/**
 * Silence Thresholds — Seuils différenciés Junior/Senior.
 *
 * Source : RECOVERY_VALIDATION_REPORT.md (Beta Cohort 01)
 *   - 10s pour profils Junior (anxieux, risque de rupture rapide)
 *   - 14s pour profils Senior/Tech (réflexion profonde, faux positifs à 10s)
 */
export type SeniorityLevel = "junior" | "mid" | "senior";
export interface SilenceThresholds {
    /** Durée (ms) au-delà de laquelle un freeze est déclaré */
    freezeThresholdMs: number;
    /** Durée (ms) au-delà de laquelle la frustration est détectée */
    frustrationThresholdMs: number;
    /** Nombre min de mots sous lequel la réponse est squelettique */
    skeletonWordCount: number;
    /** Hesitation rate (%) déclenchant le mode recovery */
    recoveryHesitationRate: number;
}
export declare const SILENCE_THRESHOLDS: Record<SeniorityLevel, SilenceThresholds>;
/**
 * Returns the appropriate thresholds for a given seniority level.
 */
export declare function getSilenceThresholds(level: SeniorityLevel): SilenceThresholds;
/**
 * Source de vérité du niveau:
 * Actuellement résolu via l'analyse du titre du poste (CV analysis / Job details).
 * Default = mid jusqu'à l'étape Career DNA.
 */
export declare function inferSeniority(session: {
    persona?: string;
    jobTitle?: string;
}): SeniorityLevel;
//# sourceMappingURL=silence-thresholds.d.ts.map