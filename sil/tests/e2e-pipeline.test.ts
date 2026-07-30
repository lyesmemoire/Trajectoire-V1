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
import { RuntimeTraceProvider } from "../contracts/runtime-trace-provider";
import { P7EvaluatorClient, EvaluationCommand, EvaluationResult } from "../contracts/p7-evaluator";
import { RuntimeTrace } from "../../core/p7/trace-contract";
import { MemorySessionRegistry } from "../services/memory-session-registry";

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

// --- Trace Provider that throws (trace not found) ---
class FailingTraceProvider implements RuntimeTraceProvider {
  async getTrace(_sessionId: string): Promise<RuntimeTrace> {
    throw new Error("TRACE_NOT_FOUND: No trace exists for this session");
  }
  async hasTrace(_sessionId: string): Promise<boolean> {
    return false;
  }
}

// --- P7 Evaluator that throws (corrupted trace) ---
class FailingP7Evaluator implements P7EvaluatorClient {
  async evaluate(_command: EvaluationCommand): Promise<EvaluationResult> {
    throw new Error("P7_EVALUATION_FAILED: Invalid trace structure");
  }
}

describe("SIL Phase 2-C — End-to-End Integration", () => {

  // ── Helper ──────────────────────────────────────────────────────
  const setup = (traceProvider?: RuntimeTraceProvider, p7?: P7EvaluatorClient, ) => {
    const store = new MemoryEventStore();
    const router = new EventRouter();
    const registry = new MemorySessionRegistry();
    const p6 = new MockP6RuntimeClient();
    const tp = traceProvider ?? new MockRuntimeTraceProvider();
    const evaluator = p7 ?? new MockP7EvaluatorClient();
    const failureController = new FailureController(router);
    const loop = new SILRuntimeLoop(router, p6, evaluator, tp, failureController, store);

    const verifier = new MockVerifier();
    const ingestor = new SILIngestor(verifier, store, registry, loop);
    const kafkaBridge = new KafkaBridge(ingestor);
    router.setKafkaBridge(kafkaBridge);

    return { store, loop, kafkaBridge };
  };

  // ── S1: Full Happy Path ─────────────────────────────────────────
  it("S1: Full pipeline reaches COMPLETED with correct event sequence", async () => {
    const { kafkaBridge, loop } = setup();
    const sessionId = "session_full_pipeline";

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

    await new Promise(r => setTimeout(r, 100));

    const state = loop.getState(sessionId);
    expect(state).toBeDefined();
    expect(state?.status).toBe("COMPLETED");

    // Verify the event sequence
    const eventTypes = state!.eventLog.map(e => e.type);
    expect(eventTypes).toContain("SESSION_CREATED");
    expect(eventTypes).toContain("P6_RUNTIME_STARTED");
    expect(eventTypes).toContain("P6_RUNTIME_COMMITTED");
    expect(eventTypes).toContain("P6_RUNTIME_COMPLETED");
    expect(eventTypes).toContain("TRACE_RECOVERY_STARTED");
    expect(eventTypes).toContain("TRACE_RECOVERY_COMPLETED");
    expect(eventTypes).toContain("P7_EVALUATION_STARTED");
    expect(eventTypes).toContain("P7_EVALUATION_COMPLETED");
    expect(eventTypes).toContain("REPORT_GENERATED");
    expect(eventTypes).toContain("SESSION_COMPLETED");

    // Verify ordering: TRACE_RECOVERY before P7
    const traceRecIdx = eventTypes.indexOf("TRACE_RECOVERY_COMPLETED");
    const p7StartIdx = eventTypes.indexOf("P7_EVALUATION_STARTED");
    expect(traceRecIdx).toBeLessThan(p7StartIdx);
  });

  // ── S2: Trace Not Found ─────────────────────────────────────────
  it("S2: Missing trace triggers TRACE_RECOVERY_FAILED → FAILED", async () => {
    const { kafkaBridge, loop } = setup(new FailingTraceProvider());
    const sessionId = "session_no_trace";

    await kafkaBridge.simulateConsume({
      eventId: "e1", type: "SESSION_CREATED", sessionId, tenantId: "tenant",
      timestamp: Date.now(), hash: "hash", signature: "sig"
    });
    await kafkaBridge.simulateConsume({
      eventId: "e2", type: "P6_RUNTIME_COMPLETED", sessionId, tenantId: "tenant",
      timestamp: Date.now(), hash: "hash", signature: "sig"
    });

    await new Promise(r => setTimeout(r, 100));

    const state = loop.getState(sessionId);
    expect(state).toBeDefined();
    expect(state?.status).toBe("FAILED");

    const eventTypes = state!.eventLog.map(e => e.type);
    expect(eventTypes).toContain("TRACE_RECOVERY_STARTED");
    expect(eventTypes).toContain("TRACE_RECOVERY_FAILED");
    expect(eventTypes).not.toContain("P7_EVALUATION_STARTED");
  });

  // ── S3: Corrupted Trace → P7 Fails ─────────────────────────────
  it("S3: Corrupted trace triggers P7_EVALUATION_FAILED → FAILED", async () => {
    const { kafkaBridge, loop } = setup(undefined, new FailingP7Evaluator());
    const sessionId = "session_corrupt_trace";

    await kafkaBridge.simulateConsume({
      eventId: "e1", type: "SESSION_CREATED", sessionId, tenantId: "tenant",
      timestamp: Date.now(), hash: "hash", signature: "sig"
    });
    await kafkaBridge.simulateConsume({
      eventId: "e2", type: "P6_RUNTIME_COMPLETED", sessionId, tenantId: "tenant",
      timestamp: Date.now(), hash: "hash", signature: "sig"
    });

    await new Promise(r => setTimeout(r, 100));

    const state = loop.getState(sessionId);
    expect(state).toBeDefined();
    expect(state?.status).toBe("FAILED");

    const eventTypes = state!.eventLog.map(e => e.type);
    expect(eventTypes).toContain("TRACE_RECOVERY_COMPLETED");
    expect(eventTypes).toContain("P7_EVALUATION_STARTED");
    expect(eventTypes).toContain("P7_EVALUATION_FAILED");
    expect(eventTypes).not.toContain("P7_EVALUATION_COMPLETED");
    expect(eventTypes).not.toContain("REPORT_GENERATED");
  });
});
