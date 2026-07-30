import { z } from "zod";

// ===================================================================
// DECISION — The next action the Interview Director will take
// Decisions are structured objects, never free text.
// ===================================================================

export const DecisionTypeSchema = z.enum([
  "CONTINUE",
  "CHALLENGE",
  "VERIFY",
  "GO_DEEPER",
  "CHANGE_TOPIC",
  "RETURN_TO_CONTRADICTION",
  "REQUEST_EXAMPLE",
  "REQUEST_METRICS",
  "REQUEST_FAILURE",
  "END_SECTION",
  "END_INTERVIEW",
]);

export type DecisionType = z.infer<typeof DecisionTypeSchema>;

export const DecisionSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  sequence: z.number().int().nonnegative(),
  type: DecisionTypeSchema,
  reason: z.string().min(1),
  targetCompetency: z.string().nullable().default(null),
  expectedEvidence: z.array(z.string()).default([]),
  expectedOutcome: z.string().min(1),
  confidenceBefore: z.number().min(0).max(1),
  confidenceAfter: z.number().min(0).max(1).nullable().default(null),
  outcome: z.enum(["SUCCESS", "FAILED", "PENDING"]).default("PENDING"),
  createdAt: z.date(),
  resolvedAt: z.date().nullable().default(null),
});

export type Decision = z.infer<typeof DecisionSchema>;
