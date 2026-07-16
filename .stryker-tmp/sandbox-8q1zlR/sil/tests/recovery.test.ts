// @ts-nocheck
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

describe("SIL Phase 2-D — Recovery", () => {
  it("Should recover a complete session from the checkpoint and result in the exact same state", async () => {
    const storageAdapter = new InMemoryStorageAdapter();
    const reportRepo = new PostgresReportRepository(storageAdapter);
    const checkpointRepo = new PostgresCheckpointRepository(storageAdapter);

    const sessionId = "session_recovery_test";

    // ── Phase 1: Simulate Normal Execution to generate checkpoint
    {
      const store = new MemoryEventStore();
      const router = new EventRouter();
      const registry = new MemorySessionRegistry();
      const failureController = new FailureController(router);
      const loop = new SILRuntimeLoop(
        router, new MockP6RuntimeClient(), new MockP7EvaluatorClient(), 
        new MockRuntimeTraceProvider(), failureController, store,
        storageAdapter, reportRepo, checkpointRepo
      );
      const ingestor = new SILIngestor(new MockVerifier(), store, registry, loop);
      const kafkaBridge = new KafkaBridge(ingestor);
      router.setKafkaBridge(kafkaBridge);

      await kafkaBridge.simulateConsume({
        eventId: "e1", type: "SESSION_CREATED", sessionId, tenantId: "tenant",
        timestamp: Date.now(), hash: "h1", signature: "s1"
      });
      await kafkaBridge.simulateConsume({
        eventId: "e2", type: "P6_RUNTIME_COMPLETED", sessionId, tenantId: "tenant",
        timestamp: Date.now(), hash: "h2", signature: "s2"
      });

      await new Promise(r => setTimeout(r, 100));
      expect(loop.getState(sessionId)?.status).toBe("COMPLETED");
    }

    // ── Phase 2: Simulate Crash & Recovery (new objects, but same storage)
    {
      const store = new MemoryEventStore();
      const router = new EventRouter();
      const registry = new MemorySessionRegistry();
      const failureController = new FailureController(router);
      const loop = new SILRuntimeLoop(
        router, new MockP6RuntimeClient(), new MockP7EvaluatorClient(), 
        new MockRuntimeTraceProvider(), failureController, store,
        storageAdapter, reportRepo, checkpointRepo
      );
      
      const recoveryManager = new RecoveryManager(
        loop, storageAdapter, checkpointRepo, {} as any, {} as any, reportRepo, registry
      );

      const ckpt = await checkpointRepo.load("tenant", sessionId);
      console.log("CHECKPOINT STATE:", ckpt?.state.status);

      const recovered = await recoveryManager.recover("tenant", sessionId);
      expect(recovered).toBe(true);

      const state = loop.getState(sessionId);
      console.log("STATE AFTER RECOVER:", state?.status);
      expect(state).toBeDefined();
      expect(state!.status).toBe("COMPLETED");
      expect(state!.eventLog.length).toBeGreaterThan(0);
      expect(state!.pointer).toBeGreaterThan(0);

      // Verify registry was populated during recovery
      expect(registry.getTenantId(sessionId)).toBe("tenant");
    }
  });
});
