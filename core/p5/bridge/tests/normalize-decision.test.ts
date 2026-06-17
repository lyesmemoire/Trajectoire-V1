import { describe, it, expect } from "vitest";
import { normalizeDecision } from "../normalize-decision";
import { GovernorDecision } from "../normalization-contract";

describe("normalize-decision", () => {
  // B1 — Déterminisme: même décision → mêmes événements
  it("should produce identical events for identical decisions", () => {
    const decision: GovernorDecision = {
      trustDelta: 0.2,
      pressureDelta: -10,
    };

    const a = normalizeDecision(decision);
    const b = normalizeDecision(decision);

    expect(a).toEqual(b);
  });

  // B2 — Ordre stable: trust → suspicion → pressure → emotion
  it("should emit events in a stable order regardless of object key order", () => {
    // Keys declared in reverse order
    const decision: GovernorDecision = {
      emotion: "stressed",
      pressureDelta: 5,
      suspicionDelta: 0.1,
      trustDelta: -0.2,
    };

    const events = normalizeDecision(decision);

    expect(events).toHaveLength(4);
    expect(events[0]!.type).toBe("TRUST_DELTA");
    expect(events[1]!.type).toBe("SUSPICION_DELTA");
    expect(events[2]!.type).toBe("PRESSURE_DELTA");
    expect(events[3]!.type).toBe("EMOTION_SET");
  });

  it("should only emit events for defined fields", () => {
    const decision: GovernorDecision = { trustDelta: 0.1 };
    const events = normalizeDecision(decision);

    expect(events).toHaveLength(1);
    expect(events[0]!!).toEqual({ type: "TRUST_DELTA", delta: 0.1 });
  });

  it("should return an empty array for an empty decision", () => {
    const events = normalizeDecision({});
    expect(events).toEqual([]);
  });

  it("should preserve delta values exactly", () => {
    const decision: GovernorDecision = {
      trustDelta: 0.123456789,
      suspicionDelta: -0.999,
      pressureDelta: 99.5,
    };

    const events = normalizeDecision(decision);

    expect(events[0]!!).toEqual({ type: "TRUST_DELTA", delta: 0.123456789 });
    expect(events[1]).toEqual({ type: "SUSPICION_DELTA", delta: -0.999 });
    expect(events[2]).toEqual({ type: "PRESSURE_DELTA", delta: 99.5 });
  });
});
