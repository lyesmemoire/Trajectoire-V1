import { RuntimeTrace } from "../../trace-contract.js";
import { Signal, SignalExtractor } from "../scoring-contract.js";

export class StabilityExtractor implements SignalExtractor {
  name = "StabilityExtractor";

  extract(trace: RuntimeTrace): Signal[] {
    const signals: Signal[] = [];

    for (const turn of trace.turns) {
      // Very long turn duration or extreme latency might represent instability
      if (turn.derived.latencyMs > 3000) {
        signals.push({
          id: `high_latency_${turn.index}`,
          type: "latency",
          value: -1, // Negative signal for stability
          timestamp: turn.input.timestamp,
          excerpt: turn.input.message,
        });
      } else if (turn.derived.latencyMs < 500) {
         signals.push({
          id: `fast_response_${turn.index}`,
          type: "latency",
          value: 1, // Positive signal
          timestamp: turn.input.timestamp,
          excerpt: turn.input.message,
        });
      }
      
      // Analyze Voice Plan for interruptions
      for (const event of turn.events) {
        if (event.type === "VOICE_PLAN") {
          const payload = event.payload as { shouldInterrupt?: boolean };
          if (payload?.shouldInterrupt) {
            signals.push({
              id: `interruption_${turn.index}`,
              type: "interruption_rate",
              value: -1,
              timestamp: event.timestamp,
              excerpt: turn.input.message,
            });
          }
        }
      }
    }
    return signals;
  }
}
