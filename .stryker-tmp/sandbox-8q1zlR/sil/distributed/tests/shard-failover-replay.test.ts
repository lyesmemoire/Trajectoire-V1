// @ts-nocheck
import { describe, it, expect } from "vitest";
import { DistributedEventStore } from "../event-store/distributed-event-store";
import { ShardRouter } from "../sharding/shard-router";
import { GlobalEventIndex } from "../index/global-event-index";
import { MemoryEventStore } from "../../services/memory-event-store";
import { FailoverManager } from "../failover/failover-manager";
import { SILEvent } from "../../contracts/sil-events";

describe("Phase 2-K: Shard Failover & Recovery", () => {
  it("should recover session state from DistributedEventStore on failover", async () => {
    const shardRouter = new ShardRouter(3);
    const index = new GlobalEventIndex();
    
    const stores = new Map();
    stores.set(0, new MemoryEventStore());
    stores.set(1, new MemoryEventStore());
    stores.set(2, new MemoryEventStore());

    const distStore = new DistributedEventStore(shardRouter, stores, index);
    const failover = new FailoverManager(shardRouter, distStore);

    const tenantId = "tenant-failover";
    const sessionId = "sess-crash";

    await distStore.append({ eventId: "e1", tenantId, sessionId, type: "TEST", timestamp: 1, signature: "s", hash: "h" } as SILEvent);
    await distStore.append({ eventId: "e2", tenantId, sessionId, type: "TEST", timestamp: 2, signature: "s", hash: "h" } as SILEvent);

    // Simulate Node processing crash
    // Failover manager triggered
    const recovery = await failover.recoverSession(tenantId, sessionId);

    expect(recovery.shard).toBeDefined();
    expect(recovery.events.length).toBe(2);
    expect(recovery.events[0].eventId).toBe("e1");
    expect(recovery.events[1].eventId).toBe("e2");
  });
});
