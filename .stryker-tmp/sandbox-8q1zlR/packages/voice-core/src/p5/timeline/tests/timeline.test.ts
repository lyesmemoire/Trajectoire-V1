// @ts-nocheck
import { describe, it, expect } from "vitest";
import { createTimeline } from "../timeline.js";
import { appendTick } from "../append-tick.js";

describe("timeline — creation & append", () => {
  it("should create an empty timeline", () => {
    const tl = createTimeline();
    expect(tl.entries).toEqual([]);
  });

  it("should append events with sequential ticks", () => {
    let tl = createTimeline();
    tl = appendTick(tl, { type: "TRUST_DELTA", delta: 0.1 });
    tl = appendTick(tl, { type: "PRESSURE_DELTA", delta: 5 });
    tl = appendTick(tl, { type: "EMOTION_SET", emotion: "focused" });

    expect(tl.entries).toHaveLength(3);
    expect(tl.entries[0]!.tick).toBe(1);
    expect(tl.entries[1]!.tick).toBe(2);
    expect(tl.entries[2]!.tick).toBe(3);
  });

  it("should preserve event data in entries", () => {
    let tl = createTimeline();
    tl = appendTick(tl, { type: "TRUST_DELTA", delta: 0.25 });

    expect(tl.entries[0]!.event).toEqual({ type: "TRUST_DELTA", delta: 0.25 });
  });
});
