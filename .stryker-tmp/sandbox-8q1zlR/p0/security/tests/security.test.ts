// @ts-nocheck
import { describe, it, expect } from "vitest";
import { generateTenantDID, createSessionIdentity, verifySessionBinding } from "../identity";
import { createSignedEvent, verifySignedEvent } from "../signed-event";
import { createHashChain, appendToChain, validateChain } from "../hash-chain";
import { createPolicyEngine, PolicyInput } from "../policy-engine";

// ============================================================
// P0.6 ZERO TRUST — SECURITY NON-REGRESSION SUITE
// ============================================================

describe("P0.6 — Identity Plane", () => {
  it("Z1: Tenant DID generation produces valid cryptographic identity", () => {
    const tenant = generateTenantDID("t_001");

    expect(tenant.did).toBe("did:deds:t_001");
    expect(tenant.publicKey).toBeTruthy();
    expect(tenant.privateKey).toBeTruthy();
    expect(tenant.publicKey).not.toBe(tenant.privateKey);
  });

  it("Z2: Session identity is cryptographically bound to tenant", () => {
    const tenant = generateTenantDID("t_002");
    const session = createSessionIdentity("s_001", tenant);

    expect(session.tenantDid).toBe(tenant.did);
    expect(session.sessionSignature).toBeTruthy();

    // Verify binding with correct key → true
    const valid = verifySessionBinding(session, tenant.publicKey);
    expect(valid).toBe(true);
  });

  it("Z3: Session binding fails with wrong tenant key (spoofing detection)", () => {
    const tenantA = generateTenantDID("t_A");
    const tenantB = generateTenantDID("t_B");
    const session = createSessionIdentity("s_001", tenantA);

    // Verify with wrong tenant's key → false
    const valid = verifySessionBinding(session, tenantB.publicKey);
    expect(valid).toBe(false);
  });
});

describe("P0.6 — Signed Event System", () => {
  it("Z4: Signed event is verifiable with correct key", () => {
    const tenant = generateTenantDID("t_003");
    const session = createSessionIdentity("s_002", tenant);

    const event = createSignedEvent(
      "runtime.command",
      { text: "Hello", timestamp: 1000 },
      session.sessionId,
      tenant.did,
      session.ephemeralPrivateKey
    );

    const result = verifySignedEvent(event, session.ephemeralPublicKey);
    expect(result.valid).toBe(true);
  });

  it("Z5: Tampered payload is detected (hash mismatch)", () => {
    const tenant = generateTenantDID("t_004");
    const session = createSessionIdentity("s_003", tenant);

    const event = createSignedEvent(
      "runtime.command",
      { text: "Hello" },
      session.sessionId,
      tenant.did,
      session.ephemeralPrivateKey
    );

    // Tamper with payload
    const tampered = { ...event, payload: { text: "HACKED" } };

    const result = verifySignedEvent(tampered, session.ephemeralPublicKey);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("HASH_MISMATCH");
  });

  it("Z6: Forged signature is detected", () => {
    const tenantA = generateTenantDID("t_A2");
    const tenantB = generateTenantDID("t_B2");
    const sessionA = createSessionIdentity("s_004", tenantA);
    const sessionB = createSessionIdentity("s_005", tenantB);

    const event = createSignedEvent(
      "runtime.command",
      { text: "Hello" },
      sessionA.sessionId,
      tenantA.did,
      sessionA.ephemeralPrivateKey
    );

    // Verify with wrong key → signature invalid
    const result = verifySignedEvent(event, sessionB.ephemeralPublicKey);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("SIGNATURE_INVALID");
  });
});

