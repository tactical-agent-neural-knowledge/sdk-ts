import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, } from "react";
import { isTerminalRunState } from "../blocks/runTone.js";
import { notificationPagingKey, } from "../client/store.js";
/** Ref-counted union of every usePresence() set, so one gateway subscription covers all visible lists. */
class PresenceRegistry {
    client;
    counts = new Map();
    timer;
    constructor(client) {
        this.client = client;
    }
    add(ids) {
        for (const id of ids)
            this.counts.set(id, (this.counts.get(id) ?? 0) + 1);
        this.flush();
    }
    remove(ids) {
        for (const id of ids) {
            const n = (this.counts.get(id) ?? 0) - 1;
            if (n <= 0)
                this.counts.delete(id);
            else
                this.counts.set(id, n);
        }
        this.flush();
    }
    flush() {
        if (this.timer)
            return;
        this.timer = setTimeout(() => {
            this.timer = undefined;
            this.client.realtime.presenceSubscribe(Array.from(this.counts.keys()));
        }, 0);
    }
}
const TankContext = createContext(null);
export function TankProvider({ client, autoStart = true, children }) {
    const value = useMemo(() => ({ client, presence: new PresenceRegistry(client) }), [client]);
    useEffect(() => {
        if (!autoStart)
            return;
        void client.start();
        return () => {
            void client.stop();
        };
    }, [client, autoStart]);
    return _jsx(TankContext.Provider, { value: value, children: children });
}
function useCtx() {
    const ctx = useContext(TankContext);
    if (!ctx)
        throw new Error("TANK hooks must be used inside <TankProvider>");
    return ctx;
}
export function useTank() {
    return useCtx().client;
}
/** Subscribe to a memoized slice of the store. `select` must return a stable reference for unchanged input. */
export function useTankSelector(select) {
    const { client } = useCtx();
    const get = useCallback(() => select(client.store), [client, select]);
    return useSyncExternalStore(client.store.subscribe, get, get);
}
export function useConnectionState() {
    return useTankSelector(useCallback((s) => s.getState().connection, []));
}
export function useWorkspace(id) {
    return useTankSelector(useCallback((s) => s.getState().workspaces[id], [id]));
}
export function useChannels(workspaceId) {
    return useTankSelector(useCallback((s) => s.selectChannels(workspaceId), [workspaceId]));
}
export function useChannel(id) {
    return useTankSelector(useCallback((s) => s.getState().channels[id], [id]));
}
/** Messages for a channel in channel_seq order (optimistic sends trail), with paging. */
export function useMessages(channelId, opts = {}) {
    const { client } = useCtx();
    const view = opts.view ?? true;
    const messages = useTankSelector(useCallback((s) => s.selectChannelMessages(channelId), [channelId]));
    const paging = useTankSelector(useCallback((s) => s.getState().channelPaging[channelId], [channelId]));
    const loadOlder = useCallback(() => client.loadChannel(channelId, {
        direction: "before",
        ...(opts.pageSize ? { limit: opts.pageSize } : {}),
    }), [client, channelId, opts.pageSize]);
    useEffect(() => {
        if (!view || !channelId)
            return;
        client.viewChannel(channelId);
        if (!client.store.getState().channelPaging[channelId]?.loaded)
            void loadOlder().catch(() => undefined);
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
export function useThread(rootId, opts = {}) {
    const { client } = useCtx();
    const view = opts.view ?? true;
    const thread = useTankSelector(useCallback((s) => s.selectThread(rootId), [rootId]));
    useEffect(() => {
        if (!view || !rootId)
            return;
        client.viewThread(rootId);
        void client.loadThread(rootId).catch(() => undefined);
        return () => client.realtime.unsubscribe({ threadRootIds: [rootId] });
    }, [client, rootId, view]);
    return thread;
}
/** Channel unreads for a workspace, with thread unreads counted separately in `threads` / `byThread`. */
export function useUnreads(workspaceId) {
    return useTankSelector(useCallback((s) => s.selectUnreads(workspaceId), [workspaceId]));
}
/** Unread replies in one thread (root reply_count minus my last read thread_seq). */
export function useThreadUnread(rootId) {
    return useTankSelector(useCallback((s) => s.selectThreadUnread(rootId), [rootId]));
}
/** Presence for a set of users; keeps the gateway presence subscription in sync while mounted. */
export function usePresence(userIds) {
    const { presence } = useCtx();
    const key = userIds.join(",");
    const stable = useMemo(() => key.split(",").filter(Boolean), [key]);
    useEffect(() => {
        presence.add(stable);
        return () => presence.remove(stable);
    }, [presence, stable]);
    return useTankSelector(useCallback((s) => s.selectPresence(stable), [stable]));
}
/** User ids currently typing in a channel (or thread), excluding me. */
export function useTyping(channelId, threadRootId = "") {
    return useTankSelector(useCallback((s) => s.selectTyping(channelId, threadRootId), [channelId, threadRootId]));
}
/** A workspace's notifications (unread or all), loading the first page on mount. */
export function useNotifications(workspaceId, opts = {}) {
    const { client } = useCtx();
    const unreadOnly = opts.unreadOnly ?? false;
    const load = opts.load ?? true;
    const mode = unreadOnly ? "unread" : "all";
    const notifications = useTankSelector(useCallback((s) => s.selectNotifications(workspaceId, unreadOnly), [workspaceId, unreadOnly]));
    const paging = useTankSelector(useCallback((s) => s.getState().notificationPaging[notificationPagingKey(workspaceId, mode)], [workspaceId, mode]));
    const loadMore = useCallback(() => {
        const cur = client.store.getState().notificationPaging[notificationPagingKey(workspaceId, mode)];
        if (cur?.loading || (cur?.loaded && !cur.hasMore))
            return Promise.resolve(undefined);
        return client.loadNotifications({
            workspaceId,
            unreadOnly,
            ...(cur?.loaded ? { cursor: cur.cursor } : {}),
            ...(opts.pageSize ? { limit: opts.pageSize } : {}),
        });
    }, [client, workspaceId, unreadOnly, mode, opts.pageSize]);
    const markRead = useCallback((ids) => client.markNotificationsRead(workspaceId, ids), [client, workspaceId]);
    useEffect(() => {
        if (!load || !workspaceId)
            return;
        const cur = client.store.getState().notificationPaging[notificationPagingKey(workspaceId, mode)];
        if (!cur?.loaded)
            void loadMore().catch(() => undefined);
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
export function useUnreadNotificationCount(workspaceId) {
    return useTankSelector(useCallback((s) => s.getState().unreadNotificationCount[workspaceId] ?? 0, [workspaceId]));
}
// ---------------------------------------------------------------- agent runs
/** One run by id; fetched with `GetRun` on mount when the store does not have it. */
export function useRun(runId, opts = {}) {
    const { client } = useCtx();
    const load = opts.load ?? true;
    const run = useTankSelector(useCallback((s) => s.getState().runsById[runId], [runId]));
    useEffect(() => {
        if (!load || !runId || client.store.getState().runsById[runId])
            return;
        void client.getRun(runId).catch(() => undefined);
    }, [client, runId, load]);
    return run;
}
/**
 * The newest run in a thread; seeds from `ListRuns` on mount when none is known. `agent.run.updated`
 * is fanned out on the thread subject, so keep `useThread(rootId)` mounted for live updates.
 */
export function useThreadRun(rootId, opts = {}) {
    const { client } = useCtx();
    const load = opts.load ?? true;
    const run = useTankSelector(useCallback((s) => s.getState().runsByThread[rootId], [rootId]));
    useEffect(() => {
        if (!load || !rootId || client.store.getState().runsByThread[rootId])
            return;
        void client.listRuns({ threadRootId: rootId }).catch(() => undefined); // agent:read may be missing
    }, [client, rootId, load]);
    // A run chip spins while the run is live, so a missed agent.run.updated
    // leaves it spinning forever and lying about a run that finished minutes
    // ago. Realtime stays the fast path; this is the reconciliation that makes
    // the chip eventually honest. It stops as soon as the run is terminal.
    const live = run !== undefined && !isTerminalRunState(run.state);
    useEffect(() => {
        if (!load || !rootId || !live)
            return;
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
export function useRuns(workspaceId) {
    return useTankSelector(useCallback((s) => s.selectRuns(workspaceId), [workspaceId]));
}
/** The whole thread root id → run map (stable reference); message lists index it per row. */
export function useRunsByThread() {
    return useTankSelector(useCallback((s) => s.getState().runsByThread, []));
}
/** The live `agent_status` frame for a thread root id (or channel id); `undefined` once it expires (30 s). */
export function useAgentStatus(threadRootIdOrChannelId) {
    return useTankSelector(useCallback((s) => s.selectAgentStatus(threadRootIdOrChannelId), [threadRootIdOrChannelId]));
}
/** Every live `agent_status` frame in a channel (its threads included). */
export function useAgentStatuses(channelId) {
    return useTankSelector(useCallback((s) => s.selectAgentStatuses(channelId), [channelId]));
}
// ---------------------------------------------------------------- files
/** A file the store knows about (from an upload or a `file.ready` event). */
export function useFile(fileId) {
    return useTankSelector(useCallback((s) => s.getState().filesById[fileId], [fileId]));
}
/** The known `File`s a message references, in `file_ids` order. */
export function useMessageFiles(messageId) {
    return useTankSelector(useCallback((s) => s.selectMessageFiles(messageId), [messageId]));
}
export { TankStore } from "../client/store.js";
