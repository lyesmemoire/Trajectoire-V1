/**
 * Predictive Return Model V1
 * Predicts the probability of a user returning within 24-48 hours.
 */
export interface ReturnScoreInput {
    behavior: {
        victorInterrupts: number;
        claraRecoveries: number;
        freezes: number;
        replays: number;
        retries: number;
    };
    ux: {
        hesitationIndex: number;
        scrollEntropy: number;
        clickDelayAvg: number;
        typingSpeed: number;
    };
}
export interface ReturnPrediction {
    returnProbability: number;
    returnSegment: "HIGH" | "MEDIUM" | "LOW";
    primaryDriver: string;
    rawScore: number;
}
export declare function computeReturnScore(input: _ReturnScoreInput): ReturnPrediction;
//# sourceMappingURL=return-model-v1.d.ts.map