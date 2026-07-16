// @ts-nocheck
import { describe, it, expect } from "vitest";
import { batchDecisions } from "../event-batch.js";
import { reduceMind } from "../../reduceMind.js";
import { MindState } from "../../execution-contract.js";

describe("event-batch", () => {
  // B1 — Déterminisme
  it("should produce identical output for identical input", () => {
    const decisions = [
      { trustDelta: 0.1, pressureDelta: 5 },
      { suspicionDelta: -0.2, emotion: "positive" as const },
    ];

    const a = batchDecisions(decisions);
    const b = batchDecisions(decisions);

    expect(a).toEqual(b);
  });

  // B2 — Ordre stable across decisions
  it("should preserve decision order and internal event order", () => {
    const result = batchDecisions([
      { trustDelta: 0.1, suspicionDelta: 0.2 },
      { pressureDelta: 5, emotion: "stressed" },
    ]);

    expect(result.events).toHaveLength(4);
    expect(result.events[0]).toEqual({ type: "TRUST_DELTA", delta: 0.1 });
    expect(result.events[1]).toEqual({ type: "SUSPICION_DELTA", delta: 0.2 });
    expect(result.events[2]).toEqual({ type: "PRESSURE_DELTA", delta: 5 });
    expect(result.events[3]).toEqual({ type: "EMOTION_SET", emotion: "stressed" });
  });

  // B3 — Invalid decisions are rejected, not silently dropped
  it("should reject invalid decisions and exclude them from events", () => {
    const result = batchDecisions([
      { trustDelta: 0.1 },          // valid
      { suspicionDelta: NaN },      // invalid
      { pressureDelta: 10 },        // valid
    ]);

    expect(result.events).toHaveLength(2);
    expect(result.events[0]).toEqual({ type: "TRUST_DELTA", delta: 0.1 });
    expect(result.events[1]).toEqual({ type: "PRESSURE_DELTA", delta: 10 });

    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0]!.index).toBe(1);
    expect(result.rejected[0]!.reasons[0]).toContain("suspicionDelta");
  });

  // B4 — Pureté: no side effects
  it("should not mutate the input array", () => {
    const decisions = Object.freeze([
      Object.freeze({ trustDelta: 0.1 }),
      Object.freeze({ pressureDelta: 5 }),
    ]);

    // Should not throw despite frozen input
    const result = batchDecisions(decisions);
    expect(result.events).toHaveLength(2);
  });

  // B5 — Compatibilité P5: output is directly consumable by reduceMind
  it("should produce events directly consumable by reduceMind", () => {
    const result = batchDecisions([
      { trustDelta: 0.2, pressureDelta: -10 },
      { emotion: "happy" },
    ]);

    const initialState: MindState = {
      trust: 0.5,
      suspicion: 0.5,
      pressure: 50,
      emotion: "neutral",
    };

    // Every event must be accepted by reduceMind without error
    let state = initialState;
    for (const event of result.events) {
      state = reduceMind(state, event);
    }

    expect(state.trust).toBeCloseTo(0.7, 5);
    expect(state.pressure).toBe(40);
    expect(state.emotion).toBe("happy");
    expect(state.suspicion).toBe(0.5); // untouched
  });

  it("should return empty events for an empty decision list", () => {
    const result = batchDecisions([]);
    expect(result.events).toEqual([]);
    expect(result.rejected).toEqual([]);
  });

  it("should handle a batch where all decisions are invalid", () => {
    const result = batchDecisions([
      { trustDelta: NaN },
      { suspicionDelta: Infinity },
      { pressureDelta: -Infinity },
    ]);

    expect(result.events).toEqual([]);
    expect(result.rejected).toHaveLength(3);
  });
});
