export type RiskLevel = "low" | "medium" | "high";
export type ProbableCause = "overwhelm" | "frustration" | "fatigue" | "rumination";
export type RecommendedTone = "supportive" | "neutral" | "motivational";
export interface RiskScoreInput {
    interruptionsCount: number;
    pressurePeak: number;
    confidenceDrop: number;
    hesitationIncrease: number;
    replayReturns: number;
    replayDurationAvg: number;
    sessionAbortions: number;
    inactivityDays: number;
}
export interface RiskScoreOutput {
    riskLevel: RiskLevel;
    probableCause: ProbableCause;
    recommendedTone: RecommendedTone;
    score: number;
}
/**
 * Moteur de calcul déterministe du risque comportemental.
 */
export declare function calculateRiskScore(input: _RiskScoreInput): RiskScoreOutput;
//# sourceMappingURL=risk-score.d.ts.map