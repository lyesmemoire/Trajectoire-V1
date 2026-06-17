import { FraudKernel } from "./fraud-kernel"
import { FraudAssessment, FraudSignal } from "@/domain/fraud-kernel.contract"
import { EvaluationContext, AgentOpinion } from "@/domain/orchestration.contract"

export class FraudKernelEngine {
  constructor(private kernel: FraudKernel) {}

  evaluate(ctx: EvaluationContext): AgentOpinion {
    const signals = this.extractSignals(ctx)

    const result = this.kernel.evaluate(signals, ctx.userId)

    return {
      agent: "fraud", // Map to existing "fraud" agent namespace
      confidence: result.riskScore,
      severity: result.veto ? 1 : result.riskScore,
      recommendation: result.veto ? "veto" : "allow",
      reasoning: result.reason,
      signals: {
        riskScore: result.riskScore,
        veto: result.veto ? 1 : 0
      },
    }
  }

  private extractSignals(ctx: EvaluationContext): FraudSignal[] {
    const signals: FraudSignal[] = []

    // velocity
    const rpm = ctx.metrics?.requestsLastMinute ?? 0;
    if (rpm > 10) {
      signals.push({
        type: "velocity",
        severity: 0.8,
        confidence: 0.9,
        metadata: {
          requestsLastMinute: rpm
        },
      })
    }

    // behavioral jump
    if (ctx.driftScore && ctx.driftScore > 0.6) {
      signals.push({
        type: "behavioral_jump",
        severity: ctx.driftScore,
        confidence: 0.8,
        metadata: {},
      })
    }

    // billing anomaly
    if (ctx.billing?.negativeBalance) {
      signals.push({
        type: "billing_inconsistency",
        severity: 1,
        confidence: 1,
        metadata: ctx.billing,
      })
    }
    
    // ip anomaly map from previous context
    if (ctx.ipAnomalies && ctx.ipAnomalies > 0) {
      signals.push({
        type: "ip_anomaly",
        severity: Math.min(ctx.ipAnomalies * 0.4, 1.0),
        confidence: 0.9,
        metadata: { anomalies: ctx.ipAnomalies }
      })
    }

    // velocity map from previous context
    if (ctx.velocityAnomalies && ctx.velocityAnomalies > 0) {
      signals.push({
        type: "velocity",
        severity: Math.min(ctx.velocityAnomalies * 0.6, 1.0),
        confidence: 0.85,
        metadata: { velocityAnomalies: ctx.velocityAnomalies }
      })
    }

    return signals
  }
}
