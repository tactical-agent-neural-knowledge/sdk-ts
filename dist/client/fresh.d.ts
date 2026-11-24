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
export declare const FRESH_FADE_MS = 280;
/** How often a client redraws while something is fading. */
export declare const FRESH_TICK_MS = 32;
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
export declare const FRESH_MAX_RUNS = 8;
/**
 * The settling tint (Robby, 2026-11-24, after the fade went live: "The neural speed is perfect.
 * What I want is for the text to appear, but the first time the user sees it, it soft fades
 * from a lightly colored text to the font it is now. Don't change anything on the speed, add
 * this as a separate animation."). Text still appears exactly when it does now and at full
 * strength; it is drawn in a light tint and its color settles to the normal text color over
 * TINT_SETTLE_MS, so on a long reply arriving fast a soft band of color trails the newest words.
 */
export declare const TINT_SETTLE_MS = 800;
/** How many runs settle at once: the trailing band, never the whole reply. */
export declare const TINT_MAX_RUNS = 16;
/** A gentle ease in and out (a half cosine): no jump at the start, no snap at the end. */
export declare function freshAlpha(elapsedMs: number, durationMs?: number): number;
/** Tracks one text as it grows. */
export declare class FreshTail {
    private length;
    private blocks;
    private readonly durationMs;
    private readonly maxRuns;
    /** `durationMs`: how long a run takes to become plain (the fade by default, or TINT_SETTLE_MS). */
    constructor(durationMs?: number, maxRuns?: number);
    /** The text is now `length` characters long. Call it whenever the text is drawn. */
    arrived(length: number, now: number): void;
    /** Whether anything is still fading. */
    active(now: number): boolean;
    /** The runs still fading, oldest first; empty when the whole text is plain. */
    runs(now: number): FreshRun[];
    /** Blocks that have finished fading are plain text again. They finish in the order they came. */
    private settle;
}
/** How many characters at the end of the text the runs cover. */
export declare function freshChars(runs: FreshRun[]): number;
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
export declare function freshPieces(text: string, runs: FreshRun[], after: number): FreshPiece[];
/** Arrivals this close together are one block; nothing waits longer than this to be shown. */
export declare const BLOCK_WINDOW_MS = 150;
/** How long a block may be held back so that a Markdown marker in it can close. */
export declare const MARKER_HOLD_MS = 400;
/**
 * Where the earliest Markdown marker that is still open at the end of `text` begins, or -1 when
 * everything that was opened has been closed. Shown as it is, an open marker is raw punctuation
 * on screen ("**largest to" until the closing stars arrive), so a block is never cut inside one.
 * Known markers: bold (`**`, `__`), emphasis (`*x`, `_x`), strike (`~~`), inline code, a link
 * (`[text](address)`), and a code fence. Inline markers do not outlive their paragraph.
 */
export declare function openMarker(text: string): number;
/**
 * Gathers arrived text into blocks. `step` says how much of the text is out now; when the
 * answer grows, that growth is one block, to be faded in together.
 */
export declare class BlockGate {
    private shown;
    private seen;
    /** What has arrived and is not out yet: up to where, and when it arrived. Oldest first. */
    private arrivals;
    private lastOut;
    /** Since when a block has been held back for a marker to close; -1 when none is. */
    private heldSince;
    /** How much of the text is out now. */
    get length(): number;
    /**
     * Returns the new length when a block is let out, and undefined when nothing changes.
     * `ended`: no more text will come, so whatever is waiting goes out now.
     */
    step(text: string, now: number, ended?: boolean): number | undefined;
    /** When the character at `index` arrived. */
    private arrivedAt;
}
