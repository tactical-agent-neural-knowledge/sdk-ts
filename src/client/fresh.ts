/**
 * Text that is still arriving fades in, block by block (Robby, 2026-11-23, after trying words in
 * groups: "just makes it look like it's sticky ... What if the block of words fade in?"). Nothing
 * is ever held back: every character is on screen the moment it arrives, and only its opacity
 * moves, from 0 to 1 over FRESH_FADE_MS, eased. Each arrival is its own block with its own clock,
 * so blocks that arrive faster than the fade are fading at the same time and the text flows
 * instead of stepping; text that arrives all at once (a reply that was already written) is one
 * block and fades in together. Only the tail is ever touched: everything older is plain text.
 *
 * This file is the arithmetic only, shared by the browser and both phones: it says how many
 * characters at the end of the text are still fading and how visible each run of them is. The
 * clients draw that with whatever they have (a span's opacity, a text run's color).
 */
export const FRESH_FADE_MS = 160;
/** How often a client redraws while something is fading. */
export const FRESH_TICK_MS = 32;

/** A run of characters still fading. Runs are in reading order and together end the text. */
export interface FreshRun {
  /** How many characters. */
  chars: number;
  /** How visible they are now, 0 to 1. */
  alpha: number;
  /** When they arrived, on the clock the caller passes in: a renderer that animates the run
   * itself between redraws (the browser does) computes its alpha from this with `freshAlpha`. */
  at: number;
}

/** How many runs fade at once. A burst of more words than this shows its oldest words plain, so
 * a long reply never has more than a line or two in motion (a mid-range phone keeps its frames). */
export const FRESH_MAX_RUNS = 24;

interface Block {
  /** Where the block starts in the text. */
  from: number;
  /** When it arrived. */
  at: number;
}

/** Ease out: quick at first, settling. */
export function freshAlpha(elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  if (elapsedMs >= FRESH_FADE_MS) return 1;
  const left = 1 - elapsedMs / FRESH_FADE_MS;
  return 1 - left * left * left;
}

/** Tracks one text as it grows. */
export class FreshTail {
  private length = 0;
  private blocks: Block[] = [];

  /** The text is now `length` characters long. Call it whenever the text is drawn. */
  arrived(length: number, now: number): void {
    if (length === this.length) return;
    if (length < this.length) {
      // A reset or a dropped tail: what is there now is what there is, with nothing fading.
      this.blocks = this.blocks.filter((b) => b.from < length);
      this.length = length;
      return;
    }
    this.blocks.push({ from: this.length, at: now });
    this.length = length;
    if (this.blocks.length > FRESH_MAX_RUNS) this.blocks.splice(0, this.blocks.length - FRESH_MAX_RUNS);
  }

  /** Whether anything is still fading. */
  active(now: number): boolean {
    this.settle(now);
    return this.blocks.length > 0;
  }

  /** The runs still fading, oldest first; empty when the whole text is plain. */
  runs(now: number): FreshRun[] {
    this.settle(now);
    const out: FreshRun[] = [];
    for (let i = 0; i < this.blocks.length; i++) {
      const b = this.blocks[i] as Block;
      const to = i + 1 < this.blocks.length ? (this.blocks[i + 1] as Block).from : this.length;
      if (to > b.from) out.push({ chars: to - b.from, alpha: freshAlpha(now - b.at), at: b.at });
    }
    return out;
  }

  /** Blocks that have finished fading are plain text again. They finish in the order they came. */
  private settle(now: number): void {
    while (this.blocks.length > 0 && now - (this.blocks[0] as Block).at >= FRESH_FADE_MS) this.blocks.shift();
  }
}

/** How many characters at the end of the text the runs cover. */
export function freshChars(runs: FreshRun[]): number {
  let n = 0;
  for (const r of runs) n += r.chars;
  return n;
}

/** A piece of text with how visible it is; 1 is plain. `at` is set on a fading piece. */
export interface FreshPiece {
  text: string;
  alpha: number;
  at?: number;
}

/**
 * Cuts the last `text.length` characters of a longer text into plain and fading pieces, given
 * that `after` characters of that longer text come after this piece. A renderer walks its text
 * pieces from the end, passing how many characters it has already placed, and draws what comes
 * back. A piece nothing reaches comes back whole and plain.
 */
