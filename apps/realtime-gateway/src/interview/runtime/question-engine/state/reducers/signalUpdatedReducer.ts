// runtime/question-engine/state/reducers/signalUpdatedReducer.ts
import type { InterviewRuntimeState } from "../InterviewRuntimeState";
import type { RuntimeAction } from "../RuntimeAction";
import type { SignalUpdate } from "../RuntimeAction";

/**
 * Handles SIGNAL_UPDATED actions.
 * Returns a new state draft (without stateHash) where the SignalRegistry is
 * updated immutably via its `withSignal` method.
 */
export function signalUpdatedReducer(
  state: InterviewRuntimeState,
  action: Extract<RuntimeAction, { type: "SIGNAL_UPDATED" }>,
): Omit<InterviewRuntimeState, "stateHash"> {
  const { name, value } = action.payload as SignalUpdate;
  const updatedRegistry = state.signals.withSignal(name, value);
  return {
    ...state,
    executionCount: state.executionCount + 1,
    signals: updatedRegistry,
  } as Omit<InterviewRuntimeState, "stateHash">;
}
