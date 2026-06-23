import { describe, it, expect, beforeEach } from "vitest";
import { CryptoEventVerifier } from "../../services/crypto-event-verifier";
import { MockTenantKeyManager, signEventForTest } from "./crypto-test-helper";

describe("CryptoEventVerifier Security Boundary", () => {
  let keyManager: MockTenantKeyManager;
  let verifier: CryptoEventVerifier;

  const TENANT_A = "tenant-a";
  const TENANT_B = "tenant-b";
  const SECRET_A = "super-secret-a";
  const SECRET_B = "super-secret-b";

  beforeEach(() => {
    keyManager = new MockTenantKeyManager();
    keyManager.setSecret(TENANT_A, SECRET_A);
    keyManager.setSecret(TENANT_B, SECRET_B);
    verifier = new CryptoEventVerifier(keyManager);
  });

  it("should accept a validly signed event", async () => {
    const event = signEventForTest({
      eventId: "e1",
      type: "USER_MESSAGE",
      sessionId: "s1",
      tenantId: TENANT_A,
      timestamp: Date.now(),
      payload: { msg: "hello" }
    }, SECRET_A);

    const result = await verifier.verifySignature(event);
    expect(result.isValid).toBe(true);
  });

  it("invalid-signature.test.ts: should reject tampered payload", async () => {
    const event = signEventForTest({
      eventId: "e1",
      type: "USER_MESSAGE",
      sessionId: "s1",
      tenantId: TENANT_A,
      timestamp: Date.now(),
      payload: { msg: "hello" }
    }, SECRET_A);

    // Tamper with the payload after signing
    event.payload = { msg: "malicious" };

    const result = await verifier.verifySignature(event);
    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.reason).toContain("mismatch");
    }
  });

  it("cross-tenant-signature.test.ts: should reject signature from wrong tenant secret", async () => {
    // Event claims to be for Tenant A, but is signed with Tenant B's secret
    const event = signEventForTest({
      eventId: "e1",
      type: "USER_MESSAGE",
      sessionId: "s1",
      tenantId: TENANT_A,
      timestamp: Date.now(),
      payload: { msg: "hello" }
    }, SECRET_B);

    const result = await verifier.verifySignature(event);
    expect(result.isValid).toBe(false);
  });

  it("future-timestamp.test.ts: should reject events too far in the future", async () => {
    const event = signEventForTest({
      eventId: "e1",
      type: "USER_MESSAGE",
      sessionId: "s1",
      tenantId: TENANT_A,
      timestamp: Date.now() + 10 * 60 * 1000, // +10 minutes
      payload: { msg: "hello" }
    }, SECRET_A);

    const result = await verifier.verifyTimestamp(event);
    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.reason).toContain("future");
    }
  });

  it("expired-timestamp: should reject events too old", async () => {
    const event = signEventForTest({
      eventId: "e1",
      type: "USER_MESSAGE",
      sessionId: "s1",
      tenantId: TENANT_A,
      timestamp: Date.now() - 10 * 60 * 1000, // -10 minutes
      payload: { msg: "hello" }
    }, SECRET_A);

    const result = await verifier.verifyTimestamp(event);
    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.reason).toContain("old");
    }
  });
});
