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
/** How many blocks fade at once. Blocks come at most one every BLOCK_WINDOW_MS and fade for
 * FRESH_FADE_MS, so three or four overlap; the cap is a guard, not something a reply reaches. */
export const FRESH_MAX_RUNS = 8;
/** A gentle ease in and out (a half cosine): no jump at the start, no snap at the end. */
export function freshAlpha(elapsedMs) {
    if (elapsedMs <= 0)
        return 0;
    if (elapsedMs >= FRESH_FADE_MS)
        return 1;
    return (1 - Math.cos((Math.PI * elapsedMs) / FRESH_FADE_MS)) / 2;
}
/** Tracks one text as it grows. */
export class FreshTail {
    length = 0;
    blocks = [];
    /** The text is now `length` characters long. Call it whenever the text is drawn. */
    arrived(length, now) {
        if (length === this.length)
            return;
        if (length < this.length) {
            // A reset or a dropped tail: what is there now is what there is, with nothing fading.
            this.blocks = this.blocks.filter((b) => b.from < length);
            this.length = length;
            return;
        }
        this.blocks.push({ from: this.length, at: now });
        this.length = length;
        if (this.blocks.length > FRESH_MAX_RUNS)
            this.blocks.splice(0, this.blocks.length - FRESH_MAX_RUNS);
    }
    /** Whether anything is still fading. */
    active(now) {
        this.settle(now);
        return this.blocks.length > 0;
    }
    /** The runs still fading, oldest first; empty when the whole text is plain. */
    runs(now) {
        this.settle(now);
        const out = [];
        for (let i = 0; i < this.blocks.length; i++) {
            const b = this.blocks[i];
            const to = i + 1 < this.blocks.length ? this.blocks[i + 1].from : this.length;
            if (to > b.from)
                out.push({ chars: to - b.from, alpha: freshAlpha(now - b.at), at: b.at });
        }
        return out;
    }
    /** Blocks that have finished fading are plain text again. They finish in the order they came. */
    settle(now) {
        while (this.blocks.length > 0 && now - this.blocks[0].at >= FRESH_FADE_MS)
            this.blocks.shift();
    }
}
/** How many characters at the end of the text the runs cover. */
export function freshChars(runs) {
    let n = 0;
    for (const r of runs)
        n += r.chars;
    return n;
}
/**
 * Cuts the last `text.length` characters of a longer text into plain and fading pieces, given
 * that `after` characters of that longer text come after this piece. A renderer walks its text
 * pieces from the end, passing how many characters it has already placed, and draws what comes
 * back. A piece nothing reaches comes back whole and plain.
 */
export function freshPieces(text, runs, after) {
    if (text === "" || runs.length === 0)
        return text === "" ? [] : [{ text, alpha: 1 }];
    const out = [];
    // Distances from the end of the whole text: this piece covers (after, after + text.length].
    let end = text.length;
    let edge = 0; // how far from the end the runs handled so far reach
    for (let i = runs.length - 1; i >= 0 && end > 0; i--) {
        const run = runs[i];
        const from = edge;
        edge += run.chars;
        // The part of this run inside this piece, as distances from the end.
        const lo = Math.max(from, after);
        const hi = Math.min(edge, after + text.length);
        if (hi <= lo)
            continue;
        const start = text.length - (hi - after);
        const stop = text.length - (lo - after);
        out.unshift({ text: text.slice(start, stop), alpha: run.alpha, at: run.at });
        end = start;
    }
    if (end > 0)
        out.unshift({ text: text.slice(0, end), alpha: 1 });
    return out;
}
/** Arrivals this close together are one block; nothing waits longer than this to be shown. */
export const BLOCK_WINDOW_MS = 150;
/** The last place in `text` after `from` where a sentence or a line ends, or -1. */
function lastBreak(text, from) {
    for (let i = text.length - 1; i > from; i--) {
        const c = text[i - 1];
        if (c === "\n")
            return i;
        if (/\s/.test(text[i] ?? "") && /[.!?:;]["')\]]?$/.test(text.slice(Math.max(from, i - 2), i)))
            return i + 1;
    }
    return -1;
}
/** The last place in `text` after `from` that follows whitespace, or -1. */
function lastSpace(text, from) {
    for (let i = text.length; i > from; i--)
        if (/\s/.test(text[i - 1]))
            return i;
    return -1;
}
/**
 * Gathers arrived text into blocks. `step` says how much of the text is out now; when the
 * answer grows, that growth is one block, to be faded in together.
 */
export class BlockGate {
    shown = 0;
    seen = 0;
    /** What has arrived and is not out yet: up to where, and when it arrived. Oldest first. */
    arrivals = [];
    lastOut = Number.NEGATIVE_INFINITY;
    /** How much of the text is out now. */
    get length() {
        return this.shown;
    }
    /**
     * Returns the new length when a block is let out, and undefined when nothing changes.
     * `ended`: no more text will come, so whatever is waiting goes out now.
     */
    step(text, now, ended = false) {
        if (text.length < this.seen) {
            // A reset: what is there now is what there is.
            this.shown = Math.min(this.shown, text.length);
            this.seen = this.shown;
            this.arrivals = [];
        }
        if (text.length > this.seen) {
            this.arrivals.push({ to: text.length, at: now });
            this.seen = text.length;
        }
        while (this.arrivals.length > 0 && this.arrivals[0].to <= this.shown)
            this.arrivals.shift();
        const oldest = this.arrivals[0];
        if (!oldest)
            return undefined;
        // The first text after a quiet moment is not held: it is the fast part. Neither is the
        // end of the stream. Otherwise a block goes out once its oldest text has waited the window.
        const quiet = now - this.lastOut >= BLOCK_WINDOW_MS * 2;
        if (!ended && !quiet && now - oldest.at < BLOCK_WINDOW_MS)
            return undefined;
        let to = text.length;
        if (!ended) {
            // Cut where a sentence or a line ends, or failing that between words, but only when what
            // is left behind has only just arrived: nothing waits past the window for a tidy edge.
            // (Text that came in the same piece as the block's oldest is never split from it: a
            // reply that arrives whole is one block.)
            const young = (at) => {
                const came = this.arrivedAt(at);
                return came > oldest.at && now - came < BLOCK_WINDOW_MS / 2;
            };
            const edge = lastBreak(text, this.shown);
            const space = lastSpace(text, this.shown);
            if (edge > this.shown && edge < text.length && young(edge))
                to = edge;
            else if (space > this.shown && space < text.length && young(space))
                to = space;
        }
        this.shown = to;
        this.lastOut = now;
        return to;
    }
    /** When the character at `index` arrived. */
    arrivedAt(index) {
        for (const a of this.arrivals)
            if (index < a.to)
                return a.at;
        return Number.POSITIVE_INFINITY;
    }
}
