// runtime/question-engine/DecisionTrace.ts
/**
 * Trace of the deterministic decision process for debugging and replay.
 */
import type { DifficultyLevel } from "./DifficultyLevel";
import type { QuestionObjective } from "./QuestionObjective";

/**
 * All selector identifiers used in the decision pipeline.
 */
export type SelectorName =
  | "topic"
  | "difficulty"
  | "objective"
  | "followup"
  | "phase";

export interface DecisionTrace {
  readonly selectedTopic: string;
  readonly topicReason: string;

  readonly selectedDifficulty: DifficultyLevel;
  readonly difficultyReason: string;

  readonly selectedObjective: QuestionObjective;
  readonly objectiveReason: string;

  readonly rejectedTopics: readonly string[];
  readonly selectorScores: Readonly<Record<SelectorName, number>>;
}
