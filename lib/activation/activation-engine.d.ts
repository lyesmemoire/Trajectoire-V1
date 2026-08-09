/**
 * Calculates the activation score of a user (0-100).
 * Thresholds: Profile setup (20), First CV (20), First Session (40), First Result (20).
 */
export declare function computeActivationScore(userId: string): Promise<number>;
/**
 * Returns triggers for UI nudges based on activation stage.
 */
export declare function getActivationTriggers(userId: string): Promise<"UPLOAD_CV_NUDGE" | "START_FIRST_INTERVIEW_NUDGE" | "VIEW_RESULTS_NUDGE" | null>;
//# sourceMappingURL=activation-engine.d.ts.map