// runtime/question-engine/selectors/shared/confidenceUtils.ts
/**
 * Utilities for handling confidence values across selectors.
 * All confidence values are expected to be in the range [0, 1].
 * Functions clamp values and optionally normalise the floating‑point
 * representation using the existing `normalizeFloat` utility.
 */
import { normalizeFloat } from "../../../utils/normalizeFloat";

/** Clamp a number between min and max (inclusive). */
export function clamp(value: number, min: number = 0, max: number = 1): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/** Convert a raw score to a confidence value in [0,1] and normalize it. */
export function toConfidence(
  raw: number,
  min: number = 0,
  max: number = 1,
): number {
  const clamped = clamp(raw, min, max);
  // Use a deterministic precision (6 decimal places) for replay safety.
  return normalizeFloat(clamped);
}
