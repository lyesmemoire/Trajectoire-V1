export interface NextBestAction {
    title: string;
    description: string;
    duration: number;
    reasoning: string;
}
/**
 * Propose UNE seule action prioritaire pour éviter la surcharge mentale.
 */
export declare function getAdaptiveRecommendation(analysis: _unknown): NextBestAction;
//# sourceMappingURL=adaptive-recommendation.d.ts.map