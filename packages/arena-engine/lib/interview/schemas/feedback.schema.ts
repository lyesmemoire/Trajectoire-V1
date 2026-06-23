import { z } from "zod";

// ── Ce que le LLM extrait — signaux bruts, jamais de score ───────────────────
export const FeedbackSignalsSchema = z.object({

  // Observations par dimension — le LLM cite des faits, pas des notes
  observations: z.object({
    content: z.object({
      positives:    z.array(z.string().max(300)).max(4),
      negatives:    z.array(z.string().max(300)).max(4),
      // Nombre de points concrets mentionnés (chiffres, exemples, contexte)
      concrete_count: z.number().int().min(0).max(20),
    }),
    structure: z.object({
      has_situation:   z.boolean(), // STAR — Situation
      has_task:        z.boolean(), // STAR — Tâche
      has_action:      z.boolean(), // STAR — Action
      has_result:      z.boolean(), // STAR — Résultat
      is_concise:      z.boolean(), // Réponse < 3 min sans hors-sujet
    }),
    cv_alignment: z.object({
      contradictions: z.array(
        z.object({
          said:      z.string(), // Ce que le candidat a dit à l'oral
          cv_states: z.string(), // Ce que le CV dit
        })
      ).max(5),
      omissions: z.array(z.string()).max(5), // Points CV non défendus à l'oral
      inflations: z.array(z.string()).max(5), // Chiffres gonflés vs CV
    }),
  }),

  // Feedback actionnable — max 3 items, ordonnés par impact
  recommendations: z.array(
    z.object({
      priority:   z.number().int().min(1).max(3),
      area:       z.enum(["CONTENT", "STRUCTURE", "CV_COHERENCE", "DELIVERY"]),
      action:     z.string().max(300),
      example:    z.string().max(300).nullable(), // Reformulation suggérée
    })
  ).min(1).max(3),

  // Résumé exécutif — une phrase, factuelle
  summary: z.string().min(10).max(250),
});

export type FeedbackSignals = z.infer<typeof FeedbackSignalsSchema>;

// ── Score calculé en TypeScript — déterministe ────────────────────────────────
export const ComputedScoreSchema = z.object({
  content:      z.number().int().min(0).max(100),
  structure:    z.number().int().min(0).max(100),
  cv_alignment: z.number().int().min(0).max(100),
  overall:      z.number().int().min(0).max(100),
});

export type ComputedScore = z.infer<typeof ComputedScoreSchema>;

// ── Calcul déterministe depuis les signaux ────────────────────────────────────
export function computeFeedbackScore(signals: FeedbackSignals): ComputedScore {
  const obs = signals.observations;

  // Content score : ratio positives / (positives + negatives) + bonus concret
  const totalContent   = obs.content.positives.length + obs.content.negatives.length;
  const contentRatio   = totalContent > 0
    ? obs.content.positives.length / totalContent
    : 0.5;
  const concreteBonus  = Math.min(obs.content.concrete_count * 5, 20);
  const content        = Math.round(contentRatio * 80 + concreteBonus);

  // Structure score : STAR completeness
  const starFlags = [
    obs.structure.has_situation,
    obs.structure.has_task,
    obs.structure.has_action,
    obs.structure.has_result,
  ];
  const starScore   = Math.round((starFlags.filter(Boolean).length / 4) * 80);
  const conciseBonus = obs.structure.is_concise ? 20 : 0;
  const structure    = Math.min(starScore + conciseBonus, 100);

  // CV Alignment score : pénalités sur contradictions, omissions, inflations
  const contradictionPenalty = obs.cv_alignment.contradictions.length * 20;
  const omissionPenalty      = obs.cv_alignment.omissions.length     * 8;
  const inflationPenalty     = obs.cv_alignment.inflations.length    * 12;
  const cv_alignment         = Math.max(
    0,
    100 - contradictionPenalty - omissionPenalty - inflationPenalty
  );

  // Overall : pondération — cv_alignment pénalise fortement (incohérence = éliminatoire)
  const overall = Math.round(
    content      * 0.35 +
    structure    * 0.25 +
    cv_alignment * 0.40
  );

  return {
    content:      Math.min(content, 100),
    structure,
    cv_alignment,
    overall,
  };
}

// ── Schéma complet de sortie API ──────────────────────────────────────────────
export const FeedbackResponseSchema = z.object({
  scores:          ComputedScoreSchema,
  signals:         FeedbackSignalsSchema,
  computed_at:     z.string().datetime(),
});

export type FeedbackResponse = z.infer<typeof FeedbackResponseSchema>;
