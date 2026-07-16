// @ts-nocheck
import { makeFingerprint } from "../../src/replay/fingerprint";
import type { TickDiff } from "../../src/replay/diffTrace";

describe("makeFingerprint", () => {
  const makeDiff = (partial: Partial<TickDiff> & { tickId: number }): TickDiff =>
    ({
      tickId: partial.tickId,
      leaderChange: partial.leaderChange,
      eventCountChange: partial.eventCountChange,
      missing: partial.missing,
    } as TickDiff);

  test("Empty diff → no changes, eventDrift === 0", () => {
    const fingerprint = makeFingerprint([], 0);
    expect(fingerprint.changedTicks).toEqual([]);
    expect(fingerprint.leaderChanges).toBe(0);
    expect(fingerprint.eventDrift).toBe(0);
  });

  test("Leader drift is counted", () => {
    const diffs: TickDiff[] = [
      makeDiff({ tickId: 1, leaderChange: { old: "A", new: "B" } }),
    ];
    const fp = makeFingerprint(diffs, 5);
    expect(fp.leaderChanges).toBe(1);
    expect(fp.changedTicks).toEqual([1]);
  });

  test("Event drift normalization with precise rounding", () => {
    const diffs: TickDiff[] = [
      // diff of 3 (|4-1|) and 2 (|5-3|) → sum = 5
      makeDiff({ tickId: 2, eventCountChange: { old: 1, new: 4 } }),
      makeDiff({ tickId: 3, eventCountChange: { old: 3, new: 5 } }),
    ];
    const totalOldEvents = 10;
    const fp = makeFingerprint(diffs, totalOldEvents);
    // Expected drift = 5 / 10 = 0.5 → rounded to 4 decimals => 0.5
    expect(fp.eventDrift).toBeCloseTo(0.5);
    // Ensure changedTicks includes both IDs and is sorted
    expect(fp.changedTicks).toEqual([2, 3]);
  });

  test("Purity: 100 executions produce identical fingerprint", () => {
    const diffs: TickDiff[] = [
      makeDiff({ tickId: 1, leaderChange: { old: "A", new: "B" } }),
      makeDiff({ tickId: 2, eventCountChange: { old: 2, new: 5 } }),
      makeDiff({ tickId: 3, missing: "new" }),
    ];
    const totalOldEvents = 7;
    const first = JSON.stringify(makeFingerprint(diffs, totalOldEvents));
    for (let i = 0; i < 100; i++) {
      const next = JSON.stringify(makeFingerprint(diffs, totalOldEvents));
      expect(next).toBe(first);
    }
  });
});
