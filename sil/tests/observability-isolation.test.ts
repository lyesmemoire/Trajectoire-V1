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
import { InMemoryStorageAdapter } from "../services/storage-adapter";
import { PostgresCheckpointRepository } from "../services/postgres/checkpoint-repository";
import { PostgresReportRepository } from "../services/postgres/report-repository";
import { InMemoryObservabilityBus } from "../services/observability/in-memory-observability-bus";
import { InMemoryLogger } from "../services/logging/in-memory-logger";

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

const setup = (withObservability: boolean) => {
  const store = new MemoryEventStore();
  const router = new EventRouter();
  const registry = new MemorySessionRegistry();
  const p6 = new MockP6RuntimeClient();
  const p7 = new MockP7EvaluatorClient();
  const traceProvider = new MockRuntimeTraceProvider();
  const failureController = new FailureController(router);
  const storageAdapter = new InMemoryStorageAdapter();
  const reportRepo = new PostgresReportRepository(storageAdapter);
  const checkpointRepo = new PostgresCheckpointRepository(storageAdapter);
  
  const bus = withObservability ? new InMemoryObservabilityBus() : undefined;
  const logger = withObservability ? new InMemoryLogger() : undefined;

  const loop = new SILRuntimeLoop(
    router, p6, p7, traceProvider, failureController, store,
    storageAdapter, reportRepo, checkpointRepo,
    bus, logger
  );
  
  const verifier = new MockVerifier();
  const ingestor = new SILIngestor(verifier, store, registry, loop);
  const kafkaBridge = new KafkaBridge(ingestor);
  
  router.setKafkaBridge(kafkaBridge);

  return { store, loop, kafkaBridge, bus, logger };
};

describe("Phase 2-I: Observability Isolation", () => {
  it("observability events must NOT affect the runtime execution or resulting state hashes", async () => {
    // 1. Run without observability
    const runA = setup(false);
    const sessionIdA = "session-iso";
    const tenantIdA = "tenant-A";

    await runA.kafkaBridge.simulateConsume({
      eventId: "e1", type: "SESSION_CREATED", sessionId: sessionIdA, tenantId: tenantIdA, timestamp: 100, signature: "", hash: ""
    });
    await runA.kafkaBridge.simulateConsume({
      eventId: "e2", type: "SESSION_FINISHED", sessionId: sessionIdA, tenantId: tenantIdA, timestamp: 101, signature: "", hash: ""
    });
    // Let the loop settle to generate report
    await new Promise(r => setTimeout(r, 50));
    
    const stateA = runA.loop.getState(sessionIdA);
    const hashA = stateA?.runtimeContext.p7State?.evaluationHash;
    expect(hashA).toBeDefined();

    // 2. Run with observability
    const runB = setup(true);
    const sessionIdB = "session-iso"; // same id for deterministic trace if any
    const tenantIdB = "tenant-A";

    await runB.kafkaBridge.simulateConsume({
      eventId: "e1", type: "SESSION_CREATED", sessionId: sessionIdB, tenantId: tenantIdB, timestamp: 100, signature: "", hash: ""
    });
    await runB.kafkaBridge.simulateConsume({
      eventId: "e2", type: "SESSION_FINISHED", sessionId: sessionIdB, tenantId: tenantIdB, timestamp: 101, signature: "", hash: ""
    });
    await new Promise(r => setTimeout(r, 50));
    
    const stateB = runB.loop.getState(sessionIdB);
    const hashB = stateB?.runtimeContext.p7State?.evaluationHash;
    expect(hashB).toBeDefined();

    // 3. Assert equality
    expect(hashA).toBe(hashB);

    // 4. Verify observability actually captured things
    expect(runB.bus?.events.length).toBeGreaterThan(0);
    expect(runB.logger?.entries.length).toBeGreaterThan(0);
  });
});
