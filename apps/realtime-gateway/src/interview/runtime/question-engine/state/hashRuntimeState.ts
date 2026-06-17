// runtime/question-engine/state/hashRuntimeState.ts
import type { InterviewRuntimeState } from "./InterviewRuntimeState";
import { hashObjectStable } from "../../utils/hash";

/**
 * Computes a stable hash for the given runtime state.
 * The `stateHash` property itself is deliberately omitted to avoid recursion.
 */
export function hashRuntimeState(
  state: Omit<InterviewRuntimeState, "stateHash">,
): string {
  // Shallow copy without the stateHash (if present).
  const { stateHash, ...hashable } = state as any;
  return hashObjectStable(hashable);
}
