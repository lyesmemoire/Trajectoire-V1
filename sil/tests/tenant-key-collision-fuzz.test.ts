import { describe, it, expect } from "vitest";
import { EventRouter } from "../services/event-router";
import { MemoryEventStore } from "../services/memory-event-store";
import { SILRuntimeLoop } from "../core/runtime-loop";
import { FailureController } from "../core/failure-controller";
import { SILIngestor } from "../services/ingestor";
import { SILEvent } from "../contracts/sil-events";
import { EventVerifier, VerificationResult } from "../contracts/event-verifier";
import { MockP6RuntimeClient } from "./mocks/mock-p6-runtime-client";
import { MockP7EvaluatorClient } from "./mocks/mock-p7-evaluator-client";
import { MockRuntimeTraceProvider } from "./mocks/mock-runtime-trace-provider";
import { MemorySessionRegistry } from "../services/memory-session-registry";
import { randomUUID } from "crypto";

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

describe("Phase 2-F: Fuzz Testing - Tenant Key Collisions", () => {
  const setup = () => {
    const router = new EventRouter();
    const store = new MemoryEventStore();
    const registry = new MemorySessionRegistry();
    const loop = new SILRuntimeLoop(
      router, new MockP6RuntimeClient(), new MockP7EvaluatorClient(),
      new MockRuntimeTraceProvider(), new FailureController(router), store
    );
    const ingestor = new SILIngestor(new MockVerifier(), store, registry, loop);
    return { ingestor, store, registry, loop };
  };

  it("Scenario 1: 1000 random sessions with same generic IDs across different tenants", async () => {
    const { ingestor, store, registry } = setup();

    const GENERIC_SESSION_IDS = ["session-1", "session-2", "session-3", "session-test", "default-session"];
    const TENANTS = Array.from({ length: 20 }, (_, i) => `tenant-${i}`);

    const events: SILEvent[] = [];

    // Generate 1000 SESSION_CREATED events with collisions on sessionId but different tenants
    for (let i = 0; i < 1000; i++) {
      const tenantId = TENANTS[Math.floor(Math.random() * TENANTS.length)];
      const sessionId = GENERIC_SESSION_IDS[Math.floor(Math.random() * GENERIC_SESSION_IDS.length)];

      events.push({
        eventId: randomUUID(),
        sessionId,
        tenantId,
        type: "SESSION_CREATED",
        payload: {},
        timestamp: Date.now() + i,
        hash: `h${i}`, signature: `s${i}`
      });
    }

    // Ingest them all concurrently
    await Promise.all(events.map(e => ingestor.ingest(e)));

    // Wait for async processing
    await new Promise(r => setTimeout(r, 100));

    // Validate that EventStore grouped them correctly by the combined tenantKey
    // Note: because of collisions, some events were rejected. We only care that the STORED events
    // are perfectly isolated by tenant.
    for (const sessionId of GENERIC_SESSION_IDS) {
      // Find which tenant ultimately won this session ID by looking at the registry
      const winningTenant = registry.getTenantId(sessionId);
      if (!winningTenant) continue;

      const storedEvents = await store.readAfter(winningTenant, sessionId, -1);
      for (const ev of storedEvents) {
        expect(ev.tenantId).toBe(winningTenant);
        expect(ev.sessionId).toBe(sessionId);
      }

      // Check that NO other tenant has events for this sessionId
      for (const tenantId of TENANTS) {
        if (tenantId === winningTenant) continue;
        const leakEvents = await store.readAfter(tenantId, sessionId, -1);
        expect(leakEvents.length).toBe(0);
      }
    }
  });

  it("Scenario 2: Complex 10-tenant / 100-sessions / 10000-events simulation", async () => {
    const { ingestor, store } = setup();

    const TENANTS = Array.from({ length: 10 }, (_, i) => `tenant-scale-${i}`);
    const SESSIONS_PER_TENANT = 100;
    const EVENTS_PER_SESSION = 10; // Total 10 * 100 * 10 = 10000 events

    // Pre-create all events to simulate a high-throughput stream
    const eventStream: SILEvent[] = [];

    for (const tenantId of TENANTS) {
      for (let s = 0; s < SESSIONS_PER_TENANT; s++) {
        const sessionId = `shared-session-id-${s}`; // Intentional collision across tenants!
        
        for (let e = 0; e < EVENTS_PER_SESSION; e++) {
          eventStream.push({
            eventId: randomUUID(),
            sessionId,
            tenantId,
            type: e === 0 ? "SESSION_CREATED" : "USER_MESSAGE",
            payload: { idx: e },
            timestamp: Date.now() + e,
            hash: `h-${tenantId}-${s}-${e}`,
            signature: `s-${tenantId}-${s}-${e}`,
            previousEventHash: e > 0 ? `h-${tenantId}-${s}-${e-1}` : undefined
          });
        }
      }
    }

    // Shuffle the stream to simulate out-of-order/concurrent ingestion from Kafka
    eventStream.sort(() => Math.random() - 0.5);

    // Ingest all 10,000 events
    // We do it in chunks to avoid blowing up the promise queue
    const chunkSize = 500;
    for (let i = 0; i < eventStream.length; i += chunkSize) {
      const chunk = eventStream.slice(i, i + chunkSize);
      await Promise.all(chunk.map(e => ingestor.ingest(e)));
    }

    // Wait for all processing to settle
    await new Promise(r => setTimeout(r, 500));

    // Verification
    // 1. We have exactly 10,000 events in the store overall? (MemoryStore doesn't expose a global count easily, but we can verify randomly)
    // 2. No cross-tenant leakage.
    for (const tenantId of TENANTS) {
      for (let s = 0; s < SESSIONS_PER_TENANT; s++) {
        const sessionId = `shared-session-id-${s}`;
        const storedEvents = await store.readAfter(tenantId, sessionId, -1);
        
        // Ensure no events from OTHER tenants leaked into this bucket
        for (const ev of storedEvents) {
          expect(ev.tenantId).toBe(tenantId);
          expect(ev.sessionId).toBe(sessionId);
        }
      }
    }
  });
});
