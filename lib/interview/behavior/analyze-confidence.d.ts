export interface ConfidenceReport {
    score: number;
    reasoning: string;
    isReliable: boolean;
}
/**
 * Analyse la confiance de l'IA envers la réponse du candidat.
 */
export declare function analyzeAnswerConfidence(answer: _string): Promise<ConfidenceReport>;
//# sourceMappingURL=analyze-confidence.d.ts.map