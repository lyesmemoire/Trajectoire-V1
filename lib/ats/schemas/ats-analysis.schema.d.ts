import { z } from "zod";
/** Sortie LLM pour POST /api/ats — analyse CV vs offre (pas extraction seule). */
export declare const AtsAnalysisSchema: z.ZodObject<{
    score: z.ZodNumber;
    matched_keywords: z.ZodArray<z.ZodString, "many">;
    missing_keywords: z.ZodArray<z.ZodString, "many">;
    strengths: z.ZodArray<z.ZodString, "many">;
    weaknesses: z.ZodArray<z.ZodString, "many">;
    recommendations: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    matched_keywords: string[];
    missing_keywords: string[];
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    score: number;
}, {
    matched_keywords: string[];
    missing_keywords: string[];
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    score: number;
}>;
export type AtsAnalysis = z.infer<typeof AtsAnalysisSchema>;
//# sourceMappingURL=ats-analysis.schema.d.ts.map