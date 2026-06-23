import crypto from "crypto";

// --- Signed Event System ---

export interface SignedEvent<T = unknown> {
  readonly eventId: string;
  readonly tenantDid: string;
  readonly sessionId: string;
  readonly timestamp: number;
  readonly type: string;
  readonly version: number;

  readonly payload: T;

  readonly hash: string;
  readonly signature: string;
  readonly previousEventHash: string;
}

/**
 * Compute the canonical hash of an event's content (excludes signature).
 * This is the hash that enters the chain.
 */
export function computeEventHash(
  eventId: string,
  tenantDid: string,
  sessionId: string,
  timestamp: number,
  type: string,
  payload: unknown,
  previousEventHash: string
): string {
  const canonical = JSON.stringify({
    eventId,
    tenantDid,
    sessionId,
    timestamp,
    type,
    payload,
    previousEventHash,
  });

  return crypto.createHash("sha256").update(canonical).digest("hex");
}

/**
 * Create a signed event with hash-chain integrity.
 *
 * @param type - Event type (e.g. "runtime.command")
 * @param payload - Arbitrary event payload
 * @param sessionId - Session this event belongs to
 * @param tenantDid - DID of the owning tenant
 * @param signingKeyHex - Ed25519 private key (DER hex) for signature
 * @param previousEventHash - Hash of the previous event in this session's chain ("0" for genesis)
 */
export function createSignedEvent<T>(
  type: string,
  payload: T,
  sessionId: string,
  tenantDid: string,
  signingKeyHex: string,
  previousEventHash: string = "0"
): SignedEvent<T> {
  const eventId = crypto.randomUUID();
  const timestamp = Date.now();
  const version = 1;

  const hash = computeEventHash(
    eventId,
    tenantDid,
    sessionId,
    timestamp,
    type,
    payload,
    previousEventHash
  );

  // Sign the hash with the session's ephemeral key
  const privateKey = crypto.createPrivateKey({
    key: Buffer.from(signingKeyHex, "hex"),
    format: "der",
    type: "pkcs8",
  });

  const signature = crypto.sign(null, Buffer.from(hash), privateKey).toString("hex");

  return {
    eventId,
    tenantDid,
    sessionId,
    timestamp,
    type,
    version,
    payload,
    hash,
    signature,
    previousEventHash,
  };
}

/**
 * Verify a signed event's integrity:
 * 1. Recompute hash from content → must match event.hash
 * 2. Verify signature against public key → must be valid
 * 3. Verify chain link → event.previousEventHash must match expected
 */
export function verifySignedEvent(
  event: SignedEvent,
  publicKeyHex: string,
  expectedPreviousHash?: string
): { valid: boolean; reason?: string } {
  // 1. Recompute hash
  const recomputedHash = computeEventHash(
    event.eventId,
    event.tenantDid,
    event.sessionId,
    event.timestamp,
    event.type,
    event.payload,
    event.previousEventHash
  );

  if (recomputedHash !== event.hash) {
    return { valid: false, reason: "HASH_MISMATCH: event content has been tampered" };
  }

  // 2. Verify signature
  const publicKey = crypto.createPublicKey({
    key: Buffer.from(publicKeyHex, "hex"),
    format: "der",
    type: "spki",
  });

  const signatureValid = crypto.verify(
    null,
    Buffer.from(event.hash),
    publicKey,
    Buffer.from(event.signature, "hex")
  );

  if (!signatureValid) {
    return { valid: false, reason: "SIGNATURE_INVALID: event was not signed by claimed identity" };
  }

  // 3. Chain integrity
  if (expectedPreviousHash !== undefined && event.previousEventHash !== expectedPreviousHash) {
    return { valid: false, reason: "CHAIN_BROKEN: previousEventHash does not match expected" };
  }

  return { valid: true };
}
