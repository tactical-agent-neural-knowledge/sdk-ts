import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { TankClient } from "../client/client.js";
import type { ConnectionState, TankStore, ThreadView, Unreads } from "../client/store.js";
import type { Channel } from "../contracts/tank/channel/v1/channel_pb.js";
import type { Message } from "../contracts/tank/message/v1/message_pb.js";
import type { Presence } from "../contracts/tank/presence/v1/presence_pb.js";
import type { Workspace } from "../contracts/tank/workspace/v1/workspace_pb.js";

/** Ref-counted union of every usePresence() set, so one gateway subscription covers all visible lists. */
class PresenceRegistry {
  private counts = new Map<string, number>();
  private timer: ReturnType<typeof setTimeout> | undefined;
  constructor(private readonly client: TankClient) {}
  add(ids: readonly string[]): void {
    for (const id of ids) this.counts.set(id, (this.counts.get(id) ?? 0) + 1);
    this.flush();
  }
  remove(ids: readonly string[]): void {
    for (const id of ids) {
      const n = (this.counts.get(id) ?? 0) - 1;
      if (n <= 0) this.counts.delete(id);
      else this.counts.set(id, n);
    }
    this.flush();
  }
  private flush(): void {
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.client.realtime.presenceSubscribe(Array.from(this.counts.keys()));
    }, 0);
  }
}

interface TankContextValue {
  client: TankClient;
  presence: PresenceRegistry;
}

const TankContext = createContext<TankContextValue | null>(null);

export interface TankProviderProps {
  client: TankClient;
  /** Call client.start() on mount and stop() on unmount. Default true. */
  autoStart?: boolean;
  children?: ReactNode;
}

export function TankProvider({ client, autoStart = true, children }: TankProviderProps) {
  const value = useMemo<TankContextValue>(
    () => ({ client, presence: new PresenceRegistry(client) }),
    [client],
  );
  useEffect(() => {
    if (!autoStart) return;
    void client.start();
    return () => {
      void client.stop();
    };
  }, [client, autoStart]);
  return <TankContext.Provider value={value}>{children}</TankContext.Provider>;
}

function useCtx(): TankContextValue {
  const ctx = useContext(TankContext);
  if (!ctx) throw new Error("TANK hooks must be used inside <TankProvider>");
  return ctx;
}

export function useTank(): TankClient {
  return useCtx().client;
}

/** Subscribe to a memoized slice of the store. `select` must return a stable reference for unchanged input. */
export function useTankSelector<T>(select: (store: TankStore) => T): T {
  const { client } = useCtx();
  const get = useCallback(() => select(client.store), [client, select]);
  return useSyncExternalStore(client.store.subscribe, get, get);
}

export function useConnectionState(): ConnectionState {
  return useTankSelector(useCallback((s: TankStore) => s.getState().connection, []));
}

export function useWorkspace(id: string): Workspace | undefined {
  return useTankSelector(useCallback((s: TankStore) => s.getState().workspaces[id], [id]));
}

export function useChannels(workspaceId: string): Channel[] {
  return useTankSelector(useCallback((s: TankStore) => s.selectChannels(workspaceId), [workspaceId]));
}

export function useChannel(id: string): Channel | undefined {
  return useTankSelector(useCallback((s: TankStore) => s.getState().channels[id], [id]));
}

export interface UseMessagesResult {
  messages: Message[];
  loading: boolean;
  hasMoreBefore: boolean;
  /** Page older messages in. */
  loadOlder: () => Promise<boolean>;
}

export interface UseMessagesOptions {
  /** Subscribe + focus the channel on the gateway and load the first page. Default true. */
  view?: boolean;
  pageSize?: number;
}

/** Messages for a channel in channel_seq order (optimistic sends trail), with paging. */
export function useMessages(channelId: string, opts: UseMessagesOptions = {}): UseMessagesResult {
  const { client } = useCtx();
  const view = opts.view ?? true;
  const messages = useTankSelector(
    useCallback((s: TankStore) => s.selectChannelMessages(channelId), [channelId]),
  );
  const paging = useTankSelector(
    useCallback((s: TankStore) => s.getState().channelPaging[channelId], [channelId]),
  );
  const loadOlder = useCallback(
    () =>
      client.loadChannel(channelId, {
        direction: "before",
        ...(opts.pageSize ? { limit: opts.pageSize } : {}),
      }),
    [client, channelId, opts.pageSize],
  );
  useEffect(() => {
    if (!view || !channelId) return;
    client.viewChannel(channelId);
    if (client.store.selectChannelMessages(channelId).length === 0) void loadOlder().catch(() => undefined);
    return () => client.realtime.unsubscribe({ channelIds: [channelId] });
  }, [client, channelId, view, loadOlder]);
  return {
    messages,
    loading: paging?.loading ?? false,
    hasMoreBefore: paging?.hasMoreBefore ?? true,
    loadOlder,
  };
}

/** A thread's root and replies; subscribes and loads on mount. */
export function useThread(rootId: string, opts: { view?: boolean } = {}): ThreadView {
  const { client } = useCtx();
  const view = opts.view ?? true;
  const thread = useTankSelector(useCallback((s: TankStore) => s.selectThread(rootId), [rootId]));
  useEffect(() => {
    if (!view || !rootId) return;
    client.viewThread(rootId);
    void client.loadThread(rootId).catch(() => undefined);
    return () => client.realtime.unsubscribe({ threadRootIds: [rootId] });
  }, [client, rootId, view]);
  return thread;
}

export function useUnreads(workspaceId: string): Unreads {
  return useTankSelector(useCallback((s: TankStore) => s.selectUnreads(workspaceId), [workspaceId]));
}

/** Presence for a set of users; keeps the gateway presence subscription in sync while mounted. */
export function usePresence(userIds: readonly string[]): Record<string, Presence> {
  const { presence } = useCtx();
  const key = userIds.join(",");
  const stable = useMemo(() => key.split(",").filter(Boolean), [key]);
  useEffect(() => {
    presence.add(stable);
    return () => presence.remove(stable);
  }, [presence, stable]);
  return useTankSelector(useCallback((s: TankStore) => s.selectPresence(stable), [stable]));
}

/** User ids currently typing in a channel (or thread), excluding me. */
export function useTyping(channelId: string, threadRootId = ""): string[] {
  return useTankSelector(
    useCallback((s: TankStore) => s.selectTyping(channelId, threadRootId), [channelId, threadRootId]),
  );
}

export type { ConnectionState, ThreadView, Unreads };
