export type RuminationInput = {
    replayReturns: number;
    avgReplayDuration: number;
    newSessionsStarted: number;
};
export type RuminationOutput = {
    isRuminating: boolean;
    severity: "low" | "medium" | "high";
};
/**
 * Détecte une forte réflexion sans passage à l'action.
 */
export declare function detectRumination(input: _RuminationInput): RuminationOutput;
//# sourceMappingURL=rumination-detector.d.ts.map