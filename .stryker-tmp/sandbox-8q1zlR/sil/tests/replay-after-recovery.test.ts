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
import { InMemoryStorageAdapter } from "../services/storage-adapter";
import { PostgresCheckpointRepository } from "../services/postgres/checkpoint-repository";
import { PostgresReportRepository } from "../services/postgres/report-repository";

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

describe("Phase 2-I: Replay After Recovery", () => {
  it("should output the same hash even after a crash and recovery", async () => {
    const store = new MemoryEventStore();
    const storageAdapter = new InMemoryStorageAdapter();
    const reportRepo = new PostgresReportRepository(storageAdapter);
    const checkpointRepo = new PostgresCheckpointRepository(storageAdapter);
    const traceProvider = new MockRuntimeTraceProvider();
    const p7 = new MockP7EvaluatorClient();

    const createSystem = () => {
      const router = new EventRouter();
      const registry = new MemorySessionRegistry();
      const p6 = new MockP6RuntimeClient();
      const failureController = new FailureController(router);
      
      const loop = new SILRuntimeLoop(
        router, p6, p7, traceProvider, failureController, store, 
        storageAdapter, reportRepo, checkpointRepo
      );
      
      const verifier = new MockVerifier();
      const ingestor = new SILIngestor(verifier, store, registry, loop);
      const kafkaBridge = new KafkaBridge(ingestor);
      router.setKafkaBridge(kafkaBridge);

      return { loop, kafkaBridge };
    };

    const sys1 = createSystem();
    const sessionId = "session-recovery";
    const tenantId = "tenant-E";

    // Start session and create a checkpoint
    await sys1.kafkaBridge.simulateConsume({
      eventId: "e1", type: "SESSION_CREATED", sessionId, tenantId, timestamp: 100, signature: "", hash: ""
    });
    
    // Simulate events
    await sys1.kafkaBridge.simulateConsume({
      eventId: "e2", type: "USER_MESSAGE", sessionId, tenantId, timestamp: 110, signature: "", hash: "", payload: { msg: "hello" }
    });

    // Let it process
    await new Promise(r => setTimeout(r, 50));

    // Simulate crash
    const sys2 = createSystem();

    // End session (trigger recovery and completion)
    await sys2.kafkaBridge.simulateConsume({
      eventId: "e3", type: "SESSION_FINISHED", sessionId, tenantId, timestamp: 120, signature: "", hash: ""
    });
    
    await new Promise(r => setTimeout(r, 50));

    const state = sys2.loop.getState(sessionId);
    const reportHash = state?.runtimeContext.p7State?.reportHash;
    expect(reportHash).toBeDefined();

    // Replay
    const query = new DefaultEventQueryService(store);
    const replayEngine = new ReplayEngine(query, p7, traceProvider);
    const result = await replayEngine.replay(tenantId, sessionId);

    expect(result.originalHash).toBe(reportHash);
    expect(result.replayHash).toBe(reportHash);
    expect(result.deterministic).toBe(true);
  });
});
