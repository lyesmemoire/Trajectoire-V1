// @ts-nocheck
import { diffTraces } from "../../src/replay/diffTrace";
import type { TickTrace } from "../../src/common/trace";

describe("diffTraces", () => {
  const createTick = (tickId: number, nodeId: string, isLeader: boolean): TickTrace => ({
    tickId,
    ts: Date.now(),
    nodeId,
    isLeader,
  });

  test("Cas 1: Entrées identiques", () => {
    const traceA: TickTrace[] = [createTick(1, "node-1", true)];
    const traceB: TickTrace[] = [createTick(1, "node-1", true)];

    const diffs = diffTraces(traceA, traceB);
    const activeDiffs = diffs.filter(d => d.leaderChange || d.eventCountChange || d.missing);
    expect(activeDiffs.length).toBe(0);
  });

  test("Cas 2: Leader change", () => {
    const traceA: TickTrace[] = [createTick(1, "node-1", true)];
    const traceB: TickTrace[] = [createTick(1, "node-2", true)];

    const diffs = diffTraces(traceA, traceB);
    expect(diffs).toHaveLength(1);
    expect(diffs[0]!.leaderChange).toBeDefined();
    expect(diffs[0]!.leaderChange?.old).toBe("node-1");
    expect(diffs[0]!.leaderChange?.new).toBe("node-2");
  });

  test("Cas 3: Event inflation", () => {
    const traceA: TickTrace[] = [createTick(1, "node-1", true)];
    const traceB: TickTrace[] = [
      createTick(1, "node-1", true),
      createTick(1, "node-2", false),
    ];

    const diffs = diffTraces(traceA, traceB);
    expect(diffs).toHaveLength(1);
    expect(diffs[0]!.eventCountChange).toBeDefined();
    expect(diffs[0]!.eventCountChange?.old).toBe(1);
    expect(diffs[0]!.eventCountChange?.new).toBe(2);
    expect(diffs[0]!.eventCountChange!.new).toBeGreaterThan(diffs[0]!.eventCountChange!.old);
  });

  test("Cas 4: Event regression", () => {
    const traceA: TickTrace[] = [
      createTick(1, "node-1", true),
      createTick(1, "node-2", false),
    ];
    const traceB: TickTrace[] = [createTick(1, "node-1", true)];

    const diffs = diffTraces(traceA, traceB);
    expect(diffs).toHaveLength(1);
    expect(diffs[0]!.eventCountChange).toBeDefined();
    expect(diffs[0]!.eventCountChange?.old).toBe(2);
    expect(diffs[0]!.eventCountChange?.new).toBe(1);
    expect(diffs[0]!.eventCountChange!.new).toBeLessThan(diffs[0]!.eventCountChange!.old);
  });

  test("Cas 5: Missing tick", () => {
    // Missing in "new"
    const traceA: TickTrace[] = [createTick(1, "node-1", true)];
    const traceB: TickTrace[] = [];

    const diffs1 = diffTraces(traceA, traceB);
    expect(diffs1).toHaveLength(1);
    expect(diffs1[0]!.missing).toBe("new");

    // Missing in "old"
    const traceC: TickTrace[] = [];
    const traceD: TickTrace[] = [createTick(1, "node-1", true)];

    const diffs2 = diffTraces(traceC, traceD);
    expect(diffs2).toHaveLength(1);
    expect(diffs2[0]!.missing).toBe("old");
  });

  test("Cas 6: Deterministic ordering", () => {
    // We intentionally create events with unsorted tickIds
    // to verify that diffTraces outputs them sorted.
    const traceA: TickTrace[] = [
      createTick(10, "node-1", true),
      createTick(5, "node-1", true),
      createTick(3, "node-1", true),
      createTick(7, "node-1", true),
    ];
    // Create mismatch to ensure diffs are generated
    const traceB: TickTrace[] = [
      createTick(10, "node-2", true),
      createTick(5, "node-2", true),
      createTick(3, "node-2", true),
      createTick(7, "node-2", true),
    ];

    const diffs = diffTraces(traceA, traceB);
    expect(diffs).toHaveLength(4);
    
    // Map to an array of tickIds to easily check order
    const tickIds = diffs.map((d) => d.tickId);
    expect(tickIds).toEqual([3, 5, 7, 10]);
  });
});
