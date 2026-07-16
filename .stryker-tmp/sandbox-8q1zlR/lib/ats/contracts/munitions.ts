// @ts-nocheck
import { z } from "zod";

export const MunitionCategorySchema = z.enum([
  "doubt",
  "inconsistency",
  "risk",
  "vague_claim",
  "mismatch",
  "red_flag",
]);

export const PressureMunitionSchema = z.object({
  id: z.string().describe("Identifiant unique du signal, ex: doubt_123"),
  category: MunitionCategorySchema,
  hook: z.string().describe("Phrase d'accroche naturelle que le bot peut utiliser pour amener le sujet"),
  evidence: z.object({
    field: z.string().describe("Le champ du CV concerné (ex: 'Expérience Google', 'Compétence Python')"),
    snippet: z.string().describe("La citation exacte du CV qui pose problème"),
  }),
  severity: z.number().min(0).max(1).describe("Sévérité perçue du signal (0 = anodin, 1 = bloquant)"),
  pressureReady: z.boolean().describe("Le bot peut-il en faire une question de pressure naturelle et concrète ?"),
  confidence: z.number().min(0).max(1).describe("Indice de confiance dans l'extraction (0 = doute d'hallucination, 1 = certain)"),
  suggestedQuestion: z.string().optional().describe("Question suggérée par le moteur ATS que le bot peut utiliser"),
  coaching: z.string().optional().describe("Conseil pour lever le doute, utile pour le feedback post-entretien"),
});

export type PressureMunition = z.infer<typeof PressureMunitionSchema>;

export const MunitionPackSchema = z.object({
  generatedAt: z.string(),
  munitions: z.array(PressureMunitionSchema),
  context: z.object({
    overallATS: z.number(),
    riskLevel: z.enum(["low", "medium", "high"]),
    coachingFocus: z.array(z.string()),
  }),
});

export type MunitionPack = z.infer<typeof MunitionPackSchema>;
