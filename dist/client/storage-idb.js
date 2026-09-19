const STORE = "kv";
/**
 * IndexedDB adapter over one object store keyed by string. Opens lazily so
 * importing this module is safe in non-DOM runtimes (SSR, tests); the `idb`
 * dependency is loaded on first use.
 */
export class IndexedDbStorage {
    db;
    name;
    constructor(opts = {}) {
        this.name = opts.name ?? "tank";
    }
    open() {
        if (!this.db) {
            this.db = import("idb").then(({ openDB }) => openDB(this.name, 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(STORE))
                        db.createObjectStore(STORE);
                },
            }));
        }
        return this.db;
    }
    async get(key) {
        const db = await this.open();
        const v = await db.get(STORE, key);
        return typeof v === "string" ? v : undefined;
    }
    async put(key, value) {
        const db = await this.open();
        await db.put(STORE, value, key);
    }
    async delete(key) {
        const db = await this.open();
        await db.delete(STORE, key);
    }
    async scan(prefix) {
        const db = await this.open();
        const upper = `${prefix}￿`;
        const range = IDBKeyRange.bound(prefix, upper, false, true);
        const out = [];
        let cursor = await db.transaction(STORE).store.openCursor(range);
        while (cursor) {
            if (typeof cursor.key === "string" && typeof cursor.value === "string")
                out.push([cursor.key, cursor.value]);
            cursor = await cursor.continue();
        }
        return out;
    }
    async close() {
        if (!this.db)
            return;
        (await this.db).close();
        this.db = undefined;
    }
    /** Drops the whole database (logout). */
    static async destroy(name = "tank") {
        const { deleteDB } = await import("idb");
        await deleteDB(name);
    }
}
