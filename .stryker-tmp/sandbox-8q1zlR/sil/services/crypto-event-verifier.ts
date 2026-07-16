// @ts-nocheck
import { EventVerifier, VerificationResult } from "../contracts/event-verifier";
import { IncomingSILEvent } from "../contracts/sil-events";
import { TenantKeyManager } from "../contracts/tenant-key-manager";
import { canonicalize } from "../utils/canonicalize";
import * as crypto from "crypto";

const MAX_CLOCK_SKEW_MS = 300000; // 5 minutes

export class CryptoEventVerifier implements EventVerifier {
  constructor(private keyManager: TenantKeyManager) {}

  async verifySignature(event: IncomingSILEvent): Promise<VerificationResult> {
    const secrets = await this.keyManager.getVerificationKeys(event.tenantId);
    if (!secrets || secrets.length === 0) {
      return { isValid: false, reason: `Unknown tenant or missing verification keys for tenant ${event.tenantId}` };
    }

    // Hash the event payload identically to how the Gateway is expected to
    const hashPayload = `${event.tenantId}:${event.sessionId}:${event.eventId}:${event.timestamp}:${event.type}:${canonicalize(event.payload || {})}`;
    const expectedHash = crypto.createHash("sha256").update(hashPayload).digest("hex");

    for (const secret of secrets) {
      const expectedSignature = crypto.createHmac("sha256", secret).update(expectedHash).digest("hex");

      if (event.signature.length === expectedSignature.length) {
        const isValid = crypto.timingSafeEqual(
          Buffer.from(event.signature, "utf8"),
          Buffer.from(expectedSignature, "utf8")
        );
        if (isValid) {
          return { isValid: true };
        }
      }
    }

    return { isValid: false, reason: "Cryptographic signature mismatch against all active keys" };
  }

  async verifyTenant(event: IncomingSILEvent): Promise<VerificationResult> {
    // Basic sanity check, the real enforcement is that the signature was generated
    // with the tenant's exact secret key, which implicitly binds the event to the tenant.
    if (!event.tenantId) {
      return { isValid: false, reason: "Missing tenantId" };
    }
    return { isValid: true };
  }

  async verifyTimestamp(event: IncomingSILEvent): Promise<VerificationResult> {
    const now = Date.now();
    if (event.timestamp < now - MAX_CLOCK_SKEW_MS) {
      return { isValid: false, reason: "Event timestamp too old (expired)" };
    }
    if (event.timestamp > now + MAX_CLOCK_SKEW_MS) {
      return { isValid: false, reason: "Event timestamp too far in the future" };
    }
    return { isValid: true };
  }
}
