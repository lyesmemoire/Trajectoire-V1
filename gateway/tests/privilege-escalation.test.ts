import { describe, it, expect, beforeEach } from "vitest";
import { CryptoJwtVerifier } from "../services/auth";
import * as crypto from "crypto";

function createJwt(payload: any, secret: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = Buffer.from(JSON.stringify(header)).toString("base64url");
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");
  return `${headerB64}.${payloadB64}.${signature}`;
}

describe("Gateway Phase 2-H.3 — Privilege Escalation Prevention", () => {
  const SECRET = "secret-key-for-gateway";
  let verifier: CryptoJwtVerifier;

  beforeEach(() => {
    verifier = new CryptoJwtVerifier(SECRET);
  });

  it("Should reject a JWT with a forged role array", async () => {
    // 1. Attacker receives a valid token for a candidate
    const validCandidateToken = createJwt({
      sub: "attacker_1",
      tenantDid: "did:X",
      roles: ["candidate"],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }, SECRET);

    // 2. Attacker modifies the payload to elevate privileges
    const parts = validCandidateToken.split(".");
    const forgedPayload = {
      ...JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8")),
      roles: ["tenant_admin"] // Escalation!
    };
    parts[1] = Buffer.from(JSON.stringify(forgedPayload)).toString("base64url");
    const forgedToken = parts.join(".");

    // 3. Gateway must reject the token completely due to signature mismatch
    await expect(verifier.verifyToken(forgedToken)).rejects.toThrow("Invalid JWT signature");
  });
});
