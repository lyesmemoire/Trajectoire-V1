// @ts-nocheck
export type RiskLevel = "low" | "medium" | "high";
export type ProbableCause =
  | "overwhelm"
  | "frustration"
  | "fatigue"
  | "rumination";
export type RecommendedTone = "supportive" | "neutral" | "motivational";

export interface RiskScoreInput {
  interruptionsCount: number;
  pressurePeak: number;
  confidenceDrop: number;
  hesitationIncrease: number;
  replayReturns: number;
  replayDurationAvg: number;
  sessionAbortions: number;
  inactivityDays: number;
}

export interface RiskScoreOutput {
  riskLevel: RiskLevel;
  probableCause: ProbableCause;
  recommendedTone: RecommendedTone;
  score: number;
}

/**
 * Moteur de calcul déterministe du risque comportemental.
 */
export function calculateRiskScore(input: RiskScoreInput): RiskScoreOutput {
  let score = 0;
  let probableCause: ProbableCause = "fatigue";
  let recommendedTone: RecommendedTone = "neutral";

  // 1. Calcul du score brut basé sur les signaux de fatigue
  score += input.inactivityDays * 5;
  score += input.sessionAbortions * 15;
  score += input.confidenceDrop > 20 ? 20 : 0;
  score += input.interruptionsCount > 5 ? 10 : 0;

  // 2. Détection Rumination
  const isRuminating =
    input.replayReturns > 5 &&
    input.replayDurationAvg > 120 &&
    input.sessionAbortions > 0;

  if (isRuminating) {
    probableCause = "rumination";
    recommendedTone = "supportive";
    score += 30;
  } else if (input.sessionAbortions >= 2 || input.confidenceDrop > 30) {
    probableCause = "overwhelm";
    recommendedTone = "supportive";
    score += 40;
  } else if (input.interruptionsCount > 6 && input.pressurePeak > 80) {
    probableCause = "frustration";
    recommendedTone = "motivational";
    score += 20;
  }

  // 3. Catégorisation
  let riskLevel: RiskLevel = "low";
  if (score > 60) riskLevel = "high";
  else if (score > 30) riskLevel = "medium";

  return {
    riskLevel,
    probableCause,
    recommendedTone,
    score: Math.min(100, score),
  };
}
