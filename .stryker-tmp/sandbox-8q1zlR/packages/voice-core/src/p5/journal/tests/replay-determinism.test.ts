// @ts-nocheck
import { describe, it, expect } from "vitest";
import { replay } from "../replay.js";
import { createJournal } from "../journal.js";
import { appendEvent } from "../append-event.js";
import { createSnapshot } from "../../snapshot/create-snapshot.js";
import { MindState, P5Event } from "../../execution-contract.js";

describe("replay — J4: Determinism", () => {
  it("should produce identical results for two identical replays", () => {
    const state: MindState = {
      trust: 0.3,
      suspicion: 0.7,
      pressure: 80,
      emotion: "tense",
    };

    const events: P5Event[] = [
      { type: "TRUST_DELTA", delta: 0.15 },
      { type: "SUSPICION_DELTA", delta: -0.2 },
      { type: "PRESSURE_DELTA", delta: -30 },
      { type: "EMOTION_SET", emotion: "calm" },
      { type: "TRUST_DELTA", delta: 0.05 },
    ];

    const snapshot = createSnapshot(state, 0);
    let journal = createJournal();
    for (const event of events) {
      journal = appendEvent(journal, event);
    }

    const a = replay(snapshot, journal);
    const b = replay(snapshot, journal);

    expect(a).toEqual(b);
  });

  it("should be deterministic across reconstructed journals", () => {
    const state: MindState = {
      trust: 0.5,
      suspicion: 0.5,
      pressure: 50,
      emotion: "neutral",
    };

    const events: P5Event[] = [
      { type: "TRUST_DELTA", delta: 0.1 },
      { type: "PRESSURE_DELTA", delta: 20 },
    ];

    const snapshot = createSnapshot(state, 0);

    // Build journal A
    let journalA = createJournal();
    for (const event of events) {
      journalA = appendEvent(journalA, event);
    }

    // Build journal B independently
    let journalB = createJournal();
    for (const event of events) {
      journalB = appendEvent(journalB, event);
    }

    expect(replay(snapshot, journalA)).toEqual(replay(snapshot, journalB));
  });
});
