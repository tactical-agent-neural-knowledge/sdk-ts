import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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
import type { Mark, MarkType, WaitingDirection, WaitingOnItem } from "../contracts/tank/topo/v1/topo_pb.js";
import type {
  Entitlements,
  Preferences,
  TopoPreferences,
  Workspace,
} from "../contracts/tank/workspace/v1/workspace_pb.js";
import { visibleMarkTypes } from "../topo/visibility.js";

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

export interface TopoVisibility {
  /** The families the strip should draw, already accounting for the defaults. */
  visible: Set<MarkType>;
  /** Message-indexed (false) or time-indexed (true) axis. */
  timeAxis: boolean;
  loading: boolean;
  toggle: (type: MarkType) => Promise<void>;
  setTimeAxis: (on: boolean) => Promise<void>;
}

/**
 * The person's Topo preferences: which mark families to draw, and how the axis is scaled.
 *
 * Stored per workspace on the server rather than per device, so the strip looks the same on the
 * phone as on the laptop.
 *
 * Every write is read-modify-write: UpdatePreferences replaces the whole Preferences message, so
 * sending only the Topo part would quietly reset somebody's notification and theme settings.
 */
export function useTopoVisibility(workspaceId: string): TopoVisibility {
  const client = useTank();
  const [prefs, setPrefs] = useState<Preferences | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) return;
    let live = true;
    client.workspaces
      .getPreferences({ workspaceId })
      .then((res) => {
        if (live) {
          setPrefs(res.preferences);
          setLoading(false);
        }
      })
      .catch(() => {
        // The strip still draws, on the defaults. Preferences failing to load is not a reason to
        // show somebody an empty map.
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [client, workspaceId]);

  const save = useCallback(
    async (next: TopoPreferences) => {
      const current = prefs ?? (await client.workspaces.getPreferences({ workspaceId })).preferences;
      const merged = { ...(current ?? {}), topo: next } as Preferences;
      setPrefs(merged);
      const res = await client.workspaces.updatePreferences({ workspaceId, preferences: merged });
      setPrefs(res.preferences);
    },
    [client, workspaceId, prefs],
  );

  const topo = prefs?.topo;
  const visible = useMemo(() => visibleMarkTypes(topo), [topo]);

  const toggle = useCallback(
    async (type: MarkType) => {
      const next = new Set(visible);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      // configured flips on the first change, which is what lets "everything off" survive instead
      // of reading as "never chosen".
      await save({
        configured: true,
        visible: [...next],
        timeAxis: topo?.timeAxis ?? false,
      } as TopoPreferences);
    },
    [save, visible, topo],
  );

  const setTimeAxis = useCallback(
    async (on: boolean) => {
      await save({
        configured: topo?.configured ?? false,
        visible: topo?.visible ?? [...visible],
        timeAxis: on,
      } as TopoPreferences);
    },
    [save, visible, topo],
  );

  return { visible, timeAxis: topo?.timeAxis ?? false, loading, toggle, setTimeAxis };
}

export interface TopoMarks {
  marks: Mark[];
  /** The channel's newest seq, which is the strip's axis length. */
  lastSeq: bigint;
  loading: boolean;
}

/**
 * The marks for a channel's Topo strip.
 *
 * Refetches when the channel's `lastSeq` moves, which is the one signal that can add, move or
 * retire a derived mark — a new message, a new mention, or the read horizon advancing. Marks are
 * not in the normalized store, so this owns the small amount of state a strip needs. A stale
 * response from a channel the user has already left is dropped rather than rendered.
 */
export function useTopoMarks(channelId: string): TopoMarks {
  const client = useTank();
  const channel = useChannel(channelId);
  const seq = channel?.lastSeq ?? 0n;
  const [state, setState] = useState<TopoMarks>({ marks: [], lastSeq: 0n, loading: true });

  // biome-ignore lint/correctness/useExhaustiveDependencies: `seq` is the refetch trigger, not a read
  useEffect(() => {
    if (!channelId) return;
    let live = true;
    setState((s) => ({ ...s, loading: true }));
    client
      .listMarks(channelId)
      .then((r) => {
        if (live) setState({ marks: r.marks, lastSeq: r.lastSeq, loading: false });
      })
      .catch(() => {
        // A strip is an aid, not the conversation: if it cannot be drawn, the Tread still reads.
        if (live) setState({ marks: [], lastSeq: 0n, loading: false });
      });
    return () => {
      live = false;
    };
  }, [client, channelId, seq]);

  return state;
}

export interface WaitingOn {
  items: WaitingOnItem[];
  loading: boolean;
  /** Refetch. The queues are small and read rarely; a re-read beats an invalidation rule. */
  reload: () => void;
}

/**
 * One side of the waiting-on relationship: what is owed to you, or what you owe.
 *
 * Re-reads whenever a stored mark changes anywhere in the workspace. That is coarser than tracking
 * which mark moved, and deliberately so — the queues hold a handful of rows, and a wrong
 * invalidation rule here shows somebody an obligation they have already discharged.
 */
export function useWaitingOn(workspaceId: string, direction: WaitingDirection): WaitingOn {
  const client = useTank();
  const [items, setItems] = useState<WaitingOnItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `nonce` is the refetch trigger
  useEffect(() => {
    if (!workspaceId) return;
    let live = true;
    setLoading(true);
    client.topo
      .listWaitingOn({ workspaceId, direction })
      .then((res) => {
        if (live) {
          setItems(res.items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (live) {
          setItems([]);
          setLoading(false);
        }
      });
    return () => {
      live = false;
    };
  }, [client, workspaceId, direction, nonce]);

  // A mark changing anywhere means somebody's queue moved; the cheapest correct answer is a re-read.
  useEffect(() => client.onMarkUpdated(reload), [client, reload]);

  return { items, loading, reload };
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

// ---------------------------------------------------------------- entitlements

/**
 * What this workspace's plan allows. Absent until bootstrap lands, and absent from an older server,
 * so a caller treats `undefined` as "assume free and let the server decide" rather than unlocking.
 */
export function useEntitlements(workspaceId: string): Entitlements | undefined {
  return useTankSelector(
    useCallback((s: TankStore) => s.getState().entitlements[workspaceId], [workspaceId]),
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
