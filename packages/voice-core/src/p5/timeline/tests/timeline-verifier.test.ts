import { describe, it, expect } from "vitest";
import { verifyTimeline } from "../timeline-verifier.js";
import { createTimeline } from "../timeline.js";
import { appendTick } from "../append-tick.js";
import { Timeline } from "../timeline-contract.js";

describe("timeline-verifier — T1/T2: Structural validation", () => {
  it("should accept a valid timeline built with appendTick", () => {
    let tl = createTimeline();
    tl = appendTick(tl, { type: "TRUST_DELTA", delta: 0.1 });
    tl = appendTick(tl, { type: "PRESSURE_DELTA", delta: 5 });
    tl = appendTick(tl, { type: "EMOTION_SET", emotion: "calm" });

    const result = verifyTimeline(tl);
    expect(result.valid).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it("should accept an empty timeline", () => {
    const result = verifyTimeline(createTimeline());
    expect(result.valid).toBe(true);
  });

  it("should reject a timeline with a duplicate tick", () => {
    const tl: Timeline = {
      entries: [
        { tick: 1, event: { type: "TRUST_DELTA", delta: 0.1 } },
        { tick: 2, event: { type: "TRUST_DELTA", delta: 0.1 } },
        { tick: 2, event: { type: "TRUST_DELTA", delta: 0.1 } }, // duplicate
      ],
    };

    const result = verifyTimeline(tl);
    expect(result.valid).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it("should reject a timeline with a gap", () => {
    const tl: Timeline = {
      entries: [
        { tick: 1, event: { type: "TRUST_DELTA", delta: 0.1 } },
        { tick: 2, event: { type: "TRUST_DELTA", delta: 0.1 } },
        { tick: 5, event: { type: "TRUST_DELTA", delta: 0.1 } }, // gap: 3,4 missing
      ],
    };

    const result = verifyTimeline(tl);
    expect(result.valid).toBe(false);
    expect(result.violations[0]).toContain("expected tick 3");
  });

  it("should reject a timeline with a negative tick", () => {
    const tl: Timeline = {
      entries: [
        { tick: -1, event: { type: "TRUST_DELTA", delta: 0.1 } },
      ],
    };

    const result = verifyTimeline(tl);
    expect(result.valid).toBe(false);
    expect(result.violations.some((v) => v.includes("negative"))).toBe(true);
  });

  it("should report multiple violations", () => {
    const tl: Timeline = {
      entries: [
        { tick: 0, event: { type: "TRUST_DELTA", delta: 0.1 } },  // wrong: expected 1
        { tick: 5, event: { type: "TRUST_DELTA", delta: 0.1 } },  // wrong: expected 2
      ],
    };

    const result = verifyTimeline(tl);
    expect(result.valid).toBe(false);
    expect(result.violations).toHaveLength(2);
  });
});
