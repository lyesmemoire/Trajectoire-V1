/**
 * Détecte les signes de frustration ou de blocage émotionnel.
 */
export function detectFrustration(metrics) {
    // 1. Détection du "Freeze" (Silence long > 10s)
    if (metrics.silenceDuration > 10000) {
        return { frustrated: true, reason: "FREEZE_DETECTED" };
    }
    // 2. Détection du désengagement (Réponses ultra-courtes répétées)
    if (metrics.wordCount < 10 && metrics.hesitationCount > 3) {
        return { frustrated: true, reason: "DISENGAGEMENT_RISK" };
    }
    // 3. Détection de la tension vocale (sentiment score très bas)
    if (metrics.sentimentScore < 0.2) {
        return { frustrated: true, reason: "HIGH_STRESS_LEVEL" };
    }
    return { frustrated: false, reason: null };
}
//# sourceMappingURL=frustration-detector.js.map