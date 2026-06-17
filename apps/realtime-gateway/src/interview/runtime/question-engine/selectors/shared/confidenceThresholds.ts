// runtime/question-engine/selectors/shared/confidenceThresholds.ts
/**
 * Shared confidence thresholds used across selectors.
 * All thresholds are inclusive lower bounds; the upper bound of a bucket
 * is the lower bound of the next bucket.
 */
export const CONFIDENCE_THRESHOLDS = {
  LOW: 0.0, // [0.0, 0.25)
  MODERATE: 0.25, // [0.25, 0.5)
  STRONG: 0.5, // [0.5, 0.75)
  VERY_STRONG: 0.75, // [0.75, 1.0]
  MAX: 1.0,
} as const;

/**
 * Helper to classify a confidence value into a bucket name.
 */
export function classifyConfidence(
  confidence: number,
): keyof typeof CONFIDENCE_THRESHOLDS {
  if (confidence < CONFIDENCE_THRESHOLDS.MODERATE) return "LOW";
  if (confidence < CONFIDENCE_THRESHOLDS.STRONG) return "MODERATE";
  if (confidence < CONFIDENCE_THRESHOLDS.VERY_STRONG) return "STRONG";
  if (confidence <= CONFIDENCE_THRESHOLDS.MAX) return "VERY_STRONG";
  return "MAX";
}
