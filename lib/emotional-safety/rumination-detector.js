/**
 * Détecte une forte réflexion sans passage à l'action.
 */
export function detectRumination(input) {
    const isRuminating = input.replayReturns > 4 && input.newSessionsStarted === 0;
    let severity = "low";
    if (input.avgReplayDuration > 180)
        severity = "high";
    else if (input.replayReturns > 7)
        severity = "medium";
    return {
        isRuminating,
        severity,
    };
}
//# sourceMappingURL=rumination-detector.js.map