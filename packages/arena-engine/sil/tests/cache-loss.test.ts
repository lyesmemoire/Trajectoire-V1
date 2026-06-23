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
import { RedisReportCache } from "../services/cache/report-cache";
import { EventVerifier, VerificationResult } from "../contracts/event-verifier";
import { MemorySessionRegistry } from "../services/memory-session-registry";

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

describe("SIL Phase 2-D — Cache Loss", () => {
  it("Should demonstrate Redis data loss does not affect the source of truth (Postgres)", async () => {
    const postgresAdapter = new InMemoryStorageAdapter();
    const redisAdapter = new InMemoryStorageAdapter(); // Simulating a different store
    
    const reportRepo = new PostgresReportRepository(postgresAdapter);
    const checkpointRepo = new PostgresCheckpointRepository(postgresAdapter);
    const reportCache = new RedisReportCache(redisAdapter);

    const sessionId = "session_cache_loss";

    // Phase 1: Generate and persist
    const store = new MemoryEventStore();
    const router = new EventRouter();
    const registry = new MemorySessionRegistry();
    const failureController = new FailureController(router);
    const loop = new SILRuntimeLoop(
      router, new MockP6RuntimeClient(), new MockP7EvaluatorClient(), 
      new MockRuntimeTraceProvider(), failureController, store,
      postgresAdapter, reportRepo, checkpointRepo
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

    // We manually simulate caching the report
    const dbReportId = `mock-report-${sessionId}`;
    const dbReport = await reportRepo.load("tenant", dbReportId);
    expect(dbReport).toBeDefined();
    await reportCache.set("tenant", dbReport!);

    // Phase 2: Nuke Redis
    await redisAdapter._clearStore();
    expect(await reportCache.get("tenant", dbReportId)).toBeNull();

    // Phase 3: Prove Postgres still has truth and we can recover
    const recoveredReport = await reportRepo.load("tenant", dbReportId);
    expect(recoveredReport).not.toBeNull();
    expect(recoveredReport!.reportHash).toBe("mock-report-hash");

    // We can rebuild cache
    await reportCache.set("tenant", recoveredReport!);
    expect(await reportCache.get("tenant", dbReportId)).not.toBeNull();
  });
});
