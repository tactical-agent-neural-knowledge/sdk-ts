import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { isTerminalRunState } from "../blocks/runTone.js";
import type { TankClient } from "../client/client.js";
import {
  type ChannelPaging,
  type ConnectionState,
  type NotificationPaging,
  notificationPagingKey,
  type PendingMessage,
  type TankState,
  type TankStore,
  type ThreadView,
  type Unreads,
} from "../client/store.js";
import type { Run } from "../contracts/tank/agent/v1/agent_pb.js";
import type { Channel } from "../contracts/tank/channel/v1/channel_pb.js";
import type { AgentStatus } from "../contracts/tank/events/v1/events_pb.js";
import type { File } from "../contracts/tank/files/v1/files_pb.js";
import type { Message } from "../contracts/tank/message/v1/message_pb.js";
import type { Notification } from "../contracts/tank/notification/v1/notification_pb.js";
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
  /** A page is being fetched (including the first one). */
  loading: boolean;
  /** Whether older messages exist. `false` until the first page has loaded. */
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
    if (!client.store.getState().channelPaging[channelId]?.loaded) void loadOlder().catch(() => undefined);
    return () => client.realtime.unsubscribe({ channelIds: [channelId] });
  }, [client, channelId, view, loadOlder]);
  return {
    messages,
    loading: paging?.loading ?? false,
    hasMoreBefore: paging?.loaded ? paging.hasMoreBefore : false,
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

/** Channel unreads for a workspace, with thread unreads counted separately in `threads` / `byThread`. */
export function useUnreads(workspaceId: string): Unreads {
  return useTankSelector(useCallback((s: TankStore) => s.selectUnreads(workspaceId), [workspaceId]));
}

/** Unread replies in one thread (root reply_count minus my last read thread_seq). */
export function useThreadUnread(rootId: string): number {
  return useTankSelector(useCallback((s: TankStore) => s.selectThreadUnread(rootId), [rootId]));
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

// ---------------------------------------------------------------- notifications

export interface UseNotificationsOptions {
  /** Only unread rows. Default false. */
  unreadOnly?: boolean;
  /** Load the first page on mount when it has not been loaded yet. Default true. */
  load?: boolean;
  pageSize?: number;
}

export interface UseNotificationsResult {
  /** Newest first. */
  notifications: Notification[];
  loading: boolean;
  /** `false` until the first page has landed, then the server's paging flag. */
  hasMore: boolean;
  loadMore: () => Promise<unknown>;
  /** Mark rows read (no ids = every unread one in the workspace). Optimistic. */
  markRead: (notificationIds?: string[]) => Promise<void>;
}

/** A workspace's notifications (unread or all), loading the first page on mount. */
export function useNotifications(
  workspaceId: string,
  opts: UseNotificationsOptions = {},
): UseNotificationsResult {
  const { client } = useCtx();
  const unreadOnly = opts.unreadOnly ?? false;
  const load = opts.load ?? true;
  const mode = unreadOnly ? "unread" : "all";
  const notifications = useTankSelector(
    useCallback((s: TankStore) => s.selectNotifications(workspaceId, unreadOnly), [workspaceId, unreadOnly]),
  );
  const paging = useTankSelector(
    useCallback(
      (s: TankStore): NotificationPaging | undefined =>
        s.getState().notificationPaging[notificationPagingKey(workspaceId, mode)],
      [workspaceId, mode],
    ),
  );
  const loadMore = useCallback(() => {
    const cur = client.store.getState().notificationPaging[notificationPagingKey(workspaceId, mode)];
    if (cur?.loading || (cur?.loaded && !cur.hasMore)) return Promise.resolve(undefined);
    return client.loadNotifications({
      workspaceId,
      unreadOnly,
      ...(cur?.loaded ? { cursor: cur.cursor } : {}),
      ...(opts.pageSize ? { limit: opts.pageSize } : {}),
    });
  }, [client, workspaceId, unreadOnly, mode, opts.pageSize]);
  const markRead = useCallback(
    (ids?: string[]) => client.markNotificationsRead(workspaceId, ids),
    [client, workspaceId],
  );
  useEffect(() => {
    if (!load || !workspaceId) return;
    const cur = client.store.getState().notificationPaging[notificationPagingKey(workspaceId, mode)];
    if (!cur?.loaded) void loadMore().catch(() => undefined);
  }, [client, workspaceId, mode, load, loadMore]);
  return {
    notifications,
    loading: paging?.loading ?? false,
    hasMore: paging?.loaded ? paging.hasMore : false,
    loadMore,
    markRead,
  };
}

/** The workspace's unread notification badge (bootstrap count + live deltas). */
export function useUnreadNotificationCount(workspaceId: string): number {
  return useTankSelector(
    useCallback((s: TankStore) => s.getState().unreadNotificationCount[workspaceId] ?? 0, [workspaceId]),
  );
}

// ---------------------------------------------------------------- agent runs

/** One run by id; fetched with `GetRun` on mount when the store does not have it. */
export function useRun(runId: string, opts: { load?: boolean } = {}): Run | undefined {
  const { client } = useCtx();
  const load = opts.load ?? true;
  const run = useTankSelector(useCallback((s: TankStore) => s.getState().runsById[runId], [runId]));
  useEffect(() => {
    if (!load || !runId || client.store.getState().runsById[runId]) return;
    void client.getRun(runId).catch(() => undefined);
  }, [client, runId, load]);
  return run;
}

/**
 * The newest run in a thread; seeds from `ListRuns` on mount when none is known. `agent.run.updated`
 * is fanned out on the thread subject, so keep `useThread(rootId)` mounted for live updates.
 */
export function useThreadRun(rootId: string, opts: { load?: boolean } = {}): Run | undefined {
  const { client } = useCtx();
  const load = opts.load ?? true;
  const run = useTankSelector(useCallback((s: TankStore) => s.getState().runsByThread[rootId], [rootId]));
  useEffect(() => {
    if (!load || !rootId || client.store.getState().runsByThread[rootId]) return;
    void client.listRuns({ threadRootId: rootId }).catch(() => undefined); // agent:read may be missing
  }, [client, rootId, load]);

  // A run chip spins while the run is live, so a missed agent.run.updated
  // leaves it spinning forever and lying about a run that finished minutes
  // ago. Realtime stays the fast path; this is the reconciliation that makes
  // the chip eventually honest. It stops as soon as the run is terminal.
  const live = run !== undefined && !isTerminalRunState(run.state);
  useEffect(() => {
    if (!load || !rootId || !live) return;
    const id = setInterval(() => {
      void client.listRuns({ threadRootId: rootId }).catch(() => undefined);
    }, RUN_REFRESH_MS);
    return () => clearInterval(id);
  }, [client, rootId, load, live]);
  return run;
}

/** How often a live run is re-fetched when no event has corrected it. */
const RUN_REFRESH_MS = 15_000;

/** Runs in a workspace, newest first (whatever `ListRuns` pages and events have put in the store). */
export function useRuns(workspaceId: string): Run[] {
  return useTankSelector(useCallback((s: TankStore) => s.selectRuns(workspaceId), [workspaceId]));
}

/** The whole thread root id → run map (stable reference); message lists index it per row. */
export function useRunsByThread(): Record<string, Run> {
  return useTankSelector(useCallback((s: TankStore) => s.getState().runsByThread, []));
}

/** The live `agent_status` frame for a thread root id (or channel id); `undefined` once it expires (30 s). */
export function useAgentStatus(threadRootIdOrChannelId: string): AgentStatus | undefined {
  return useTankSelector(
    useCallback((s: TankStore) => s.selectAgentStatus(threadRootIdOrChannelId), [threadRootIdOrChannelId]),
  );
}

/** Every live `agent_status` frame in a channel (its threads included). */
export function useAgentStatuses(channelId: string): AgentStatus[] {
  return useTankSelector(useCallback((s: TankStore) => s.selectAgentStatuses(channelId), [channelId]));
}

// ---------------------------------------------------------------- files

/** A file the store knows about (from an upload or a `file.ready` event). */
export function useFile(fileId: string): File | undefined {
  return useTankSelector(useCallback((s: TankStore) => s.getState().filesById[fileId], [fileId]));
}

/** The known `File`s a message references, in `file_ids` order. */
export function useMessageFiles(messageId: string): File[] {
  return useTankSelector(useCallback((s: TankStore) => s.selectMessageFiles(messageId), [messageId]));
}

export { TankStore } from "../client/store.js";
export type {
  ChannelPaging,
  ConnectionState,
  NotificationPaging,
  PendingMessage,
  TankState,
  ThreadView,
  Unreads,
};
