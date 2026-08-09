export type RecoveryAction = {
    title: string;
    duration: string;
    difficulty: "light" | "medium";
    tone: "supportive" | "calm";
};
/**
 * Retourne UNE seule action recommandée basée sur le diagnostic de risque.
 */
export declare function getRecommendedRecoveryAction(risk: _RiskScoreOutput): RecoveryAction;
//# sourceMappingURL=recovery-action.d.ts.map