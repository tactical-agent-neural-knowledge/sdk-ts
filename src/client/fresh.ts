/**
 * Text that is still arriving appears in blocks that fade in (Robby, 2026-11-24, after words in
 * groups and then words one at a time: "I was asking for a softer fade in not like a typewriter
 * again. And I was asking for fast." and, the day before, "What if the block of words fade in?").
 *
 * Two rules, and nothing else:
 *
 * - What has arrived is shown as a whole block. Arrivals within about BLOCK_WINDOW_MS of each
 *   other are one block, cut at the end of a sentence or a line when there is one; nothing is
 *   ever let out a word or a letter at a time, and nothing waits longer than that window. The
 *   first text after a quiet moment is not held at all, and a reply that arrives all at once
 *   (one that was already written) is one block.
 * - A block fades in: opacity only, FRESH_FADE_MS, a gentle ease. The next block starts its own
 *   fade while the one before is finishing, so the text reads as calm blocks arriving quickly.
 *   Everything older is plain text.
 *
 * This file is the arithmetic only, shared by the browser and both phones: how much of the text
 * is out, how many characters at its end are still fading, and how visible each run of them is.
 * The clients draw that with what they have (a span's opacity, a text run's color).
 */
export const FRESH_FADE_MS = 280;
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

/** How many blocks fade at once. Blocks come at most one every BLOCK_WINDOW_MS and fade for
 * FRESH_FADE_MS, so three or four overlap; the cap is a guard, not something a reply reaches. */
export const FRESH_MAX_RUNS = 8;

interface Block {
  /** Where the block starts in the text. */
  from: number;
  /** When it arrived. */
  at: number;
}

