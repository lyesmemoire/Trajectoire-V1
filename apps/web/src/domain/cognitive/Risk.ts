import { z } from "zod";

// ===================================================================
// RISK — A risk register for the interview evaluation
// Risks track threats to the quality of the hiring decision.
// ===================================================================

export const RiskTypeSchema = z.enum([
  "OVERESTIMATION",
  "UNDERESTIMATION",
  "INSUFFICIENT_EVIDENCE",
  "MAJOR_CONTRADICTION",
  "INCONSISTENT_RESPONSE",
  "MEMORIZED_ANSWER",
  "AI_GENERATED_ANSWER",
  "COPIED_ANSWER",
  "CANDIDATE_FATIGUE",
  "ENGINE_BIAS",
  "TIME_PRESSURE",
]);

export type RiskType = z.infer<typeof RiskTypeSchema>;

export const RiskLevelSchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const RiskSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  type: RiskTypeSchema,
  level: RiskLevelSchema,
  description: z.string().min(1),
  linkedCompetencies: z.array(z.string()).default([]),
  mitigationStrategy: z.string().nullable().default(null),
  mitigated: z.boolean().default(false),
  createdAt: z.date(),
});

export type Risk = z.infer<typeof RiskSchema>;

/**
 * Pure function: computes the global risk level from the set of active risks.
 */
export function computeGlobalRiskLevel(risks: Risk[]): RiskLevel {
  const activeRisks = risks.filter((r) => !r.mitigated);
  if (activeRisks.some((r) => r.level === "CRITICAL")) {
    return "CRITICAL";
  }
  if (activeRisks.filter((r) => r.level === "HIGH").length >= 2) {
    return "CRITICAL";
  }
  if (activeRisks.some((r) => r.level === "HIGH")) {
    return "HIGH";
  }
  if (activeRisks.some((r) => r.level === "MEDIUM")) {
    return "MEDIUM";
  }
  return "LOW";
}
