export type RecoveryType = "confidence" | "technical" | "communication" | "stress";
export interface RecoveryConversionPayload {
    userId: string;
    tenantId: string;
    sessionId: string;
    timestamp: string;
    questionId: string;
    recoveryType: RecoveryType;
    scoreBefore: number;
    scoreAfter: number;
    scoreDelta: number;
}
export declare const RecoveryAnalytics: {
    /**
     * Enregistre un événement de conversion (recovery) si la progression de score
     * est supérieure ou égale au seuil minimum.
     *
     * @param payload L'objet contenant les métriques avant/après.
     */
    trackConversion: (payload: Omit<RecoveryConversionPayload, "scoreDelta">) => void;
};
//# sourceMappingURL=recovery-analytics.d.ts.map