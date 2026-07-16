// @ts-nocheck
import { AgentOpinion, EvaluationContext } from "@/domain/orchestration.contract";

/**
 * Behavior Agent
 * Input: longitudinal user memory
 * Output: trend, stability, drift
 * Nature: temporel
 * Autorité: moyenne (influence globale)
 */
export function evaluateBehavior(ctx: EvaluationContext): AgentOpinion {
  const driftScore = ctx.driftScore ?? 0.0;
  const stabilityScore = ctx.stabilityScore ?? 1.0;
  
  let recommendation: AgentOpinion["recommendation"] = "allow";
  let severity = 0;
  
  if (driftScore > 0.5) {
    recommendation = "escalate";
    severity = 0.8;
  } else if (driftScore > 0.3) {
    recommendation = "warn";
    severity = 0.4;
  }

  return {
    agent: "behavior",
    confidence: stabilityScore,
    severity,
    recommendation,
    reasoning: `Drift score: ${driftScore.toFixed(2)}, Stability: ${stabilityScore.toFixed(2)}.`,
    signals: {
      driftScore,
      stabilityScore
    }
  };
}
