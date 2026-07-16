// @ts-nocheck
// tests/helpers/deterministicClock.ts
/**
 * DeterministicClock provides an immutable, monotonic clock for replay‑safe tests.
 * Each tick returns a new instance; the original instance remains unchanged.
 */
export interface DeterministicClock {
  readonly now: number; // milliseconds
  tick(delta: number): DeterministicClock;
}

export class SimpleDeterministicClock implements DeterministicClock {
  public readonly now: number;
  constructor(now: number = 0) {
    this.now = now;
  }
  tick(delta: number): DeterministicClock {
    // Ensure delta is non‑negative and return a fresh instance.
    const next = this.now + Math.max(0, delta);
    return new SimpleDeterministicClock(next);
  }
}
export const deterministicClock = new SimpleDeterministicClock();
