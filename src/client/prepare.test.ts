import { describe, expect, it, vi } from "vitest";
import { createDraftPreparer } from "./prepare.js";

function setup() {
  vi.useFakeTimers();
  const sent: [string, string][] = [];
  let release: (() => void) | undefined;
  let hold = false;
  const p = createDraftPreparer({
    send: (key, text) => {
      sent.push([key, text]);
      if (!hold) return Promise.resolve();
      return new Promise<void>((r) => {
        release = r;
      });
    },
  });
  return {
    p,
    sent,
    holdNext: () => {
      hold = true;
    },
    release: async () => {
      hold = false;
      release?.();
      await vi.runAllTicks();
      await Promise.resolve();
      await Promise.resolve();
    },
  };
}

describe("createDraftPreparer", () => {
  it("wakes on the first keystroke and reports the draft when typing pauses", async () => {
    const { p, sent } = setup();
    p.changed("c1", "H");
    expect(sent).toEqual([["c1", ""]]);
    await Promise.resolve();
    await Promise.resolve();
    p.changed("c1", "How do");
    p.changed("c1", "How do Roman numerals work?");
    await vi.advanceTimersByTimeAsync(249);
    expect(sent).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(sent).toEqual([
      ["c1", ""],
      ["c1", "How do Roman numerals work?"],
    ]);
    vi.useRealTimers();
  });

  it("never reports the same draft twice in a row, and nothing after done", async () => {
    const { p, sent } = setup();
    p.changed("", "Hello there");
    await vi.advanceTimersByTimeAsync(300);
    p.changed("", "Hello there");
    await vi.advanceTimersByTimeAsync(300);
    expect(sent).toEqual([
      ["", ""],
      ["", "Hello there"],
    ]);
    p.changed("", "Hello there, Neural");
    p.done();
    await vi.advanceTimersByTimeAsync(1000);
    expect(sent).toHaveLength(2);
    vi.useRealTimers();
  });

  it("does not overlap calls: the newest draft goes when the one in flight returns", async () => {
    const { p, sent, holdNext, release } = setup();
    holdNext();
    p.changed("c1", "one");
    expect(sent).toEqual([["c1", ""]]);
    await vi.advanceTimersByTimeAsync(300);
    p.changed("c1", "one two");
    await vi.advanceTimersByTimeAsync(300);
    expect(sent).toHaveLength(1);
    await release();
    expect(sent[sent.length - 1]).toEqual(["c1", "one two"]);
    vi.useRealTimers();
  });

  it("an emptied draft reports nothing", async () => {
    const { p, sent } = setup();
    p.changed("c1", "   ");
    await vi.advanceTimersByTimeAsync(500);
    expect(sent).toEqual([]);
    vi.useRealTimers();
  });
});
