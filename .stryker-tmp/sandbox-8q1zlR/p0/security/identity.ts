// @ts-nocheck
import crypto from "crypto";

// --- Tenant Identity (DID-like) ---

export interface TenantIdentity {
  readonly tenantId: string;
  readonly did: string;
  readonly publicKey: string;
  readonly privateKey: string;
  readonly policyVersion: string;
}

export interface SessionIdentity {
  readonly sessionId: string;
  readonly tenantDid: string;
  readonly ephemeralPublicKey: string;
  readonly ephemeralPrivateKey: string;
  readonly sessionSignature: string;
}

/**
 * Generate a deterministic DID for a tenant.
 * Format: did:deds:<tenantId>
 */
export function generateTenantDID(tenantId: string): TenantIdentity {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");

  const pubKeyHex = publicKey.export({ type: "spki", format: "der" }).toString("hex");
  const privKeyHex = privateKey.export({ type: "pkcs8", format: "der" }).toString("hex");

  return {
    tenantId,
    did: `did:deds:${tenantId}`,
    publicKey: pubKeyHex,
    privateKey: privKeyHex,
    policyVersion: "1.0.0",
  };
}

/**
 * Create a session identity bound to a tenant DID.
 * The session gets an ephemeral key pair, signed by the tenant.
 */
export function createSessionIdentity(
  sessionId: string,
  tenant: TenantIdentity
): SessionIdentity {
  // Generate ephemeral key pair for this session
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");

  const ephPubHex = publicKey.export({ type: "spki", format: "der" }).toString("hex");
  const ephPrivHex = privateKey.export({ type: "pkcs8", format: "der" }).toString("hex");

  // Sign the session binding with the tenant's private key
  const tenantPrivKey = crypto.createPrivateKey({
    key: Buffer.from(tenant.privateKey, "hex"),
    format: "der",
    type: "pkcs8",
  });

  const bindingData = `${sessionId}:${tenant.did}:${ephPubHex}`;
  const signature = crypto.sign(null, Buffer.from(bindingData), tenantPrivKey).toString("hex");

  return {
    sessionId,
    tenantDid: tenant.did,
    ephemeralPublicKey: ephPubHex,
    ephemeralPrivateKey: ephPrivHex,
    sessionSignature: signature,
  };
}

/**
 * Verify that a session identity was legitimately issued by the claimed tenant.
 */
export function verifySessionBinding(
  session: SessionIdentity,
  tenantPublicKey: string
): boolean {
  const pubKey = crypto.createPublicKey({
    key: Buffer.from(tenantPublicKey, "hex"),
    format: "der",
    type: "spki",
  });

  const bindingData = `${session.sessionId}:${session.tenantDid}:${session.ephemeralPublicKey}`;

  return crypto.verify(
    null,
    Buffer.from(bindingData),
    pubKey,
    Buffer.from(session.sessionSignature, "hex")
  );
}