/** A gentle ease in and out (a half cosine): no jump at the start, no snap at the end. */
export function freshAlpha(elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  if (elapsedMs >= FRESH_FADE_MS) return 1;
  return (1 - Math.cos((Math.PI * elapsedMs) / FRESH_FADE_MS)) / 2;
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

/** Arrivals this close together are one block; nothing waits longer than this to be shown. */
export const BLOCK_WINDOW_MS = 150;

/** The last place in `text` after `from` where a sentence or a line ends, or -1. */
function lastBreak(text: string, from: number): number {
  for (let i = text.length - 1; i > from; i--) {
    const c = text[i - 1] as string;
    if (c === "\n") return i;
    if (/\s/.test(text[i] ?? "") && /[.!?:;]["')\]]?$/.test(text.slice(Math.max(from, i - 2), i)))
      return i + 1;
  }
  return -1;
}

/** How long a block may be held back so that a Markdown marker in it can close. */
export const MARKER_HOLD_MS = 400;

/**
 * Where the earliest Markdown marker that is still open at the end of `text` begins, or -1 when
 * everything that was opened has been closed. Shown as it is, an open marker is raw punctuation
 * on screen ("**largest to" until the closing stars arrive), so a block is never cut inside one.
 * Known markers: bold (`**`, `__`), emphasis (`*x`, `_x`), strike (`~~`), inline code, a link
 * (`[text](address)`), and a code fence. Inline markers do not outlive their paragraph.
 */
export function openMarker(text: string): number {
  let fence = -1;
  let code = -1;
  let bold = -1;
  let under = -1;
  let strike = -1;
  let star = -1;
  let score = -1;
  let link = -1;
  let inAddress = false;
  const clear = () => {
    code = bold = under = strike = star = score = link = -1;
    inAddress = false;
  };
  const space = (c: string | undefined) => c === undefined || /\s/.test(c);
  for (let i = 0; i < text.length; i++) {
    const c = text[i] as string;
    const lineStart = i === 0 || text[i - 1] === "\n";
    if (lineStart && (text.startsWith("```", i) || text.startsWith("~~~", i))) {
      fence = fence < 0 ? i : -1;
      clear();
      const nl = text.indexOf("\n", i);
      if (nl < 0) return fence < 0 ? -1 : fence;
      i = nl;
      continue;
    }
    if (fence >= 0) continue;
    if (c === "\n" && text[i + 1] === "\n") {
      clear();
      continue;
    }
    if (c === "\\") {
      i++;
      continue;
    }
    if (c === "`") {
      code = code < 0 ? i : -1;
      continue;
    }
    if (code >= 0) continue;
    if (inAddress) {
      if (c === ")") {
        inAddress = false;
        link = -1;
      }
      continue;
    }
    if (c === "*" && text[i + 1] === "*") {
      bold = bold < 0 ? i : -1;
      i++;
      continue;
    }
    if (c === "_" && text[i + 1] === "_") {
      under = under < 0 ? i : -1;
      i++;
      continue;
    }
    if (c === "~" && text[i + 1] === "~") {
      strike = strike < 0 ? i : -1;
      i++;
      continue;
    }
    if (c === "*") {
      // A star with a space after it at the start of a line is a list bullet, not emphasis.
      if (star < 0 && !space(text[i + 1]) && !(lineStart && text[i + 1] === " ")) star = i;
      else if (star >= 0 && !space(text[i - 1])) star = -1;
      continue;
    }
    if (c === "_") {
      // An underscore inside a word (snake_case) is not emphasis.
      if (score < 0 && space(text[i - 1]) && !space(text[i + 1])) score = i;
      else if (score >= 0 && !space(text[i - 1]) && space(text[i + 1])) score = -1;
      continue;
    }
    if (c === "[") {
      if (link < 0) link = i;
      continue;
    }
    if (c === "]" && link >= 0) {
      if (text[i + 1] === "(") {
        inAddress = true;
        i++;
      } else if (i + 1 < text.length) {
        link = -1; // brackets that were only brackets
      }
    }
  }
  let first = -1;
  for (const at of [fence, code, bold, under, strike, star, score, link]) {
    if (at >= 0 && (first < 0 || at < first)) first = at;
  }
  return first;
}

/** The last place in `text` after `from` that follows whitespace, or -1. */
function lastSpace(text: string, from: number): number {
  for (let i = text.length; i > from; i--) if (/\s/.test(text[i - 1] as string)) return i;
  return -1;
}

/**
 * Gathers arrived text into blocks. `step` says how much of the text is out now; when the
 * answer grows, that growth is one block, to be faded in together.
 */
export class BlockGate {
  private shown = 0;
  private seen = 0;
  /** What has arrived and is not out yet: up to where, and when it arrived. Oldest first. */
  private arrivals: { to: number; at: number }[] = [];
  private lastOut = Number.NEGATIVE_INFINITY;
  /** Since when a block has been held back for a marker to close; -1 when none is. */
  private heldSince = -1;

  /** How much of the text is out now. */
  get length(): number {
    return this.shown;
  }

  /**
   * Returns the new length when a block is let out, and undefined when nothing changes.
   * `ended`: no more text will come, so whatever is waiting goes out now.
   */
  step(text: string, now: number, ended = false): number | undefined {
    if (text.length < this.seen) {
      // A reset: what is there now is what there is.
      this.shown = Math.min(this.shown, text.length);
      this.seen = this.shown;
      this.arrivals = [];
      this.heldSince = -1;
    }
    if (text.length > this.seen) {
      this.arrivals.push({ to: text.length, at: now });
      this.seen = text.length;
    }
    while (this.arrivals.length > 0 && (this.arrivals[0] as { to: number }).to <= this.shown)
      this.arrivals.shift();
    const oldest = this.arrivals[0];
    if (!oldest) return undefined;
    // The first text after a quiet moment is not held: it is the fast part. Neither is the
    // end of the stream. Otherwise a block goes out once its oldest text has waited the window.
    const quiet = now - this.lastOut >= BLOCK_WINDOW_MS * 2;
    if (!ended && !quiet && now - oldest.at < BLOCK_WINDOW_MS) return undefined;
    let to = text.length;
    if (!ended) {
      // Cut where a sentence or a line ends, or failing that between words, but only when what
      // is left behind has only just arrived: nothing waits past the window for a tidy edge.
      // (Text that came in the same piece as the block's oldest is never split from it: a
      // reply that arrives whole is one block.)
      const young = (at: number) => {
        const came = this.arrivedAt(at);
        return came > oldest.at && now - came < BLOCK_WINDOW_MS / 2;
      };
      const edge = lastBreak(text, this.shown);
      const space = lastSpace(text, this.shown);
      if (edge > this.shown && edge < text.length && young(edge)) to = edge;
      else if (space > this.shown && space < text.length && young(space)) to = space;
    }
    if (!ended) {
      // Never cut inside Markdown: a marker opened in this block and not yet closed stays
      // back, with what follows it, until it closes. Not for long: text is never stalled.
      const open = openMarker(text.slice(0, to));
      if (open >= this.shown) {
        if (this.heldSince < 0) this.heldSince = now;
        if (now - this.heldSince < MARKER_HOLD_MS) {
          // A code fence is drawn as a block from its first line: it is let out line by line.
          const fenced = text.startsWith("```", open) || text.startsWith("~~~", open);
          const line = fenced ? text.lastIndexOf("\n", to - 1) + 1 : -1;
          to = fenced && line > open ? line : open;
        }
      }
      if (to <= this.shown) return undefined;
    }
    this.heldSince = -1;
    this.shown = to;
    this.lastOut = now;
    return to;
  }

  /** When the character at `index` arrived. */
  private arrivedAt(index: number): number {
    for (const a of this.arrivals) if (index < a.to) return a.at;
    return Number.POSITIVE_INFINITY;
  }
}
