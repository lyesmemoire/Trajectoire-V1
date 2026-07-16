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
import { ReplayEngine } from "../services/replay/replay-engine";
import { DefaultEventQueryService } from "../services/query/event-query-service";

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

describe("Phase 2-I: Deterministic Replay", () => {
  it("should replay a session and output the exact same hash", async () => {
    // 1. Setup and run a session
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

    const sessionId = "replay-session-1";
    const tenantId = "tenant-C";

    await kafkaBridge.simulateConsume({
      eventId: "e1", type: "SESSION_CREATED", sessionId, tenantId, timestamp: 100, signature: "", hash: ""
    });
    await kafkaBridge.simulateConsume({
      eventId: "e2", type: "SESSION_FINISHED", sessionId, tenantId, timestamp: 101, signature: "", hash: ""
    });
    await new Promise(r => setTimeout(r, 50));
    
    // Get the final report hash from the state
    const state = loop.getState(sessionId);
    const reportHash = state?.runtimeContext.p7State?.reportHash;
    expect(reportHash).toBeDefined();

    // 2. Run ReplayEngine
    const query = new DefaultEventQueryService(store);
    const replayEngine = new ReplayEngine(query, p7, traceProvider);

    const result = await replayEngine.replay(tenantId, sessionId);

    expect(result.originalHash).toBe(reportHash);
    expect(result.replayHash).toBe(reportHash);
    expect(result.deterministic).toBe(true);
  });
});
