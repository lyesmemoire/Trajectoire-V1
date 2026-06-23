import { z } from "zod";
import { ResponseScoreSchema } from "./scoring";

// ─── Schéma d'une réponse persistée ───────────────────────────────────────────
export const PersistedResponseSchema = z.object({
  question_index: z.number().int().min(0).max(2),
  question_text: z.string(),
  transcription: z.string(),
  score: ResponseScoreSchema,
});

export type PersistedResponse = z.infer<typeof PersistedResponseSchema>;

// ─── Schéma du rapport final ───────────────────────────────────────────────────
export const FinalReportSchema = z.object({
  verdict: z.enum([
    "READY",          // ≥ 75 overall moyen — candidat prêt
    "NEEDS_WORK",     // 50-74 — des lacunes comblables
    "NOT_READY",      // < 50 — retour immédiat au CV
  ]),

  aggregate_scores: z.object({
    coherence: z.number(),   // Moyenne pondérée des 3 questions
    depth: z.number(),
    clarity: z.number(),
    overall: z.number(),
  }),

  critical_inconsistency: z.boolean(), // Une CONTRADICTION détectée → always NOT_READY

  // Ce que le candidat défend bien
  validated_strengths: z.array(z.string()).min(1).max(4),

  // Les failles concrètes
  critical_gaps: z.array(
    z.object({
      gap: z.string(),                 // Description de la faille
      source_question: z.number(),     // Index de la question concernée
      cv_bullet_to_fix: z.string().nullable(), // Le bullet CV à corriger
    })
  ),

  // Actions concrètes — max 3, ordonnées par priorité
  action_plan: z.array(
    z.object({
      priority: z.number().int().min(1).max(3),
      action: z.string(),
      target: z.enum(["CV", "PREPARATION", "BOTH"]),
      cv_section: z.string().nullable(), // "Expérience → Poste X → Bullet Y"
    })
  ).max(3),

  // Phrase de verdict — une ligne, sans bullshit
  executive_summary: z.string().max(200),
});

export type FinalReport = z.infer<typeof FinalReportSchema>;

// ─── Calcul déterministe de l'agrégat ─────────────────────────────────────────
// Pas de LLM ici. Mathématiques pures.
export function computeAggregateScores(
  responses: PersistedResponse[]
): FinalReport["aggregate_scores"] {
  // Poids par type de question :
  // Q0 (vulnérabilité) → poids 0.4 — c'est la plus révélatrice
  // Q1 (profondeur technique) → poids 0.35
  // Q2 (comportementale) → poids 0.25
  const weights = [0.4, 0.35, 0.25];

  const weighted = (key: "coherence" | "depth" | "clarity" | "overall") =>
    responses.reduce((acc, r) => {
      const w = weights[r.question_index] ?? 0.33;
      return acc + r.score.scores[key] * w;
    }, 0);

  const coherence = Math.round(weighted("coherence"));
  const depth = Math.round(weighted("depth"));
  const clarity = Math.round(weighted("clarity"));

  // Pondération finale : cohérence prime sur tout
  const overall = Math.round(coherence * 0.45 + depth * 0.35 + clarity * 0.20);

  return { coherence, depth, clarity, overall };
}

// ─── Détection d'incohérence critique ─────────────────────────────────────────
export function hasCriticalInconsistency(responses: PersistedResponse[]): boolean {
  return responses.some((r) =>
    r.score.factual_alerts.some((a) => a.type === "CONTRADICTION")
  );
}

// ─── Verdict déterministe ──────────────────────────────────────────────────────
export function computeVerdict(
  overall: number,
  criticalInconsistency: boolean
): FinalReport["verdict"] {
  if (criticalInconsistency) return "NOT_READY"; // Contradiction → éliminatoire
  if (overall >= 75) return "READY";
  if (overall >= 50) return "NEEDS_WORK";
  return "NOT_READY";
}
