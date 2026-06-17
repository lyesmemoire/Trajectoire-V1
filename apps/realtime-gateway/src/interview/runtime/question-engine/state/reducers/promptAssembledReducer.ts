// runtime/question-engine/state/reducers/promptAssembledReducer.ts
import type { InterviewRuntimeState } from "../InterviewRuntimeState";
import type { RuntimeAction } from "../RuntimeAction";
import type { PromptSnapshot } from "../../../types/prompt";

/**
 * Handles PROMPT_ASSEMBLED actions.
 * Adds a new PromptSnapshot to the state's promptSnapshots collection.
 */
export function promptAssembledReducer(
  state: InterviewRuntimeState,
  action: Extract<RuntimeAction, { type: "PROMPT_ASSEMBLED" }>,
): Omit<InterviewRuntimeState, "stateHash"> {
  const newSnapshot = action.payload as PromptSnapshot;
  return {
    ...state,
    executionCount: state.executionCount + 1,
    promptSnapshots: [...state.promptSnapshots, newSnapshot],
  } as Omit<InterviewRuntimeState, "stateHash">;
}
