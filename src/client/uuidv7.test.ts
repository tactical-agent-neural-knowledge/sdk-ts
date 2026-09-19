import { describe, expect, it } from "vitest";
import { isUuidv7, uuidv7, uuidv7Time } from "./uuidv7.js";

describe("uuidv7", () => {
  it("has the v7 layout", () => {
    const id = uuidv7();
    expect(isUuidv7(id)).toBe(true);
    expect(id).toHaveLength(36);
  });
  it("encodes the timestamp", () => {
    const t = Date.now() + 1_000; // ahead of any id minted so far, so the monotonic clamp does not lift it
    expect(uuidv7Time(uuidv7(t))).toBe(t);
  });
  it("is monotonic within a millisecond and unique", () => {
    const ids = Array.from({ length: 5000 }, () => uuidv7(1_700_000_000_000));
    for (let i = 1; i < ids.length; i++) expect(ids[i]! > ids[i - 1]!).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("never goes backwards when the clock does", () => {
    const a = uuidv7(2_000_000_000_000);
    const b = uuidv7(1_000_000_000_000);
    expect(b > a).toBe(true);
  });
});
