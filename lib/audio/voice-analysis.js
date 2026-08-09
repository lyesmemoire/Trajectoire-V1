/**
 * Real Voice Stress Analysis
 * Based on measurable signals only.
 * Returns "insufficient data" when no real signals are available.
 */
/**
 * Analyzes voice signals to compute an evidence-based stress score.
 * Only uses real, measurable data.
 */
export function analyzeVoiceStress(signals) {
    const availableSignals = Object.values(signals).filter(v => v !== undefined && v !== null).length;
    // Not enough real data → explicit insufficient data
    if (availableSignals < 2) {
        return {
            level: null,
            signals,
            status: "insufficient_data",
            message: "Insufficient voice data for stress analysis",
        };
    }
    let score = 0;
    let weight = 0;
    // Speaking rate (words per second)
    if (signals.wordCount !== undefined && signals.responseDurationMs !== undefined) {
        const durationSec = signals.responseDurationMs / 1000;
        const wps = durationSec > 0 ? signals.wordCount / durationSec : 0;
        // Very slow or very fast = higher stress
        if (wps < 1.8 || wps > 4.5)
            score += 25;
        else if (wps < 2.2 || wps > 4.0)
            score += 12;
        weight += 25;
    }
    // Filler words (um, uh, euh, etc.)
    if (signals.fillerCount !== undefined && signals.wordCount !== undefined) {
        const fillerRatio = signals.wordCount > 0
            ? signals.fillerCount / signals.wordCount
            : 0;
        if (fillerRatio > 0.12)
            score += 30;
        else if (fillerRatio > 0.06)
            score += 15;
        weight += 30;
    }
    // Pauses and hesitation
    if (signals.pauseCount !== undefined) {
        if (signals.pauseCount > 4)
            score += 20;
        else if (signals.pauseCount > 2)
            score += 10;
        weight += 20;
    }
    // Hesitation markers
    if (signals.hesitationMarkers !== undefined) {
        if (signals.hesitationMarkers > 3)
            score += 15;
        else if (signals.hesitationMarkers > 1)
            score += 8;
        weight += 15;
    }
    // Interruptions (if tracked)
    if (signals.interruptionCount !== undefined) {
        if (signals.interruptionCount > 2)
            score += 10;
        weight += 10;
    }
    const finalLevel = weight > 0 ? Math.min(100, Math.round((score / weight) * 100)) : null;
    return {
        level: finalLevel,
        signals,
        status: finalLevel !== null ? "sufficient" : "insufficient_data",
        message: finalLevel !== null ? undefined : "Insufficient voice data for stress analysis",
    };
}
//# sourceMappingURL=voice-analysis.js.map