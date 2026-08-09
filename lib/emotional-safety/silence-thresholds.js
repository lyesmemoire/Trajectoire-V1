/**
 * Silence Thresholds — Seuils différenciés Junior/Senior.
 *
 * Source : RECOVERY_VALIDATION_REPORT.md (Beta Cohort 01)
 *   - 10s pour profils Junior (anxieux, risque de rupture rapide)
 *   - 14s pour profils Senior/Tech (réflexion profonde, faux positifs à 10s)
 */
export const SILENCE_THRESHOLDS = {
    junior: {
        freezeThresholdMs: 10_000,
        frustrationThresholdMs: 10_000,
        skeletonWordCount: 5,
        recoveryHesitationRate: 70,
    },
    mid: {
        freezeThresholdMs: 7_500,
        frustrationThresholdMs: 7_500,
        skeletonWordCount: 4,
        recoveryHesitationRate: 75,
    },
    senior: {
        freezeThresholdMs: 5_000,
        frustrationThresholdMs: 5_000,
        skeletonWordCount: 3,
        recoveryHesitationRate: 85,
    },
};
/**
 * Returns the appropriate thresholds for a given seniority level.
 */
export function getSilenceThresholds(level) {
    return SILENCE_THRESHOLDS[level] || SILENCE_THRESHOLDS.mid;
}
/**
 * Source de vérité du niveau:
 * Actuellement résolu via l'analyse du titre du poste (CV analysis / Job details).
 * Default = mid jusqu'à l'étape Career DNA.
 */
export function inferSeniority(session) {
    const seniorKeywords = [
        "senior", "lead", "staff", "principal", "architect",
        "manager", "director", "vp", "head", "cto", "ceo",
    ];
    const juniorKeywords = [
        "junior", "stagiaire", "intern", "apprentice", "alternant", "trainee"
    ];
    const title = (session.jobTitle ?? "").toLowerCase();
    const persona = (session.persona ?? "").toLowerCase();
    if (persona === "faang" || persona === "tech" || seniorKeywords.some(kw => title.includes(kw))) {
        return "senior";
    }
    if (juniorKeywords.some(kw => title.includes(kw))) {
        return "junior";
    }
    // default = mid
    return "mid";
}
//# sourceMappingURL=silence-thresholds.js.map