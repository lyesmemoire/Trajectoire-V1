export interface StabilityMetrics {
    secondSessionRate: number;
    rageQuitRate: number;
    freezeEventRate: number;
    replayCompletionRate: number;
    voiceToTextFallbackRate: number;
}
/**
 * Calculates behavioral stability KPIs from recent session data.
 */
export declare function computeBehavioralStability(): Promise<StabilityMetrics>;
/**
 * Maps silence duration to psychological state.
 */
export declare function interpretSilence(durationSeconds: _number): string;
//# sourceMappingURL=behavioral-stability.d.ts.map