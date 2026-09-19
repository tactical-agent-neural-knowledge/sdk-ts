import type { IDBPDatabase } from "idb";
import type { TankStorage } from "./storage.js";

const STORE = "kv";

export interface IndexedDbStorageOptions {
  /** Database name; use one per signed-in principal so logout can drop it. Default "tank". */
  name?: string;
}

/**
 * IndexedDB adapter over one object store keyed by string. Opens lazily so
 * importing this module is safe in non-DOM runtimes (SSR, tests); the `idb`
 * dependency is loaded on first use.
 */
export class IndexedDbStorage implements TankStorage {
  private db: Promise<IDBPDatabase> | undefined;
  private readonly name: string;

  constructor(opts: IndexedDbStorageOptions = {}) {
    this.name = opts.name ?? "tank";
  }

  private open(): Promise<IDBPDatabase> {
    if (!this.db) {
      this.db = import("idb").then(({ openDB }) =>
        openDB(this.name, 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
          },
        }),
      );
    }
    return this.db;
  }

  async get(key: string): Promise<string | undefined> {
    const db = await this.open();
    const v = await db.get(STORE, key);
    return typeof v === "string" ? v : undefined;
  }

  async put(key: string, value: string): Promise<void> {
    const db = await this.open();
    await db.put(STORE, value, key);
  }

  async delete(key: string): Promise<void> {
    const db = await this.open();
    await db.delete(STORE, key);
  }

  async scan(prefix: string): Promise<Array<[string, string]>> {
    const db = await this.open();
    const upper = `${prefix}￿`;
    const range = IDBKeyRange.bound(prefix, upper, false, true);
    const out: Array<[string, string]> = [];
    let cursor = await db.transaction(STORE).store.openCursor(range);
    while (cursor) {
      if (typeof cursor.key === "string" && typeof cursor.value === "string")
        out.push([cursor.key, cursor.value]);
      cursor = await cursor.continue();
    }
    return out;
  }

  async close(): Promise<void> {
    if (!this.db) return;
    (await this.db).close();
    this.db = undefined;
  }

  /** Drops the whole database (logout). */
  static async destroy(name = "tank"): Promise<void> {
    const { deleteDB } = await import("idb");
    await deleteDB(name);
  }
}
