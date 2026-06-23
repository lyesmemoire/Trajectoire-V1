import { FakeInfra } from "../../src/testing/FakeInfra";
import { WorldSnapshot } from "../../src/ports/ISnapshot";
import { InterWorldMessage, SerializableMessage, WorldId } from "../../src/distributed/network/types";
import { FakeRandom } from "../../src/testing/FakeInfra";

export interface SimulatedWorld {
  id: number;
  infra: FakeInfra;
  engine: any; // Moteur principal du monde (ChaosEngine, Bootstrap, etc.)
  nextExecutionTime: number | null;
  inFlightMessages?: InterWorldMessage[];
  receiveMessage?(msg: InterWorldMessage): void;
  serialize?(): WorldSnapshot;
  restore?(snapshot: WorldSnapshot): void;
  rehydrate?(): void;
}

interface PQNode {
  world: SimulatedWorld;
  scheduledTime: number;
}

class MinHeap {
  private data: PQNode[] = [];

  push(world: SimulatedWorld, scheduledTime: number) {
    this.data.push({ world, scheduledTime });
    this.bubbleUp(this.data.length - 1);
  }

  pop(): PQNode | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const bottom = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = bottom;
      this.sinkDown(0);
    }
    return top;
  }

  size(): number {
    return this.data.length;
  }

  private bubbleUp(index: number) {
    const element = this.data[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.data[parentIndex];
      if (element.scheduledTime >= parent.scheduledTime) break;
      this.data[parentIndex] = element;
      this.data[index] = parent;
      index = parentIndex;
    }
  }

  private sinkDown(index: number) {
    const length = this.data.length;
    const element = this.data[index];

    while (true) {
      let leftChildIdx = 2 * index + 1;
      let rightChildIdx = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.data[leftChildIdx];
        if (leftChild.scheduledTime < element.scheduledTime) swap = leftChildIdx;
      }

      if (rightChildIdx < length) {
        rightChild = this.data[rightChildIdx];
        if (
          (swap === null && rightChild.scheduledTime < element.scheduledTime) ||
          (swap !== null && rightChild.scheduledTime < leftChild!.scheduledTime)
        ) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;
      this.data[index] = this.data[swap];
      this.data[swap] = element;
      index = swap;
    }
  }
}

/**
 * Event-Driven Global Scheduler (O(E log W))
 */
export class MultiWorldSimulator {
  public worlds: SimulatedWorld[] = [];
  public currentGlobalTime = 0;
  public networkRandom: FakeRandom;
  public router: NetworkRouter;
  public activePq: MinHeap | null = null;
  
  public stats = {
    eventsProcessed: 0,
    wallClockMs: 0,
  };

  constructor(networkSeed = 9999) {
    this.networkRandom = new FakeRandom(networkSeed);
    this.router = new NetworkRouter(this);
  }

  addWorld(world: SimulatedWorld) {
    if (!world.inFlightMessages) world.inFlightMessages = [];
    world.nextExecutionTime = world.infra.timer.peekNextExecutionTime();
    if (!this.worlds.some(w => w.id === world.id)) {
      this.worlds.push(world);
    }
  }

  snapshotWorld(id: number): WorldSnapshot {
    const world = this.worlds.find((w) => w.id === id);
    if (!world) throw new Error(`World ${id} not found`);

    if (typeof world.serialize === "function") {
      return world.serialize();
    }

    // Default serialization strategy for ad-hoc tests
    return {
      logicalTime: world.infra.clock.now(),
      randomState: world.infra.random.getInternalState(),
      stateStore: world.engine.stateStore ? world.engine.stateStore.serialize() : {},
      controlPlaneState: world.engine.controlPlane ? world.engine.controlPlane.serialize() : {},
      networkInFlightMessages: world.inFlightMessages.map(m => structuredClone(m)),
      networkBacklog: structuredClone(this.router.getBacklog()),
      partitions: structuredClone(this.router.getPartitions())
    };
  }

