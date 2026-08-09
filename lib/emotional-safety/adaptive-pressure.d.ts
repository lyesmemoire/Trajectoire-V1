/**
 * Ajuste le comportement de l'IA Victor pour protéger la confiance de l'utilisateur.
 */
export declare function calculateAdaptivePressure(metrics: {
    consecutiveInterruptions: number;
    confidenceDrop: number;
    hesitationRate: number;
    lastScore: number;
}): {
    newPressureLevel: number;
    behaviorMode: "coaching" | "standard" | "recovery";
};
//# sourceMappingURL=adaptive-pressure.d.ts.map