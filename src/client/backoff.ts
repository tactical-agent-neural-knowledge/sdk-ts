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
export class Backoff {
  private attempt = 0;
  private readonly minMs: number;
  private readonly maxMs: number;
  private readonly random: () => number;

  constructor(opts: BackoffOptions = {}) {
    this.minMs = opts.minMs ?? 250;
    this.maxMs = opts.maxMs ?? 30_000;
    this.random = opts.random ?? Math.random;
  }

  /** Delay for the current attempt, then advances the attempt counter. */
  next(): number {
    const ceiling = Math.min(this.maxMs, this.minMs * 2 ** this.attempt);
    this.attempt = Math.min(this.attempt + 1, 30);
    return Math.floor(this.random() * ceiling);
  }

  get attempts(): number {
    return this.attempt;
  }

  reset(): void {
    this.attempt = 0;
  }
}
