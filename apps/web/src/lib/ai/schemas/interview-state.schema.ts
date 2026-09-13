import { z } from "zod";

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
});

export type CompetencyState = z.infer<typeof CompetencyStateSchema>;
export type InterviewState = z.infer<typeof InterviewStateSchema>;
