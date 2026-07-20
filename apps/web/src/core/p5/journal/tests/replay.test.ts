import { describe, it, expect } from "vitest";
import { replay } from "../replay.js";
import { createJournal } from "../journal.js";
import { appendEvent } from "../append-event.js";
import { createSnapshot } from "../../snapshot/create-snapshot.js";
import { applyEvents } from "../../execution-engine.js";
import { MindState, P5Event } from "../../execution-contract.js";

describe("replay — J3: Replay exact", () => {
  const getState = (): MindState => ({
    trust: 0.5,
    suspicion: 0.5,
    pressure: 50,
    emotion: "neutral",
  });

  const events: P5Event[] = [
    { type: "TRUST_DELTA", delta: 0.1 },
    { type: "SUSPICION_DELTA", delta: -0.05 },
    { type: "PRESSURE_DELTA", delta: 15 },
    { type: "EMOTION_SET", emotion: "engaged" },
  ];

  it("should produce the exact same state as direct execution", () => {
    const state = getState();

    // Direct execution
    const directResult = applyEvents(state, events);

    // Replay path: snapshot + journal
    const snapshot = createSnapshot(state, 0);
    let journal = createJournal();
    for (const event of events) {
      journal = appendEvent(journal, event);
    }
    const replayResult = replay(snapshot, journal);

    expect(replayResult).toEqual(directResult);
  });

  it("should handle replay with an empty journal", () => {
    const state = getState();
    const snapshot = createSnapshot(state, 0);
    const journal = createJournal();

    const result = replay(snapshot, journal);
    expect(result).toEqual(state);
  });

  it("should handle a long replay sequence", () => {
    const state = getState();
    const longEvents: P5Event[] = [];
    for (let i = 0; i < 100; i++) {
      longEvents.push({ type: "TRUST_DELTA", delta: 0.001 });
    }

    const directResult = applyEvents(state, longEvents);

    const snapshot = createSnapshot(state, 0);
    let journal = createJournal();
    for (const event of longEvents) {
      journal = appendEvent(journal, event);
    }
    const replayResult = replay(snapshot, journal);

    expect(replayResult.trust).toBeCloseTo(directResult.trust, 10);
    expect(replayResult.suspicion).toBe(directResult.suspicion);
    expect(replayResult.pressure).toBe(directResult.pressure);
    expect(replayResult.emotion).toBe(directResult.emotion);
  });

  it("should replay from a mid-execution snapshot", () => {
    const state = getState();
    const firstBatch: P5Event[] = [
      { type: "TRUST_DELTA", delta: 0.2 },
      { type: "PRESSURE_DELTA", delta: -10 },
    ];
    const secondBatch: P5Event[] = [
      { type: "SUSPICION_DELTA", delta: -0.1 },
      { type: "EMOTION_SET", emotion: "relaxed" },
    ];

    // Full direct execution
    const mid = applyEvents(state, firstBatch);
    const fullResult = applyEvents(mid, secondBatch);

    // Snapshot at mid-point, replay second batch
    const midSnapshot = createSnapshot(mid, 1000);
    let journal = createJournal();
    for (const event of secondBatch) {
      journal = appendEvent(journal, event);
    }
    const replayResult = replay(midSnapshot, journal);

    expect(replayResult).toEqual(fullResult);
  });
});
