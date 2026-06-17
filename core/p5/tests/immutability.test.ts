import { describe, it, expect } from "vitest";
import { reduceMind } from "../reduceMind";
import { MindState } from "../execution-contract";

describe("reduceMind - Immutability", () => {
  it("should return a new object when state changes", () => {
    const state: MindState = {
      trust: 0.5,
      suspicion: 0.5,
      pressure: 50,
      emotion: "neutral"
    };

    const nextState = reduceMind(state, { type: "TRUST_DELTA", delta: 0.1 });
    
    // Should be a different object reference
    expect(nextState).not.toBe(state);
    expect(nextState.trust).toBe(0.6);
  });

  it("should not mutate the original state object", () => {
    const state: MindState = {
      trust: 0.5,
      suspicion: 0.5,
      pressure: 50,
      emotion: "neutral"
    };
    
    // Deep freeze guarantees no mutations occur during the operation
    Object.freeze(state);

    reduceMind(state, { type: "PRESSURE_DELTA", delta: 10 });
    reduceMind(state, { type: "EMOTION_SET", emotion: "stressed" });
    
    expect(state.pressure).toBe(50);
    expect(state.emotion).toBe("neutral");
  });
});
