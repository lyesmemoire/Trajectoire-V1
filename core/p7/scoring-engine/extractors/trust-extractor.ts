import { RuntimeTrace, TurnTrace } from "../../trace-contract";
import { Signal, SignalExtractor } from "../scoring-contract";

export class TrustExtractor implements SignalExtractor {
  name = "TrustExtractor";

  extract(trace: RuntimeTrace): Signal[] {
    const signals: Signal[] = [];
    let currentTrust = 0.5; // Default initial state in P5
    
    for (const turn of trace.turns) {
      for (const event of turn.events) {
        if (event.type === "DECISION") {
          const payload = event.payload as { trustDelta?: number };
          if (payload && payload.trustDelta !== undefined) {
            currentTrust += payload.trustDelta;
            
            // Generate a signal for each meaningful trust interaction
            if (payload.trustDelta > 0) {
              signals.push({
                id: `trust_increase_${turn.index}`,
                type: "trust_trend",
                value: 1, // Positive signal
                timestamp: event.timestamp,
                excerpt: turn.input.message,
              });
            } else if (payload.trustDelta < 0) {
              signals.push({
                id: `trust_decrease_${turn.index}`,
                type: "trust_trend",
                value: -1, // Negative signal
                timestamp: event.timestamp,
                excerpt: turn.input.message,
              });
            }
          }
        }
      }
    }
    return signals;
  }
}
