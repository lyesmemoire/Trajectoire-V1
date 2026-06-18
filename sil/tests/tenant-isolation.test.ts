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

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

describe("Phase 2-F: Tenant Isolation", () => {
  it("Should reject an event if tenantId does not match the active session", async () => {
    const router = new EventRouter();
    const store = new MemoryEventStore();
    const registry = new MemorySessionRegistry();
    const loop = new SILRuntimeLoop(
      router, new MockP6RuntimeClient(), new MockP7EvaluatorClient(),
      new MockRuntimeTraceProvider(), new FailureController(router), store
    );
    const ingestor = new SILIngestor(new MockVerifier(), store, registry, loop);

    const sessionId = "session-iso-1";
    
    const createEvent: SILEvent = {
      eventId: "e1",
      sessionId,
      tenantId: "tenant-A",
      type: "SESSION_CREATED",
      payload: {},
      timestamp: Date.now(),
      hash: "h1", signature: "s1"
    };

    // 1. Ingest valid event for Tenant A
    await ingestor.ingest(createEvent);

    // Wait for async processing
    await new Promise(r => setTimeout(r, 10));

    const state = loop.getState(sessionId);
    expect(state).toBeDefined();
    expect(state?.tenantId).toBe("tenant-A");

    // Verify session is registered
    expect(registry.getTenantId(sessionId)).toBe("tenant-A");

    // 2. Try to ingest event for Tenant B on the SAME session
    const maliciousEvent: SILEvent = {
      eventId: "e2",
      sessionId,
      tenantId: "tenant-B",
      type: "USER_MESSAGE",
      payload: { text: "Sneaky" },
      timestamp: Date.now(),
      hash: "h2", signature: "s2"
    };

    await ingestor.ingest(maliciousEvent);
    
    // Wait for async processing
    await new Promise(r => setTimeout(r, 10));

    // The ingestor should have caught it via SessionRegistry — event is silently rejected
    // The session should still be in its original state (RUNNING), NOT FAILED
    // because the violation was caught at the Ingestor level, not the RuntimeLoop level
    const finalState = loop.getState(sessionId);
    expect(finalState?.status).not.toBe("FAILED");
    
    // The event should NOT be in the event store (preventing log pollution)
    const stored = await store.readAfter("tenant-B", sessionId, -1);
    expect(stored.length).toBe(0);
    
    // Check Tenant A store just in case
    const storedA = await store.readAfter("tenant-A", sessionId, -1);
    expect(storedA.length).toBe(1); // Only the initial event
  });
});
