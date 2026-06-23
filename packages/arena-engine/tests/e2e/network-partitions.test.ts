import { describe, it, expect } from "vitest";
import { MultiWorldSimulator, SimulatedWorld } from "../helpers/MultiWorldSimulator";
import { FakeInfra } from "../../src/testing/FakeInfra";
import { LamportClock } from "../../src/distributed/causality/LamportClock";

function createSimpleWorld(id: number, infra: FakeInfra, sim: MultiWorldSimulator): SimulatedWorld {
  const clock = new LamportClock();
  const state = {
    receivedCounts: 0,
    lastReceivedFrom: -1,
    clock,
    history: [] as string[]
  };

  const world: SimulatedWorld = {
    id,
    infra,
    engine: { state },
    nextExecutionTime: null,
    inFlightMessages: [],

    receiveMessage(msg: any) {
      state.receivedCounts++;
      state.lastReceivedFrom = msg.from;
      clock.update(msg.message.lamportClock ?? 0);
      state.history.push(`Msg from ${msg.from} at L:${clock.get()}`);
    }
  };

  return world;
}

describe("Phase 7.3 — Network Partitions & Split-Brain", () => {
  it("A) Isolation Parfaite : inter-groupe bloqués, intra-groupe passent", () => {
    const sim = new MultiWorldSimulator(123);
    const worlds: SimulatedWorld[] = [];
    
    // Create 4 worlds
    for (let i = 0; i < 4; i++) {
      const world = createSimpleWorld(i, new FakeInfra(i), sim);
      sim.addWorld(world);
      worlds.push(world);
    }

    // Configure partition: [0, 1] vs [2, 3]
    sim.router.setPartitions([[0, 1], [2, 3]]);

    // Send messages
    // Intra-group (should pass)
    sim.router.send(0, 1, { lamportClock: 1 }, 10);
    sim.router.send(2, 3, { lamportClock: 1 }, 10);

    // Inter-group (should be trapped in partition backlog)
    sim.router.send(0, 2, { lamportClock: 2 }, 20);
    sim.router.send(3, 1, { lamportClock: 3 }, 20);

    sim.runUntil(100);

    // Verify intra-group passed
    expect(worlds[1].engine.state.receivedCounts).toBe(1);
    expect(worlds[3].engine.state.receivedCounts).toBe(1);

    // Verify inter-group blocked
    expect(worlds[2].engine.state.receivedCounts).toBe(0); // 0->2 blocked
    
    // Verify backlog contains exactly the 2 trapped messages
    const backlog = sim.router.getBacklog();
    expect(backlog.length).toBe(2);
    expect(backlog.some(b => b.from === 0 && b.to === 2)).toBe(true);
    expect(backlog.some(b => b.from === 3 && b.to === 1)).toBe(true);
  });

  it("B) Backlog & Snapshot : Forking preserves network partitions and backlog", () => {
    const sim = new MultiWorldSimulator(123);
    const worlds: SimulatedWorld[] = [];
    
    for (let i = 0; i < 4; i++) {
      const world = createSimpleWorld(i, new FakeInfra(i), sim);
      sim.addWorld(world);
      worlds.push(world);
    }

    sim.router.setPartitions([[0, 1], [2, 3]]);
    sim.router.send(0, 3, { lamportClock: 5 }, 15); // Trapped
    sim.runUntil(50);

    expect(sim.router.getBacklog().length).toBe(1);

    // Take snapshot of the entire simulator state
    const snapshot = sim.snapshotWorld(0); // This takes the global simulator state including backlog now

    // Fork simulator
    const forkedSim = new MultiWorldSimulator(123);
    
    for (let i = 0; i < 4; i++) {
      // Actually, our forkWorld API works on a single world.
      // But the backlog is restored globally when restoring the FIRST world.
      forkedSim.forkWorld(snapshot, i, (id, infra) => createSimpleWorld(id, infra, forkedSim));
    }

    // Verify backlog is perfectly restored
    expect(forkedSim.router.getBacklog().length).toBe(1);
    expect(forkedSim.router.getBacklog()[0].to).toBe(3);
    
    // Verify partitions config is restored
    expect(forkedSim.router.getPartitions()).toEqual([[0, 1], [2, 3]]);
  });

  it("C) Healing Déterministe : Healing flushes backlog with causal constraints", () => {
    const sim = new MultiWorldSimulator(456);
    const world0 = createSimpleWorld(0, new FakeInfra(0), sim);
    const world1 = createSimpleWorld(1, new FakeInfra(1), sim);
    sim.addWorld(world0);
    sim.addWorld(world1);

    sim.router.setPartitions([[0], [1]]);

    world0.engine.state.clock.update(10);
    
    // Send message during partition
    sim.router.send(0, 1, { lamportClock: 10 }, 50); // latency=50, enqueuedAt=0

    // Evolve time to 200ms
    sim.runUntil(200);

    expect(world1.engine.state.receivedCounts).toBe(0);
    expect(sim.router.getBacklog().length).toBe(1);

    // Heal partition
    sim.router.healPartition();

    // The message had enqueuedAt=0, latency=50. 
    // Healing at T=200 means deliverAt = Math.max(200, 0 + 50) = 200.
    // So the message is injected exactly AT current time (200), ensuring no time-travel.
    expect(sim.router.getBacklog().length).toBe(0);

    // Run just a little bit to process the injected message
    sim.runUntil(210);

    expect(world1.engine.state.receivedCounts).toBe(1);
    expect(world1.engine.state.clock.get()).toBe(11); // Lamport clock updated properly
  });
});
