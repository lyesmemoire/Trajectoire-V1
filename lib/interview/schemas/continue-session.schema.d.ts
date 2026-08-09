import { z } from "zod";
export declare const ContinueSessionSchema: z.ZodObject<{
    ai_response: z.ZodString;
    follow_up: z.ZodObject<{
        type: z.ZodEnum<["DEEP_DIVE", "CHALLENGE", "NEXT_QUESTION", "CLOSING"]>;
        question: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "DEEP_DIVE" | "CHALLENGE" | "NEXT_QUESTION" | "CLOSING";
        question: string | null;
    }, {
        type: "DEEP_DIVE" | "CHALLENGE" | "NEXT_QUESTION" | "CLOSING";
        question: string | null;
    }>;
    instant_feedback: z.ZodObject<{
        signal_quality: z.ZodEnum<["STRONG", "ADEQUATE", "WEAK"]>;
        one_line: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        signal_quality: "STRONG" | "ADEQUATE" | "WEAK";
        one_line: string;
    }, {
        signal_quality: "STRONG" | "ADEQUATE" | "WEAK";
        one_line: string;
    }>;
    session_complete: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    ai_response: string;
    follow_up: {
        type: "DEEP_DIVE" | "CHALLENGE" | "NEXT_QUESTION" | "CLOSING";
        question: string | null;
    };
    instant_feedback: {
        signal_quality: "STRONG" | "ADEQUATE" | "WEAK";
        one_line: string;
    };
    session_complete: boolean;
}, {
    ai_response: string;
    follow_up: {
        type: "DEEP_DIVE" | "CHALLENGE" | "NEXT_QUESTION" | "CLOSING";
        question: string | null;
    };
    instant_feedback: {
        signal_quality: "STRONG" | "ADEQUATE" | "WEAK";
        one_line: string;
    };
    session_complete: boolean;
}>;
export type ContinueSession = z.infer<typeof ContinueSessionSchema>;
//# sourceMappingURL=continue-session.schema.d.ts.map