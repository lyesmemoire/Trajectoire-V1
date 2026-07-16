// @ts-nocheck
export interface NormalizedScore {
  candidateId: string;
  rawScore: number;
  normalizedScore: number; // 0-100 recalibrated globally
  percentile: number; // 0-1
}

export interface GlobalRankingEntry {
  candidateId: string;
  rank: number;
  score: NormalizedScore;
}

export interface CohortStats {
  mean: number;
  stdDev: number;
  min: number;
  max: number;
}

export type CohortLabel =
  | "low_variance_cohort"
  | "high_dispersion_cohort"
  | "normal_cohort";

export interface GlobalRankingReport {
  rankings: GlobalRankingEntry[];
  stats: CohortStats;
  cohortLabel: CohortLabel;
}
