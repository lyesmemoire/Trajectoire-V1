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
import { RecoveryManager } from "../core/recovery-manager";
import { EventVerifier, VerificationResult } from "../contracts/event-verifier";
import { MemorySessionRegistry } from "../services/memory-session-registry";

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

describe("SIL Phase 2-D — Recovery after Report", () => {
  it("Should not duplicate report if recovering after report but before checkpoint", async () => {
    const storageAdapter = new InMemoryStorageAdapter();
    const reportRepo = new PostgresReportRepository(storageAdapter);
    const checkpointRepo = new PostgresCheckpointRepository(storageAdapter);
    
    // We mock the checkpoint repo to throw an error during save, simulating a crash
    // just *after* the report was successfully saved (inside the transaction).
    // Oh wait, if it's a transaction, the whole transaction rolls back!
    // Let's test exactly that: if checkpoint fails, report is rolled back.
    const failingCheckpointRepo = new PostgresCheckpointRepository(storageAdapter);
    failingCheckpointRepo.save = async () => {
      throw new Error("Simulated Crash during Checkpoint Persistence");
    };

    const sessionId = "session_crash_during_tx";
    const store = new MemoryEventStore();
    const router = new EventRouter();
    const registry = new MemorySessionRegistry();
    const failureController = new FailureController(router);
    const loop = new SILRuntimeLoop(
      router, new MockP6RuntimeClient(), new MockP7EvaluatorClient(), 
      new MockRuntimeTraceProvider(), failureController, store,
      storageAdapter, reportRepo, failingCheckpointRepo
    );
    const ingestor = new SILIngestor(new MockVerifier(), store, registry, loop);
    const kafkaBridge = new KafkaBridge(ingestor);
    router.setKafkaBridge(kafkaBridge);

    await kafkaBridge.simulateConsume({
      eventId: "e1", type: "SESSION_CREATED", sessionId, tenantId: "tenant",
      timestamp: Date.now(), hash: "h1", signature: "s1"
    });
    
    // This will trigger P7 and the persistence transaction. The transaction will fail on checkpoint save.
    await kafkaBridge.simulateConsume({
      eventId: "e2", type: "P6_RUNTIME_COMPLETED", sessionId, tenantId: "tenant",
      timestamp: Date.now(), hash: "h2", signature: "s2"
    });

    await new Promise(r => setTimeout(r, 100));
    
    // Loop should have transitioned to FAILED due to the unhandled crash in the event loop
    expect(loop.getState(sessionId)?.status).toBe("FAILED");

    // The transaction should have rolled back. Report should NOT exist.
    const rawStorage = await storageAdapter._dumpStore();
    const reportsCol = rawStorage.get("reports");
    expect(reportsCol).toBeUndefined(); // or empty
    
    // Now simulate restart and recovery - since no checkpoint was saved, it starts from scratch or last valid checkpoint
    const newRegistry = new MemorySessionRegistry();
    const recoveryManager = new RecoveryManager(
      loop, storageAdapter, checkpointRepo, {} as any, {} as any, reportRepo, newRegistry
    );
    const recovered = await recoveryManager.recover("tenant", sessionId);
    expect(recovered).toBe(false); // No checkpoint was successfully saved
  });
});
