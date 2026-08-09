/**
 * Calcule la pression adaptative en protégeant la confiance de l'utilisateur.
 * Interdiction des interruptions précoces et mode Recovery obligatoire.
 */
export declare function calculateAdaptivePressure(metrics: {
    consecutiveInterruptions: number;
    confidenceDrop: number;
    hesitationRate: number;
    lastScore: number;
    secondsInAnswer: number;
    wordCount: number;
}): {
    newPressureLevel: number;
    behaviorMode: "coaching" | "standard" | "recovery";
    canInterrupt: boolean;
};
export declare const RECOVERY_PHRASES: string[];
//# sourceMappingURL=adaptive-pressure.d.ts.map