/**
 * Détecte les moments de gel (Freeze) basés sur les métriques temps réel.
 */
export function detectUserFreeze(metrics) {
    // RÈGLE : Si silence > 10s OU réponse squelettique
    if (metrics.silenceDuration > 10000)
        return true;
    if (metrics.wordCount > 0 && metrics.wordCount < 5)
        return true;
    if (metrics.consecutiveHesitations >= 2)
        return true;
    return false;
}
//# sourceMappingURL=freeze-detector.js.map