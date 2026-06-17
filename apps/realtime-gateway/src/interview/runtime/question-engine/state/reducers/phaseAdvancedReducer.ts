// runtime/question-engine/state/reducers/phaseAdvancedReducer.ts
import type { InterviewRuntimeState } from "../InterviewRuntimeState";
import type { RuntimeAction } from "../RuntimeAction";

/**
 * Handles PHASE_ADVANCED actions.
 * Updates the interview phase and increments the execution counter.
 */
export function phaseAdvancedReducer(
  state: InterviewRuntimeState,
  action: Extract<RuntimeAction, { type: "PHASE_ADVANCED" }>,
): Omit<InterviewRuntimeState, "stateHash"> {
  const newPhase = action.payload;
  return {
    ...state,
    executionCount: state.executionCount + 1,
    interviewPhase: newPhase,
  } as Omit<InterviewRuntimeState, "stateHash">;
}
