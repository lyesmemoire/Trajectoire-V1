import { z } from "zod";
export declare const MunitionCategorySchema: z.ZodEnum<["doubt", "inconsistency", "risk", "vague_claim", "mismatch", "red_flag"]>;
export declare const PressureMunitionSchema: z.ZodObject<{
    id: z.ZodString;
    category: z.ZodEnum<["doubt", "inconsistency", "risk", "vague_claim", "mismatch", "red_flag"]>;
    hook: z.ZodString;
    evidence: z.ZodObject<{
        field: z.ZodString;
        snippet: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        field: string;
        snippet: string;
    }, {
        field: string;
        snippet: string;
    }>;
    severity: z.ZodNumber;
    pressureReady: z.ZodBoolean;
    confidence: z.ZodNumber;
    suggestedQuestion: z.ZodOptional<z.ZodString>;
    coaching: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    confidence: number;
    category: "inconsistency" | "risk" | "doubt" | "vague_claim" | "mismatch" | "red_flag";
    hook: string;
    evidence: {
        field: string;
        snippet: string;
    };
    severity: number;
    pressureReady: boolean;
    coaching?: string | undefined;
    suggestedQuestion?: string | undefined;
}, {
    id: string;
    confidence: number;
    category: "inconsistency" | "risk" | "doubt" | "vague_claim" | "mismatch" | "red_flag";
    hook: string;
    evidence: {
        field: string;
        snippet: string;
    };
    severity: number;
    pressureReady: boolean;
    coaching?: string | undefined;
    suggestedQuestion?: string | undefined;
}>;
export type PressureMunition = z.infer<typeof PressureMunitionSchema>;
export declare const MunitionPackSchema: z.ZodObject<{
    generatedAt: z.ZodString;
    munitions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        category: z.ZodEnum<["doubt", "inconsistency", "risk", "vague_claim", "mismatch", "red_flag"]>;
        hook: z.ZodString;
        evidence: z.ZodObject<{
            field: z.ZodString;
            snippet: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            field: string;
            snippet: string;
        }, {
            field: string;
            snippet: string;
        }>;
        severity: z.ZodNumber;
        pressureReady: z.ZodBoolean;
        confidence: z.ZodNumber;
        suggestedQuestion: z.ZodOptional<z.ZodString>;
        coaching: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        confidence: number;
        category: "inconsistency" | "risk" | "doubt" | "vague_claim" | "mismatch" | "red_flag";
        hook: string;
        evidence: {
            field: string;
            snippet: string;
        };
        severity: number;
        pressureReady: boolean;
        coaching?: string | undefined;
        suggestedQuestion?: string | undefined;
    }, {
        id: string;
        confidence: number;
        category: "inconsistency" | "risk" | "doubt" | "vague_claim" | "mismatch" | "red_flag";
        hook: string;
        evidence: {
            field: string;
            snippet: string;
        };
        severity: number;
        pressureReady: boolean;
        coaching?: string | undefined;
        suggestedQuestion?: string | undefined;
    }>, "many">;
    context: z.ZodObject<{
        overallATS: z.ZodNumber;
        riskLevel: z.ZodEnum<["low", "medium", "high"]>;
        coachingFocus: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        overallATS: number;
        riskLevel: "high" | "medium" | "low";
        coachingFocus: string[];
    }, {
        overallATS: number;
        riskLevel: "high" | "medium" | "low";
        coachingFocus: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    generatedAt: string;
    munitions: {
        id: string;
        confidence: number;
        category: "inconsistency" | "risk" | "doubt" | "vague_claim" | "mismatch" | "red_flag";
        hook: string;
        evidence: {
            field: string;
            snippet: string;
        };
        severity: number;
        pressureReady: boolean;
        coaching?: string | undefined;
        suggestedQuestion?: string | undefined;
    }[];
    context: {
        overallATS: number;
        riskLevel: "high" | "medium" | "low";
        coachingFocus: string[];
    };
}, {
    generatedAt: string;
    munitions: {
        id: string;
        confidence: number;
        category: "inconsistency" | "risk" | "doubt" | "vague_claim" | "mismatch" | "red_flag";
        hook: string;
        evidence: {
            field: string;
            snippet: string;
        };
        severity: number;
        pressureReady: boolean;
        coaching?: string | undefined;
        suggestedQuestion?: string | undefined;
    }[];
    context: {
        overallATS: number;
        riskLevel: "high" | "medium" | "low";
        coachingFocus: string[];
    };
}>;
export type MunitionPack = z.infer<typeof MunitionPackSchema>;
//# sourceMappingURL=munitions.d.ts.map