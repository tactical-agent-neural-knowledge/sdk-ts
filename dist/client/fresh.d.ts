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
export declare const FRESH_FADE_MS = 160;
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
/** How many runs fade at once. A burst of more words than this shows its oldest words plain, so
 * a long reply never has more than a line or two in motion (a mid-range phone keeps its frames). */
export declare const FRESH_MAX_RUNS = 24;
/** Ease out: quick at first, settling. */
export declare function freshAlpha(elapsedMs: number): number;
/** Tracks one text as it grows. */
export declare class FreshTail {
    private length;
    private blocks;
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
/**
 * Text arrives from the network in bursts, and painting each burst as it lands is what makes a
 * reply look jerky (Robby, 2026-11-24: "We need to make the animation of words appearing
 * smoother"). The pacer lets arrived text out a word at a time at a steady rate that adapts to
 * how much is waiting: the more there is, the faster it goes, so what is on screen is never more
 * than about PACE_LAG_MS behind what has arrived. A word is let out whole. A long run with no
 * space in it (an address, a line of code) is not waited for past the lag, and when the stream
 * ends everything left is shown at once.
 */
export declare const PACE_LAG_MS = 120;
/** The slowest the pacer goes while anything is waiting, in characters a second. */
export declare const PACE_MIN_CPS = 90;
export declare class RevealPacer {
    private shown;
    private seen;
    private credit;
    private last;
    /** What has arrived and is not all out yet: up to where, and when it arrived. Oldest first. */
    private arrivals;
    /** How much of the text is out now. */
    get length(): number;
    /**
     * Lets out what is due. Returns where each newly shown word ends, in order (empty when
     * nothing new is shown); the last of them is the new length. `ended`: no more text will come.
     */
    step(text: string, now: number, ended?: boolean): number[];
}
