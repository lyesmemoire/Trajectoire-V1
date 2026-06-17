// runtime/question-engine/state/interviewRuntimeReducer.ts
import {
  InterviewRuntimeState,
  hashRuntimeState,
} from "./InterviewRuntimeState";
import { RuntimeAction } from "./RuntimeAction";
import { deepFreeze } from "@core/freeze/deepFreeze";

/**
 * The pure deterministic reducer for the engine.
 * This is the ONLY place where InterviewRuntimeState transitions.
 * It contains NO business logic, NO selection, NO scoring.
 * It merely applies events, hashes the new state, and deep freezes it.
 */
export function reduceRuntimeState(
  state: InterviewRuntimeState,
  action: RuntimeAction,
): InterviewRuntimeState {
  let pipelineExecutionCount = state.pipelineExecutionCount;
  let signals = state.signals;
  let interviewPhase = state.interviewPhase;
  let promptSnapshots = state.promptSnapshots;

  switch (action.type) {
    case "PIPELINE_EXECUTED": {
      pipelineExecutionCount += 1;
      break;
    }

    case "SIGNAL_UPDATED": {
      signals = state.signals.withSignal(
        action.payload.name,
        action.payload.value,
      );
      break;
    }

    case "PHASE_ADVANCED": {
      interviewPhase = action.payload;
      break;
    }

    case "PROMPT_ASSEMBLED": {
      promptSnapshots = [
        ...state.promptSnapshots,
        action.payload,
      ];
      break;
    }
  }

  const nextStateDraft: any = {
    signals,
    graphSnapshot: state.graphSnapshot,
    previousDecisions: state.previousDecisions,
    promptSnapshots,
    interviewPhase,
    executionCount: state.executionCount + 1,
    pipelineExecutionCount,
    cumulativeDecisionCount: state.cumulativeDecisionCount,
    lastDecisionHash: state.lastDecisionHash as string | undefined,
    previousStateHash: state.stateHash,
    runtimeVersion: state.runtimeVersion,
    signalRegistryVersion: state.signalRegistryVersion,
    pipelineVersion: state.pipelineVersion,
    selectorVersions: state.selectorVersions,
  };

  const stateHash = hashRuntimeState(nextStateDraft);

  return deepFreeze({
    ...nextStateDraft,
    stateHash,
  }) as unknown as InterviewRuntimeState;
}
