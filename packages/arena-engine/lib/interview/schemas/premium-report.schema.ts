import { z } from "zod";

export const PremiumReportSchema = z.object({
  overall_assessment: z.string().min(1).max(500),

  dimension_scores: z.object({
    structure:     z.number().int().min(0).max(100),
    specificity:   z.number().int().min(0).max(100),
    impact:        z.number().int().min(0).max(100),
    adaptability:  z.number().int().min(0).max(100),
  }),

  strengths: z.array(z.string().min(1)).min(1).max(4),

  development_areas: z.array(
    z.object({
      area:            z.string(),
      observation:     z.string(), // Ce qui a été dit / pas dit
      recommendation:  z.string(), // Action concrète
    })
  ).min(1).max(4),

  cv_coherence: z.object({
    is_coherent:   z.boolean(),
    discrepancies: z.array(z.string()), // Vide si cohérent
  }),

  readiness_level: z.enum([
    "NOT_READY",    // < 50
    "DEVELOPING",   // 50-69
    "READY",        // 70-84
    "EXCELLENT",    // 85+
  ]),
});

export type PremiumReport = z.infer<typeof PremiumReportSchema>;

// Calcul déterministe du readiness_level depuis les dimension_scores
// Le LLM ne décide PAS du niveau — il fournit les scores bruts
export function computeReadinessLevel(
  scores: PremiumReport["dimension_scores"]
): PremiumReport["readiness_level"] {
  const overall = Math.round(
    scores.structure    * 0.25 +
    scores.specificity  * 0.30 +
    scores.impact       * 0.30 +
    scores.adaptability * 0.15
  );

  if (overall >= 85) return "EXCELLENT";
  if (overall >= 70) return "READY";
  if (overall >= 50) return "DEVELOPING";
  return "NOT_READY";
}

// Score global déterministe
export function computeOverallScore(
  scores: PremiumReport["dimension_scores"]
): number {
  return Math.round(
    scores.structure    * 0.25 +
    scores.specificity  * 0.30 +
    scores.impact       * 0.30 +
    scores.adaptability * 0.15
  );
}
