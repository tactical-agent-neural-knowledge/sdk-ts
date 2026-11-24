import { describe, expect, it } from "vitest";
import {
  FRESH_FADE_MS,
  FRESH_MAX_RUNS,
  FreshTail,
  freshAlpha,
  freshChars,
  freshPieces,
  PACE_LAG_MS,
  RevealPacer,
} from "./fresh.js";

describe("FreshTail", () => {
  it("fades each arrival on its own clock, so blocks overlap", () => {
    const t = new FreshTail();
    t.arrived(10, 0);
    t.arrived(25, 60);
    t.arrived(30, 100);
    const runs = t.runs(100);
    expect(runs.map((r) => r.chars)).toEqual([10, 15, 5]);
    expect(runs[0]?.alpha).toBeGreaterThan(runs[1]?.alpha ?? 1);
    expect(runs[1]?.alpha).toBeGreaterThan(runs[2]?.alpha ?? 1);
    expect(runs[2]?.alpha).toBe(0);
    expect(freshChars(runs)).toBe(30);
  });

  it("leaves finished blocks as plain text, and ends", () => {
    const t = new FreshTail();
    t.arrived(10, 0);
    t.arrived(25, 100);
    expect(t.runs(FRESH_FADE_MS + 1).map((r) => r.chars)).toEqual([15]);
    expect(t.active(100 + FRESH_FADE_MS)).toBe(false);
    expect(t.runs(1000)).toEqual([]);
  });

  it("fades text that arrives all at once as one block", () => {
    const t = new FreshTail();
    t.arrived(400, 5);
    expect(t.runs(5)).toEqual([{ chars: 400, alpha: 0, at: 5 }]);
  });

  it("takes a shorter text as it is, with nothing fading past its end", () => {
    const t = new FreshTail();
    t.arrived(50, 0);
    t.arrived(4, 10);
    expect(t.runs(10)).toEqual([{ chars: 4, alpha: freshAlpha(10), at: 0 }]);
    t.arrived(9, 20);
    expect(freshChars(t.runs(20))).toBe(9);
  });

  it("eases out from nothing to fully there", () => {
    expect(freshAlpha(0)).toBe(0);
    expect(freshAlpha(FRESH_FADE_MS)).toBe(1);
    expect(freshAlpha(FRESH_FADE_MS / 2)).toBeGreaterThan(0.8);
  });
});

describe("freshPieces", () => {
  const runs = [
    { chars: 4, alpha: 0.9, at: 1 },
    { chars: 3, alpha: 0.2, at: 2 },
  ];

  it("cuts the end of the last piece into its runs", () => {
    expect(freshPieces("hello world", runs, 0)).toEqual([
      { text: "hell", alpha: 1 },
      { text: "o wo", alpha: 0.9, at: 1 },
      { text: "rld", alpha: 0.2, at: 2 },
    ]);
  });

  it("reaches back into an earlier piece only as far as the runs do", () => {
    // Five characters come after this piece: the newest run and two of the older one's four.
    expect(freshPieces("abcdef", runs, 5)).toEqual([
      { text: "abcd", alpha: 1 },
      { text: "ef", alpha: 0.9, at: 1 },
    ]);
    expect(freshPieces("abcdef", runs, 7)).toEqual([{ text: "abcdef", alpha: 1 }]);
  });

  it("returns plain text when nothing is fading", () => {
    expect(freshPieces("abc", [], 0)).toEqual([{ text: "abc", alpha: 1 }]);
    expect(freshPieces("", runs, 0)).toEqual([]);
  });
});

describe("FreshTail cap", () => {
  it("never has more runs fading than the cap", () => {
    const t = new FreshTail();
    for (let i = 1; i <= FRESH_MAX_RUNS + 10; i++) t.arrived(i * 5, 1);
    expect(t.runs(2)).toHaveLength(FRESH_MAX_RUNS);
  });
});

describe("RevealPacer", () => {
  const drain = (p: RevealPacer, text: string, from: number, until: number, ended = false) => {
    const cuts: [number, number][] = [];
    for (let now = from; now <= until; now += 16)
      for (const c of p.step(text, now, ended)) cuts.push([now, c]);
    return cuts;
  };

  it("lets a burst out a word at a time, spread over frames, and never far behind", () => {
    const p = new RevealPacer();
    const text = "one two three four five six seven eight nine ten eleven twelve ".repeat(4);
    const cuts = drain(p, text, 0, 400);
    expect(p.length).toBe(text.length);
    // Spread over several frames, not painted in one.
    expect(new Set(cuts.map(([at]) => at)).size).toBeGreaterThan(4);
    // Every cut ends a whole word.
    for (const [, c] of cuts) expect(c === text.length || !/\s/.test(text[c] as string)).toBe(true);
    // And all of it is out by the time it has waited the lag (give or take a frame).
    expect(Math.max(...cuts.map(([at]) => at))).toBeLessThanOrEqual(PACE_LAG_MS + 16);
  });

  it("waits for the end of the last word, but not past the lag", () => {
    const p = new RevealPacer();
    expect(p.step("Hello wor", 0)).toEqual([6]);
    expect(p.length).toBe(6);
    // The rest of the word arrives: it goes out whole.
    const cuts = drain(p, "Hello world and", 16, 64);
    expect(cuts.map(([, c]) => c)).toContain(12);
    // A run with no space is shown once it has waited as long as anything may.
    const q = new RevealPacer();
    q.step("https://example.com/a/very/long/address", 0);
    expect(q.length).toBe(0);
    drain(q, "https://example.com/a/very/long/address", 16, PACE_LAG_MS + 64);
    expect(q.length).toBe(39);
  });

  it("shows everything left the moment the stream ends, and starts over on a reset", () => {
    const p = new RevealPacer();
    p.step("a long sentence that has only just arrived", 0);
    expect(p.step("a long sentence that has only just arrived", 16, true)).toEqual([42]);
    expect(p.step("next", 32)).toEqual([]);
    expect(p.length).toBe(4);
  });
});
