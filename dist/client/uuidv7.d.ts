/** Fills `n` cryptographically random bytes. Injectable for runtimes without `crypto.getRandomValues`. */
export type RandomBytes = (n: number) => Uint8Array;
/**
 * Default source: `globalThis.crypto.getRandomValues` (browsers, node, Expo with `expo-crypto`'s
 * polyfill), falling back to Math.random when it is missing or refuses. On 2026-11-11 a person on
 * Ubuntu's Firefox could not send a single message: getRandomValues threw "OperationError" in
 * their browser, and the composer failed before anything left it. An id only has to be unique.
 */
export declare const cryptoRandomBytes: RandomBytes;
export declare function uuidv7(now?: number, randomBytes?: RandomBytes): string;
export declare function isUuidv7(s: string): boolean;
/** Millisecond timestamp encoded in a v7 id. */
export declare function uuidv7Time(id: string): number;
