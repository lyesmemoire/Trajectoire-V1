import { IncomingSILEvent } from "../../contracts/sil-events";
import { TenantKeyManager } from "../../contracts/tenant-key-manager";
import { canonicalize } from "../../utils/canonicalize";
import * as crypto from "crypto";

export class MockTenantKeyManager implements TenantKeyManager {
  private secrets = new Map<string, string[]>();

  setSecret(tenantId: string, secret: string) {
    const existing = this.secrets.get(tenantId) || [];
    this.secrets.set(tenantId, [secret, ...existing]); // Latest secret first
  }

  async getActiveKey(tenantId: string): Promise<string | undefined> {
    const keys = this.secrets.get(tenantId);
    return keys ? keys[0] : undefined;
  }

  async getVerificationKeys(tenantId: string): Promise<string[]> {
    return this.secrets.get(tenantId) || [];
  }
}

export function signEventForTest(event: Partial<IncomingSILEvent>, secret: _string): IncomingSILEvent {
  const hashPayload = `${event.tenantId}:${event.sessionId}:${event.eventId}:${event.timestamp}:${event.type}:${canonicalize(event.payload || {})}`;
  const hash = crypto.createHash("sha256").update(hashPayload).digest("hex");
  const signature = crypto.createHmac("sha256", secret).update(hash).digest("hex");

  return {
    ...event,
    signature
  } as IncomingSILEvent;
}
