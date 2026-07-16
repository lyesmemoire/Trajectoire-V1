// @ts-nocheck
import { buildDiffContext } from "../../src/replay/buildDiffContext";
import type { TickTrace } from "../../src/common/trace";

describe("buildDiffContext", () => {
  const createTick = (tickId: number, nodeId: string, isLeader: boolean): TickTrace => ({
    tickId,
    ts: Date.now(),
    nodeId,
    isLeader,
  });

  test("totalOldEvents exact: doit correspondre au calcul manuel", () => {
    // 3 events for oldTrace
    const oldTrace: TickTrace[] = [
      createTick(1, "node-1", true),
      createTick(1, "node-2", false),
      createTick(2, "node-1", true),
    ];
    
    // 2 events for newTrace
    const newTrace: TickTrace[] = [
      createTick(1, "node-1", true),
      createTick(2, "node-1", true),
    ];

    const context = buildDiffContext(oldTrace, newTrace);

    // Calcul manuel: 3 événements dans oldTrace
    const expectedTotal = oldTrace.length;

    expect(context.totalOldEvents).toBe(expectedTotal);
    // On vérifie que la valeur est bien 3 pour ce test
    expect(context.totalOldEvents).toBe(3);
  });

  test("Idempotence: deux appels consécutifs doivent produire un résultat strictement identique", () => {
    const oldTrace: TickTrace[] = [
      createTick(10, "node-1", true),
      createTick(20, "node-1", true),
    ];
    
    const newTrace: TickTrace[] = [
      createTick(10, "node-2", true), // Leader change
      createTick(20, "node-1", true),
      createTick(30, "node-1", true), // Inflation / missing in old
    ];

    const run1 = buildDiffContext(oldTrace, newTrace);
    const run2 = buildDiffContext(oldTrace, newTrace);

    // Les deux exécutions avec les mêmes entrées doivent être deep equal
    expect(run1).toEqual(run2);
  });
});
