import { describe, it, expect } from "vitest";
import request from "supertest";
import * as crypto from "crypto";
import { createGatewayApp, GatewayDependencies } from "../app";
import { EventSigner } from "../services/event-signer";
import { CryptoJwtVerifier } from "../services/auth";
import { MockTenantResolver } from "../services/tenant-resolver";
import { MockAuthorizationService } from "../services/rbac";
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
import { SecurityAuditRecord, SecurityAuditStore } from "../../sil/contracts/security-audit-store";
import { MockP6RuntimeClient } from "../../sil/tests/mocks/mock-p6-runtime-client";
import { MockP7EvaluatorClient } from "../../sil/tests/mocks/mock-p7-evaluator-client";
import { MockRuntimeTraceProvider } from "../../sil/tests/mocks/mock-runtime-trace-provider";

// --- Helpers ---
const JWT_SECRET = "e2e-jwt-secret";
const TENANT_SECRET = "e2e-tenant-hmac-secret";

function createJwt(payload: unknown, secret: string = JWT_SECRET): string {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = Buffer.from(JSON.stringify(header)).toString("base64url");
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");
  return `${headerB64}.${payloadB64}.${signature}`;
}

class MockVerifier implements EventVerifier {
  async verifySignature(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTimestamp(): Promise<VerificationResult> { return { isValid: true }; }
  async verifyTenant(): Promise<VerificationResult> { return { isValid: true }; }
}

class MemoryAuditStore implements SecurityAuditStore {
  records: SecurityAuditRecord[] = [];
  async logRejection(record: SecurityAuditRecord): Promise<void> {
    this.records.push(record);
  }
}

function buildSecuredGateway() {
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
  signer.setSecret("tenant-alpha", TENANT_SECRET);
  const silClient = new SILClient(kafkaBridge, loop, reportRepo);

  const jwtVerifier = new CryptoJwtVerifier(JWT_SECRET);
  const tenantResolver = new MockTenantResolver();
  tenantResolver.setMapping("did:tenant:alpha", "tenant-alpha");
  const authz = new MockAuthorizationService();
  const auditStore = new MemoryAuditStore();

  const deps: GatewayDependencies = {
    silClient, signer, jwtVerifier, tenantResolver, authz, auditStore
  };
  const app = createGatewayApp(deps);

  return { app, silClient, auditStore };
}

function recruiterJwt() {
  return createJwt({
    sub: "user_recruiter_1",
    tenantDid: "did:tenant:alpha",
    roles: ["recruiter"],
    iss: "intervo-auth",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  });
}

function candidateJwt() {
  return createJwt({
    sub: "user_candidate_1",
    tenantDid: "did:tenant:alpha",
    roles: ["candidate"],
    iss: "intervo-auth",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  });
}

// --- Tests ---
describe("Gateway Phase 2-H — Full Secured Pipeline E2E", () => {

  it("Recruiter can create a session via secured pipeline", async () => {
    const { app } = buildSecuredGateway();

    const res = await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${recruiterJwt()}`)
      .send({ metadata: { name: "Secured Interview" } });

    expect(res.status).toBe(201);
    expect(res.body.sessionId).toBeDefined();
  });

  it("Unauthenticated request is rejected with 401", async () => {
    const { app } = buildSecuredGateway();

    const res = await request(app)
      .post("/api/interviews")
      .send({ metadata: {} });

    expect(res.status).toBe(401);
  });

  it("Expired JWT is rejected with 401", async () => {
    const { app } = buildSecuredGateway();

    const expiredToken = createJwt({
      sub: "user_1",
      tenantDid: "did:tenant:alpha",
      roles: ["recruiter"],
      iss: "intervo-auth",
      iat: Math.floor(Date.now() / 1000) - 7200,
      exp: Math.floor(Date.now() / 1000) - 3600
    });

    const res = await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${expiredToken}`)
      .send({ metadata: {} });

    expect(res.status).toBe(401);
  });

  it("Candidate cannot create a session (insufficient permissions)", async () => {
    const { app, auditStore } = buildSecuredGateway();

    const res = await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${candidateJwt()}`)
      .send({ metadata: {} });

    expect(res.status).toBe(403);
    // Verify the rejection was audited
    expect(auditStore.records.length).toBeGreaterThanOrEqual(1);
    expect(auditStore.records[0].reason).toContain("session:create");
  });

  it("Unknown tenant DID is rejected with 403", async () => {
    const { app } = buildSecuredGateway();

    const unknownTenantJwt = createJwt({
      sub: "hacker_1",
      tenantDid: "did:tenant:unknown",
      roles: ["tenant_admin"],
      iss: "intervo-auth",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    });

    const res = await request(app)
      .post("/api/interviews")
      .set("Authorization", `Bearer ${unknownTenantJwt}`)
      .send({ metadata: {} });

    expect(res.status).toBe(403);
  });
});
