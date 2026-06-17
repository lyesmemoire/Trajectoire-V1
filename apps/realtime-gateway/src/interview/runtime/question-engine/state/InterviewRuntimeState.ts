// runtime/question-engine/state/InterviewRuntimeState.ts
import { SignalRegistry } from "../signals/SignalRegistry";
import { TopicGraphSnapshot } from "../../types/graph";
import { DecisionSnapshot } from "../../types/decision-snapshot";
import { PromptSnapshot } from "../../types/prompt";
import { InterviewPhase } from "../types/InterviewPhase";
import { SelectorName } from "../models/SelectorName";
import { SemanticVersion } from "../../types/semantic-version";
import { hashObjectStable } from "../../utils/hash";

/**
 * The single source of truth for the entire conversational deterministic runtime.
 * This state is purely immutable. Every transition returns a new deep-frozen instance
 * with an updated `stateHash`.
 */
export interface InterviewRuntimeState {
  readonly signals: SignalRegistry;
  readonly graphSnapshot: TopicGraphSnapshot;
  readonly previousDecisions: readonly DecisionSnapshot[];
  readonly promptSnapshots: readonly PromptSnapshot[];
  readonly interviewPhase: InterviewPhase;

  // Deterministic counters and lineage tracking
  readonly executionCount: number;
  readonly pipelineExecutionCount: number;
  readonly cumulativeDecisionCount: number;

  // Hashes for causal replay lineage
  readonly lastDecisionHash?: string; // StableHash
  readonly previousStateHash?: string; // StableHash

  // Versions
  readonly runtimeVersion: SemanticVersion;
  readonly signalRegistryVersion: SemanticVersion;
  readonly pipelineVersion: SemanticVersion;
  readonly selectorVersions: Readonly<Record<SelectorName, SemanticVersion>>;

  // The cryptographic identity of this exact state
  readonly stateHash: string; // StableHash
}

/**
 * Utility to deterministically hash an InterviewRuntimeState, EXCLUDING the stateHash field itself.
 */
export function hashRuntimeState(
  state: Omit<InterviewRuntimeState, "stateHash">,
): string {
  // We use hashObjectStable on the entire structure.
  // Note: SignalRegistry has a toMap() or we can let hashObjectStable serialize it if it implements toJSON.
  // We explicitly extract what needs hashing to guarantee no reference/recursion issues.
  return hashObjectStable({
    signals: state.signals.toMap(),
    graphSnapshot: state.graphSnapshot,
    previousDecisions: state.previousDecisions,
    promptSnapshots: state.promptSnapshots,
    interviewPhase: state.interviewPhase,
    executionCount: state.executionCount,
    pipelineExecutionCount: state.pipelineExecutionCount,
    cumulativeDecisionCount: state.cumulativeDecisionCount,
    lastDecisionHash: state.lastDecisionHash,
    previousStateHash: state.previousStateHash,
    runtimeVersion: state.runtimeVersion,
    signalRegistryVersion: state.signalRegistryVersion,
    pipelineVersion: state.pipelineVersion,
    selectorVersions: state.selectorVersions,
  });
}
