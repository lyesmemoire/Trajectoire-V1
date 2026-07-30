import { z } from "zod";

// ===================================================================
// HYPOTHESIS — A belief the system holds about the candidate
// A hypothesis is never a conclusion. It is always pending
// until sufficient evidence validates or rejects it.
// ===================================================================

export const HypothesisStatusSchema = z.enum([
  "PENDING",
  "VALIDATED",
  "REJECTED",
  "INCONCLUSIVE",
]);

export type HypothesisStatus = z.infer<typeof HypothesisStatusSchema>;

export const HypothesisSchema = z.object({
  id: z.string().uuid(),
  statement: z.string().min(1),
  confidence: z.number().min(0).max(1).default(0),
  status: HypothesisStatusSchema.default("PENDING"),
  supportingEvidence: z.array(z.string().uuid()).default([]),
  contradictingEvidence: z.array(z.string().uuid()).default([]),
  requiredEvidence: z.array(z.string()).default([]),
  verificationPlan: z.array(z.string()).default([]),
  creationReason: z.string().min(1),
  linkedCompetencies: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Hypothesis = z.infer<typeof HypothesisSchema>;

/**
 * Pure function: derives hypothesis status from confidence
 * and evidence counts.
 */
export function deriveHypothesisStatus(
  confidence: number,
  supportingCount: number,
  contradictingCount: number,
  requiredEvidenceCount: number,
  fulfilledEvidenceCount: number
): HypothesisStatus {
  if (contradictingCount >= 2 && confidence < 0.3) {
    return "REJECTED";
  }
  if (
    confidence >= 0.85 &&
    supportingCount >= 3 &&
    contradictingCount === 0 &&
    fulfilledEvidenceCount >= requiredEvidenceCount
  ) {
    return "VALIDATED";
  }
  if (
    confidence >= 0.4 &&
    confidence < 0.85 &&
    supportingCount > 0 &&
    contradictingCount > 0
  ) {
    return "INCONCLUSIVE";
  }
  return "PENDING";
}