  forkWorld(
    snapshot: WorldSnapshot,
    newId: number,
    worldFactory: (id: number, infra: FakeInfra) => SimulatedWorld
  ): SimulatedWorld {
    const infra = new FakeInfra();
    
    // Restaurer le temps logique et l'entropie
    infra.clock.setTime(snapshot.logicalTime);
    infra.random.setInternalState(snapshot.randomState);

    // Restore network partition layer
    this.router._restoreState(
      snapshot.partitions ?? null,
      snapshot.networkBacklog ?? []
    );

    const newWorld = worldFactory(newId, infra);

    if (typeof newWorld.restore === "function") {
      newWorld.restore(snapshot);
    } else {
      if (newWorld.engine.stateStore) newWorld.engine.stateStore.restore(snapshot.stateStore);
      if (newWorld.engine.controlPlane) newWorld.engine.controlPlane.restore(snapshot.controlPlaneState);
    }

    if (typeof newWorld.rehydrate === "function") {
      newWorld.rehydrate();
    } else {
      if (newWorld.engine.controlPlane) newWorld.engine.controlPlane.rehydrate();
      
      // Rehydrate in-flight messages from snapshot
      if (snapshot.networkInFlightMessages) {
        newWorld.inFlightMessages = snapshot.networkInFlightMessages.map(m => structuredClone(m));
        for (const msg of newWorld.inFlightMessages) {
          newWorld.infra.timer.scheduleAtAbsolute!(msg.deliverAt, () => {
            newWorld.inFlightMessages = newWorld.inFlightMessages.filter(m => m.id !== msg.id);
            if (newWorld.receiveMessage) newWorld.receiveMessage(msg);
          });
        }
      }
    }

    this.addWorld(newWorld);
    return newWorld;
  }

  runUntil(targetTimeMs: number): void {
    const startMs = performance.now();
    this.activePq = new MinHeap();

    // Init the priority queue with active worlds
    for (const w of this.worlds) {
      w.nextExecutionTime = w.infra.timer.peekNextExecutionTime();
      if (w.nextExecutionTime !== null && w.nextExecutionTime <= targetTimeMs) {
        this.activePq.push(w, w.nextExecutionTime);
      }
    }

    while (this.activePq.size() > 0) {
      const node = this.activePq.pop()!;
      const nextWorld = node.world;
      const timeToRun = node.scheduledTime;

      // If the node's scheduled time doesn't match the world's actual next execution time,
      // it means this is a stale node (the world was re-scheduled). We just drop it.
      if (timeToRun !== nextWorld.nextExecutionTime) {
        continue;
      }

      if (timeToRun > targetTimeMs) {
        break;
      }

      this.currentGlobalTime = timeToRun;

      // Execute the next event for this world.
      // This may inject network messages into OTHER worlds' FakeTimers via router.
      nextWorld.infra.timer.advanceTo(timeToRun);
      this.stats.eventsProcessed++;

      // Re-check this world
      const nextTime = nextWorld.infra.timer.peekNextExecutionTime();
      nextWorld.nextExecutionTime = nextTime;
      if (nextTime !== null && nextTime <= targetTimeMs) {
        this.activePq.push(nextWorld, nextTime);
      }
    }

    this.activePq = null;

    // Finalize: advance all world clocks to the target time
    for (const w of this.worlds) {
      if (w.infra.clock.currentTime < targetTimeMs) {
        w.infra.timer.advanceTo(targetTimeMs);
      }
    }

    this.currentGlobalTime = targetTimeMs;
    this.stats.wallClockMs += performance.now() - startMs;
  }
}

export interface NetworkChaosConfig {
  dropRate: number;          // 0–1
  duplicationRate: number;   // 0–1
  reorderRate: number;       // 0–1
  maxJitterMs: number;
}

export interface NetworkPartitionConfig {
  partitions: number[][]; // Ex: [[0, 1], [2, 3]]
}

export interface BackloggedMessage {
  from: number;
  to: number;
  message: InterWorldMessage;
  latency: number;
  enqueuedAt: number;
}

export class NetworkRouter {
  private messageCounter = 0;
  private config: NetworkChaosConfig = {
    dropRate: 0,
    duplicationRate: 0,
    reorderRate: 0,
    maxJitterMs: 0
  };
  private partitions: number[][] | null = null;
  private backlog: any[] = [];

  constructor(private simulator: MultiWorldSimulator) {}

  setConfig(config: Partial<NetworkChaosConfig>) {
    this.config = { ...this.config, ...config };
  }

  setPartitions(partitions: number[][] | null) {
    this.partitions = partitions;
  }

  getBacklog(): BackloggedMessage[] { return this.backlog; }
  getPartitions() { return this.partitions; }

  _restoreState(partitions: number[][] | null, backlog: BackloggedMessage[]) {
    this.partitions = partitions;
    this.backlog = [...backlog];
  }

