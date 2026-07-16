// @ts-nocheck
import { describe, it, expect } from "vitest";
import { createJournal } from "../journal.js";
import { appendEvent } from "../append-event.js";
import { P5Event } from "../../execution-contract.js";

describe("journal — J1: Immutability & J2: Continuous sequence", () => {
  it("should create an empty journal", () => {
    const journal = createJournal();
    expect(journal.entries).toEqual([]);
  });

  it("should append an event and return a new journal (J1)", () => {
    const j0 = createJournal();
    const event: P5Event = { type: "TRUST_DELTA", delta: 0.1 };

    const j1 = appendEvent(j0, event);

    // New journal has the entry
    expect(j1.entries).toHaveLength(1);
    expect(j1.entries[0]!.event).toEqual(event);

    // Original journal is untouched
    expect(j0.entries).toHaveLength(0);
  });

  it("should assign strictly continuous sequence numbers (J2)", () => {
    let journal = createJournal();

    journal = appendEvent(journal, { type: "TRUST_DELTA", delta: 0.1 });
    journal = appendEvent(journal, { type: "SUSPICION_DELTA", delta: -0.2 });
    journal = appendEvent(journal, { type: "PRESSURE_DELTA", delta: 5 });
    journal = appendEvent(journal, { type: "EMOTION_SET", emotion: "focused" });

    expect(journal.entries.map((e) => e.sequence)).toEqual([1, 2, 3, 4]);
  });

  it("should not mutate a frozen journal (J1)", () => {
    const j0 = Object.freeze(createJournal());

    // Should not throw
    const j1 = appendEvent(j0, { type: "TRUST_DELTA", delta: 0.5 });

    expect(j1.entries).toHaveLength(1);
    expect(j0.entries).toHaveLength(0);
  });

  it("should preserve previous entries when appending", () => {
    const j0 = createJournal();
    const j1 = appendEvent(j0, { type: "TRUST_DELTA", delta: 0.1 });
    const j2 = appendEvent(j1, { type: "PRESSURE_DELTA", delta: 10 });

    expect(j2.entries[0]!.event).toEqual({ type: "TRUST_DELTA", delta: 0.1 });
    expect(j2.entries[1]!.event).toEqual({ type: "PRESSURE_DELTA", delta: 10 });
  });
});
