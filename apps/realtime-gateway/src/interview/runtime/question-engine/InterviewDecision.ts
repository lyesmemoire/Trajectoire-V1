// runtime/question-engine/InterviewDecision.ts
/**
 * Central immutable decision artifact produced by the interview engine.
 * All fields are readonly and the object should be deep‑frozen before exposure.
 */
import type { DecisionId } from "../types/decision";
import type { ConfidenceBreakdown } from "../types/decision";
import type { DecisionTrace } from "./DecisionTrace";
import type { RecoveryStrategy } from "./RecoveryStrategy";
import type { QuestionObjective } from "./QuestionObjective";
import type { DifficultyLevel } from "./DifficultyLevel";
import { StableHash } from "../contracts/types/stableHash";
import type { PromptHash } from "../utils/hash";
import type { EpochMilliseconds } from "../types/time";
import type { SemanticVersion } from "../types/semantic-version";

export interface InterviewDecision {
  readonly id: DecisionId;
  readonly topic: string;
  readonly difficulty: DifficultyLevel;
  readonly objective: QuestionObjective;
  readonly phase: string;
  readonly followup: boolean;
  readonly constraints: {
    readonly maxWords: number;
    readonly focusArea?: string;
  };
  readonly confidenceBreakdown: ConfidenceBreakdown;
  readonly trace: DecisionTrace;
  readonly promptSnapshotHash: PromptHash;
  readonly decisionHash: StableHash;
  readonly runtimeVersion: SemanticVersion;
  readonly selectorVersion: SemanticVersion;
  readonly createdAt: EpochMilliseconds;
  readonly recovery?: RecoveryStrategy;
}
