/**
 * Calcul déterministe du score de compétences.
 * 40% du score final ATS.
 */
export function calculateSkillScore(required: string[], candidate: string[], ): { score: number; matched: string[]; missing: string[] } {
  if (!required.length) return { score: 100, matched: [], missing: [] };

  const matched = required.filter((skill) => candidate.includes(skill));
  const missing = required.filter((skill) => !candidate.includes(skill));

  const score = Math.round((matched.length / required.length) * 100);

  return { score, matched, missing };
}

/**
 * Agrégation finale du score ATS (Deterministic).
 */
export function aggregateFinalScore(metrics: {
  skills: number;
  experience: number;
  seniority: number;
  readability: number;
}): number {
  const weights = {
    skills: 0.4,
    experience: 0.3,
    seniority: 0.2,
    readability: 0.1,
  };

  const final =
    metrics.skills * weights.skills +
    metrics.experience * weights.experience +
    metrics.seniority * weights.seniority +
    metrics.readability * weights.readability;

  return Math.round(final);
}
