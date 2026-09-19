import type { TankStorage } from "./storage.js";
export interface IndexedDbStorageOptions {
    /** Database name; use one per signed-in principal so logout can drop it. Default "tank". */
    name?: string;
}
/**
 * IndexedDB adapter over one object store keyed by string. Opens lazily so
 * importing this module is safe in non-DOM runtimes (SSR, tests); the `idb`
 * dependency is loaded on first use.
 */
export declare class IndexedDbStorage implements TankStorage {
    private db;
    private readonly name;
    constructor(opts?: IndexedDbStorageOptions);
    private open;
    get(key: string): Promise<string | undefined>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
    scan(prefix: string): Promise<Array<[string, string]>>;
    close(): Promise<void>;
    /** Drops the whole database (logout). */
    static destroy(name?: string): Promise<void>;
}
