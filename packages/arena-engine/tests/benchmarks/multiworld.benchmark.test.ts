import { describe, it, expect } from "vitest";
import { MultiWorldSimulator, SimulatedWorld } from "../helpers/MultiWorldSimulator";
import { FakeInfra } from "../../src/testing/FakeInfra";

function simpleHash(seed: number): number {
  let h = seed ^ (seed >>> 16);
  h = Math.imul(h, 0x85ebca6b);
  h = h ^ (h >>> 13);
  h = Math.imul(h, 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

class MockWorldEngine {
  public ticks = 0;
  public subtasks = 0;

  constructor(private infra: FakeInfra) {}

  start() {
    this.infra.timer.setInterval(() => {
      this.ticks++;
      // Simulate deterministic entropy usage
      const delay = Math.floor(this.infra.random.next() * 50);
      
      this.infra.timer.setTimeout(() => {
        this.subtasks++;
      }, delay);
    }, 1000); // 1 tick per second
  }
}

function createWorlds(count: number, globalSeed: number): SimulatedWorld[] {
  const worlds: SimulatedWorld[] = [];
  for (let i = 0; i < count; i++) {
    const worldSeed = simpleHash(globalSeed + i);
    const infra = new FakeInfra(worldSeed);
    const engine = new MockWorldEngine(infra);
    engine.start(); // starts the scheduling

    worlds.push({
      id: i,
      infra,
      engine,
      nextExecutionTime: infra.timer.peekNextExecutionTime()
    });
  }
  return worlds;
}

describe("MultiWorldSimulator Benchmark", () => {
  const ONE_HOUR_MS = 60 * 60 * 1000;

  it("should process 10 worlds deterministically", () => {
    const simulator1 = new MultiWorldSimulator();
    const simulator2 = new MultiWorldSimulator();

    const worlds1 = createWorlds(10, 1337);
    const worlds2 = createWorlds(10, 1337);

    worlds1.forEach(w => simulator1.addWorld(w));
    worlds2.forEach(w => simulator2.addWorld(w));

    simulator1.runUntil(ONE_HOUR_MS);
    simulator2.runUntil(ONE_HOUR_MS);

    console.log(`[10 Worlds] Events: ${simulator1.stats.eventsProcessed}, WallMs: ${simulator1.stats.wallClockMs.toFixed(2)}ms`);

    // Verify determinism
    for (let i = 0; i < 10; i++) {
      expect(worlds1[i].engine.ticks).toBe(worlds2[i].engine.ticks);
      expect(worlds1[i].engine.subtasks).toBe(worlds2[i].engine.subtasks);
      expect(worlds1[i].engine.ticks).toBe(3600); // 1 hour = 3600 seconds
    }
  });

  it("should scale efficiently to 100 worlds", () => {
    const simulator = new MultiWorldSimulator();
    const worlds = createWorlds(100, 1337);
    worlds.forEach(w => simulator.addWorld(w));

    simulator.runUntil(ONE_HOUR_MS);

    console.log(`[100 Worlds] Events: ${simulator.stats.eventsProcessed}, WallMs: ${simulator.stats.wallClockMs.toFixed(2)}ms`);
    expect(simulator.stats.eventsProcessed).toBeGreaterThan(700000); 
  });

  it("should scale efficiently to 1000 worlds (O(E log W))", () => {
    const simulator = new MultiWorldSimulator();
    const worlds = createWorlds(1000, 1337);
    worlds.forEach(w => simulator.addWorld(w));

    simulator.runUntil(ONE_HOUR_MS);

    console.log(`[1000 Worlds] Events: ${simulator.stats.eventsProcessed}, WallMs: ${simulator.stats.wallClockMs.toFixed(2)}ms`);
    expect(simulator.stats.eventsProcessed).toBeGreaterThan(7000000); 
    
    // Un benchmark pur sur 1000 mondes (7 millions d'évènements) 
    // devrait prendre moins de 5 secondes sur un V8 moderne avec MinHeap.
    expect(simulator.stats.wallClockMs).toBeLessThan(10000);
  });
});
