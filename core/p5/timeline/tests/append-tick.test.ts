import { describe, it, expect } from "vitest";
import { createTimeline } from "../timeline.js";
import { appendTick } from "../append-tick.js";
import { P5Event } from "../../execution-contract.js";

describe("append-tick — T1: Monotonicity & T2: No gaps", () => {
  it("should produce strictly monotonic ticks", () => {
    const events: P5Event[] = [
      { type: "TRUST_DELTA", delta: 0.1 },
      { type: "SUSPICION_DELTA", delta: -0.05 },
      { type: "PRESSURE_DELTA", delta: 10 },
      { type: "EMOTION_SET", emotion: "alert" },
      { type: "TRUST_DELTA", delta: -0.2 },
    ];

    let tl = createTimeline();
    for (const event of events) {
      tl = appendTick(tl, event);
    }

    const ticks = tl.entries.map((e) => e.tick);
    expect(ticks).toEqual([1, 2, 3, 4, 5]);

    // Verify strict monotonicity
    for (let i = 1; i < ticks.length; i++) {
      expect(ticks[i]!).toBeGreaterThan(ticks[i - 1]!);
    }
  });

  it("should never produce a gap in ticks", () => {
    let tl = createTimeline();
    for (let i = 0; i < 20; i++) {
      tl = appendTick(tl, { type: "TRUST_DELTA", delta: 0.01 });
    }

    const ticks = tl.entries.map((e) => e.tick);
    for (let i = 0; i < ticks.length; i++) {
      expect(ticks[i]).toBe(i + 1);
    }
  });

  it("should not mutate the original timeline", () => {
    const tl0 = Object.freeze(createTimeline());
    const tl1 = appendTick(tl0, { type: "TRUST_DELTA", delta: 0.1 });

    expect(tl0.entries).toHaveLength(0);
    expect(tl1.entries).toHaveLength(1);
  });

  it("should preserve previous entries on append", () => {
    let tl = createTimeline();
    tl = appendTick(tl, { type: "TRUST_DELTA", delta: 0.1 });
    tl = appendTick(tl, { type: "PRESSURE_DELTA", delta: 5 });

    expect(tl.entries[0]!.event).toEqual({ type: "TRUST_DELTA", delta: 0.1 });
    expect(tl.entries[1]!.event).toEqual({ type: "PRESSURE_DELTA", delta: 5 });
  });
});
