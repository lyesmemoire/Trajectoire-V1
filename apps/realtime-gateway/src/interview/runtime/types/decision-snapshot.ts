// runtime/types/decision-snapshot.ts
import { StableHash } from "../contracts/types/stableHash";
import type { EpochMilliseconds } from "./time";
import type { SemanticVersion } from "./semantic-version";
import type { PipelineExecutionId } from "../question-engine/pipeline/PipelineExecutionId";

/** Snapshot of a decision for replay/analytics */
export interface DecisionSnapshot {
  readonly decisionHash: StableHash;
  readonly createdAt: EpochMilliseconds;
  readonly selectorVersion: SemanticVersion;
  readonly runtimeVersion: SemanticVersion;
  // New deterministic fields
  readonly pipelineExecutionId: PipelineExecutionId;
  readonly selectorExecutionHashes: readonly StableHash[];
  readonly decisionTraceHash: StableHash;
  readonly promptAssemblyHash: StableHash;
  readonly deterministicReplayKey: StableHash;
}
