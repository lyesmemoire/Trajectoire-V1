import { z } from "zod";

// ===================================================================
// EVIDENCE — A qualified proof extracted from the interview
// Evidence is never free text. It is a structured object
// linking an observable fact to one or more competencies.
// ===================================================================

export const EvidenceStrengthSchema = z.enum([
  "ANECDOTAL",
  "WEAK",
  "MODERATE",
  "STRONG",
  "DECISIVE",
]);

export type EvidenceStrength = z.infer<typeof EvidenceStrengthSchema>;

export const EvidenceSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  sourceMessageIndex: z.number().int().nonnegative(),
  quotedText: z.string().min(1),
  fact: z.string().min(1),
  strength: EvidenceStrengthSchema,
  specificity: z.number().min(0).max(1),
  credibility: z.number().min(0).max(1),
  technicalDepth: z.number().min(0).max(1),
  behavioralDepth: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  linkedCompetencies: z.array(z.string()).min(1),
  linkedNodeIds: z.array(z.string().uuid()).default([]),
  timestamp: z.date(),
});

export type Evidence = z.infer<typeof EvidenceSchema>;

// ===================================================================
// CONFIDENCE CALCULATION
// The confidence of a piece of evidence is computed mathematically.
// It never depends on the LLM's opinion.
// ===================================================================

export const ConfidenceFactorsSchema = z.object({
  quality: z.number().min(0).max(1),
  specificity: z.number().min(0).max(1),
  consistency: z.number().min(0).max(1),
  recency: z.number().min(0).max(1),
  technicalDepth: z.number().min(0).max(1),
  behavioralDepth: z.number().min(0).max(1),
  sourceReliability: z.number().min(0).max(1),
});

export type ConfidenceFactors = z.infer<typeof ConfidenceFactorsSchema>;

export const ConfidenceDeltaSchema = z.object({
  competency: z.string(),
  previousConfidence: z.number().min(0).max(1),
  newConfidence: z.number().min(0).max(1),
  delta: z.number().min(-1).max(1),
  factors: ConfidenceFactorsSchema,
  reason: z.string(),
  timestamp: z.date(),
});

export type ConfidenceDelta = z.infer<typeof ConfidenceDeltaSchema>;

/**
 * Pure function: computes a confidence score from individual factors.
 * The formula is a weighted geometric mean, penalized by contradictions
 * and weak signals.
 *
 * @param factors The individual confidence factors
 * @param contradictionPenalty A penalty in [0, 1] for existing contradictions
 * @param weakSignalPenalty A penalty in [0, 1] for weak signals
 * @returns A confidence score between 0 and 1
 */
export function computeConfidence(
  factors: ConfidenceFactors,
  contradictionPenalty: number = 0,
  weakSignalPenalty: number = 0
): number {
  const clamp = (v: number): number => Math.max(0, Math.min(1, v));

  const raw =
    factors.quality *
    factors.specificity *
    factors.consistency *
    factors.recency *
    factors.technicalDepth *
    factors.behavioralDepth *
    factors.sourceReliability;

  // Geometric mean over 7 factors
  const geometricMean = Math.pow(raw, 1 / 7);

  const penalized =
    geometricMean -
    clamp(contradictionPenalty) -
    clamp(weakSignalPenalty);

  return clamp(penalized);
}
