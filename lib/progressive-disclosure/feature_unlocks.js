/**
 * Contrôle la visibilité des fonctionnalités pour éviter la surcharge cognitive.
 * Le produit se révèle au rythme de l'utilisateur.
 */
export function getVisibleFeatures(sessionCount) {
    const base = ["mini_interview", "replay_simple", "profile"];
    if (sessionCount >= 1) {
        base.push("progression_summary");
    }
    if (sessionCount >= 3) {
        base.push("ats_audit", "detailed_coaching");
    }
    if (sessionCount >= 7) {
        base.push("career_dna", "market_benchmarks");
    }
    return base;
}
export function isFeatureLocked(featureId, sessionCount) {
    return !getVisibleFeatures(sessionCount).includes(featureId);
}
//# sourceMappingURL=feature_unlocks.js.map