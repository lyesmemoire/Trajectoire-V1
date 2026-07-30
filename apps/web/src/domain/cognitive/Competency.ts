import { z } from "zod";

// ===================================================================
// COMPETENCY — A competency being evaluated during the interview
// Status flows: UNKNOWN → PARTIAL → LIKELY → VERIFIED or REJECTED
// ===================================================================

export const CompetencyStatusSchema = z.enum([
  "UNKNOWN",
  "PARTIAL",
  "LIKELY",
  "VERIFIED",
  "REJECTED",
]);

export type CompetencyStatus = z.infer<typeof CompetencyStatusSchema>;

export const CompetencySchema = z.object({
  identifier: z.string().min(1),
  confidence: z.number().min(0).max(1).default(0),
  status: CompetencyStatusSchema.default("UNKNOWN"),
  supportingEvidence: z.array(z.string().uuid()).default([]),
  contradictions: z.array(z.string().uuid()).default([]),
  coverage: z.number().min(0).max(1).default(0),
  depth: z.number().min(0).max(1).default(0),
  lastUpdated: z.date(),
});

export type Competency = z.infer<typeof CompetencySchema>;

/**
 * Pure function: derives the status from the confidence level
 * and the number of supporting/contradicting evidence.
 */
export function deriveCompetencyStatus(
  confidence: number,
  supportingCount: number,
  contradictionCount: number
): CompetencyStatus {
  if (contradictionCount > 0 && confidence < 0.2) {
    return "REJECTED";
  }
  if (confidence >= 0.85 && supportingCount >= 3 && contradictionCount === 0) {
    return "VERIFIED";
  }
  if (confidence >= 0.6) {
    return "LIKELY";
  }
  if (confidence >= 0.2 || supportingCount >= 1) {
    return "PARTIAL";
  }
  return "UNKNOWN";
}

/**
 * Pure function: creates an initial competency with UNKNOWN status.
 */
export function createCompetency(identifier: string): Competency {
  return {
    identifier,
    confidence: 0,
    status: "UNKNOWN",
    supportingEvidence: [],
    contradictions: [],
    coverage: 0,
    depth: 0,
    lastUpdated: new Date(),
  };
}
