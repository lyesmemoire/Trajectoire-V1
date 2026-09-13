import { z } from "zod";

/**
 * Structured schema for AI evaluation of a candidate's interview answer.
 *
 * Produced by evaluateCandidateAnswer() in the answer-evaluator module.
 * Consumed by InterviewStrategyService to decide the next recruiter move.
 */

const scoreField = z.number().int().min(0).max(100);

export const CandidateClaimCategorySchema = z.enum([
  "company",
  "role",
  "team_size",
  "duration",
  "date",
  "metric",
  "achievement",
  "responsibility",
  "technology",
  "other",
]);

export const CandidateClaimWithoutTurnSchema = z.object({
  key: z.string(),
  value: z.string(),
  statement: z.string(),
  category: CandidateClaimCategorySchema,
});

export type CandidateClaimWithoutTurn = z.infer<typeof CandidateClaimWithoutTurnSchema>;
export type CandidateClaimCategory = z.infer<typeof CandidateClaimCategorySchema>;

export const AnswerEvaluationSchema = z.object({
  /**
   * Does the answer address the question that was asked? (0-100)
   */
  relevanceScore: scoreField,

  /**
   * How specific is the answer vs. generic/abstract? (0-100)
   */
  specificityScore: scoreField,

  /**
   * Quality and concreteness of proof provided. (0-100)
   */
  evidenceScore: scoreField,

  /**
   * How well the target competency is demonstrated. (0-100)
   */
  competencyScore: scoreField,

  /**
   * Candidate explicitly described a real past situation or project.
   */
  hasConcreteExample: z.boolean(),

  /**
   * Candidate clearly explained their personal role vs. the team's.
   */
  hasPersonalOwnership: z.boolean(),

  /**
   * Candidate provided a metric, number, or order of magnitude.
   */
  hasMetrics: z.boolean(),

  /**
   * Candidate stated a clear outcome or result of their action.
   */
  hasOutcome: z.boolean(),

  /**
   * Answer is too generic / non-specific to evaluate properly.
   */
  isVague: z.boolean(),

  /**
   * Candidate avoided the question or redirected without answering.
   */
  isEvasive: z.boolean(),

  /**
   * Answer is too short to contain meaningful signal.
   */
  isTooShort: z.boolean(),

  /**
   * Overall assessment of how well the target competency was demonstrated.
   */
  demonstratedCompetency: z.enum([
    "strong",
    "partial",
    "insufficient",
  ]),

  /**
   * What proof elements are still missing from the answer.
   */
  missingEvidence: z.array(
    z.enum([
      "example",
      "personal_role",
      "metrics",
      "result",
      "clarification",
      "technical_depth",
    ]),
  ),

  /**
   * Primary recruiter decision for the next turn.
   */
  recommendedAction: z.enum([
    "FOLLOW_UP",
    "NEXT_QUESTION",
  ]),

  /**
   * When recommendedAction is FOLLOW_UP, the type of follow-up to generate.
   * Null when recommendedAction is NEXT_QUESTION.
   */
  followUpType: z
    .enum([
      "CLARIFY",
      "ASK_EXAMPLE",
      "ASK_PERSONAL_ROLE",
      "ASK_METRIC",
      "ASK_RESULT",
      "DEEPEN",
      "CLARIFY_CONTRADICTION",
    ])
    .nullable(),

  /**
   * One-sentence recruiter reasoning for the decision. Not surfaced to candidate.
   */
  shortReason: z.string().min(1).max(300),

  /**
   * Explicit factual claims made by the candidate in their answer.
   */
  extractedClaims: z.array(CandidateClaimWithoutTurnSchema).default([]),

  /**
   * Potential contradictions detected between new claims and existing claims.
   */
  claimConflicts: z.array(
    z.object({
      key: z.string(),
      previousValue: z.string(),
      newValue: z.string(),
      reason: z.string(),
      severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
    })
  ).default([]),

  /**
   * Keys of the open conflicts that were successfully clarified by this answer.
   */
  resolvedConflicts: z.array(z.string()).default([]),
});

export type AnswerEvaluation = z.infer<typeof AnswerEvaluationSchema>;

export type RecommendedAction = AnswerEvaluation["recommendedAction"];
export type FollowUpType = NonNullable<AnswerEvaluation["followUpType"]>;
export type MissingEvidenceItem = AnswerEvaluation["missingEvidence"][number];
export type DemonstratedCompetency = AnswerEvaluation["demonstratedCompetency"];
