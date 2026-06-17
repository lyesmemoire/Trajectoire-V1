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

describe("SIL Phase 2-A — Checkpoint Recovery", () => {
  it("Should recover identical state from EventStore after a crash", async () => {
    // 1. Initial run
    const store = new MemoryEventStore();
    const router1 = new EventRouter();
    const registry1 = new MemorySessionRegistry();
    const loop1 = new SILRuntimeLoop(router1, new MockP6RuntimeClient(), new MockP7EvaluatorClient(), new MockRuntimeTraceProvider(), new FailureController(router1), store);
    
    const verifier = new MockVerifier();
    const ingestor = new SILIngestor(verifier, store, registry1, loop1);
    const kafkaBridge = new KafkaBridge(ingestor);
    router1.setKafkaBridge(kafkaBridge);

    const sessionId = "session_crash";

    await kafkaBridge.simulateConsume({
      eventId: "e1", type: "SESSION_CREATED", sessionId, tenantId: "tenant",
      timestamp: Date.now(), hash: "hash", signature: "sig"
    });
    await kafkaBridge.simulateConsume({
      eventId: "e2", type: "USER_MESSAGE", sessionId, tenantId: "tenant",
      payload: { text: "hello" },
      timestamp: Date.now(), hash: "hash", signature: "sig"
    });
    await kafkaBridge.simulateConsume({
      eventId: "e3", type: "P6_RUNTIME_COMPLETED", sessionId, tenantId: "tenant",
      timestamp: Date.now(), hash: "hash", signature: "sig"
    });

    await new Promise(r => setTimeout(r, 50));

    const finalState = loop1.getState(sessionId);
    expect(finalState).toBeDefined();
    expect(finalState?.status).toBe("COMPLETED");

    // 2. Simulating a crash
    const router2 = new EventRouter();
    const loop2 = new SILRuntimeLoop(router2, new MockP6RuntimeClient(), new MockP7EvaluatorClient(), new MockRuntimeTraceProvider(), new FailureController(router2), store); // Reuse the same store!
    
    // 3. Recovery
    await loop2.wakeup("tenant", sessionId);

    const recoveredState = loop2.getState(sessionId);
    
    // State should be exactly identical
    expect(recoveredState).toBeDefined();
    expect(recoveredState?.status).toBe("COMPLETED");
    expect(recoveredState?.pointer).toBe(finalState?.pointer);
    expect(recoveredState?.eventLog.length).toBe(finalState?.eventLog.length);
    expect(recoveredState?.runtimeContext).toEqual(finalState?.runtimeContext);
  });
});
