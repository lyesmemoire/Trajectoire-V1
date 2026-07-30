import { BaseEvent } from "../contracts/Event";
import { CognitiveState } from "../../../domain/cognitive/CognitiveState";

// ===================================================================
// REDUCER — Minimal Reducer for Phase A.1
// ===================================================================

export interface Reducer {
  reduce(events: BaseEvent[], previousState: CognitiveState): CognitiveState;
}

export class DummyReducer implements Reducer {
  reduce(events: BaseEvent[], previousState: CognitiveState): CognitiveState {
    // Minimal implementation - just return previous state
    // Full implementation will be in Phase B
    return previousState;
  }
}
