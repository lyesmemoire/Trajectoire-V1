import { describe, it, expect } from "vitest";
import { MultiWorldSimulator, SimulatedWorld } from "../helpers/MultiWorldSimulator";
import { FakeInfra } from "../../src/testing/FakeInfra";
import { InterWorldMessage } from "../../src/distributed/network/types";

describe("Phase 7.1b — Deterministic Network Chaos", () => {

  // Helper: create a minimal world that logs received messages
  function createWorld(id: number, seed: number): { world: SimulatedWorld; receivedMessages: InterWorldMessage[] } {
    const infra = new FakeInfra(seed);
    const receivedMessages: InterWorldMessage[] = [];

    const world: SimulatedWorld = {
      id,
      infra,
      engine: {},
      nextExecutionTime: null,
      inFlightMessages: [],
      receiveMessage(msg: InterWorldMessage) {
        receivedMessages.push(msg);
      },
    };

    return { world, receivedMessages };
  }

  // ─────────────────────────────────────────────────────
  // A. Strict Determinism
  // ─────────────────────────────────────────────────────
  it("A) Déterminisme strict : Same seed -> same drops, reorders, duplicates", () => {
    function runChaosSim(networkSeed: number) {
      const sim = new MultiWorldSimulator(networkSeed);
      sim.router.setConfig({
        dropRate: 0.2,
        duplicationRate: 0.2,
        reorderRate: 0.2,
        maxJitterMs: 50
      });

      const { world: wA } = createWorld(0, 10);
      const { world: wB, receivedMessages: recv } = createWorld(1, 20);

      sim.addWorld(wA);
      sim.addWorld(wB);

      // Send 10 messages
      for (let i = 0; i < 10; i++) {
        sim.router.send(0, 1, { type: "MSG", payload: { seq: i } });
      }

      sim.runUntil(1000);

      // Return a compact representation of received messages
      return recv.map(m => ({ seq: m.message.payload.seq, deliverAt: m.deliverAt }));
    }

    const run1 = runChaosSim(42);
    const run2 = runChaosSim(42);
    const run3 = runChaosSim(99); // Different seed

    // Strict equality with the same seed
    expect(run1).toEqual(run2);

    // Chaos is active, so we should see duplicates, drops, or reorders compared to a linear list
    // And different seeds produce different outcomes
    expect(run1).not.toEqual(run3);

    // Ensure some chaos actually happened (at least a drop or duplication or out-of-order)
    const isLinear = run1.length === 10 && run1.every((m, i) => m.seq === i);
    expect(isLinear).toBe(false);
  });

  // ─────────────────────────────────────────────────────
  // B. Snapshot in flight with Duplication & Reorder
  // ─────────────────────────────────────────────────────
  it("B) Snapshot en vol : captures duplicated and reordered messages", () => {
    const sim = new MultiWorldSimulator(42);
    sim.router.setConfig({
      duplicationRate: 1.0, // Force duplication for test
      reorderRate: 1.0,     // Force reorder for test
      maxJitterMs: 100
    });

    const { world: worldA } = createWorld(0, 10);
    const { world: worldB, receivedMessages: recvB } = createWorld(1, 20);

    sim.addWorld(worldA);
    sim.addWorld(worldB);

    // Send a message. It should be duplicated and reordered
    sim.router.send(0, 1, { type: "CHAOS", payload: {} }, 100);

    // At t=50, it is still in flight
    sim.runUntil(50);
    expect(recvB.length).toBe(0);

    // Because of duplicationRate = 1.0, there should be 2 in-flight messages
    expect(worldB.inFlightMessages!.length).toBe(2);

    // Snapshot B
    const snapshot = sim.snapshotWorld(1);
    expect(snapshot.networkInFlightMessages!.length).toBe(2);

    // Restore into a new simulation fork
    const recvC: InterWorldMessage[] = [];
    const worldC = sim.forkWorld(snapshot, 2, (id, infra) => ({
      id,
      infra,
      engine: {},
      nextExecutionTime: null,
      inFlightMessages: [],
      receiveMessage(msg: InterWorldMessage) {
        recvC.push(msg);
      },
    }));

    sim.runUntil(1000);

    // B should have received the 2 duplicated messages
    expect(recvB.length).toBe(2);
    expect(recvB[0].message.type).toBe("CHAOS");
    expect(recvB[1].message.type).toBe("CHAOS");

    // C should have also received the 2 duplicated messages at the exact same logical times
    expect(recvC.length).toBe(2);
    expect(recvC[0].message.type).toBe("CHAOS");
    expect(recvC[1].message.type).toBe("CHAOS");

    expect(recvC[0].deliverAt).toBe(recvB[0].deliverAt);
    expect(recvC[1].deliverAt).toBe(recvB[1].deliverAt);
  });

  // ─────────────────────────────────────────────────────
  // C. Stress Test (O(E log W))
  // ─────────────────────────────────────────────────────
  it("C) Stress test : 1000 mondes avec chaos (Performance)", () => {
    const sim = new MultiWorldSimulator(1234);
    sim.router.setConfig({
      dropRate: 0.1,
      duplicationRate: 0.1,
      reorderRate: 0.1,
      maxJitterMs: 50
    });

    // Create 1000 worlds
    for (let i = 0; i < 1000; i++) {
      const { world } = createWorld(i, i * 10);
      
      // Each world sends a message to the next world at t=0, t=10, t=20 ... t=90
      for (let t = 0; t < 100; t += 10) {
        world.infra.timer.scheduleAtAbsolute(t, () => {
          sim.router.send(i, (i + 1) % 1000, { type: "STRESS", payload: { step: t } }, 10);
        });
      }

      sim.addWorld(world);
    }

    // Run for 150ms. 
    // This generates 1000 * 10 = 10,000 base send events
    // Plus the network router events. Total should be ~20-30k events.
    sim.runUntil(150);

    console.log(`[Chaos Stress Test] Events processed: ${sim.stats.eventsProcessed}, Wall time: ${sim.stats.wallClockMs.toFixed(2)}ms`);

    // The execution should be extremely fast (O(E log W)).
    // A budget of 5s is given by requirements, but it should realistically be < 200ms.
    expect(sim.stats.wallClockMs).toBeLessThan(5000);
    expect(sim.stats.eventsProcessed).toBeGreaterThan(15000); 
  });

  // ─────────────────────────────────────────────────────
  // D. Isolation (WorldRandom Unchanged)
  // ─────────────────────────────────────────────────────
  it("D) Isolation : Le chaos réseau ne doit jamais altérer worldRandom", () => {
    const runSim = (chaosEnabled: boolean) => {
      const sim = new MultiWorldSimulator(42);
      if (chaosEnabled) {
        sim.router.setConfig({
          dropRate: 0.5,
          duplicationRate: 0.5,
          maxJitterMs: 100
        });
      }

      const { world: wA } = createWorld(0, 100);
      const { world: wB } = createWorld(1, 200);

      // World A consumes local random, then sends a message
      let localRandomA1 = 0;
      let localRandomA2 = 0;
      let localRandomB = 0;

      wA.infra.timer.scheduleAtAbsolute(10, () => {
        localRandomA1 = wA.infra.random.next();
        sim.router.send(0, 1, { type: "MSG", payload: {} });
        localRandomA2 = wA.infra.random.next();
      });

      // World B consumes local random when receiving
      wB.receiveMessage = () => {
        localRandomB = wB.infra.random.next();
      };

      sim.addWorld(wA);
      sim.addWorld(wB);

      sim.runUntil(1000);

      return { localRandomA1, localRandomA2, localRandomB };
    };

    const withoutChaos = runSim(false);
    const withChaos = runSim(true);

    // Chaos should not affect the local random streams
    expect(withChaos.localRandomA1).toBe(withoutChaos.localRandomA1);
    expect(withChaos.localRandomA2).toBe(withoutChaos.localRandomA2);
    
    // Note: localRandomB might be different ONLY IF chaos drops or duplicates the message
    // so we only check World A's local random state which shouldn't be affected by whether
    // the network router consumed more random numbers.
    // The requirement states: "Le chaos réseau ne doit jamais altérer worldRandom"
    // which holds true because NetworkRouter uses sim.networkRandom exclusively.
  });

});
