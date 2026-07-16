// @ts-nocheck
// tests/replay/goldenScoring.test.ts
import { computeDistance } from "../../src/replay/goldenScoring";
import type { DriftCluster } from "../../src/replay/types";

describe("goldenScoring.computeDistance", () => {
  const makeCluster = (type: DriftCluster["type"], severity: number, ticks: number[]): DriftCluster => ({
    type,
    ticks,
    severity,
    count: ticks.length,
  });

  const clusters: DriftCluster[] = [
    makeCluster("leader_drift", 9, [1, 2]), // severity 9 (3*3)
    makeCluster("event_inflation", 2, [3]), // severity 2 (1*2)
    makeCluster("event_regression", 1, [4]), // severity 1 (1*1)
    makeCluster("missing_tick", 10, [5, 6]), // severity 10 (5*2)
  ];

  test("distance calculation and breakdown", () => {
    const { total, breakdown } = computeDistance(clusters);
    expect(total).toBe(22);
    expect(breakdown).toEqual({
      leader_drift: 9,
      event_inflation: 2,
      event_regression: 1,
      missing_tick: 10,
    });
  });

  test("deterministic ranking – same input yields identical output over many runs", () => {
    const iterations = 100;
    let firstResult: ReturnType<typeof computeDistance> | null = null;
    for (let i = 0; i < iterations; i++) {
      const result = computeDistance(clusters);
      if (i === 0) firstResult = result;
      else expect(result).toEqual(firstResult);
    }
  });
});
