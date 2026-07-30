import { z } from "zod";

// ===================================================================
// INTERVIEW GOAL — What the engine is currently trying to achieve
// Goals exist at multiple horizons: immediate, short-term, and global.
// ===================================================================

export const GoalHorizonSchema = z.enum([
  "IMMEDIATE",
  "SHORT_TERM",
  "MEDIUM_TERM",
  "INTERVIEW",
  "HIRING",
]);

export type GoalHorizon = z.infer<typeof GoalHorizonSchema>;

export const InterviewGoalSchema = z.object({
  id: z.string().uuid(),
  horizon: GoalHorizonSchema,
  description: z.string().min(1),
  targetCompetency: z.string().nullable().default(null),
  expectedEvidence: z.array(z.string()).default([]),
  successCriteria: z.string().min(1),
  failureCriteria: z.string().min(1),
  priority: z.number().min(0).max(1),
  active: z.boolean().default(true),
  createdAt: z.date(),
  completedAt: z.date().nullable().default(null),
});

export type InterviewGoal = z.infer<typeof InterviewGoalSchema>;
