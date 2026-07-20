import { z } from "zod";

/** Sortie LLM pour POST /api/ats — analyse CV vs offre (pas extraction seule). */
export const AtsAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  matched_keywords: z.array(z.string()),
  missing_keywords: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export type AtsAnalysis = z.infer<typeof AtsAnalysisSchema>;
