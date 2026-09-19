/**
 * "Full jitter" exponential backoff (AWS Architecture Blog): each delay is a
 * uniform random value in [0, min(max, base * 2^attempt)]. Full jitter spreads
 * a thundering herd of reconnects after a gateway restart across the whole
 * window instead of clustering them at the cap.
 */
export class Backoff {
    attempt = 0;
    minMs;
    maxMs;
    random;
    constructor(opts = {}) {
        this.minMs = opts.minMs ?? 250;
        this.maxMs = opts.maxMs ?? 30_000;
        this.random = opts.random ?? Math.random;
    }
    /** Delay for the current attempt, then advances the attempt counter. */
    next() {
        const ceiling = Math.min(this.maxMs, this.minMs * 2 ** this.attempt);
        this.attempt = Math.min(this.attempt + 1, 30);
        return Math.floor(this.random() * ceiling);
    }
    get attempts() {
        return this.attempt;
    }
    reset() {
        this.attempt = 0;
    }
}
