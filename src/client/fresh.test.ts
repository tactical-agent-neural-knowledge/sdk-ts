import { describe, expect, it } from "vitest";
import {
  BLOCK_WINDOW_MS,
  BlockGate,
  FRESH_FADE_MS,
  FRESH_MAX_RUNS,
  FreshTail,
  freshAlpha,
  freshChars,
  freshPieces,
  MARKER_HOLD_MS,
  openMarker,
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

  it("eases gently from nothing to fully there", () => {
    expect(freshAlpha(0)).toBe(0);
    expect(freshAlpha(FRESH_FADE_MS)).toBe(1);
    expect(freshAlpha(FRESH_FADE_MS / 2)).toBeCloseTo(0.5, 5);
    // Gentle at both ends: the first and last tenth of the fade move very little.
    expect(freshAlpha(FRESH_FADE_MS / 10)).toBeLessThan(0.03);
    expect(freshAlpha((FRESH_FADE_MS * 9) / 10)).toBeGreaterThan(0.97);
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

describe("BlockGate", () => {
  it("shows the first text at once and a reply that arrives whole as one block", () => {
    const g = new BlockGate();
    const whole = "A reply that was already written arrives all at once. It is one block, not many.";
    expect(g.step(whole, 1000)).toBe(whole.length);
    expect(g.step(whole, 1016)).toBeUndefined();
  });

  it("gathers what arrives within the window into one block, never a word at a time", () => {
    const g = new BlockGate();
    let text = "The ";
    expect(g.step(text, 0)).toBe(4);
    // A token every 30 ms: nothing is let out word by word.
    const outs: [number, number][] = [];
    const tokens = [
      "quick ",
      "brown ",
      "fox ",
      "jumps ",
      "over ",
      "the ",
      "lazy ",
      "dog ",
      "and ",
      "keeps ",
      "going ",
    ];
    let now = 0;
    for (const tok of tokens) {
      now += 30;
      text += tok;
      const out = g.step(text, now);
      if (out !== undefined) outs.push([now, out]);
    }
    for (now += 16; now < 800; now += 16) {
      const out = g.step(text, now);
      if (out !== undefined) outs.push([now, out]);
    }
    expect(g.length).toBe(text.length);
    // Eleven tokens came; they went out as a few blocks of several words each.
    expect(outs.length).toBeLessThanOrEqual(4);
    expect(outs.length).toBeGreaterThanOrEqual(2);
    // Nothing waited longer than the window (give or take a frame) to be shown.
    let shown = 4;
    let arrived = 4;
    now = 0;
    const arrivals: [number, number][] = [];
    for (const tok of tokens) {
      now += 30;
      arrived += tok.length;
      arrivals.push([now, arrived]);
    }
    for (const [at, to] of outs) {
      for (const [came, upTo] of arrivals) {
        if (upTo > shown && upTo <= to) expect(at - came).toBeLessThanOrEqual(BLOCK_WINDOW_MS + 16);
      }
      shown = to;
    }
  });

  it("cuts a block where a sentence ends when what follows has only just arrived", () => {
    const g = new BlockGate();
    g.step("Intro. ", 0);
    const text = "Intro. The first sentence is complete. And the";
    // The sentence arrived at 20 ms, the start of the next one just before the block goes out.
    g.step("Intro. The first sentence is complete. ", 20);
    expect(g.step(text, 20 + BLOCK_WINDOW_MS - 10)).toBeUndefined();
    expect(g.step(text, 20 + BLOCK_WINDOW_MS)).toBe("Intro. The first sentence is complete. ".length);
    // What was left behind goes out with the next block, within its own window.
    expect(g.step(text, 20 + BLOCK_WINDOW_MS * 2 + 16)).toBe(text.length);
  });

  it("lets everything out when the stream ends, and starts over on a reset", () => {
    const g = new BlockGate();
    g.step("One. ", 0);
    expect(g.step("One. Two is still arriv", 30)).toBeUndefined();
    expect(g.step("One. Two is still arriv", 40, true)).toBe(23);
    expect(g.step("Next", 60)).toBeUndefined();
    expect(g.length).toBe(4);
  });
});

describe("openMarker", () => {
  it("finds a marker that has not closed yet, and nothing in balanced text", () => {
    expect(openMarker("symbols from **largest to")).toBe(13);
    expect(openMarker("symbols from **largest to smallest**, and")).toBe(-1);
    expect(openMarker("so `VIII")).toBe(3);
    expect(openMarker("so `VIII` is eight")).toBe(-1);
    expect(openMarker("see [the docs](https://tank.ch")).toBe(4);
    expect(openMarker("see [the docs](https://tank.chat) now")).toBe(-1);
    expect(openMarker("this is *really")).toBe(8);
    expect(openMarker("this is *really* true")).toBe(-1);
    expect(openMarker("was ~~wrong")).toBe(4);
  });

  it("is not fooled by bullets, snake_case, plain brackets or a new paragraph", () => {
    expect(openMarker("Steps:\n* first\n* second")).toBe(-1);
    expect(openMarker("call read_file_now with it")).toBe(-1);
    expect(openMarker("the list [1, 2] is short")).toBe(-1);
    expect(openMarker("a stray **star here\n\nA new paragraph")).toBe(-1);
    expect(openMarker("2 * 3 = 6")).toBe(-1);
  });

  it("knows an open code fence, and ignores markers inside one", () => {
    const text = "Here:\n```ts\nconst a = b ** c;\n";
    expect(openMarker(text)).toBe(6);
    expect(openMarker(`${text}\`\`\`\nDone`)).toBe(-1);
  });
});

describe("BlockGate and Markdown", () => {
  const run = (g: BlockGate, pieces: [number, string][], until: number) => {
    const shown: string[] = [];
    let text = "";
    let k = 0;
    for (let now = 0; now <= until; now += 16) {
      while (k < pieces.length && (pieces[k] as [number, string])[0] <= now)
        text += (pieces[k++] as [number, string])[1];
      const out = g.step(text, now);
      if (out !== undefined) shown.push(text.slice(0, out));
    }
    return { shown, text };
  };

  it("never shows a block that ends inside bold, code or a link", () => {
    const g = new BlockGate();
    const { shown, text } = run(
      g,
      [
        [0, "Roman "],
        [40, "numerals add symbols from **largest "],
        [200, "to "],
        [380, "smallest**, and `VIII` is "],
        [560, "eight. See [the "],
        [740, "table](https://tank.chat/t) for more."],
      ],
      1400,
    );
    expect(shown[shown.length - 1]).toBe(text);
    for (const s of shown) expect(openMarker(s)).toBe(-1);
    // What came before the marker was not held back with it.
    expect(shown.some((s) => s.endsWith("symbols from "))).toBe(true);
  });

  it("does not stall on a marker that never closes", () => {
    const g = new BlockGate();
    const { shown, text } = run(
      g,
      [
        [0, "Price: "],
        [40, "5 *per unit, before tax and shipping"],
      ],
      MARKER_HOLD_MS + 400,
    );
    expect(shown[shown.length - 1]).toBe(text);
  });
});
