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
/** How many runs fade at once. A burst of more words than this shows its oldest words plain, so
 * a long reply never has more than a line or two in motion (a mid-range phone keeps its frames). */
export const FRESH_MAX_RUNS = 24;
/** Ease out: quick at first, settling. */
export function freshAlpha(elapsedMs) {
    if (elapsedMs <= 0)
        return 0;
    if (elapsedMs >= FRESH_FADE_MS)
        return 1;
    const left = 1 - elapsedMs / FRESH_FADE_MS;
    return 1 - left * left * left;
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
    shown = 0;
    seen = 0;
    credit = 0;
    last = -1;
    /** What has arrived and is not all out yet: up to where, and when it arrived. Oldest first. */
    arrivals = [];
    /** How much of the text is out now. */
    get length() {
        return this.shown;
    }
    /**
     * Lets out what is due. Returns where each newly shown word ends, in order (empty when
     * nothing new is shown); the last of them is the new length. `ended`: no more text will come.
     */
    step(text, now, ended = false) {
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
        while (this.arrivals.length > 0 && this.arrivals[0].to <= this.shown)
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
        if (!overdue)
            this.credit += Math.max(PACE_MIN_CPS / 1000, (head.to - this.shown) / (due - now)) * dt;
        const cuts = [];
        for (;;) {
            if (this.shown >= text.length)
                break;
            const end = wordEnd(text, this.shown);
            // The last word may still be arriving: it is let out when its end is known (a space
            // follows it), or when it has waited as long as anything is allowed to.
            const whole = end < text.length || /\s/.test(text[end - 1]);
            const late = overdue && this.shown < head.to;
            if (!late && (!whole || this.credit < end - this.shown))
                break;
            this.credit = Math.max(0, this.credit - (end - this.shown));
            this.shown = end;
            cuts.push(end);
        }
        if (this.shown >= text.length)
            this.credit = 0;
        return cuts;
    }
}
/** Where the word starting at `from` ends: past its letters and the space after them. */
function wordEnd(text, from) {
    let i = from;
    while (i < text.length && /\s/.test(text[i]))
        i++;
    while (i < text.length && !/\s/.test(text[i]))
        i++;
    while (i < text.length && /\s/.test(text[i]))
        i++;
    return i;
}
