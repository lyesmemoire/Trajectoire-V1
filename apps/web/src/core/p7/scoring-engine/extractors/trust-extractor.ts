import { RuntimeTrace } from "../../trace-contract";
import { Signal, SignalExtractor } from "../scoring-contract";

export class TrustExtractor implements SignalExtractor {
  name = "TrustExtractor";

  extract(trace: RuntimeTrace): Signal[] {
    const signals: Signal[] = [];
    
    // Trust extraction requires full RuntimeTrace with events and decision data
    // Currently using TurnTrace placeholder - awaiting realtime-gateway migration
    // Placeholder implementation returns empty signals until full trace data is available
    
    return signals;
  }
}