describe("P0.6 — Hash Chain Integrity", () => {
  it("Z7: Valid chain passes validation", () => {
    const tenant = generateTenantDID("t_005");
    const session = createSessionIdentity("s_006", tenant);

    let chain = createHashChain(session.sessionId, tenant.did);

    const e1 = createSignedEvent("msg", { n: 1 }, session.sessionId, tenant.did, session.ephemeralPrivateKey, chain.headHash);
    chain = appendToChain(chain, e1);

    const e2 = createSignedEvent("msg", { n: 2 }, session.sessionId, tenant.did, session.ephemeralPrivateKey, chain.headHash);
    chain = appendToChain(chain, e2);

    const e3 = createSignedEvent("msg", { n: 3 }, session.sessionId, tenant.did, session.ephemeralPrivateKey, chain.headHash);
    chain = appendToChain(chain, e3);

    const result = validateChain(chain);
    expect(result.valid).toBe(true);
    expect(chain.length).toBe(3);
  });

  it("Z8: Out-of-order event breaks chain (reordering detection)", () => {
    const tenant = generateTenantDID("t_006");
    const session = createSessionIdentity("s_007", tenant);

    let chain = createHashChain(session.sessionId, tenant.did);

    const e1 = createSignedEvent("msg", { n: 1 }, session.sessionId, tenant.did, session.ephemeralPrivateKey, chain.headHash);
    chain = appendToChain(chain, e1);

    // Create e2 with WRONG previous hash (simulating injection/reorder)
    const eInjected = createSignedEvent("msg", { n: "INJECTED" }, session.sessionId, tenant.did, session.ephemeralPrivateKey, "fake_hash");

    expect(() => appendToChain(chain, eInjected)).toThrow("CHAIN_INTEGRITY_VIOLATION");
  });

  it("Z9: Cross-tenant event injection is blocked", () => {
    const tenantA = generateTenantDID("t_A3");
    const tenantB = generateTenantDID("t_B3");
    const sessionA = createSessionIdentity("s_008", tenantA);

    const chain = createHashChain(sessionA.sessionId, tenantA.did);

    // Event from tenant B trying to enter tenant A's chain
    const foreignEvent = createSignedEvent("msg", { n: 1 }, sessionA.sessionId, tenantB.did, createSessionIdentity("s_009", tenantB).ephemeralPrivateKey, chain.headHash);

    expect(() => appendToChain(chain, foreignEvent)).toThrow("TENANT_MISMATCH");
  });
});

describe("P0.6 — Policy Engine (OPA)", () => {
  const engine = createPolicyEngine();

  it("Z10: Same-tenant access is allowed", () => {
    const input: PolicyInput = {
      action: "session.read",
      tenantId: "t_100",
      role: "user",
      jwt: { tenantId: "t_100", did: "did:deds:t_100", role: "user" },
      resource: { tenantId: "t_100", sessionId: "s_100" },
    };
    expect(engine.evaluate(input).decision).toBe("ALLOW");
  });

  it("Z11: Cross-tenant access is denied", () => {
    const input: PolicyInput = {
      action: "session.read",
      tenantId: "t_100",
      role: "user",
      jwt: { tenantId: "t_100", did: "did:deds:t_100", role: "user" },
      resource: { tenantId: "t_200", sessionId: "s_200" },
    };
    const result = engine.evaluate(input);
    expect(result.decision).toBe("DENY");
    expect(result.deniedBy).toBe("tenant_isolation");
  });

  it("Z12: P7 internal events cannot be published by external callers", () => {
    const input: PolicyInput = {
      action: "evaluation.result",
      tenantId: "t_100",
      role: "user",
      jwt: { tenantId: "t_100", did: "did:deds:t_100", role: "user" },
    };
    const result = engine.evaluate(input);
    expect(result.decision).toBe("DENY");
    expect(result.deniedBy).toBe("p7_internal_protection");
  });

  it("Z13: Admin bypasses tenant isolation (authorized escalation)", () => {
    const input: PolicyInput = {
      action: "report.read",
      tenantId: "t_admin",
      role: "admin",
      jwt: { tenantId: "t_admin", did: "did:deds:t_admin", role: "admin" },
      resource: { tenantId: "t_200", sessionId: "s_200" },
    };
    expect(engine.evaluate(input).decision).toBe("ALLOW");
  });
});
