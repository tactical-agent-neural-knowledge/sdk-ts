/** Fills `n` cryptographically random bytes. Injectable for runtimes without `crypto.getRandomValues`. */
export type RandomBytes = (n: number) => Uint8Array;
/** Default source: `globalThis.crypto.getRandomValues` (browsers, node, Expo with `expo-crypto`'s polyfill). */
export declare const cryptoRandomBytes: RandomBytes;
export declare function uuidv7(now?: number, randomBytes?: RandomBytes): string;
export declare function isUuidv7(s: string): boolean;
/** Millisecond timestamp encoded in a v7 id. */
export declare function uuidv7Time(id: string): number;
