import { RuntimeTrace } from "../../trace-contract.js";
import { Signal, SignalExtractor } from "../scoring-contract.js";

export class TrustExtractor implements SignalExtractor {
  name = "TrustExtractor";

  extract(trace: RuntimeTrace): Signal[] {
    const signals: Signal[] = [];
    
    // TODO: Implement trust extraction after realtime-gateway migration
    // The current TurnTrace placeholder doesn't include events or decision data
    // This extractor will be functional once the full RuntimeTrace types are available
    
    return signals;
  }
}
