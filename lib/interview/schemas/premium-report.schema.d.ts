import { z } from "zod";
export declare const PremiumReportSchema: z.ZodObject<{
    overall_assessment: z.ZodString;
    dimension_scores: z.ZodObject<{
        structure: z.ZodNumber;
        specificity: z.ZodNumber;
        impact: z.ZodNumber;
        adaptability: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        specificity: number;
        impact: number;
        structure: number;
        adaptability: number;
    }, {
        specificity: number;
        impact: number;
        structure: number;
        adaptability: number;
    }>;
    strengths: z.ZodArray<z.ZodString, "many">;
    development_areas: z.ZodArray<z.ZodObject<{
        area: z.ZodString;
        observation: z.ZodString;
        recommendation: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        recommendation: string;
        area: string;
        observation: string;
    }, {
        recommendation: string;
        area: string;
        observation: string;
    }>, "many">;
    cv_coherence: z.ZodObject<{
        is_coherent: z.ZodBoolean;
        discrepancies: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        is_coherent: boolean;
        discrepancies: string[];
    }, {
        is_coherent: boolean;
        discrepancies: string[];
    }>;
    readiness_level: z.ZodEnum<["NOT_READY", "DEVELOPING", "READY", "EXCELLENT"]>;
}, "strip", z.ZodTypeAny, {
    strengths: string[];
    overall_assessment: string;
    dimension_scores: {
        specificity: number;
        impact: number;
        structure: number;
        adaptability: number;
    };
    development_areas: {
        recommendation: string;
        area: string;
        observation: string;
    }[];
    cv_coherence: {
        is_coherent: boolean;
        discrepancies: string[];
    };
    readiness_level: "NOT_READY" | "DEVELOPING" | "READY" | "EXCELLENT";
}, {
    strengths: string[];
    overall_assessment: string;
    dimension_scores: {
        specificity: number;
        impact: number;
        structure: number;
        adaptability: number;
    };
    development_areas: {
        recommendation: string;
        area: string;
        observation: string;
    }[];
    cv_coherence: {
        is_coherent: boolean;
        discrepancies: string[];
    };
    readiness_level: "NOT_READY" | "DEVELOPING" | "READY" | "EXCELLENT";
}>;
export type PremiumReport = z.infer<typeof PremiumReportSchema>;
export declare function computeReadinessLevel(scores: PremiumReport["dimension_scores"]): PremiumReport["readiness_level"];
export declare function computeOverallScore(scores: PremiumReport["dimension_scores"]): number;
//# sourceMappingURL=premium-report.schema.d.ts.map