import { describe, expect, it } from "vitest";
import { nextReveal, REVEAL_TICK_MS, revealSteps } from "./reveal.js";

describe("nextReveal", () => {
  it("shows whole words, never part of one", () => {
    const text = "Neural answers at once, in groups of words.";
    let shown = 0;
    while (shown < text.length) {
      shown = nextReveal(text, shown);
      const cut = text.slice(0, shown);
      expect(shown === text.length || /\s/.test(text[shown] as string)).toBe(true);
      expect(text.startsWith(cut)).toBe(true);
    }
  });

  it("puts a long burst on screen in well under a quarter of a second", () => {
    const text = "word ".repeat(400);
    expect(revealSteps(text) * REVEAL_TICK_MS).toBeLessThan(250);
  });

  it("shows a single new word in one step", () => {
    expect(nextReveal("Hello there", 6)).toBe(11);
  });

  it("stays at the end, and recovers from a count past it", () => {
    expect(nextReveal("done", 4)).toBe(4);
    expect(nextReveal("done", 99)).toBe(4);
    expect(nextReveal("", 0)).toBe(0);
  });
});
