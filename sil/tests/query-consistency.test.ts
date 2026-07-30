import { describe, it, expect } from "vitest";
import { MemoryEventStore } from "../services/memory-event-store";
import { DefaultEventQueryService } from "../services/query/event-query-service";
import * as crypto from "crypto";
import { SILEvent } from "../contracts/sil-events";

describe("Phase 2-I: Query Layer Consistency", () => {
  it("should retrieve all events for a session via query layer", async () => {
    const store = new MemoryEventStore();
    const queryService = new DefaultEventQueryService(store);
    
    const tenantId = "tenant-A";
    const sessionId = "session-123";

    for (let i = 0; i < 10; i++) {
      await store.append({
        eventId: crypto.randomUUID(),
        type: "TEST_EVENT",
        tenantId,
        sessionId,
        timestamp: Date.now() + i,
        signature: "sig",
        hash: "hash",
        payload: { i }
      } as SILEvent);
    }

    const events = await queryService.getSessionEvents(tenantId, sessionId);
    expect(events.length).toBe(10);
    
    // Test getLastEvent
    const lastEvent = await queryService.getLastEvent(tenantId, sessionId);
    expect(lastEvent).toBeDefined();
    expect((lastEvent!.payload as { i: number }).i).toBe(9);

    // Test getEventRange
    const range = await queryService.getEventRange(tenantId, sessionId, 2, 5);
    expect(range.length).toBe(4); // from index 2 to 5 inclusive
    expect((range[0].payload as { i: number }).i).toBe(2);
    expect((range[3].payload as { i: number }).i).toBe(5);
  });
});
