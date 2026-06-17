import * as crypto from "crypto";
import { canonicalize } from "../../sil/utils/canonicalize";

export class EventSigner {
  constructor(private tenantSecrets: Map<string, string> = new Map()) {}

  setSecret(tenantId: string, secret: string) {
    this.tenantSecrets.set(tenantId, secret);
  }

  sign(
    tenantId: string,
    sessionId: string,
    eventId: string,
    type: string,
    payload: any,
    timestamp: number
  ): string {
    const secret = this.tenantSecrets.get(tenantId);
    if (!secret) {
      throw new Error(`Cannot sign: missing secret for tenant ${tenantId}`);
    }

    const hashPayload = `${tenantId}:${sessionId}:${eventId}:${timestamp}:${type}:${canonicalize(payload || {})}`;
    const expectedHash = crypto.createHash("sha256").update(hashPayload).digest("hex");

    return crypto.createHmac("sha256", secret).update(expectedHash).digest("hex");
  }
}
