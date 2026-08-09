/**
 * Mesure l'effort mental de l'utilisateur (Invisible Analytics).
 */
export declare function trackCognitiveLoad(events: {
    timeBeforeAction: number;
    backNavigation: number;
    modalCloses: number;
    rageClicks: number;
}): {
    loadLevel: "low" | "medium" | "high";
    risk: string | null;
};
//# sourceMappingURL=hesitation-tracker.d.ts.map