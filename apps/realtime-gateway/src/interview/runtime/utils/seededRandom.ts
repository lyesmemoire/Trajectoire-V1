// runtime/utils/seededRandom.ts
/**
 * Simple deterministic pseudo‑random number generator based on a linear congruential generator (LCG).
 * The implementation is deliberately lightweight and fully deterministic given an initial seed.
 * It supports snapshot/restore for replay checkpoints.
 */
import type { SeededRandom } from "../EngineRuntimeConfig";

/**
 * LCG parameters (same as Numerical Recipes):
 *   modulus = 2^31 - 1 (a prime), multiplier = 16807, increment = 0.
 * These produce a full‑period generator for seeds in [1, modulus‑1].
 */
const MODULUS = 0x7fffffff; // 2^31 - 1 = 2147483647
const MULTIPLIER = 16807;

export class SeededRandomImpl implements SeededRandom {
  private seed: number;

  constructor(initialSeed?: number) {
    if (initialSeed !== undefined) {
      this.seed = this.normaliseSeed(initialSeed);
    } else {
      // default deterministic seed if none provided
      this.seed = 123456789;
    }
  }

  /** Ensure seed is within the valid range (1 .. MODULUS‑1). */
  private normaliseSeed(s: number): number {
    let seed = Math.floor(s) % MODULUS;
    if (seed <= 0) seed += MODULUS - 1;
    return seed;
  }

  /** Generate next float in [0, 1). */
  next(): number {
    // LCG step: seed = (seed * MULTIPLIER) % MODULUS
    this.seed = (this.seed * MULTIPLIER) % MODULUS;
    return this.seed / MODULUS;
  }

  /** Generate integer in inclusive range [min, max]. */
  nextInt(min: number, max: number): number {
    if (min > max) {
      throw new Error(`Invalid range: min (${min}) > max (${max})`);
    }
    const rand = this.next(); // [0,1)
    const range = max - min + 1;
    return Math.floor(rand * range) + min;
  }

  /** Return a snapshot of the internal state (the current seed). */
  snapshot(): number {
    return this.seed;
  }

  /** Restore the generator to a previously snapshot state. */
  restore(state: number): void {
    this.seed = this.normaliseSeed(state);
  }
}
