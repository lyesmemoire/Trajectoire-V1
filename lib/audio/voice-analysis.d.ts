/**
 * Real Voice Stress Analysis
 * Based on measurable signals only.
 * Returns "insufficient data" when no real signals are available.
 */
export interface VoiceSignals {
    responseDurationMs?: number;
    wordCount?: number;
    fillerCount?: number;
    pauseCount?: number;
    hesitationMarkers?: number;
    interruptionCount?: number;
}
export interface StressAnalysisResult {
    level: number | null;
    signals: VoiceSignals;
    status: "sufficient" | "insufficient_data";
    message?: string;
}
/**
 * Analyzes voice signals to compute an evidence-based stress score.
 * Only uses real, measurable data.
 */
export declare function analyzeVoiceStress(signals: _VoiceSignals): StressAnalysisResult;
//# sourceMappingURL=voice-analysis.d.ts.map