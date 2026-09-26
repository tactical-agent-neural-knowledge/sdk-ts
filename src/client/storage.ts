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

export class MemoryStorage implements TankStorage {
  readonly map = new Map<string, string>();

  async get(key: string): Promise<string | undefined> {
    return this.map.get(key);
  }
  async put(key: string, value: string): Promise<void> {
    this.map.set(key, value);
  }
  async delete(key: string): Promise<void> {
    this.map.delete(key);
  }
  async scan(prefix: string): Promise<Array<[string, string]>> {
    return Array.from(this.map.entries())
      .filter(([k]) => k.startsWith(prefix))
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  }
}

export const storageKeys = {
  session: "session",
  cursor: (workspaceId: string) => `cursor:${workspaceId}`,
  cursorPrefix: "cursor:",
  outbox: (clientMsgId: string) => `outbox:${clientMsgId}`,
  outboxPrefix: "outbox:",
  bootstrap: (workspaceId: string) => `bootstrap:${workspaceId}`,
  bootstrapPrefix: "bootstrap:",
  channelMessages: (channelId: string) => `channel:${channelId}:messages`,
  channelMessagesPrefix: "channel:",
  recentChannels: "recent-channels",
  // Read progress, kept apart from the bootstrap snapshot on purpose. The
  // snapshot is only rewritten when GetBootstrap runs, so everything read after
  // it used to be lost on the next launch: hydrating the snapshot resurrected an
  // old cursor and the same messages came back unread, however many times they
  // had been read.
  readStates: "read-states",
} as const;
