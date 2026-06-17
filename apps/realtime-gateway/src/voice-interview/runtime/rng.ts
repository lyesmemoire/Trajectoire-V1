/**
 * runtime/rng.ts — RNG seedable (P4.2). DÉTERMINISTE (mulberry32).
 * Tire les probabilités UX (silence/interruption) de façon reproductible.
 */
export interface Rng {
  next(): number;
  chance(p: number): boolean;
}

export class SeededRng implements Rng {
  private state: number;
  constructor(seed = 1) {
    this.state = (seed >>> 0) || 0x9e3779b9;
  }
  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  chance(p: number): boolean {
    const clamped = Math.max(0, Math.min(1, p));
    if (clamped <= 0) return false;
    if (clamped >= 1) return true;
    return this.next() < clamped;
  }
}
