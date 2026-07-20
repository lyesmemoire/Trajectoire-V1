import { FraudAssessment, FraudKernelConfig, FraudSignal } from "@/domain/fraud-kernel.contract"

export class FraudKernel {
  constructor(private config: FraudKernelConfig) {}

  evaluate(signals: FraudSignal[], userId: string): FraudAssessment {
    const weighted = this.computeRisk(signals)

    const veto = weighted >= this.config.hardVetoThreshold

    return {
      userId,
      riskScore: weighted,
      signals,
      veto,
      reason: this.explain(signals, weighted, veto),
      timestamp: Date.now(),
    }
  }

  private computeRisk(signals: FraudSignal[]): number {
    if (signals.length === 0) return 0

    let score = 0
    let weightSum = 0

    for (const s of signals) {
      const weight = this.getWeight(s.type)
      score += s.severity * s.confidence * weight
      weightSum += weight
    }

    return Math.min(1, score / Math.max(1, weightSum))
  }

  private getWeight(type: FraudSignal["type"]): number {
    switch (type) {
      case "replay_mismatch":
        return 1.2
      case "billing_inconsistency":
        return 1.5
      case "velocity":
        return 1.3
      case "ip_anomaly":
        return 1.1
      case "device_change":
        return 1.0
      case "behavioral_jump":
        return 0.9
    }
  }

  private explain(signals: FraudSignal[], score: number, veto: boolean): string {
    if (veto) return `HARD VETO triggered (score=${score})`

    const top = signals
      .sort((a, b) => b.severity * b.confidence - a.severity * a.confidence)[0]

    return top
      ? `Primary signal: ${top.type}`
      : "No significant fraud signals"
  }
}
