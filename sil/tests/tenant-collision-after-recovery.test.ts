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

describe("Phase 2-F: Tenant Collision After Recovery", () => {
  it("Should reject cross-tenant events after a successful recovery", async () => {
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
    const _recoveryManager = new RecoveryManager(loop, adapter, checkpointRepo, sessionRepo, traceRepo, reportRepo, registry);

    const sessionId = "session-iso-3";
    
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

    // Fetch the actual hash from the store since the ingestor now computes it
    const storedHistory = await store.readAfter("tenant-A", sessionId, -1);
    const actualHash = storedHistory[0].hash;

    // Manually persist a checkpoint for Tenant A
    const stateA = loop.getState(sessionId)!;
    await checkpointRepo.save("tenant-A", {
      sessionId,
      tenantId: "tenant-A",
      state: JSON.parse(JSON.stringify(stateA)),
      lastEventId: "e1",
      runtimePointer: stateA.pointer,
      eventHash: actualHash,
      createdAt: new Date().toISOString()
    });

    // Simulate crash by creating a new runtime loop instance
    const newRouter = new EventRouter();
    const newRegistry = new MemorySessionRegistry();
    const newLoop = new SILRuntimeLoop(
      newRouter, new MockP6RuntimeClient(), new MockP7EvaluatorClient(),
      new MockRuntimeTraceProvider(), new FailureController(newRouter), store,
      adapter, reportRepo, checkpointRepo
    );
    const newIngestor = new SILIngestor(new MockVerifier(), store, newRegistry, newLoop);
    const newRecoveryManager = new RecoveryManager(newLoop, adapter, checkpointRepo, sessionRepo, traceRepo, reportRepo, newRegistry);

    // 2. Recover Tenant A
    const recovered = await newRecoveryManager.recover("tenant-A", sessionId);
    expect(recovered).toBe(true);
    
    const restoredState = newLoop.getState(sessionId);
    expect(restoredState).toBeDefined();
    expect(restoredState?.tenantId).toBe("tenant-A");

    // Verify session is registered in the new registry after recovery
    expect(newRegistry.getTenantId(sessionId)).toBe("tenant-A");

    // 3. Inject Tenant B event on Tenant A's recovered session
    const maliciousEvent: SILEvent = {
      eventId: "e2",
      sessionId,
      tenantId: "tenant-B",
      type: "USER_MESSAGE",
      payload: { text: "Sneaky injection after recovery" },
      timestamp: Date.now(),
      hash: "h2", signature: "s2"
    };

    await newIngestor.ingest(maliciousEvent);
    await new Promise(r => setTimeout(r, 10));

    // 4. Verify rejection — session stays healthy because Ingestor caught the violation
    const finalState = newLoop.getState(sessionId);
    // The Ingestor blocks the event before it reaches the RuntimeLoop
    // So the session remains in its recovered state, not FAILED
    expect(finalState?.tenantId).toBe("tenant-A");
    
    // Malicious event shouldn't be in the store
    const tenantBEvents = await store.readAfter("tenant-B", sessionId, -1);
    expect(tenantBEvents.length).toBe(0);
  });
});
