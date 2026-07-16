// @ts-nocheck
import { describe, it, expect } from "vitest";
import { DistributedEventStore } from "../event-store/distributed-event-store";
import { ShardRouter } from "../sharding/shard-router";
import { GlobalEventIndex } from "../index/global-event-index";
import { MemoryEventStore } from "../../services/memory-event-store";
import { ReplayCoordinator } from "../replay/replay-coordinator";
import { SILEvent } from "../../contracts/sil-events";
import { ReplayEngine } from "../../services/replay/replay-engine";
import { DefaultEventQueryService } from "../../services/query/event-query-service";
import { MockP7EvaluatorClient } from "../../tests/mocks/mock-p7-evaluator-client";
import { MockRuntimeTraceProvider } from "../../tests/mocks/mock-runtime-trace-provider";

describe("Phase 2-K: Cross-Node Replay", () => {
  it("replay from any node yields identical result without relying on local node state", async () => {
    const shardRouter = new ShardRouter(3);
    const index = new GlobalEventIndex();
    
    const stores = new Map();
    stores.set(0, new MemoryEventStore());
    stores.set(1, new MemoryEventStore());
    stores.set(2, new MemoryEventStore());

    const distStore = new DistributedEventStore(shardRouter, stores, index);

    const tenantId = "tenant-C";
    const sessionId = "sess-replay";

    await distStore.append({ eventId: "e1", tenantId, sessionId, type: "TEST", timestamp: 1, signature: "s", hash: "h" } as SILEvent);
    await distStore.append({ eventId: "e2", tenantId, sessionId, type: "REPORT_GENERATED", timestamp: 2, signature: "s", hash: "h", payload: { reportHash: "simulated-hash-or-actual-replay-hash" } } as any);

    // Simulate ReplayCoordinator on Node A
    const engineA = new ReplayEngine(new DefaultEventQueryService(distStore as any), new MockP7EvaluatorClient(), new MockRuntimeTraceProvider());
    const coordinatorA = new ReplayCoordinator(distStore, engineA);
    const resultA = await coordinatorA.replay(tenantId, sessionId);

    // Simulate ReplayCoordinator on Node B
    const engineB = new ReplayEngine(new DefaultEventQueryService(distStore as any), new MockP7EvaluatorClient(), new MockRuntimeTraceProvider());
    const coordinatorB = new ReplayCoordinator(distStore, engineB);
    const resultB = await coordinatorB.replay(tenantId, sessionId);

    expect(resultA.replayHash).toBe(resultB.replayHash);
    expect(resultA.deterministic).toBe(true);
    expect(resultB.deterministic).toBe(true);
  });
});
