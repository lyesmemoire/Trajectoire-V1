import { describe, it, expect } from "vitest";
import { MultiWorldSimulator, SimulatedWorld } from "../helpers/MultiWorldSimulator";
import { FakeInfra } from "../../src/testing/FakeInfra";
import { InterWorldMessage } from "../../src/distributed/network/types";
import { LamportClock } from "../../src/distributed/causality/LamportClock";
import { WorldSnapshot } from "../../src/ports/ISnapshot";

describe("Phase 7.2 — Lamport Clocks Causality", () => {

  interface LamportWorld extends SimulatedWorld {
    clock: LamportClock;
    processedEvents: Array<{ type: string, logicalTime: number }>;
  }

  function createLamportWorld(id: number, seed: number): LamportWorld {
    const infra = new FakeInfra(seed);
    const clock = new LamportClock();
    const processedEvents: Array<{ type: string, logicalTime: number }> = [];

    const world: LamportWorld = {
      id,
      infra,
      engine: {},
      nextExecutionTime: null,
      inFlightMessages: [],
      clock,
      processedEvents,
      
      receiveMessage(msg: InterWorldMessage) {
        // 1. Update clock based on received message
        const receivedTime = msg.message.lamportClock ?? 0;
        const newTime = clock.update(receivedTime);
        
        // 2. Process event
        processedEvents.push({ type: msg.message.type, logicalTime: newTime });
      },

      serialize(): any {
        return {
          id: this.id,
          logicalTime: this.infra.clock.now(),
          randomState: this.infra.random.getInternalState(),
          state: { lamportClock: clock.get() },
          networkInFlightMessages: structuredClone(this.inFlightMessages),
        };
      },

      restore(snapshot: WorldSnapshot) {
        this.clock.set(snapshot.state.lamportClock);
        this.inFlightMessages = structuredClone(snapshot.networkInFlightMessages || []);
      }
    };

    return world;
  }

  // ─────────────────────────────────────────────────────
  // A. Strict Causal Chain
  // ─────────────────────────────────────────────────────
  it("A) Chaîne causale stricte : A → B → C garantit timestampA < timestampB < timestampC", () => {
    const sim = new MultiWorldSimulator(42);
    
    const wA = createLamportWorld(0, 10);
    const wB = createLamportWorld(1, 20);
    const wC = createLamportWorld(2, 30);

    sim.addWorld(wA);
    sim.addWorld(wB);
    sim.addWorld(wC);

    // B forwards to C when it receives from A
    wB.receiveMessage = (msg: InterWorldMessage) => {
      const receivedTime = msg.message.lamportClock ?? 0;
      wB.clock.update(receivedTime);
      wB.processedEvents.push({ type: msg.message.type, logicalTime: wB.clock.get() });

      // Forward to C
      wB.clock.tick();
      sim.router.send(1, 2, { 
        type: "FORWARD", 
        payload: {}, 
        lamportClock: wB.clock.get() 
      }, 50);
    };

    // A sends to B
    wA.clock.tick();
    sim.router.send(0, 1, { 
      type: "HELLO", 
      payload: {}, 
      lamportClock: wA.clock.get() 
    }, 50);

    sim.runUntil(500);

    // Verify clock states
    expect(wA.clock.get()).toBe(1); // 1 tick for sending
    expect(wB.clock.get()).toBe(3); // 2 (update from A=1) + 1 (tick for sending) = 3
    expect(wC.clock.get()).toBe(4); // 4 (update from B=3)

    const eventB = wB.processedEvents[0];
    const eventC = wC.processedEvents[0];

    // Happened-before causal chain
    // Send_A (1) < Recv_B (2) < Send_B (3) < Recv_C (4)
    expect(eventB.logicalTime).toBe(2);
    expect(eventC.logicalTime).toBe(4);
    expect(eventB.logicalTime).toBeLessThan(eventC.logicalTime);
  });

  // ─────────────────────────────────────────────────────
  // B. Concurrent Messages
  // ─────────────────────────────────────────────────────
  it("B) Messages concurrents : A et B envoient à C sans relation", () => {
    const sim = new MultiWorldSimulator(42);
    
    const wA = createLamportWorld(0, 10);
    const wB = createLamportWorld(1, 20);
    const wC = createLamportWorld(2, 30);

    sim.addWorld(wA);
    sim.addWorld(wB);
    sim.addWorld(wC);

    // A and B do some local work
    wA.clock.tick(); wA.clock.tick(); // wA is at 2
    wB.clock.tick(); // wB is at 1

    // A sends to C
    wA.clock.tick(); // A=3
    sim.router.send(0, 2, { type: "FROM_A", payload: {}, lamportClock: wA.clock.get() }, 50);

    // B sends to C
    wB.clock.tick(); // B=2
    sim.router.send(1, 2, { type: "FROM_B", payload: {}, lamportClock: wB.clock.get() }, 50);

    sim.runUntil(500);

    // C should receive both messages. Since deliverAt is identical, the order depends on tie-breaker.
    expect(wC.processedEvents.length).toBe(2);

    const event1 = wC.processedEvents[0];
    const event2 = wC.processedEvents[1];

    // Since they are concurrent, the logical clock of C simply advances monotonically
    expect(event1.logicalTime).toBeLessThan(event2.logicalTime);
    expect(event1.logicalTime).toBeGreaterThanOrEqual(2); // Since B=2, A=3

    // Specifically, if A arrives first: C updates to max(0, 3) + 1 = 4. 
    // Then B arrives: C updates to max(4, 2) + 1 = 5.
    // If B arrives first: C updates to max(0, 2) + 1 = 3. 
    // Then A arrives: C updates to max(3, 3) + 1 = 4.
    // Both sequences guarantee strictly monotonic local progression.
    expect(event1.logicalTime).toBeGreaterThan(0);
    expect(event2.logicalTime).toBeGreaterThan(event1.logicalTime);
  });

  // ─────────────────────────────────────────────────────
  // C. Chaos + Lamport
  // ─────────────────────────────────────────────────────
  it("C) Chaos + Lamport : Les timestamps ne doivent jamais décroître même avec reorder/duplication", () => {
    const sim = new MultiWorldSimulator(42);
    sim.router.setConfig({
      duplicationRate: 0.5,
      reorderRate: 0.5,
      maxJitterMs: 100
    });
    
    const wA = createLamportWorld(0, 10);
    const wB = createLamportWorld(1, 20);

    sim.addWorld(wA);
    sim.addWorld(wB);

    // A sends 10 sequential messages to B
    for(let i=0; i<10; i++) {
      wA.infra.timer.scheduleAtAbsolute(i * 10, () => {
        wA.clock.tick();
        sim.router.send(0, 1, { type: "MSG", payload: { seq: i }, lamportClock: wA.clock.get() }, 10);
      });
    }

    sim.runUntil(500);

    // B should have received messages, potentially out of order or duplicated
    expect(wB.processedEvents.length).toBeGreaterThanOrEqual(10); // Since duplication is possible

    // VERIFY INVARIANT: LamportClock.value is strictly monotonic within a world.
    let prevLogicalTime = -1;
    for (const evt of wB.processedEvents) {
      expect(evt.logicalTime).toBeGreaterThan(prevLogicalTime);
      prevLogicalTime = evt.logicalTime;
    }
  });

  // ─────────────────────────────────────────────────────
  // D. Snapshot + Fork
  // ─────────────────────────────────────────────────────
  it("D) Snapshot + Fork : conserve le logicalClock et la progression future", () => {
    const sim = new MultiWorldSimulator(42);
    sim.router.setConfig({ maxJitterMs: 50, reorderRate: 1.0 });
    
    const wA = createLamportWorld(0, 10);
    const wB = createLamportWorld(1, 20);

    sim.addWorld(wA);
    sim.addWorld(wB);

    wA.clock.tick(); wA.clock.tick();
    wB.clock.tick();
    
    // A sends to B (will have high latency due to reorderRate=1.0)
    wA.clock.tick();
    sim.router.send(0, 1, { type: "DELAYED", payload: {}, lamportClock: wA.clock.get() }, 200);

    sim.runUntil(100);

    // Snapshot B while the message is still in flight
    const snapshotB = wB.serialize!();
    expect(snapshotB.state.lamportClock).toBe(1); // B only ticked once

    // Fork B into C
    const wC = sim.forkWorld(snapshotB, 2, (id, infra) => {
      const world = createLamportWorld(id, 20);
      world.infra = infra; // Ensure it uses the forked infra
      return world;
    }) as ReturnType<typeof createLamportWorld>;

    expect(wC.clock.get()).toBe(1);

    sim.runUntil(500);

    // Both B and C should receive the delayed message and update their clocks
    expect(wB.processedEvents.length).toBe(1);
    expect(wC.processedEvents.length).toBe(1);

    expect(wB.processedEvents[0].type).toBe("DELAYED");
    expect(wC.processedEvents[0].type).toBe("DELAYED");

    // The logic clock of A when sent was 3.
    // When B/C receives it, they update: max(1, 3) + 1 = 4.
    expect(wB.clock.get()).toBe(4);
    expect(wC.clock.get()).toBe(4);
    
    expect(wB.processedEvents[0].logicalTime).toBe(4);
    expect(wC.processedEvents[0].logicalTime).toBe(4);
  });

});
