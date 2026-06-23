import { describe, it, expect } from "vitest";
import { MultiWorldSimulator, SimulatedWorld, NetworkRouter } from "../helpers/MultiWorldSimulator";
import { FakeInfra } from "../../src/testing/FakeInfra";
import { InterWorldMessage } from "../../src/distributed/network/types";

describe("Phase 7.1 — Distributed Causality", () => {

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
  // 1. Basic routing: A → B with deterministic latency
  // ─────────────────────────────────────────────────────
  it("routes a message from World A to World B with deterministic latency", () => {
    const sim = new MultiWorldSimulator(42);

    const { world: worldA, receivedMessages: recvA } = createWorld(0, 100);
    const { world: worldB, receivedMessages: recvB } = createWorld(1, 200);

    sim.addWorld(worldA);
    sim.addWorld(worldB);

    // World A sends a message to World B at t=0
    sim.router.send(0, 1, { type: "PING", payload: { value: 42 } });

    // The message should not be received yet (latency > 0)
    expect(recvB.length).toBe(0);
    expect(worldB.inFlightMessages!.length).toBe(1);

    // Advance past the delivery time
    sim.runUntil(200);

    // Message should now be delivered
    expect(recvB.length).toBe(1);
    expect(recvB[0].message.type).toBe("PING");
    expect(recvB[0].message.payload.value).toBe(42);
    expect(recvB[0].from).toBe(0);
    expect(recvB[0].to).toBe(1);

    // In-flight list should be cleared
    expect(worldB.inFlightMessages!.length).toBe(0);

    // World A should have received nothing
    expect(recvA.length).toBe(0);
  });

  // ─────────────────────────────────────────────────────
  // 2. Chain: A → B → C (causal ordering)
  // ─────────────────────────────────────────────────────
  it("supports causal chains: A → B → C", () => {
    const sim = new MultiWorldSimulator(77);

    const { world: worldA, receivedMessages: recvA } = createWorld(0, 10);
    const { world: worldB, receivedMessages: recvB } = createWorld(1, 20);
    const { world: worldC, receivedMessages: recvC } = createWorld(2, 30);

    sim.addWorld(worldA);
    sim.addWorld(worldB);
    sim.addWorld(worldC);

    // B forwards to C when it receives from A
    worldB.receiveMessage = (msg: InterWorldMessage) => {
      recvB.push(msg);
      // On reception, B sends to C
      sim.router.send(1, 2, { type: "FORWARD", payload: { original: msg.message.payload } });
    };

    // A sends to B at t=0
    sim.router.send(0, 1, { type: "HELLO", payload: { step: 1 } });

    sim.runUntil(500);

    // B received from A
    expect(recvB.length).toBe(1);
    expect(recvB[0].message.type).toBe("HELLO");

    // C received the forward from B
    expect(recvC.length).toBe(1);
    expect(recvC[0].message.type).toBe("FORWARD");
    expect(recvC[0].message.payload.original.step).toBe(1);

    // Causal ordering: C received AFTER B
    expect(recvC[0].deliverAt).toBeGreaterThan(recvB[0].deliverAt);
  });

  // ─────────────────────────────────────────────────────
  // 3. Determinism: same seed → same delivery times
  // ─────────────────────────────────────────────────────
  it("is fully deterministic: same network seed → identical delivery times", () => {
    function runSimulation(networkSeed: number) {
      const sim = new MultiWorldSimulator(networkSeed);
      sim.router.setConfig({ maxJitterMs: 100 });

      const { world: wA } = createWorld(0, 10);
      const { world: wB, receivedMessages: recv } = createWorld(1, 20);

      sim.addWorld(wA);
      sim.addWorld(wB);

      // Send 5 messages
      for (let i = 0; i < 5; i++) {
        sim.router.send(0, 1, { type: "MSG", payload: { seq: i } });
      }

      sim.runUntil(1000);

      return recv.map(m => ({ deliverAt: m.deliverAt, seq: m.message.payload.seq }));
    }

    const run1 = runSimulation(555);
    const run2 = runSimulation(555);
    const run3 = runSimulation(999); // different seed

    // Same seed → bit-perfect identical
    expect(run1).toEqual(run2);

    // Different seed → different delivery schedule
    const times1 = run1.map(r => r.deliverAt);
    const times3 = run3.map(r => r.deliverAt);
    expect(times1).not.toEqual(times3);
  });

  // ─────────────────────────────────────────────────────
  // 4. Network messages interact with local timers
  // ─────────────────────────────────────────────────────
  it("correctly interleaves network messages with local timer events", () => {
    const sim = new MultiWorldSimulator(42);
    const log: string[] = [];

    const { world: worldA } = createWorld(0, 10);
    const { world: worldB } = createWorld(1, 20);

    sim.addWorld(worldA);
    sim.addWorld(worldB);

    // B has a local timer event at t=50
    worldB.infra.timer.scheduleAtAbsolute(50, () => {
      log.push("B:LOCAL:50");
    });

    // B has a local timer event at t=150
    worldB.infra.timer.scheduleAtAbsolute(150, () => {
      log.push("B:LOCAL:150");
    });

    // A sends a message to B. The delivery time depends on the network seed.
    // With seed=42, we can check the actual delivery time.
    sim.router.send(0, 1, { type: "NET", payload: {} });
    const deliverAt = worldB.inFlightMessages![0].deliverAt;

    worldB.receiveMessage = (msg) => {
      log.push(`B:NET:${msg.deliverAt}`);
    };

    sim.runUntil(300);

    // Verify ordering: events should be in chronological order
    expect(log.length).toBe(3);

    // The local events at 50 and 150, plus the network event
    // All should appear in their correct temporal order
    const expectedOrder = [50, deliverAt, 150].sort((a, b) => a - b);
    for (let i = 0; i < log.length - 1; i++) {
      const currentTime = parseInt(log[i].split(":")[2]);
      const nextTime = parseInt(log[i + 1].split(":")[2]);
      expect(currentTime).toBeLessThanOrEqual(nextTime);
    }
  });

  // ─────────────────────────────────────────────────────
  // 5. Snapshot + Fork preserves in-flight messages
  // ─────────────────────────────────────────────────────
  it("snapshot preserves in-flight messages and fork delivers them correctly", () => {
    const sim = new MultiWorldSimulator(42);

    const { world: worldA } = createWorld(0, 10);
    const { world: worldB, receivedMessages: recvB } = createWorld(1, 20);

    sim.addWorld(worldA);
    sim.addWorld(worldB);

    // Send a message with high latency so it's still in-flight at snapshot time
    sim.router.send(0, 1, { type: "SLOW_MSG", payload: { data: "hello" } }, 500);
    const originalDeliverAt = worldB.inFlightMessages![0].deliverAt;

    // Advance to just before delivery: message should still be in-flight
    sim.runUntil(originalDeliverAt - 1);
    expect(recvB.length).toBe(0);
    expect(worldB.inFlightMessages!.length).toBe(1);

    // Snapshot world B
    const snapshot = sim.snapshotWorld(1);
    expect(snapshot.networkInFlightMessages).toBeDefined();
    expect(snapshot.networkInFlightMessages!.length).toBe(1);
    expect(snapshot.networkInFlightMessages![0].message.type).toBe("SLOW_MSG");

    // Fork world B into world C
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

    // Advance to well past delivery time
    sim.runUntil(1000);

    // Both B and C should have received the message
    expect(recvB.length).toBe(1);
    expect(recvB[0].message.type).toBe("SLOW_MSG");

    expect(recvC.length).toBe(1);
    expect(recvC[0].message.type).toBe("SLOW_MSG");

    // Both should have received at the same logical time
    expect(recvC[0].deliverAt).toBe(originalDeliverAt);
    expect(recvB[0].deliverAt).toBe(originalDeliverAt);
  });

  // ─────────────────────────────────────────────────────
  // 6. Network isolation: messages don't leak between worlds
  // ─────────────────────────────────────────────────────
  it("messages are isolated: sending to B does not affect C", () => {
    const sim = new MultiWorldSimulator(42);

    const { world: worldA } = createWorld(0, 10);
    const { world: worldB, receivedMessages: recvB } = createWorld(1, 20);
    const { world: worldC, receivedMessages: recvC } = createWorld(2, 30);

    sim.addWorld(worldA);
    sim.addWorld(worldB);
    sim.addWorld(worldC);

    // Send only to B
    sim.router.send(0, 1, { type: "PRIVATE", payload: {} });

    sim.runUntil(500);

    expect(recvB.length).toBe(1);
    expect(recvC.length).toBe(0);
  });

  // ─────────────────────────────────────────────────────
  // 7. Tie-breaker: simultaneous events have stable ordering
  // ─────────────────────────────────────────────────────
  it("tie-breaker: events at the same logical time execute in stable order", () => {
    const sim = new MultiWorldSimulator(42);
    const log: string[] = [];

    const infra = new FakeInfra(10);
    const world: SimulatedWorld = {
      id: 0,
      infra,
      engine: {},
      nextExecutionTime: null,
      inFlightMessages: [],
    };

    sim.addWorld(world);

    // Schedule 3 events all at t=100
    infra.timer.scheduleAtAbsolute(100, () => log.push("first"));
    infra.timer.scheduleAtAbsolute(100, () => log.push("second"));
    infra.timer.scheduleAtAbsolute(100, () => log.push("third"));

    sim.runUntil(200);

    // They should execute in insertion order (stable tie-breaker by id)
    expect(log).toEqual(["first", "second", "third"]);

    // Run again with same setup to verify determinism
    const log2: string[] = [];
    const infra2 = new FakeInfra(10);
    const world2: SimulatedWorld = {
      id: 0,
      infra: infra2,
      engine: {},
      nextExecutionTime: null,
      inFlightMessages: [],
    };

    const sim2 = new MultiWorldSimulator(42);
    sim2.addWorld(world2);

    infra2.timer.scheduleAtAbsolute(100, () => log2.push("first"));
    infra2.timer.scheduleAtAbsolute(100, () => log2.push("second"));
    infra2.timer.scheduleAtAbsolute(100, () => log2.push("third"));

    sim2.runUntil(200);

    expect(log2).toEqual(log);
  });

  // ─────────────────────────────────────────────────────
  // 8. Concurrent send: stable ordering and bit-perfect determinism
  // ─────────────────────────────────────────────────────
  it("concurrent send: multiple worlds sending to C with the same deliverAt execute in stable order", () => {
    function runConcurrentSim(seed: number) {
      const sim = new MultiWorldSimulator(seed);
      const log: string[] = [];

      const { world: worldA } = createWorld(0, 10);
      const { world: worldB } = createWorld(1, 20);
      const { world: worldC } = createWorld(2, 30);

      sim.addWorld(worldA);
      sim.addWorld(worldB);
      sim.addWorld(worldC);

      worldC.receiveMessage = (msg) => {
        log.push(`${msg.from}->C:${msg.message.payload.data}`);
      };

      // We need to bypass the router's base latency randomness for this test 
      // to ensure the EXACT same deliverAt for both messages.
      const deliverAt = 50;

      // Mock the send to enforce identical deliverAt
      const msgA = {
        id: "msg_concurrent_A",
        from: 0,
        to: 2,
        message: { type: "MSG", payload: { data: "from_A" } },
        deliverAt
      };
      
      const msgB = {
        id: "msg_concurrent_B",
        from: 1,
        to: 2,
        message: { type: "MSG", payload: { data: "from_B" } },
        deliverAt
      };

      worldC.inFlightMessages!.push(msgA);
      worldC.infra.timer.scheduleAtAbsolute(deliverAt, () => {
        worldC.inFlightMessages = worldC.inFlightMessages!.filter(m => m.id !== msgA.id);
        worldC.receiveMessage!(msgA);
      });

      worldC.inFlightMessages!.push(msgB);
      worldC.infra.timer.scheduleAtAbsolute(deliverAt, () => {
        worldC.inFlightMessages = worldC.inFlightMessages!.filter(m => m.id !== msgB.id);
        worldC.receiveMessage!(msgB);
      });

      sim.runUntil(100);
      return log;
    }

    const log1 = runConcurrentSim(42);
    const log2 = runConcurrentSim(42);

    // Should process in the exact order they were scheduled in the FakeTimer
    expect(log1).toEqual(["0->C:from_A", "1->C:from_B"]);
    // Determinism: same seed produces identical log
    expect(log1).toEqual(log2);
  });
});
