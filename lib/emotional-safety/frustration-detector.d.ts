/**
 * Détecte les signes de frustration ou de blocage émotionnel.
 */
export declare function detectFrustration(metrics: {
    silenceDuration: number;
    wordCount: number;
    hesitationCount: number;
    sentimentScore: number;
}): {
    frustrated: boolean;
    reason: string | null;
};
//# sourceMappingURL=frustration-detector.d.ts.map