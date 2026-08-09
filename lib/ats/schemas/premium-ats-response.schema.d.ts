import { z } from "zod";
export declare const PremiumATSResponseSchema: z.ZodObject<{
    candidateId: z.ZodString;
    jobTitle: z.ZodString;
    analyzedAt: z.ZodString;
    score: z.ZodObject<{
        overall: z.ZodNumber;
        skills: z.ZodOptional<z.ZodNumber>;
        behavioral: z.ZodOptional<z.ZodNumber>;
        readability: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        overall: number;
        skills?: number | undefined;
        behavioral?: number | undefined;
        readability?: number | undefined;
    }, {
        overall: number;
        skills?: number | undefined;
        behavioral?: number | undefined;
        readability?: number | undefined;
    }>;
    recruiterSignals: z.ZodArray<z.ZodString, "many">;
    strengths: z.ZodArray<z.ZodString, "many">;
    missingSkills: z.ZodArray<z.ZodString, "many">;
    rewriteSuggestions: z.ZodArray<z.ZodObject<{
        original: z.ZodString;
        improved: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        original: string;
        improved: string;
    }, {
        original: string;
        improved: string;
    }>, "many">;
    confidence: z.ZodNumber;
    munitionPack: z.ZodOptional<z.ZodObject<{
        generatedAt: z.ZodString;
        munitions: z.ZodArray<z.ZodObject<{
            suggestedQuestion: z.ZodString;
            hook: z.ZodOptional<z.ZodString>;
            evidence: z.ZodOptional<z.ZodString>;
            severity: z.ZodOptional<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
        }, "strip", z.ZodTypeAny, {
            suggestedQuestion: string;
            hook?: string | undefined;
            evidence?: string | undefined;
            severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        }, {
            suggestedQuestion: string;
            hook?: string | undefined;
            evidence?: string | undefined;
            severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        }>, "many">;
        context: z.ZodObject<{
            overallATS: z.ZodNumber;
            riskLevel: z.ZodString;
            coachingFocus: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            overallATS: number;
            riskLevel: string;
            coachingFocus: string[];
        }, {
            overallATS: number;
            riskLevel: string;
            coachingFocus: string[];
        }>;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        munitions: {
            suggestedQuestion: string;
            hook?: string | undefined;
            evidence?: string | undefined;
            severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        }[];
        context: {
            overallATS: number;
            riskLevel: string;
            coachingFocus: string[];
        };
    }, {
        generatedAt: string;
        munitions: {
            suggestedQuestion: string;
            hook?: string | undefined;
            evidence?: string | undefined;
            severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        }[];
        context: {
            overallATS: number;
            riskLevel: string;
            coachingFocus: string[];
        };
    }>>;
    reportId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    strengths: string[];
    confidence: number;
    score: {
        overall: number;
        skills?: number | undefined;
        behavioral?: number | undefined;
        readability?: number | undefined;
    };
    candidateId: string;
    analyzedAt: string;
    missingSkills: string[];
    rewriteSuggestions: {
        original: string;
        improved: string;
    }[];
    jobTitle: string;
    recruiterSignals: string[];
    reportId: string | null;
    munitionPack?: {
        generatedAt: string;
        munitions: {
            suggestedQuestion: string;
            hook?: string | undefined;
            evidence?: string | undefined;
            severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        }[];
        context: {
            overallATS: number;
            riskLevel: string;
            coachingFocus: string[];
        };
    } | undefined;
}, {
    strengths: string[];
    confidence: number;
    score: {
        overall: number;
        skills?: number | undefined;
        behavioral?: number | undefined;
        readability?: number | undefined;
    };
    candidateId: string;
    analyzedAt: string;
    missingSkills: string[];
    rewriteSuggestions: {
        original: string;
        improved: string;
    }[];
    jobTitle: string;
    recruiterSignals: string[];
    reportId: string | null;
    munitionPack?: {
        generatedAt: string;
        munitions: {
            suggestedQuestion: string;
            hook?: string | undefined;
            evidence?: string | undefined;
            severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        }[];
        context: {
            overallATS: number;
            riskLevel: string;
            coachingFocus: string[];
        };
    } | undefined;
}>;
export type PremiumATSResponse = z.infer<typeof PremiumATSResponseSchema>;
//# sourceMappingURL=premium-ats-response.schema.d.ts.map