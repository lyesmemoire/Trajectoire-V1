import { computeDriftVector } from "../../src/replay/driftVector";
import type { TickDiff } from "../../src/replay/diffTrace";

describe("computeDriftVector", () => {
  const makeDiff = (partial: Partial<TickDiff> & { tickId: number }): TickDiff => (
    {
      tickId: partial.tickId,
      leaderChange: partial.leaderChange,
      eventCountChange: partial.eventCountChange,
      missing: partial.missing,
    } as TickDiff
  );

  test("counts leader, inflation, regression, missing, changed ticks, eventDriftSum and propagates totalOldEvents", () => {
    // Build a diff array covering every case
    const diffs: TickDiff[] = [
      // Leader change on tick 1
      makeDiff({ tickId: 1, leaderChange: { old: "node-A", new: "node-B" } }),
      // Event inflation on tick 2 (old 1, new 3)
      makeDiff({ tickId: 2, eventCountChange: { old: 1, new: 3 } }),
      // Event regression on tick 3 (old 4, new 2)
      makeDiff({ tickId: 3, eventCountChange: { old: 4, new: 2 } }),
      // Missing tick in new trace (tick 4)
      makeDiff({ tickId: 4, missing: "new" }),
      // Missing tick in old trace (tick 5)
      makeDiff({ tickId: 5, missing: "old" }),
      // Tick with no change (tick 6) – should count as changed tick but no specific metric
      makeDiff({ tickId: 6 }),
    ];

    // totalOldEvents is the number of events in the old trace – we set 10 for the test
    const totalOldEvents = 10;

    const vector = computeDriftVector(diffs, totalOldEvents);

    // Assertions on aggregated counts
    expect(vector.leaderChanges).toBe(1);
    expect(vector.eventInflation).toBe(1);
    expect(vector.eventRegression).toBe(1);
    expect(vector.missingTicks).toBe(2);

    // eventDriftSum = |3-1| + |2-4| = 2 + 2 = 4 (missing and unchanged ticks contribute 0)
    expect(vector.eventDriftSum).toBe(4);
    expect(vector.totalOldEvents).toBe(10);

    // changed tick IDs should contain every tick that appears in diffs (including missing & unchanged)
    expect(vector.ticks.changed).toEqual([1, 2, 3, 4, 5, 6]);

    // verify per‑tick detail arrays contain the expected tick IDs
    expect(vector.ticks.leaderChange).toEqual([1]);
    expect(vector.ticks.eventInflation).toEqual([2]);
    expect(vector.ticks.eventRegression).toEqual([3]);
    expect(vector.ticks.missing).toEqual([4, 5]);
  });

  test("determinism: 100 executions produce identical JSON output", () => {
    const diffs: TickDiff[] = [
      makeDiff({ tickId: 1, leaderChange: { old: "A", new: "B" } }),
      makeDiff({ tickId: 2, eventCountChange: { old: 2, new: 5 } }),
      makeDiff({ tickId: 3, missing: "new" }),
    ];
    const totalOldEvents = 7;

    const first = JSON.stringify(computeDriftVector(diffs, totalOldEvents));
    for (let i = 0; i < 100; i++) {
      const next = JSON.stringify(computeDriftVector(diffs, totalOldEvents));
      expect(next).toBe(first);
    }
  });
});
