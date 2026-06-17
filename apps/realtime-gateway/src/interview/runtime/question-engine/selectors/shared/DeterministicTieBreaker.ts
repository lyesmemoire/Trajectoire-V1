// runtime/question-engine/selectors/shared/DeterministicTieBreaker.ts
import { hashObjectStable } from "../../../utils/hash";

/**
 * Breaks ties deterministically between scored candidates.
 * Uses a pure functional stable hash to guarantee replay consistency
 * across versions, removing all reliance on Math.random or insertion order.
 */
export function breakTieDeterministically(
  selectorName: string,
  selectorVersion: string,
  candidateId: string,
  contextHash: string,
): string {
  return hashObjectStable({
    selectorName,
    selectorVersion,
    candidateId,
    contextHash,
  });
}
