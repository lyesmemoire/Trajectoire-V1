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
import { InMemoryStorageAdapter } from "../services/storage-adapter";
import { PostgresCheckpointRepository } from "../services/postgres/checkpoint-repository";
import { PostgresSessionRepository } from "../services/postgres/session-repository";
import { PostgresTraceRepository } from "../services/postgres/trace-repository";
import { PostgresReportRepository } from "../services/postgres/report-repository";
import { RecoveryManager } from "../core/recovery-manager";
import { MemorySessionRegistry } from "../services/memory-session-registry";

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

describe("Phase 2-F: Cross-Tenant Replay Isolation", () => {
  it("Should not recover checkpoints across tenants", async () => {
    const router = new EventRouter();
    const store = new MemoryEventStore();
    const adapter = new InMemoryStorageAdapter();
    const registry = new MemorySessionRegistry();
    const checkpointRepo = new PostgresCheckpointRepository(adapter);
    const sessionRepo = new PostgresSessionRepository(adapter);
    const traceRepo = new PostgresTraceRepository(adapter);
    const reportRepo = new PostgresReportRepository(adapter);

    const loop = new SILRuntimeLoop(
      router, new MockP6RuntimeClient(), new MockP7EvaluatorClient(),
      new MockRuntimeTraceProvider(), new FailureController(router), store,
      adapter, reportRepo, checkpointRepo
    );
    const ingestor = new SILIngestor(new MockVerifier(), store, registry, loop);
    const recoveryManager = new RecoveryManager(loop, adapter, checkpointRepo, sessionRepo, traceRepo, reportRepo, registry);

    const sessionId = "session-iso-2";
    
    // 1. Setup Tenant A
    const eventA: SILEvent = {
      eventId: "e1",
      sessionId,
      tenantId: "tenant-A",
      type: "SESSION_CREATED",
      payload: {},
      timestamp: Date.now(),
      hash: "h1", signature: "s1"
    };

    await ingestor.ingest(eventA);
    await new Promise(r => setTimeout(r, 10));

    // Manually persist a checkpoint for Tenant A
    const stateA = loop.getState(sessionId)!;
    await checkpointRepo.save("tenant-A", {
      sessionId,
      tenantId: "tenant-A",
      state: JSON.parse(JSON.stringify(stateA)),
      lastEventId: "e1",
      runtimePointer: stateA.pointer,
      eventHash: "h1",
      createdAt: new Date().toISOString()
    });

    // 2. Try to recover the session pretending to be Tenant B
    // We mock the checkpointRepo to return Tenant A's checkpoint despite the "tenant-B" request.
    // This simulates a broken storage adapter or corrupted DB, testing RecoveryManager's defense-in-depth.
    checkpointRepo.load = async (tId: string, sId: string) => {
      // Intentionally return Tenant A's checkpoint
      return (checkpointRepo as any).adapter.loadRecord("checkpoints", "tenant-A", sId);
    };

    await expect(recoveryManager.recover("tenant-B", sessionId)).rejects.toThrow("RECOVERY_FAILED: Tenant mismatch");
  });
});
