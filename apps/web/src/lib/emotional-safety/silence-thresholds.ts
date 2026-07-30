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

export const SILENCE_THRESHOLDS: Record<SeniorityLevel, SilenceThresholds> = {
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
} as const;

/**
 * Returns the appropriate thresholds for a given seniority level.
 */
export function getSilenceThresholds(level: SeniorityLevel): SilenceThresholds {
  return SILENCE_THRESHOLDS[level] || SILENCE_THRESHOLDS.mid;
}

/**
 * Source de vérité du niveau: 
 * Actuellement résolu via l'analyse du titre du poste (CV analysis / any details).
 * Default = mid jusqu'à l'étape Career DNA.
 */
export function inferSeniority(session: {
  persona?: string;
  jobTitle?: string;
}): SeniorityLevel {
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
