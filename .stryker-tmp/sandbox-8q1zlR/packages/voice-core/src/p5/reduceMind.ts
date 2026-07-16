// @ts-nocheck
import { MindState, P5Event } from "./execution-contract.js";

export function reduceMind(state: MindState, event: P5Event): MindState {
  switch (event.type) {
    case "TRUST_DELTA": {
      if (event.delta === 0) return state;
      const nextTrust = Math.max(0, Math.min(1, state.trust + event.delta));
      if (nextTrust === state.trust) return state;
      return { ...state, trust: nextTrust };
    }
    case "SUSPICION_DELTA": {
      if (event.delta === 0) return state;
      const nextSuspicion = Math.max(0, Math.min(1, state.suspicion + event.delta));
      if (nextSuspicion === state.suspicion) return state;
      return { ...state, suspicion: nextSuspicion };
    }
    case "PRESSURE_DELTA": {
      if (event.delta === 0) return state;
      const nextPressure = Math.max(0, Math.min(100, state.pressure + event.delta));
      if (nextPressure === state.pressure) return state;
      return { ...state, pressure: nextPressure };
    }
    case "EMOTION_SET": {
      if (event.emotion === state.emotion) return state;
      return { ...state, emotion: event.emotion };
    }
    default:
      return state;
  }
}
