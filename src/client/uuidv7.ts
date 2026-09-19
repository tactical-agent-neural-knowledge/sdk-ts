/**
 * UUIDv7 (RFC 9562): 48-bit unix-ms timestamp, 12 bits of sub-ms sequence,
 * 62 bits of randomness. Used as `client_msg_id`: time-ordered, so outbox
 * entries sort by creation and the server's idempotency index stays hot.
 * Monotonic within a process even when the clock does not advance.
 */
let lastMs = 0;
let seq = 0;

/** Fills `n` cryptographically random bytes. Injectable for runtimes without `crypto.getRandomValues`. */
export type RandomBytes = (n: number) => Uint8Array;

/** Default source: `globalThis.crypto.getRandomValues` (browsers, node, Expo with `expo-crypto`'s polyfill). */
export const cryptoRandomBytes: RandomBytes = (n) => {
  const c = (globalThis as { crypto?: { getRandomValues?: (a: Uint8Array) => Uint8Array } }).crypto;
  if (typeof c?.getRandomValues !== "function") {
    throw new Error(
      "uuidv7: crypto.getRandomValues is not available; polyfill it (expo-crypto) or pass `randomBytes` to createTankClient",
    );
  }
  const out = new Uint8Array(n);
  c.getRandomValues(out);
  return out;
};

export function uuidv7(now: number = Date.now(), randomBytes: RandomBytes = cryptoRandomBytes): string {
  let ms = Math.max(now, lastMs);
  if (ms === lastMs) {
    seq += 1;
    if (seq > 0xfff) {
      // Sequence exhausted within one millisecond: borrow the next one.
      ms += 1;
      seq = 0;
    }
  } else {
    seq = randomBytes(2)[0]! & 0x7f; // random start keeps ids unguessable across processes
  }
  lastMs = ms;

  const b = new Uint8Array(16);
  b[0] = (ms / 2 ** 40) & 0xff;
  b[1] = (ms / 2 ** 32) & 0xff;
  b[2] = (ms / 2 ** 24) & 0xff;
  b[3] = (ms / 2 ** 16) & 0xff;
  b[4] = (ms / 2 ** 8) & 0xff;
  b[5] = ms & 0xff;
  b[6] = 0x70 | ((seq >> 8) & 0x0f); // version 7 + seq high nibble
  b[7] = seq & 0xff;
  const r = randomBytes(8);
  b[8] = 0x80 | (r[0]! & 0x3f); // variant 10xx
  for (let i = 1; i < 8; i++) b[8 + i] = r[i]!;

  const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const V7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function isUuidv7(s: string): boolean {
  return V7.test(s);
}

/** Millisecond timestamp encoded in a v7 id. */
export function uuidv7Time(id: string): number {
  return Number.parseInt(id.slice(0, 8) + id.slice(9, 13), 16);
}
