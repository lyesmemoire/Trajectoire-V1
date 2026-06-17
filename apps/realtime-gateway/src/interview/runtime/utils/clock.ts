// runtime/utils/clock.ts
/**
 * Minimal injectable clock abstraction.
 * Allows deterministic substitution in tests / replay simulations.
 */
export interface RuntimeClock {
  /** Current timestamp in milliseconds since epoch. */
  now(): number;
}

/**
 * Default implementation that simply proxies to `Date.now()`.
 * In production you can use this directly; in tests you provide a mock.
 */
export class SystemClock implements RuntimeClock {
  now(): number {
    return Date.now();
  }
}
