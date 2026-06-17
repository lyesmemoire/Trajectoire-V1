// runtime/question-engine/state/RuntimeAction.ts
import { SelectorExecutionResult } from "../pipeline/SelectorExecutionResult";
import { InterviewPhase } from "../types/InterviewPhase";
// PromptSnapshot is assumed to exist in ../../types/prompt-snapshot.ts or similar
// For now we will use an inline type or import if it exists.
import { PromptSnapshot } from "../../types/prompt"; // assuming
import { SignalName } from "../signals/SignalName";

export interface SignalUpdate {
  readonly name: SignalName;
  readonly value: number;
}

/**
 * Strict Redux-style action definitions for deterministic state transitions.
 * The RuntimeReducer accepts only these actions to mutate InterviewRuntimeState.
 */
export type RuntimeAction =
  | {
      readonly type: "PIPELINE_EXECUTED";
      readonly payload: SelectorExecutionResult;
    }
  | { readonly type: "SIGNAL_UPDATED"; readonly payload: SignalUpdate }
  | { readonly type: "PHASE_ADVANCED"; readonly payload: InterviewPhase }
  | { readonly type: "PROMPT_ASSEMBLED"; readonly payload: PromptSnapshot };
