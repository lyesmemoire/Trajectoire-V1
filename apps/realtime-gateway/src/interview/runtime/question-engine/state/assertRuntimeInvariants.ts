// runtime/question-engine/state/assertRuntimeInvariants.ts
/**
 * Runtime invariants that must hold for every InterviewRuntimeState.
 * Called after each reducer transition to guarantee replay‑safety.
 */
import type { InterviewRuntimeState } from "./InterviewRuntimeState";

export function assertRuntimeInvariants(state: InterviewRuntimeState): void {
  // Basic sanity checks – these are cheap and ensure deterministic guarantees.
  if (state.executionCount < 0) {
    throw new Error("Invariant violation: executionCount must be non‑negative");
  }
  if (state.pipelineExecutionCount < 0) {
    throw new Error(
      "Invariant violation: pipelineExecutionCount must be non‑negative",
    );
  }
  if (state.cumulativeDecisionCount < 0) {
    throw new Error(
      "Invariant violation: cumulativeDecisionCount must be non‑negative",
    );
  }
  if (state.pipelineExecutionCount < state.cumulativeDecisionCount) {
    throw new Error(
      "Invariant violation: pipelineExecutionCount cannot be less than cumulativeDecisionCount",
    );
  }
  // Ensure the state is frozen (deep) – Object.isFrozen works for shallow freeze.
  if (!Object.isFrozen(state)) {
    throw new Error("Invariant violation: state must be deep‑frozen");
  }
  if (!state.stateHash || typeof state.stateHash !== "string") {
    throw new Error(
      "Invariant violation: stateHash must be a non‑empty string",
    );
  }
}
