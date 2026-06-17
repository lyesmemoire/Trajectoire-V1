// runtime/utils/normalizeFloat.ts
/**
 * Normalizes a floating‑point number to a fixed precision.
 * Guarantees deterministic string representation across runtimes.
 */
export function normalizeFloat(value: number, precision: number = 6): number {
  return Number(value.toFixed(precision));
}
