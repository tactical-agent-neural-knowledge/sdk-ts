export class MemoryStorage {
    map = new Map();
    async get(key) {
        return this.map.get(key);
    }
    async put(key, value) {
        this.map.set(key, value);
    }
    async delete(key) {
        this.map.delete(key);
    }
    async scan(prefix) {
        return Array.from(this.map.entries())
            .filter(([k]) => k.startsWith(prefix))
            .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    }
}
export const storageKeys = {
    session: "session",
    cursor: (workspaceId) => `cursor:${workspaceId}`,
    cursorPrefix: "cursor:",
    outbox: (clientMsgId) => `outbox:${clientMsgId}`,
    outboxPrefix: "outbox:",
    bootstrap: (workspaceId) => `bootstrap:${workspaceId}`,
    bootstrapPrefix: "bootstrap:",
    channelMessages: (channelId) => `channel:${channelId}:messages`,
    channelMessagesPrefix: "channel:",
    recentChannels: "recent-channels",
    // Read progress, kept apart from the bootstrap snapshot on purpose. The
    // snapshot is only rewritten when GetBootstrap runs, so everything read after
    // it used to be lost on the next launch: hydrating the snapshot resurrected an
    // old cursor and the same messages came back unread, however many times they
    // had been read.
    readStates: "read-states",
};