  healPartition(): void {
    this.partitions = null;
    
    // Deterministic injection of backlog
    const now = this.simulator.currentGlobalTime;
    
    for (const b of this.backlog) {
      // Re-inject with mathematical causality guarantee
      const deliverAt = Math.max(now, b.enqueuedAt + b.latency);
      const targetWorld = this.simulator.worlds.find(w => w.id === b.to);
      if (targetWorld) {
        this.scheduleMessageDelivery(targetWorld, b.from, b.to, b.message.message, deliverAt);
      }
    }
    
    this.backlog = [];
  }

  // Simple hash for asymmetric properties based on route
  private getRouteHash(from: number, to: number): number {
    let h = ((from * 31337) ^ to) % 1000;
    return Math.abs(h) / 1000; // 0.0 to 1.0
  }

  send(from: WorldId, to: WorldId, message: SerializableMessage, baseLatencyMs: number = 100): void {
    // 1. Drop
    if (this.config.dropRate > 0 && this.simulator.networkRandom.next() < this.config.dropRate) {
      return; // Message is deterministically dropped
    }

    // 2. Duplication
    let copies = 1;
    if (this.config.duplicationRate > 0 && this.simulator.networkRandom.next() < this.config.duplicationRate) {
      copies = 2; // Clone the message
    }

    // Route-specific asymmetric multiplier (0.5 to 1.5)
    const asymmetricMultiplier = 0.5 + this.getRouteHash(from, to);

    for (let i = 0; i < copies; i++) {
      // 3. Jitter (Asymmetric)
      let jitter = 0;
      if (this.config.maxJitterMs > 0) {
        // Random jitter scaled by the route's asymmetric multiplier
        jitter = Math.floor(this.simulator.networkRandom.next() * this.config.maxJitterMs * asymmetricMultiplier);
      }

      // 4. Reorder (artificial delay)
      let reorderDelay = 0;
      if (this.config.reorderRate > 0 && this.simulator.networkRandom.next() < this.config.reorderRate) {
        // Add a significant extra delay to force reordering
        reorderDelay = Math.floor(this.simulator.networkRandom.next() * this.config.maxJitterMs * 2);
      }

      // Calculate absolute delivery time
      const totalLatency = baseLatencyMs + jitter + reorderDelay;

      // --- PARTITION LAYER ---
      if (this.partitions) {
        let fromGroup = -1;
        let toGroup = -1;
        for (let j = 0; j < this.partitions.length; j++) {
          if (this.partitions[j].includes(from)) fromGroup = j;
          if (this.partitions[j].includes(to)) toGroup = j;
        }

        if (fromGroup === -1 || toGroup === -1 || fromGroup !== toGroup) {
          // Message trapped in partition
          this.backlog.push({
            from,
            to,
            message: { id: "backlog", from, to, message: structuredClone(message), deliverAt: 0 },
            latency: totalLatency,
            enqueuedAt: this.simulator.currentGlobalTime
          });
          continue; // Do not schedule
        }
      }

      // --- DELIVERY ---
      // Invariant: ∀ message m, m.deliverAt >= simulator.currentGlobalTime at send time
      const deliverAt = this.simulator.currentGlobalTime + totalLatency;
      const targetWorld = this.simulator.worlds.find(w => w.id === to);
      if (targetWorld) {
        this.scheduleMessageDelivery(targetWorld, from, to, message, deliverAt);
      }
    }
  }

  private scheduleMessageDelivery(targetWorld: SimulatedWorld, from: WorldId, to: WorldId, message: SerializableMessage, deliverAt: number) {
    const interWorldMsg: InterWorldMessage = {
      id: `msg_${this.messageCounter++}_from_${from}_to_${to}`,
      from,
      to,
      message: structuredClone(message),
      deliverAt
    };

    targetWorld.inFlightMessages!.push(interWorldMsg);

    targetWorld.infra.timer.scheduleAtAbsolute!(deliverAt, () => {
      targetWorld.inFlightMessages = targetWorld.inFlightMessages!.filter(m => m.id !== interWorldMsg.id);
      if (targetWorld.receiveMessage) {
        targetWorld.receiveMessage(interWorldMsg);
      }
    });

    // Directly re-schedule the targetWorld if this new event is earlier than its current next event
    const newNext = targetWorld.infra.timer.peekNextExecutionTime();
    if (newNext !== null && (targetWorld.nextExecutionTime === null || newNext < targetWorld.nextExecutionTime)) {
      targetWorld.nextExecutionTime = newNext;
      if (this.simulator.activePq) {
        this.simulator.activePq.push(targetWorld, newNext);
      }
    }
  }
}
