/**
 * Exponential backoff strategy with jitter for reconnection.
 * Pure computation — no I/O.
 */

export class BackoffStrategy {
  private readonly initialMs: number;
  private readonly maxMs: number;
  private readonly multiplier: number;
  private attempt: number = 0;

  constructor(initialMs: number, maxMs: number, multiplier: number) {
    this.initialMs = initialMs;
    this.maxMs = maxMs;
    this.multiplier = multiplier;
  }

  nextDelay(): number {
    const exponential = this.initialMs * Math.pow(this.multiplier, this.attempt);
    const capped = Math.min(exponential, this.maxMs);
    // Add jitter: ±25% to prevent thundering herd
    const jitter = capped * (0.75 + Math.random() * 0.5);
    this.attempt += 1;
    return Math.round(jitter);
  }

  get currentAttempt(): number {
    return this.attempt;
  }

  reset(): void {
    this.attempt = 0;
  }
}
