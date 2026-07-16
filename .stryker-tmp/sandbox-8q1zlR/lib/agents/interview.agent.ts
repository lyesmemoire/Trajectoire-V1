// @ts-nocheck
import { AgentOpinion, EvaluationContext } from "@/domain/orchestration.contract";

/**
 * Interview Agent
 * Input: sessions, réponses, features ML
 * Output: score, archetype, confidence
 * Nature: probabiliste
 * Autorité: faible sur système global
 */
export function evaluateInterview(ctx: EvaluationContext): AgentOpinion {
  const score = ctx.interviewScore ?? 0.5;
  const confidence = ctx.interviewConfidence ?? 0.8;
  
  let recommendation: AgentOpinion["recommendation"] = "allow";
  if (score < 0.3) {
    recommendation = "warn";
  }

  return {
    agent: "interview",
    confidence: confidence,
    severity: score < 0.3 ? 0.4 : 0,
    recommendation,
    reasoning: `Interview score evaluated at ${score.toFixed(2)} with confidence ${confidence.toFixed(2)}.`,
    signals: {
      score,
      confidence
    }
  };
}
