/**
 * Persistence boundary for the SDK. Values are strings (JSON) so every adapter
 * is a flat key/value table: IndexedDB on web, SQLite on mobile, memory in tests.
 * Keys are namespaced with a colon-separated prefix (`cursor:<ws>`, `outbox:<id>`,
 * `channel:<id>:messages`) so `scan(prefix)` can hydrate one family at a time.
 */
export interface TankStorage {
    get(key: string): Promise<string | undefined>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
    /** Every entry whose key starts with `prefix`, in key order. */
    scan(prefix: string): Promise<Array<[key: string, value: string]>>;
    /** Optional: release handles. */
    close?(): Promise<void>;
}
export declare class MemoryStorage implements TankStorage {
    readonly map: Map<string, string>;
    get(key: string): Promise<string | undefined>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
    scan(prefix: string): Promise<Array<[string, string]>>;
}
export declare const storageKeys: {
    readonly session: "session";
    readonly cursor: (workspaceId: string) => string;
    readonly cursorPrefix: "cursor:";
    readonly outbox: (clientMsgId: string) => string;
    readonly outboxPrefix: "outbox:";
    readonly bootstrap: (workspaceId: string) => string;
    readonly bootstrapPrefix: "bootstrap:";
    readonly channelMessages: (channelId: string) => string;
    readonly channelMessagesPrefix: "channel:";
    readonly recentChannels: "recent-channels";
    readonly readStates: "read-states";
};
