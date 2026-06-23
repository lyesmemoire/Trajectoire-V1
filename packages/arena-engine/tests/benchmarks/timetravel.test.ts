import { describe, it, expect } from "vitest";
import { MultiWorldSimulator, SimulatedWorld } from "../helpers/MultiWorldSimulator";
import { FakeInfra } from "../../src/testing/FakeInfra";
import { WorldSnapshot } from "../../src/ports/ISnapshot";

// A mock state store that behaves like a simple domain component
class MockStateStore {
  public data: number[] = [];
  
  serialize(): any {
    return { data: [...this.data] };
  }
  
  restore(snapshotData: any): void {
    this.data = [...snapshotData.data];
  }
}

// A mock engine that schedules events and mutates state based on random entropy
class MockStatefulEngine {
  public stateStore = new MockStateStore();
  public ticks = 0;

  constructor(private infra: FakeInfra) {}

  start() {
    this.infra.timer.setInterval(() => this.tick(), 100); // 10 ticks per second
  }

  private tick() {
    this.ticks++;
    // Mutate state deterministically based on entropy
    const entropy = this.infra.random.next();
    this.stateStore.data.push(entropy);

    // Schedule some delayed work
    const delay = Math.floor(this.infra.random.next() * 50);
    this.infra.timer.setTimeout(() => {
      this.stateStore.data.push(-entropy);
    }, delay);
  }

  serialize(): any {
    return {
      ticks: this.ticks,
      stateStore: this.stateStore.serialize(),
    };
  }

  restore(snapshot: any): void {
    this.ticks = snapshot.ticks;
    this.stateStore.restore(snapshot.stateStore);
  }

  rehydrate(): void {
    // Realign the interval to the 100ms grid to avoid phase drift
    const now = this.infra.clock.now();
    let offset = 100 - (now % 100);
    if (offset === 0) offset = 100; // If already on boundary, next is 100ms away
    
    this.infra.timer.setTimeout(() => {
      this.tick();
      this.start();
    }, offset);
  }
}


describe("Time-Travel & Snapshot Debugging", () => {
  const ONE_HOUR = 60 * 60 * 1000;
  const TWO_HOURS = 2 * ONE_HOUR;

  it("should perfectly fork and reproduce worlds from a snapshot", () => {
    const simulator = new MultiWorldSimulator();

    // 1. Create initial world
    const worldFactory = (id: number, infra: FakeInfra): SimulatedWorld => {
      const engine = new MockStatefulEngine(infra);
      const world: SimulatedWorld = {
        id,
        infra,
        engine,
        nextExecutionTime: null,
        serialize(): WorldSnapshot {
          return {
            logicalTime: this.infra.clock.now(),
            randomState: this.infra.random.getInternalState(),
            stateStore: this.engine.serialize(),
            controlPlaneState: {},
          };
        },
        restore(snapshot: WorldSnapshot): void {
          this.engine.restore(snapshot.stateStore);
        },
        rehydrate(): void {
          this.engine.rehydrate();
        }
      };
      return world;
    };

    const initialInfra = new FakeInfra(42);
    const initialWorld = worldFactory(0, initialInfra);
    initialWorld.engine.start(); // Starts the scheduling
    simulator.addWorld(initialWorld);

    // 2. Run until right before the 1-hour interval (Safe Point)
    // At ONE_HOUR - 1, the last interval was at ONE_HOUR - 100, and its max 50ms timeout has already resolved.
    // So there are no pending temporary timeouts, only the main setInterval.
    const SAFE_POINT = ONE_HOUR - 1;
    simulator.runUntil(SAFE_POINT);

    // 3. Take snapshot
    const snapshot = simulator.snapshotWorld(0);

    // 4. Fork A and B from the snapshot
    const worldA = simulator.forkWorld(snapshot, 1, worldFactory);
    const worldB = simulator.forkWorld(snapshot, 2, worldFactory);

    // Initial world continues as well
    // We now have 3 worlds in the simulator

    // 5. Run all worlds until 2 hours
    simulator.runUntil(TWO_HOURS);

    // 6. Assertions
    // A and B should be completely identical
    expect(worldA.engine.ticks).toBe(worldB.engine.ticks);
    expect(worldA.engine.stateStore.data).toEqual(worldB.engine.stateStore.data);

    // The initial world (0) should also be identical to A and B
    // because it ran from 0 to 2h, and A/B ran from 1h to 2h using the 1h snapshot.
    expect(initialWorld.engine.ticks).toBe(worldA.engine.ticks);
    expect(initialWorld.engine.stateStore.data).toEqual(worldA.engine.stateStore.data);

    // Verify some values
    expect(worldA.engine.ticks).toBe(72000); // 10 ticks/s * 7200s
  });
});
