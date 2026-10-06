import { describe, expect, it } from "vitest";
import { contrastRatio, WCAG } from "./contrast.js";
import { boardFills, boardStrokes, boardTextSizes, hexFor, stickyFills, tokenFor } from "./palette.js";

/**
 * A board stores the token, not the hex. If these two ever stop agreeing, a board
 * drawn today silently stops matching the product tomorrow, which is the exact
 * failure the whole "design is the running app" idea exists to prevent.
 */
describe("the brand, as a palette a board can offer", () => {
  it("resolves a token to the colour it is today", () => {
    expect(hexFor("cyan.main")).toBe("#00E5FF");
    expect(hexFor("purple.main")).toBe("#6200EA");
    expect(hexFor("not.a.token")).toBeUndefined();
  });

  it("recognises a raw hex that came from the brand, so an old shape can be adopted back", () => {
    expect(tokenFor("#00e5ff")).toBe("cyan.main");
    expect(tokenFor("  #FFC107 ")).toBe("amber.main");
    expect(tokenFor("#123456")).toBeUndefined();
  });

  it("round-trips every swatch", () => {
    for (const s of [...boardFills, ...boardStrokes]) {
      expect(hexFor(s.token)).toBe(s.hex);
    }
  });

  it("names every swatch and says what the brand ones are for", () => {
    for (const s of boardFills) {
      expect(s.label).not.toBe("");
      expect(s.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
    for (const token of ["cyan.main", "purple.main", "amber.main"]) {
      expect(boardFills.find((s) => s.token === token)?.meaning).toBeTruthy();
    }
  });

  it("carries ink that is readable on its own fill", () => {
    // A sticky note nobody can read is not a sticky note.
    for (const s of [...boardFills, ...stickyFills]) {
      expect(contrastRatio(s.ink, s.hex)).toBeGreaterThanOrEqual(WCAG.AA_LARGE);
    }
  });

  it("offers a type scale rather than a free number field", () => {
    const px = boardTextSizes.map((t) => t.px);
    expect(px).toEqual([...px].sort((a, b) => a - b));
    expect(new Set(px).size).toBe(px.length);
  });
});
