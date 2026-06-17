// runtime/question-engine/state/reducers/pipelineExecutedReducer.ts
import type { InterviewRuntimeState } from "../InterviewRuntimeState";
import type { RuntimeAction } from "../RuntimeAction";

/**
 * Handles PIPELINE_EXECUTED actions.
 * Increments the pipeline execution counter and updates any snapshots
 * that will be added later by other reducers (e.g. decision snapshot).
 */
export function pipelineExecutedReducer(
  state: InterviewRuntimeState,
  action: Extract<RuntimeAction, { type: "PIPELINE_EXECUTED" }>,
): Omit<InterviewRuntimeState, "stateHash"> {
  const { payload } = action;
  // For now we only increment counters; snapshot handling will be in dedicated reducer.
  return {
    ...state,
    executionCount: state.executionCount + 1,
    pipelineExecutionCount: state.pipelineExecutionCount + 1,
    // We could store the latest execution result if needed later.
  } as Omit<InterviewRuntimeState, "stateHash">;
}
