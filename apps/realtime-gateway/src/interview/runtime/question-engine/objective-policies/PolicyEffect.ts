// runtime/question-engine/objective-policies/PolicyEffect.ts
import { PolicyPriority } from "./PolicyPriority";
import { QuestionObjective } from "../QuestionObjective";

/**
 * Defines the probabilist and constraint-based effects of a policy.
 * Instead of hard-forcing outcomes, policies emit composable effects
 * that the ObjectiveSelector will deterministically resolve based on priority.
 */
export interface PolicyEffect {
  readonly priority: PolicyPriority;

  /** Modifiers added to the raw score of candidates. */
  readonly scoreModifiers?: Partial<Record<QuestionObjective, number>>;

  /** Modifiers adjusting confidence levels directly. */
  readonly confidenceModifiers?: Partial<Record<QuestionObjective, number>>;

  /** Hard constraint: objectives that are absolutely forbidden. */
  readonly forbiddenObjectives?: readonly QuestionObjective[];

  /** Soft constraint: objectives that are prioritized if available. */
  readonly preferredObjectives?: readonly QuestionObjective[];

  /** Human-readable trace tracking reason for the effect. */
  /** Optional identifier for the effect, useful for tracing. */
  readonly id?: string;
}
