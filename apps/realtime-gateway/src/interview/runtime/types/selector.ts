// runtime/types/selector.ts
/**
 * Generic selector result used by various selector implementations.
 */
export interface SelectorResult<T> {
  /** Selected value */
  value: T;
  /** Confidence score (0‑1) for the selected value */
  confidence: number;
  /** Human‑readable reason why this value was selected */
  reason: string;
  /** Items that were considered but rejected */
  rejected: readonly string[];
}
