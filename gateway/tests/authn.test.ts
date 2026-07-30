import { describe, it, expect, beforeEach } from "vitest";
import { CryptoJwtVerifier } from "../services/auth";
import * as crypto from "crypto";

function createJwt(payload: _unknown, secret: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = Buffer.from(JSON.stringify(header)).toString("base64url");
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");
  return `${headerB64}.${payloadB64}.${signature}`;
}

describe("Gateway Phase 2-H.1 — AuthN (Identity)", () => {
  const SECRET = "test-jwt-secret-key";
  let verifier: CryptoJwtVerifier;

  beforeEach(() => {
    verifier = new CryptoJwtVerifier(SECRET);
  });

  it("Should accept a valid JWT", async () => {
    const token = createJwt({
      sub: "user_123",
      tenantDid: "did:tenant:abc",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }, SECRET);

    const principal = await verifier.verifyToken(token);
    expect(principal.subjectId).toBe("user_123");
    expect(principal.tenantDid).toBe("did:tenant:abc");
  });

  it("Should reject an expired JWT", async () => {
    const token = createJwt({
      sub: "user_123",
      tenantDid: "did:tenant:abc",
      iat: Math.floor(Date.now() / 1000) - 7200,
      exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1h ago
    }, SECRET);

    await expect(verifier.verifyToken(token)).rejects.toThrow("JWT expired");
  });

  it("Should reject a JWT signed with the wrong key", async () => {
    const token = createJwt({
      sub: "user_123",
      tenantDid: "did:tenant:abc",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }, "wrong-secret-key");

    await expect(verifier.verifyToken(token)).rejects.toThrow("Invalid JWT signature");
  });

  it("Should reject a manually modified JWT payload (forged)", async () => {
    const token = createJwt({
      sub: "user_123",
      tenantDid: "did:tenant:abc",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }, SECRET);

    // Modify the payload without resigning
    const parts = token.split(".");
    const forgedPayload = {
      ...JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8")),
      sub: "admin_user_456"
    };
    parts[1] = Buffer.from(JSON.stringify(forgedPayload)).toString("base64url");
    const forgedToken = parts.join(".");

    await expect(verifier.verifyToken(forgedToken)).rejects.toThrow("Invalid JWT signature");
  });
});
