import { z } from "zod";

// Ce que le LLM DOIT produire. Rien d'autre.
export const ResponseScoreSchema = z.object({
  scores: z.object({
    coherence: z.number().int().min(0).max(100),   // Cohérence avec le CV
    depth: z.number().int().min(0).max(100),        // Profondeur des détails
    clarity: z.number().int().min(0).max(100),      // Clarté de l'expression
    overall: z.number().int().min(0).max(100),      // Score global pondéré
  }),
  strengths: z.array(z.string()).min(1).max(3),
  weaknesses: z.array(z.string()).min(1).max(3),
  factual_alerts: z.array(
    z.object({
      claim_in_answer: z.string(),    // Ce que le candidat a dit
      claim_in_cv: z.string(),        // Ce qui est dans le CV
      type: z.enum([
        "CONTRADICTION",              // Le chiffre ne colle pas
        "INFLATION",                  // La réponse surenchérit le CV
        "MISSING_DETAIL",             // Le CV dit X, la réponse n'en parle pas
      ]),
    })
  ),
  missing_keywords: z.array(z.string()), // Mots-clés de l'offre absents de la réponse
  recommended_bullet_fix: z.string().nullable(), // Réécriture suggérée du bullet CV si incohérence
});

export type ResponseScore = z.infer<typeof ResponseScoreSchema>;
