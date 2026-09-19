import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, } from "react";
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
        if (client.store.selectChannelMessages(channelId).length === 0)
            void loadOlder().catch(() => undefined);
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
export function useUnreads(workspaceId) {
    return useTankSelector(useCallback((s) => s.selectUnreads(workspaceId), [workspaceId]));
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
