import { describe, expect, it } from "vitest";
import { NEURAL_STARTERS, pickStarters } from "./starters.js";

/** A small seeded generator, so a run is repeatable. */
function seeded(seed: number): () => number {
  let x = seed;
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  };
}

describe("conversation starters", () => {
  it("has about forty, each short and different", () => {
    expect(NEURAL_STARTERS.length).toBeGreaterThanOrEqual(36);
    expect(new Set(NEURAL_STARTERS.map((s) => s.text)).size).toBe(NEURAL_STARTERS.length);
    for (const s of NEURAL_STARTERS) expect(s.text.length).toBeLessThanOrEqual(60);
  });

  it("is not about writing software", () => {
    const code = /\b(sql|oauth|api|code|python|javascript|typescript|bug|deploy|git|regex|database)\b/i;
    expect(NEURAL_STARTERS.filter((s) => code.test(s.text))).toEqual([]);
  });

  it("uses US spelling", () => {
    const uk = /(summaris|organis|colour|favour|neighbour|travell|cosy|programme|centre)/i;
    expect(NEURAL_STARTERS.filter((s) => uk.test(s.text))).toEqual([]);
  });

  it("picks four different ones", () => {
    for (let seed = 1; seed < 200; seed++) {
      const got = pickStarters({ random: seeded(seed) });
      expect(got).toHaveLength(4);
      expect(new Set(got.map((s) => s.text)).size).toBe(4);
    }
  });

  it("picks a different set from one load to the next", () => {
    const sets = new Set<string>();
    for (let seed = 1; seed < 50; seed++)
      sets.add(
        pickStarters({ random: seeded(seed) })
          .map((s) => s.text)
          .join("|"),
      );
    expect(sets.size).toBeGreaterThan(40);
  });

  it("only offers what the client can open, and at most one of those", () => {
    for (let seed = 1; seed < 300; seed++) {
      const none = pickStarters({ random: seeded(seed) });
      expect(none.some((s) => s.needs)).toBe(false);
      const some = pickStarters({ random: seeded(seed), can: ["photo", "webpage"] });
      expect(some.filter((s) => s.needs).length).toBeLessThanOrEqual(1);
      for (const s of some) if (s.needs) expect(["photo", "webpage"]).toContain(s.needs);
    }
    let seen = false;
    for (let seed = 1; seed < 300 && !seen; seed++)
      seen = pickStarters({ random: seeded(seed), can: ["camera"] }).some((s) => s.needs === "camera");
    expect(seen).toBe(true);
  });

  it("never repeats even when the generator does", () => {
    const got = pickStarters({ random: () => 0.99999999 });
    expect(new Set(got.map((s) => s.text)).size).toBe(4);
    expect(pickStarters({ random: () => 0 })).toHaveLength(4);
  });

  it("returns what there is when the pool is small", () => {
    expect(
      pickStarters({ pool: [{ text: "a" }, { text: "a" }, { text: "b" }] })
        .map((s) => s.text)
        .sort(),
    ).toEqual(["a", "b"]);
  });
});
