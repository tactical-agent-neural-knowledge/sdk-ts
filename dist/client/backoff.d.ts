export interface BackoffOptions {
    /** First delay ceiling in ms. Default 250. */
    minMs?: number;
    /** Delay ceiling in ms. Default 30_000. */
    maxMs?: number;
    /** Random source in [0,1). Injectable for tests. */
    random?: () => number;
}
/**
 * "Full jitter" exponential backoff (AWS Architecture Blog): each delay is a
 * uniform random value in [0, min(max, base * 2^attempt)]. Full jitter spreads
 * a thundering herd of reconnects after a gateway restart across the whole
 * window instead of clustering them at the cap.
 */
export declare class Backoff {
    private attempt;
    private readonly minMs;
    private readonly maxMs;
    private readonly random;
    constructor(opts?: BackoffOptions);
    /** Delay for the current attempt, then advances the attempt counter. */
    next(): number;
    get attempts(): number;
    reset(): void;
}
