import { describe, it, expect } from "vitest";
import { SILRuntimeLoop } from "../core/runtime-loop";
import { MemoryEventStore } from "../services/memory-event-store";
import { EventRouter } from "../services/event-router";
import { MockP6RuntimeClient } from "./mocks/mock-p6-runtime-client";
import { MockRuntimeTraceProvider } from "./mocks/mock-runtime-trace-provider";
import { MockP7EvaluatorClient } from "./mocks/mock-p7-evaluator-client";
import { FailureController } from "../core/failure-controller";
import { InMemoryStorageAdapter } from "../services/storage-adapter";
import { PostgresReportRepository } from "../services/postgres/report-repository";
import { PostgresCheckpointRepository } from "../services/postgres/checkpoint-repository";
import { SILIngestor } from "../services/ingestor";
import { KafkaBridge } from "../services/kafka-bridge";
import { EventVerifier, VerificationResult } from "../contracts/event-verifier";
import { MemorySessionRegistry } from "../services/memory-session-registry";

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

describe("SIL Phase 2-D — Persistence", () => {
  it("Should correctly persist report and checkpoint during REPORT_GENERATED with same hash", async () => {
    const store = new MemoryEventStore();
    const router = new EventRouter();
    const registry = new MemorySessionRegistry();
    const storageAdapter = new InMemoryStorageAdapter();
    const reportRepo = new PostgresReportRepository(storageAdapter);
    const checkpointRepo = new PostgresCheckpointRepository(storageAdapter);
    
    const failureController = new FailureController(router);
    const p6 = new MockP6RuntimeClient();
    const p7 = new MockP7EvaluatorClient();
    const traceProvider = new MockRuntimeTraceProvider();
    
    const loop = new SILRuntimeLoop(
      router, p6, p7, traceProvider, failureController, store,
      storageAdapter, reportRepo, checkpointRepo
    );

    const verifier = new MockVerifier();
    const ingestor = new SILIngestor(verifier, store, registry, loop);
    const kafkaBridge = new KafkaBridge(ingestor);
    router.setKafkaBridge(kafkaBridge);

    const sessionId = "session_persisted_1";

    await kafkaBridge.simulateConsume({
      eventId: "e1", type: "SESSION_CREATED", sessionId, tenantId: "tenant",
      timestamp: Date.now(), hash: "h1", signature: "s1"
    });
    
    await kafkaBridge.simulateConsume({
      eventId: "e2", type: "P6_RUNTIME_COMPLETED", sessionId, tenantId: "tenant",
      timestamp: Date.now(), hash: "h2", signature: "s2"
    });

    await new Promise(r => setTimeout(r, 100));

    const state = loop.getState(sessionId);
    expect(state).toBeDefined();
    expect(state!.status).toBe("COMPLETED");

    // Verify it was persisted
    const rawStorage = await storageAdapter._dumpStore();
    expect(rawStorage.has("reports")).toBe(true);
    expect(rawStorage.has("checkpoints")).toBe(true);

    const reportsCol = rawStorage.get("reports")!;
    expect(reportsCol.size).toBe(1);
    const savedReport = Array.from(reportsCol.values())[0];
    expect(savedReport.sessionId).toBe(sessionId);
    expect(savedReport.reportHash).toBe("mock-report-hash");

    const checkpointsCol = rawStorage.get("checkpoints")!;
    expect(checkpointsCol.size).toBe(1);
    const savedCheckpoint = Array.from(checkpointsCol.values())[0];
    expect(savedCheckpoint.sessionId).toBe(sessionId);
    expect(savedCheckpoint.reportHash).toBe("mock-report-hash");
  });
});
