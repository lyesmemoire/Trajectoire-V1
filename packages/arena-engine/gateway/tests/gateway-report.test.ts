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

describe("Gateway Phase 2-E — Report API", () => {
  it("Should finish session, trigger evaluation, and allow report retrieval via SILClient", async () => {
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

    const tenantId = "tenant-report";
    const signer = new EventSigner();
    signer.setSecret(tenantId, "test-secret");
    const silClient = new SILClient(kafkaBridge, loop, reportRepo);
    const app = createGatewayApp(silClient, signer);

    // 1. Create Session
    const createRes = await request(app)
      .post("/api/interviews")
      .set("x-tenant-id", tenantId)
      .send({ metadata: {} });
    const sessionId = createRes.body.sessionId;

    await new Promise(r => setTimeout(r, 50));

    // 2. Finish Session
    const finishRes = await request(app)
      .post(`/api/interviews/${sessionId}/finish`)
      .set("x-tenant-id", tenantId)
      .send();
    expect(finishRes.status).toBe(202);

    // Give SIL time to process P6 -> P7 -> Storage (retry loop for async processing)
    let getReportRes: any;
    for (let attempt = 0; attempt < 10; attempt++) {
      await new Promise(r => setTimeout(r, 100));
      getReportRes = await request(app)
        .get(`/api/interviews/${sessionId}/report`)
        .set("x-tenant-id", tenantId)
        .send();
      if (getReportRes.status === 200) break;
    }

    expect(getReportRes.status).toBe(200);
    expect(getReportRes.body).toHaveProperty("reportId");
    expect(getReportRes.body).toHaveProperty("reportHash");
    expect(getReportRes.body.score).toBeDefined();

    // Verify checkpoint was also generated and saved during this flow (internal invariant)
    const checkpoint = await checkpointRepo.load(tenantId, sessionId);
    expect(checkpoint).toBeDefined();
    expect(checkpoint!.state.status).toBe("COMPLETED");
  });
});
