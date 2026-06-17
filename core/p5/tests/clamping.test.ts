import { describe, it, expect } from "vitest";
import { reduceMind } from "../reduceMind";
import { MindState } from "../execution-contract";

describe("reduceMind - Clamping", () => {
  const getInitialState = (): MindState => ({
    trust: 0.5,
    suspicion: 0.5,
    pressure: 50,
    emotion: "neutral"
  });

  it("should clamp trust to [0, 1]", () => {
    let state = getInitialState();
    
    // Clamp high
    state.trust = 0.95;
    state = reduceMind(state, { type: "TRUST_DELTA", delta: +0.2 });
    expect(state.trust).toBe(1);

    // Clamp low
    state.trust = 0.05;
    state = reduceMind(state, { type: "TRUST_DELTA", delta: -0.5 });
    expect(state.trust).toBe(0);
  });

  it("should clamp suspicion to [0, 1]", () => {
    let state = getInitialState();
    
    // Clamp high
    state.suspicion = 0.8;
    state = reduceMind(state, { type: "SUSPICION_DELTA", delta: +0.5 });
    expect(state.suspicion).toBe(1);

    // Clamp low
    state.suspicion = 0.1;
    state = reduceMind(state, { type: "SUSPICION_DELTA", delta: -0.5 });
    expect(state.suspicion).toBe(0);
  });

  it("should clamp pressure to [0, 100]", () => {
    let state = getInitialState();
    
    // Clamp high
    state.pressure = 90;
    state = reduceMind(state, { type: "PRESSURE_DELTA", delta: +20 });
    expect(state.pressure).toBe(100);

    // Clamp low
    state.pressure = 10;
    state = reduceMind(state, { type: "PRESSURE_DELTA", delta: -20 });
    expect(state.pressure).toBe(0);
  });
});
