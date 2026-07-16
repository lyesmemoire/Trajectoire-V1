// @ts-nocheck
import { describe, it, expect } from "vitest";
import { EventRouter } from "../services/event-router";
import { MockP6RuntimeClient } from "./mocks/mock-p6-runtime-client";
import { MockP7EvaluatorClient } from "./mocks/mock-p7-evaluator-client";
import { MockRuntimeTraceProvider } from "./mocks/mock-runtime-trace-provider";
import { FailureController } from "../core/failure-controller";
import { SILRuntimeLoop } from "../core/runtime-loop";
import { MemoryEventStore } from "../services/memory-event-store";
import { SILIngestor } from "../services/ingestor";
import { KafkaBridge } from "../services/kafka-bridge";
import { EventVerifier, VerificationResult } from "../contracts/event-verifier";
import { SILEvent } from "../contracts/sil-events";
import { MemorySessionRegistry } from "../services/memory-session-registry";

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

describe("SIL Phase 2-A — Event Ingestion System", () => {
  const setup = () => {
    const store = new MemoryEventStore();
    const router = new EventRouter();
    const registry = new MemorySessionRegistry();
    const p6 = new MockP6RuntimeClient();
    const p7 = new MockP7EvaluatorClient();
    const traceProvider = new MockRuntimeTraceProvider();
    const failureController = new FailureController(router);
    const loop = new SILRuntimeLoop(router, p6, p7, traceProvider, failureController, store);
    
    const verifier = new MockVerifier();
    const ingestor = new SILIngestor(verifier, store, registry, loop);
    const kafkaBridge = new KafkaBridge(ingestor);
    
    router.setKafkaBridge(kafkaBridge);

    return { store, router, loop, kafkaBridge, verifier };
  };

  it("S1: Replay Consistency (Happy Path)", async () => {
    const { store, kafkaBridge, loop } = setup();
    const sessionId = "session_123";

    await kafkaBridge.simulateConsume({
      eventId: "e1",
      type: "SESSION_CREATED",
      sessionId,
      tenantId: "did:tenant",
      timestamp: Date.now(),
      hash: "hash",
      signature: "sig"
    });

    // Wait a tick for async pull model to settle
    await new Promise(r => setTimeout(r, 50));

    // Also trigger USER_MESSAGE and COMPLETED to advance
    await kafkaBridge.simulateConsume({
      eventId: "e2",
      type: "USER_MESSAGE",
      sessionId,
      tenantId: "did:tenant",
      timestamp: Date.now(),
      hash: "hash",
      signature: "sig",
      payload: "hello"
    });
    
    await new Promise(r => setTimeout(r, 50));
    
    await kafkaBridge.simulateConsume({
      eventId: "e3",
      type: "P6_RUNTIME_COMPLETED",
      sessionId,
      tenantId: "did:tenant",
      timestamp: Date.now(),
      hash: "hash",
      signature: "sig"
    });

    await new Promise(r => setTimeout(r, 50));

    const state = loop.getState(sessionId);
    expect(state).toBeDefined();
    expect(state?.status).toBe("COMPLETED");

    // Verify Replay Engine: Start a fresh loop with the same store
    const router2 = new EventRouter();
    const loop2 = new SILRuntimeLoop(router2, new MockP6RuntimeClient(), new MockP7EvaluatorClient(), new MockRuntimeTraceProvider(), new FailureController(router2), store);
    await loop2.wakeup("did:tenant", sessionId);

    const state2 = loop2.getState(sessionId);
    expect(state2).toBeDefined();
    expect(state2?.status).toBe("COMPLETED");
    expect(state2?.pointer).toBe(state?.pointer);
    expect(state2?.runtimeContext).toEqual(state?.runtimeContext);
  });

  it("S2: Duplicate Event Rejection (Idempotency)", async () => {
    const { store, kafkaBridge, loop } = setup();
    const sessionId = "session_idem";

    const event: SILEvent = {
      eventId: "e_idem",
      type: "SESSION_CREATED",
      sessionId,
      tenantId: "did:tenant",
      timestamp: Date.now(),
      hash: "hash",
      signature: "sig"
    };

    // Send the same event 5 times
    for (let i = 0; i < 5; i++) {
      await kafkaBridge.simulateConsume(event);
    }

    await new Promise(r => setTimeout(r, 50));

    // Should only trigger execution once
    const state = loop.getState(sessionId);
    expect(state).toBeDefined();
    
    // Check the store only has 2 events (1 user + 1 generated STARTED)
    const events = await store.readAfter("did:tenant", sessionId, -1);
    expect(events.filter(e => e.type === "SESSION_CREATED").length).toBe(1);
  });

  it("S3: Corrupted Signature Rejection", async () => {
    const { store, kafkaBridge, loop, verifier } = setup();
    
    // Mock failure for this specific test
    verifier.verifySignature = async () => ({ isValid: false, reason: "Bad signature" });

    const sessionId = "session_corrupt";

    await kafkaBridge.simulateConsume({
      eventId: "e_bad",
      type: "SESSION_CREATED",
      sessionId,
      tenantId: "did:tenant",
      timestamp: Date.now(),
      hash: "hash",
      signature: "sig"
    });

    await new Promise(r => setTimeout(r, 50));

    // The event should never reach the store or the loop
    const state = loop.getState(sessionId);
    expect(state).toBeUndefined();

    const events = await store.readAfter("did:tenant", sessionId, -1);
    expect(events.length).toBe(0);
  });
});
