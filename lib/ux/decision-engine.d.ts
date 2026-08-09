export type UserPriority = "CLARITY" | "CONCISENESS" | "CONFIDENCE" | "SPECIFICITY";
export interface RecommendedAction {
    id: string;
    title: string;
    description: string;
    duration: string;
    type: "practice" | "review" | "rest";
}
/**
 * Moteur de décision pour supprimer la fatigue décisionnelle.
 * Retourne UNE SEULE priorité et UNE SEULE action recommandée.
 */
export declare function calculateNextStep(userStats: _unknown): {
    priority: string;
    action: RecommendedAction;
};
//# sourceMappingURL=decision-engine.d.ts.map