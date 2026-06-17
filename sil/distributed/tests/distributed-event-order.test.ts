import { describe, it, expect } from "vitest";
import { DistributedEventStore } from "../event-store/distributed-event-store";
import { ShardRouter } from "../sharding/shard-router";
import { GlobalEventIndex } from "../index/global-event-index";
import { MemoryEventStore } from "../../services/memory-event-store";
import { SILEvent } from "../../contracts/sil-events";
import * as crypto from "crypto";

describe("Phase 2-K: Distributed Event Order", () => {
  it("events inserted across nodes must respect global index order", async () => {
    const shardRouter = new ShardRouter(3);
    const index = new GlobalEventIndex();
    
    // Simulate 3 shards
    const stores = new Map();
    stores.set(0, new MemoryEventStore());
    stores.set(1, new MemoryEventStore());
    stores.set(2, new MemoryEventStore());

    const distStore = new DistributedEventStore(shardRouter, stores, index);

    const tenantId = "tenant-xyz";
    const sessionId = "sess-123";

    // Append events (will be routed to the correct shard internally)
    await distStore.append({ eventId: "e1", tenantId, sessionId, type: "TEST", timestamp: 1, signature: "s", hash: "h" } as SILEvent);
    await distStore.append({ eventId: "e2", tenantId, sessionId, type: "TEST", timestamp: 2, signature: "s", hash: "h" } as SILEvent);
    await distStore.append({ eventId: "e3", tenantId, sessionId, type: "TEST", timestamp: 3, signature: "s", hash: "h" } as SILEvent);

    // Read all
    const events = await distStore.readAll(tenantId, sessionId);
    
    expect(events.length).toBe(3);
    expect(events[0].eventId).toBe("e1");
    expect(events[1].eventId).toBe("e2");
    expect(events[2].eventId).toBe("e3");
  });
});
