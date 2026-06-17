// runtime/question-engine/selectors/shared/selectorContext.ts
/**
 * Central immutable context passed through the selector pipeline.
 * Each selector adds its own fields while preserving the read‑only contract.
 */
import type { RuntimeClock } from "../../../utils/clock";
import type { InterviewPhase } from "../../types/InterviewPhase";
import type { Milliseconds } from "../../../types/Milliseconds";
import type { ConfidenceScore } from "../../../types/ConfidenceScore";
import type { StableHash } from "@core/types/StableHash";
import type { PipelineExecutionId } from "../../../types/PipelineExecutionId";
import type { SignalRegistry } from "../../signals/SignalRegistry";

export interface BaseSelectorContext {
  readonly interviewPhase: InterviewPhase;
  readonly remainingTimeMs: Milliseconds;
  readonly clock: RuntimeClock;
  readonly signals: SignalRegistry;
  readonly pipelineExecutionId: PipelineExecutionId;
  readonly previousStepHash: StableHash;
  readonly contextHash: StableHash;
  readonly replayChecksum: StableHash;
}

/** Context after Topic selection */
export interface TopicStageContext extends BaseSelectorContext {
  readonly selectedTopicId: string;
  readonly topicConfidence: ConfidenceScore;
}
export type TopicSelectorContext = TopicStageContext;

/** Context after Difficulty selection */
export interface DifficultyStageContext extends TopicStageContext {
  // Additional difficulty‑specific fields can be added here.
  readonly selectedDifficulty?: any;
  readonly difficultyConfidence?: ConfidenceScore;
}
export type DifficultySelectorContext = DifficultyStageContext;

export interface ObjectiveSelectorContext extends DifficultyStageContext {
  readonly selectedObjectiveId?: string;
  readonly objectiveConfidence?: ConfidenceScore;
}

export function withContext<T>(base: any, additional: any): T {
  return { ...base, ...additional } as T;
}
