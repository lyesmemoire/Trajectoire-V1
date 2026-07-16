// @ts-nocheck
import { clusterDiffs } from "../../src/replay/clusterDiffs";
import type { TickDiff } from "../../src/replay/diffTrace";

describe("clusterDiffs", () => {
  const makeDiff = (partial: Partial<TickDiff> & { tickId: number }): TickDiff =>
    ({
      tickId: partial.tickId,
      leaderChange: partial.leaderChange,
      eventCountChange: partial.eventCountChange,
      missing: partial.missing,
    } as TickDiff);

  const diffs: TickDiff[] = [
    // leader drift on tick 1
    makeDiff({ tickId: 1, leaderChange: { old: "A", new: "B" } }),
    // event inflation on tick 2
    makeDiff({ tickId: 2, eventCountChange: { old: 1, new: 4 } }),
    // event regression on tick 3
    makeDiff({ tickId: 3, eventCountChange: { old: 5, new: 2 } }),
    // missing tick on tick 4 (new missing)
    makeDiff({ tickId: 4, missing: "new" }),
    // also missing old on tick 5
    makeDiff({ tickId: 5, missing: "old" }),
    // another leader drift on tick 6 (to test multiple ticks in same cluster)
    makeDiff({ tickId: 6, leaderChange: { old: "B", new: "C" } }),
  ];

  test("produces correct clusters for each category with deterministic ordering", () => {
    const clusters = clusterDiffs(diffs);

    // Expected order based on severity: missing_tick (weight 5) > leader_drift (weight 3) > event_inflation (1) > event_regression (1)
    expect(clusters.map(c => c.type)).toEqual([
      "missing_tick",
      "leader_drift",
      "event_inflation",
      "event_regression",
    ]);

    // Verify content of each cluster
    const missing = clusters.find(c => c.type === "missing_tick")!;
    expect(missing.ticks).toEqual([4, 5]); // sorted
    expect(missing.count).toBe(2);
    expect(missing.severity).toBe(2 * 5); // weight 5 per tick

    const leader = clusters.find(c => c.type === "leader_drift")!;
    expect(leader.ticks).toEqual([1, 6]);
    expect(leader.count).toBe(2);
    expect(leader.severity).toBe(2 * 3);

    const infl = clusters.find(c => c.type === "event_inflation")!;
    expect(infl.ticks).toEqual([2]);
    expect(infl.count).toBe(1);
    expect(infl.severity).toBe(1 * 1);

    const reg = clusters.find(c => c.type === "event_regression")!;
    expect(reg.ticks).toEqual([3]);
    expect(reg.count).toBe(1);
    expect(reg.severity).toBe(1 * 1);
  });

  test("deterministic output across multiple executions", () => {
    const first = JSON.stringify(clusterDiffs(diffs));
    for (let i = 0; i < 100; i++) {
      const next = JSON.stringify(clusterDiffs(diffs));
      expect(next).toBe(first);
    }
  });
});
