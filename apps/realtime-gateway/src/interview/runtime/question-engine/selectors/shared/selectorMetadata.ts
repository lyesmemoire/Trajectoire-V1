// runtime/question-engine/selectors/shared/selectorMetadata.ts
/**
 * Common metadata included in every selector result.
 * Guarantees a uniform shape for analytics, replay, and debugging.
 */
export interface SelectorMetadata {
  /** Normalized confidence in the range [0, 1]. */
  readonly confidence: number;
  /** Human‑readable reason for the selection. */
  readonly reason: string;
  /** Raw scoring breakdown for this selector (key → raw numeric value). */
  readonly rawScores: Readonly<Record<string, number>>;
}
