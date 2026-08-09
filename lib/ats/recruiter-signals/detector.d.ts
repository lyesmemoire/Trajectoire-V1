export interface RecruiterSignal {
    pattern: string;
    mappedTrait: string;
    impact: "high" | "medium" | "low";
}
/**
 * Detects implicit recruiter needs from a job description.
 */
export declare function detectRecruiterSignals(jobDescription: string): string[];
//# sourceMappingURL=detector.d.ts.map