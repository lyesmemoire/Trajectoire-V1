/**
 * Risk level classification for engagement frequency guard.
 */
// @ts-nocheck

export type RiskLevel = "low" | "medium" | "high" | "critical";

export function calculateRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}
