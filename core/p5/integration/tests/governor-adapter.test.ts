import { describe, it, expect } from "vitest";
import { adaptDecision } from "../governor-adapter";

describe("governor-adapter", () => {
  it("should adapt a valid decision into P5Events", () => {
    const result = adaptDecision({
      trustDelta: 0.2,
      pressureDelta: -10,
      emotion: "stressed",
    });

    expect(result.valid).toBe(true);
    expect(result.events).toHaveLength(3);
    expect(result.events[0]).toEqual({ type: "TRUST_DELTA", delta: 0.2 });
    expect(result.events[1]).toEqual({ type: "PRESSURE_DELTA", delta: -10 });
    expect(result.events[2]).toEqual({ type: "EMOTION_SET", emotion: "stressed" });
  });

  it("should reject an invalid decision", () => {
    const result = adaptDecision({ trustDelta: NaN });

    expect(result.valid).toBe(false);
    expect(result.events).toEqual([]);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("should handle an empty decision", () => {
    const result = adaptDecision({});

    expect(result.valid).toBe(true);
    expect(result.events).toEqual([]);
  });

  it("should be deterministic", () => {
    const decision = { trustDelta: 0.1, suspicionDelta: -0.05 };
    const a = adaptDecision(decision);
    const b = adaptDecision(decision);

    expect(a).toEqual(b);
  });
});
