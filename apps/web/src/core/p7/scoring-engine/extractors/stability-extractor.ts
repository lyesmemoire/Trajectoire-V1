import { RuntimeTrace } from "../../trace-contract.js";
import { Signal, SignalExtractor } from "../scoring-contract.js";

export class StabilityExtractor implements SignalExtractor {
  name = "StabilityExtractor";

  extract(trace: RuntimeTrace): Signal[] {
    const signals: Signal[] = [];

    for (const turn of trace.turns) {
      // Very long turn duration or extreme latency might represent instability
      if (turn.derived?.latencyMs && turn.derived.latencyMs > 3000) {
        signals.push({
          id: `high_latency_${turn.index}`,
          type: "latency",
          value: -1, // Negative signal for stability
          timestamp: turn.input?.timestamp || turn.startTime,
          excerpt: `High latency: ${turn.derived.latencyMs}ms`,
        });
      } else if (turn.derived?.latencyMs && turn.derived.latencyMs < 500) {
         signals.push({
          id: `fast_response_${turn.index}`,
          type: "latency",
          value: 1, // Positive signal
          timestamp: turn.input?.timestamp || turn.startTime,
          excerpt: `Fast response: ${turn.derived.latencyMs}ms`,
        });
      }
    }
    return signals;
  }
}
