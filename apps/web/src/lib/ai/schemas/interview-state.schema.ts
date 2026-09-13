import { z } from "zod";
import { CandidateClaimCategorySchema } from "./answer-evaluation.schema";

export const CandidateClaimSchema = z.object({
  key: z.string(),
  value: z.string(),
  statement: z.string(),
  category: CandidateClaimCategorySchema,
  sourceTurn: z.number().int().min(0),
  competency: z.string().nullable(),
});

export type CandidateClaim = z.infer<typeof CandidateClaimSchema>;

export const ClaimConflictSchema = z.object({
  key: z.string(),
  previousValue: z.string(),
  newValue: z.string(),
  previousStatement: z.string(),
  newStatement: z.string(),
  previousTurn: z.number().int().min(0),
  currentTurn: z.number().int().min(0),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
  reason: z.string(),
  status: z.enum(["OPEN", "CLARIFIED"]),
});

export type ClaimConflict = z.infer<typeof ClaimConflictSchema>;



export const CompetencyStateSchema = z.object({
  name: z.string(),
  status: z.enum(["NOT_TESTED", "WEAK", "PARTIAL", "PROVEN"]),
  evidenceCount: z.number().int().min(0),
  bestScore: z.number().int().min(0).max(100),
  missingEvidence: z.array(
    z.enum([
      "example",
      "personal_role",
      "metrics",
      "result",
      "clarification",
      "technical_depth",
    ])
  ),
  attempts: z.number().int().min(0),
  lastEvaluatedAtTurn: z.number().int().nullable(),
});

export const InterviewStateSchema = z.object({
  competencies: z.array(CompetencyStateSchema),
  currentCompetency: z.string().nullable(),
  completedCompetencies: z.array(z.string()),
  weakCompetencies: z.array(z.string()),
  turnNumber: z.number().int().min(0),
  claims: z.array(CandidateClaimSchema).default([]),
  conflicts: z.array(ClaimConflictSchema).default([]),
});

export type CompetencyState = z.infer<typeof CompetencyStateSchema>;
export type InterviewState = z.infer<typeof InterviewStateSchema>;
