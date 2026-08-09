/**
 * Moteur de capture de la charge cognitive (Invisible Tracking).
 * Utilisé pour détecter les hésitations et les moments de confusion.
 */
export declare const CognitiveLoadTracker: {
    trackTimeToFirstAction: (timeMs: number) => void;
    trackCTAHesitation: (ctaId: string, hoverDurationMs: number) => void;
    trackNavigationConfusion: (from: string, to: string) => void;
    trackReplayFlow: (lastStepSeen: number, totalSteps: number) => void;
    trackSessionExit: (step: string, timeSpentSeconds: number) => void;
};
//# sourceMappingURL=cognitive-load.d.ts.map