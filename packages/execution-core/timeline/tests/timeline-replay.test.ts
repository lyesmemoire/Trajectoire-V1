import { describe, it, expect } from "vitest";
import { createTimeline } from "../timeline.js";
import { appendTick } from "../append-tick.js";
import { replayTimeline } from "../timeline-replay.js";
import { createSnapshot } from "../../snapshot/create-snapshot.js";
import { applyEvents } from "../../execution-engine.js";
import { MindState, P5Event } from "../../execution-contract.js";

describe("timeline-replay — T3: Determinism & T5: Causal order", () => {
  const getState = (): MindState => ({
    trust: 0.5,
    suspicion: 0.5,
    pressure: 50,
    emotion: "neutral",
  });

  const events: P5Event[] = [
    { type: "TRUST_DELTA", delta: 0.15 },
    { type: "SUSPICION_DELTA", delta: -0.1 },
    { type: "PRESSURE_DELTA", delta: 20 },
    { type: "EMOTION_SET", emotion: "engaged" },
  ];

  it("should replay to the same state as direct execution (T5)", () => {
    const state = getState();
    const directResult = applyEvents(state, events);

    const snapshot = createSnapshot(state, 0);
    let tl = createTimeline();
    for (const event of events) {
      tl = appendTick(tl, event);
    }
    const replayResult = replayTimeline(snapshot, tl);

    expect(replayResult).toEqual(directResult);
  });

  it("should produce identical results for two identical replays (T3)", () => {
    const state = getState();
    const snapshot = createSnapshot(state, 0);

    let tl = createTimeline();
    for (const event of events) {
      tl = appendTick(tl, event);
    }

    const a = replayTimeline(snapshot, tl);
    const b = replayTimeline(snapshot, tl);

    expect(a).toEqual(b);
  });

  it("should handle replay with an empty timeline", () => {
    const state = getState();
    const snapshot = createSnapshot(state, 0);
    const tl = createTimeline();

    const result = replayTimeline(snapshot, tl);
    expect(result).toEqual(state);
  });

  it("should handle a long timeline replay", () => {
    const state = getState();
    const longEvents: P5Event[] = [];
    for (let i = 0; i < 50; i++) {
      longEvents.push({ type: "TRUST_DELTA", delta: 0.001 });
      longEvents.push({ type: "PRESSURE_DELTA", delta: 0.5 });
    }

    const directResult = applyEvents(state, longEvents);

    const snapshot = createSnapshot(state, 0);
    let tl = createTimeline();
    for (const event of longEvents) {
      tl = appendTick(tl, event);
    }
    const replayResult = replayTimeline(snapshot, tl);

    expect(replayResult.trust).toBeCloseTo(directResult.trust, 10);
    expect(replayResult.pressure).toBeCloseTo(directResult.pressure, 10);
    expect(replayResult.suspicion).toBe(directResult.suspicion);
    expect(replayResult.emotion).toBe(directResult.emotion);
  });
});
