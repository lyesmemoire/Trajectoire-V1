// src/control-plane/HealthCalculator.ts
import { HealthMetrics } from "./ControlPlaneTypes";

/**
 * Simple health score calculator. Returns a value between 0 and 100.
 * The algorithm is intentionally lightweight – production systems can
 * replace it with a more sophisticated model.
 */
export class HealthCalculator {
  static compute(metrics: HealthMetrics): number {
    const weights = {
      trust: 0.4,
      replay: 0.3,
      availability: 0.2,
      queue: 0.1,
    };

    const trustScore = metrics.trustAvg * weights.trust * 100;
    const replayScore = metrics.replaySuccessRate * weights.replay * 100;
    const availabilityScore = metrics.nodeAvailability * weights.availability * 100;
    // lower queue saturation is better → (1 - sat)
    const queueScore = (1 - Math.min(metrics.queueSaturation, 1)) * weights.queue * 100;

    let rawScore = trustScore + replayScore + availabilityScore + queueScore;

    // penalize frequent governor interventions
    const penalty = Math.min(metrics.governorInterventions * 5, 20);
    rawScore = Math.max(0, rawScore - penalty);

    return Math.round(rawScore);
  }
}
