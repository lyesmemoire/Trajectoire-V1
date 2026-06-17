import { AgentOpinion, EvaluationContext } from "@/domain/orchestration.contract";

/**
 * Billing Agent
 * Input: credit events, transactions, usage patterns
 * Output: riskScore, consistencyState
 * Nature: déterministe
 * Autorité: élevée sur argent
 */
export function evaluateBilling(ctx: EvaluationContext): AgentOpinion {
  const hasInconsistency = ctx.hasBillingInconsistency ?? false;
  
  if (hasInconsistency) {
    return {
      agent: "billing",
      confidence: 1.0,
      severity: 1.0,
      recommendation: "block", // Handled as FREEZE in consensus
      reasoning: "Billing inconsistency detected. Ledger mismatch or double spend attempt.",
      signals: {
        inconsistency: 1.0
      }
    };
  }
  
  return {
    agent: "billing",
    confidence: 1.0,
    severity: 0,
    recommendation: "allow",
    reasoning: "Billing state is consistent.",
    signals: {
      inconsistency: 0.0
    }
  };
}
