// runtime/question-engine/state/reducers/stateHashReducer.ts
import type { InterviewRuntimeState } from "../InterviewRuntimeState";
import { hashRuntimeState } from "../hashRuntimeState";
import { deepFreeze } from "@core/freeze/deepFreeze";

/**
 * Recomputes the stateHash for a given intermediate state (which does not yet contain stateHash).
 * Returned state includes the newly computed hash and is deep‑frozen.
 */
export function stateHashReducer(
  state: Omit<InterviewRuntimeState, "stateHash">,
): InterviewRuntimeState {
  const hash = hashRuntimeState(state);
  return deepFreeze({
    ...state,
    stateHash: hash,
  });
}