export function freshPieces(text: string, runs: FreshRun[], after: number): FreshPiece[] {
  if (text === "" || runs.length === 0) return text === "" ? [] : [{ text, alpha: 1 }];
  const out: FreshPiece[] = [];
  // Distances from the end of the whole text: this piece covers (after, after + text.length].
  let end = text.length;
  let edge = 0; // how far from the end the runs handled so far reach
  for (let i = runs.length - 1; i >= 0 && end > 0; i--) {
    const run = runs[i] as FreshRun;
    const from = edge;
    edge += run.chars;
    // The part of this run inside this piece, as distances from the end.
    const lo = Math.max(from, after);
    const hi = Math.min(edge, after + text.length);
    if (hi <= lo) continue;
    const start = text.length - (hi - after);
    const stop = text.length - (lo - after);
    out.unshift({ text: text.slice(start, stop), alpha: run.alpha, at: run.at });
    end = start;
  }
  if (end > 0) out.unshift({ text: text.slice(0, end), alpha: 1 });
  return out;
}

/**
 * Text arrives from the network in bursts, and painting each burst as it lands is what makes a
 * reply look jerky (Robby, 2026-11-24: "We need to make the animation of words appearing
 * smoother"). The pacer lets arrived text out a word at a time at a steady rate that adapts to
 * how much is waiting: the more there is, the faster it goes, so what is on screen is never more
 * than about PACE_LAG_MS behind what has arrived. A word is let out whole. A long run with no
 * space in it (an address, a line of code) is not waited for past the lag, and when the stream
 * ends everything left is shown at once.
 */
export const PACE_LAG_MS = 120;
/** The slowest the pacer goes while anything is waiting, in characters a second. */
export const PACE_MIN_CPS = 90;

export class RevealPacer {
  private shown = 0;
  private seen = 0;
  private credit = 0;
  private last = -1;
  /** What has arrived and is not all out yet: up to where, and when it arrived. Oldest first. */
  private arrivals: { to: number; at: number }[] = [];

  /** How much of the text is out now. */
  get length(): number {
    return this.shown;
  }

  /**
   * Lets out what is due. Returns where each newly shown word ends, in order (empty when
   * nothing new is shown); the last of them is the new length. `ended`: no more text will come.
   */
  step(text: string, now: number, ended = false): number[] {
    if (text.length < this.seen) {
      // A reset: start again from what is there.
      this.shown = Math.min(this.shown, text.length);
      this.seen = this.shown;
      this.credit = 0;
      this.arrivals = [];
    }
    const dt = this.last < 0 ? 16 : Math.min(100, Math.max(0, now - this.last));
    this.last = now;
    if (text.length > this.seen) {
      if (this.arrivals.length === 0) {
        // The first word after a quiet moment goes out at once: pacing smooths what follows,
        // it never delays the start.
        this.credit = wordEnd(text, this.shown) - this.shown;
      }
      this.arrivals.push({ to: text.length, at: now });
      this.seen = text.length;
    }
    while (this.arrivals.length > 0 && (this.arrivals[0] as { to: number }).to <= this.shown)
      this.arrivals.shift();
    const head = this.arrivals[0];
    if (!head) {
      this.credit = 0;
      return [];
    }
    if (ended) {
      this.shown = text.length;
      this.credit = 0;
      this.arrivals = [];
      return [this.shown];
    }
    // Everything in the oldest arrival is due PACE_LAG_MS after it came: the rate is whatever
    // gets there on time, and never slower than the floor, so a lone word is out in a few frames.
    const due = head.at + PACE_LAG_MS;
    const overdue = now >= due;
    if (!overdue) this.credit += Math.max(PACE_MIN_CPS / 1000, (head.to - this.shown) / (due - now)) * dt;
    const cuts: number[] = [];
    for (;;) {
      if (this.shown >= text.length) break;
      const end = wordEnd(text, this.shown);
      // The last word may still be arriving: it is let out when its end is known (a space
      // follows it), or when it has waited as long as anything is allowed to.
      const whole = end < text.length || /\s/.test(text[end - 1] as string);
      const late = overdue && this.shown < head.to;
      if (!late && (!whole || this.credit < end - this.shown)) break;
      this.credit = Math.max(0, this.credit - (end - this.shown));
      this.shown = end;
      cuts.push(end);
    }
    if (this.shown >= text.length) this.credit = 0;
    return cuts;
  }
}

/** Where the word starting at `from` ends: past its letters and the space after them. */
function wordEnd(text: string, from: number): number {
  let i = from;
  while (i < text.length && /\s/.test(text[i] as string)) i++;
  while (i < text.length && !/\s/.test(text[i] as string)) i++;
  while (i < text.length && /\s/.test(text[i] as string)) i++;
  return i;
}
