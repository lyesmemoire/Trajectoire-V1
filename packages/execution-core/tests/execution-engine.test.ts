import { describe, it, expect } from "vitest";
import { applyEvents } from "../execution-engine.js";
import { MindState, P5Event } from "../execution-contract.js";

describe("execution-engine", () => {
  const getInitialState = (): MindState => ({
    trust: 0.5,
    suspicion: 0.5,
    pressure: 50,
    emotion: "neutral"
  });

  it("should return equivalent state when processing an empty event list", () => {
    const state = getInitialState();
    const result = applyEvents(state, []);
    
    expect(result).toEqual(state);
  });

  it("should correctly process a sequence of events", () => {
    const state = getInitialState();
    
    const events: P5Event[] = [
      { type: "TRUST_DELTA", delta: +0.2 },     // trust -> 0.7
      { type: "TRUST_DELTA", delta: -0.1 },     // trust -> 0.6
      { type: "TRUST_DELTA", delta: +0.3 },     // trust -> 0.9
      { type: "PRESSURE_DELTA", delta: +10 },   // pressure -> 60
      { type: "EMOTION_SET", emotion: "happy" } // emotion -> "happy"
    ];

    const result = applyEvents(state, events);

    expect(result.suspicion).toBe(0.5);
    expect(result.pressure).toBe(60);
    expect(result.emotion).toBe("happy");
    expect(result.trust).toBeCloseTo(0.9, 5);
  });

  it("should be equivalent to two successive executions", () => {
    const state = getInitialState();
    const events: P5Event[] = [
      { type: "TRUST_DELTA", delta: +0.2 },
      { type: "TRUST_DELTA", delta: -0.1 },
      { type: "TRUST_DELTA", delta: +0.3 }
    ];

    const batchResult = applyEvents(state, events);

    const step1 = applyEvents(state, [{ type: "TRUST_DELTA", delta: +0.2 }]);
    const step2 = applyEvents(step1, [{ type: "TRUST_DELTA", delta: -0.1 }]);
    const step3 = applyEvents(step2, [{ type: "TRUST_DELTA", delta: +0.3 }]);

    expect(batchResult).toEqual(step3);
  });
});
