import { z } from "zod";
export declare const JobOfferSchema: z.ZodObject<{
    required: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    required: string[];
}, {
    required: string[];
}>;
export declare const CVSkillsSchema: z.ZodArray<z.ZodString, "many">;
export declare const JobIntelligenceSchema: z.ZodObject<{
    title: z.ZodString;
    hard_skills: z.ZodArray<z.ZodString, "many">;
    seniority: z.ZodString;
    min_years: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title: string;
    hard_skills: string[];
    seniority: string;
    min_years: number;
}, {
    title: string;
    hard_skills: string[];
    seniority: string;
    min_years: number;
}>;
export declare const AdvancedCVSchema: z.ZodObject<{
    hard_skills: z.ZodArray<z.ZodString, "many">;
    seniority: z.ZodNumber;
    leadership_score: z.ZodNumber;
    impact_metrics_score: z.ZodNumber;
    years_experience: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    hard_skills: string[];
    seniority: number;
    leadership_score: number;
    impact_metrics_score: number;
    years_experience: number;
}, {
    hard_skills: string[];
    seniority: number;
    leadership_score: number;
    impact_metrics_score: number;
    years_experience: number;
}>;
export declare const RecruiterFeedbackSchema: z.ZodObject<{
    concerns: z.ZodArray<z.ZodString, "many">;
    strengths: z.ZodArray<z.ZodString, "many">;
    rewrites: z.ZodArray<z.ZodObject<{
        original: z.ZodString;
        improved: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        original: string;
        improved: string;
    }, {
        original: string;
        improved: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    strengths: string[];
    concerns: string[];
    rewrites: {
        original: string;
        improved: string;
    }[];
}, {
    strengths: string[];
    concerns: string[];
    rewrites: {
        original: string;
        improved: string;
    }[];
}>;
//# sourceMappingURL=orchestrator-schemas.d.ts.map