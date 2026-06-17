// runtime/question-engine/selectors/shared/deterministicSort.ts
/**
 * Deterministic sorting utility used by selectors.
 * Sorts an array of items that have a numeric `raw` score and an `id` string.
 * Ordering is:
 *   1. Descending raw score (higher is better).
 *   2. Lexicographical order of `id` as a tie‑breaker.
 * This ensures identical ordering across all environments for identical inputs.
 */
export interface ScoredItem<T> {
  /** The underlying item (e.g., a TopicNode). */
  item: T;
  /** Raw numeric score before normalization. */
  raw: number;
  /** Identifier used for deterministic tie‑break. */
  id: string;
}

/**
 * Deterministically sort an array of ScoredItem objects.
 * The function returns a new array (does not mutate the input).
 */
export function deterministicSort<T>(
  items: readonly ScoredItem<T>[],
): ScoredItem<T>[] {
  // Copy to avoid side‑effects.
  const copy = [...items];
  copy.sort((a, b) => {
    if (b.raw !== a.raw) return b.raw - a.raw; // higher raw first
    return a.id.localeCompare(b.id); // lexical tie‑break
  });
  return copy;
}
