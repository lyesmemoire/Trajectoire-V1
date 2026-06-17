import { FaultTrace } from "./FaultTelemetry";
import { FaultOverlayState } from "./FaultOverlayState";

export class FaultScoringEngine {
  compute(
    nodeId: string,
    trace: FaultTrace,
    totalNodes: number,
    sustainedTicks: number = 0
  ): FaultOverlayState {

    const domainCounts: Record<string, number> = {};
    let penalty = 0;
    let criticalCount = 0;

    for (const event of trace.events) {
      domainCounts[event.domain] = (domainCounts[event.domain] ?? 0) + 1;

      switch (event.severity) {
        case "CRITICAL":
          criticalCount++;
          penalty += 0.15;
          break;
        case "WARN":
          penalty += 0.05;
          break;
        default:
          penalty += 0.01;
      }

      if (event.domain === "ATTACK" || event.domain === "MEMORY") {
        penalty += 0.05;
      }
    }

    const cappedPenalty = Math.min(penalty, 0.4);

    const leaseRisk =
      penalty > 0.7 ? 1 : penalty > 0.5 ? 0.5 : 0;

    const criticalRatio = totalNodes > 0 ? criticalCount / totalNodes : 0;

    return {
      nodeId,
      penaltyScore: cappedPenalty,
      leaseRisk,
      restartBlock: criticalRatio > 0.3,
      criticalCount,
      sustainedTicks,
      faultDomains: domainCounts,
    };
  }
}
