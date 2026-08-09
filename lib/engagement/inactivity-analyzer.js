/**
 * Détermine pourquoi l'utilisateur s'est arrêté.
 */
export function analyzeDropoutReason(lastSession, totalSessions) {
    if (totalSessions === 0)
        return "friction";
    const wasHighPressure = lastSession.pressureLevel > 80;
    const wasLowConfidence = lastSession.confidenceScore < 40;
    const shortReplayView = lastSession.replayTimeSeconds < 30;
    if (wasHighPressure && (wasLowConfidence || shortReplayView)) {
        return "emotional_overload";
    }
    if (lastSession.score > 85) {
        return "natural_pause";
    }
    return "busy";
}
//# sourceMappingURL=inactivity-analyzer.js.map