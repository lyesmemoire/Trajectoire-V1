// @ts-nocheck
import { describe, it, expect } from "vitest";
import request from "supertest";
import { createGatewayApp } from "../app";
import { EventSigner } from "../services/event-signer";
import { SILClient } from "../../sil/public-api/sil-client";
import { SILRuntimeLoop } from "../../sil/core/runtime-loop";
import { MemoryEventStore } from "../../sil/services/memory-event-store";
import { EventRouter } from "../../sil/services/event-router";
import { FailureController } from "../../sil/core/failure-controller";
import { SILIngestor } from "../../sil/services/ingestor";
import { KafkaBridge } from "../../sil/services/kafka-bridge";
import { EventVerifier, VerificationResult } from "../../sil/contracts/event-verifier";
import { InMemoryStorageAdapter } from "../../sil/services/storage-adapter";
import { PostgresReportRepository } from "../../sil/services/postgres/report-repository";
import { PostgresCheckpointRepository } from "../../sil/services/postgres/checkpoint-repository";
import { MemorySessionRegistry } from "../../sil/services/memory-session-registry";
import { MockP6RuntimeClient } from "../../sil/tests/mocks/mock-p6-runtime-client";
import { MockP7EvaluatorClient } from "../../sil/tests/mocks/mock-p7-evaluator-client";
import { MockRuntimeTraceProvider } from "../../sil/tests/mocks/mock-runtime-trace-provider";

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

describe("Gateway Phase 2-E — Session API", () => {
  it("Should create a session, start it, and verify SIL state", async () => {
    const router = new EventRouter();
    const store = new MemoryEventStore();
    const registry = new MemorySessionRegistry();
    const storageAdapter = new InMemoryStorageAdapter();
    const reportRepo = new PostgresReportRepository(storageAdapter);
    const checkpointRepo = new PostgresCheckpointRepository(storageAdapter);
    const loop = new SILRuntimeLoop(
      router, new MockP6RuntimeClient(), new MockP7EvaluatorClient(),
      new MockRuntimeTraceProvider(), new FailureController(router), store,
      storageAdapter, reportRepo, checkpointRepo
    );
    const ingestor = new SILIngestor(new MockVerifier(), store, registry, loop);
    const kafkaBridge = new KafkaBridge(ingestor);
    router.setKafkaBridge(kafkaBridge);

    const signer = new EventSigner();
    signer.setSecret("tenant-foo", "test-secret");
    const silClient = new SILClient(kafkaBridge, loop, reportRepo);
    const app = createGatewayApp(silClient, signer);

    // Test: Create Session
    const createRes = await request(app)
      .post("/api/interviews")
      .set("x-tenant-id", "tenant-foo")
      .send({ metadata: { name: "Test Interview" } });

    expect(createRes.status).toBe(201);
    expect(createRes.body.sessionId).toBeDefined();
    expect(createRes.body.state).toBe("STARTING");

    const sessionId = createRes.body.sessionId;

    // Allow async ingestion
    await new Promise(r => setTimeout(r, 50));

    // Verify SIL state — need tenantId for the query now
    const stateBeforeStart = await silClient.getSessionState({ tenantId: "tenant-foo", sessionId });
    expect(stateBeforeStart.state).toBe("RUNNING");

    // Test: Start Session
    const startRes = await request(app)
      .post(`/api/interviews/${sessionId}/start`)
      .set("x-tenant-id", "tenant-foo")
      .send();

    expect(startRes.status).toBe(200);
    expect(startRes.body.state).toBe("RUNNING");
  });
});
