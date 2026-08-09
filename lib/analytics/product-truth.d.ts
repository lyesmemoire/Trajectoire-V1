export interface FeatureValueScore {
    feature: string;
    totalCost: number;
    usageCount: number;
    retentionImpact: number;
    retryImpact: number;
    valueScore: number;
}
/**
 * Calculates the real business value of each feature by correlating cost and behavior.
 */
export declare function computeFeatureValueScores(): Promise<FeatureValueScore[]>;
/**
 * Predicts the probability of a user returning based on their session quality.
 */
export declare function calculateRetryProbability(scores: {
    clarity: number;
    confidence: number;
    engagement: number;
}): number;
//# sourceMappingURL=product-truth.d.ts.map