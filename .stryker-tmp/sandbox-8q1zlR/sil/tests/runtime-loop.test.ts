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
import { MemorySessionRegistry } from "../services/memory-session-registry";

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

describe("SIL Phase 2-A — Failure Semantics", () => {
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

    return { store, loop, kafkaBridge };
  };

  it("S2: Failure Semantics — Recoverable failure (Timeout) triggers rewind", async () => {
    const { kafkaBridge, loop } = setup();
    const sessionId = "session_fail_1";

    await kafkaBridge.simulateConsume({
      eventId: "e1", type: "SESSION_CREATED", sessionId, tenantId: "did:tenant",
      timestamp: Date.now(), hash: "hash", signature: "sig"
    });

    // Wait a tick for execution to reach waiting/completed state
    await new Promise(r => setTimeout(r, 50));

    // Inject a failure
    await kafkaBridge.simulateConsume({
      eventId: "e_fail", type: "FAILURE_DETECTED", sessionId, tenantId: "did:tenant",
      error: "P6_TIMEOUT", details: { sessionId },
      timestamp: Date.now(), hash: "hash", signature: "sig"
    });

    await new Promise(r => setTimeout(r, 50));

    const state = loop.getState(sessionId);

    // The failure controller rewinds it to RUNNING due to RECOVERY_TRIGGERED
    expect(state?.eventLog.some(e => e.type === "RECOVERY_TRIGGERED")).toBe(true);
    expect(state?.status).toBe("RUNNING");
  });

  it("S3: Failure Semantics — Unrecoverable failure (Crypto) marks session FAILED", async () => {
    const { kafkaBridge, loop } = setup();
    const sessionId = "session_fail_2";

    await kafkaBridge.simulateConsume({
      eventId: "e1", type: "SESSION_CREATED", sessionId, tenantId: "did:tenant",
      timestamp: Date.now(), hash: "hash", signature: "sig"
    });

    // Wait a tick
    await new Promise(r => setTimeout(r, 50));

    // Inject crypto failure
    await kafkaBridge.simulateConsume({
      eventId: "e_crypto", type: "FAILURE_DETECTED", sessionId, tenantId: "did:tenant",
      error: "CRYPTOGRAPHIC_FAILURE", details: { sessionId },
      timestamp: Date.now(), hash: "hash", signature: "sig"
    });

    await new Promise(r => setTimeout(r, 50));

    const state = loop.getState(sessionId);

    expect(state?.status).toBe("FAILED");
    expect(state?.eventLog.some(e => e.type === "RECOVERY_TRIGGERED")).toBe(false);
  });
});
