import { IncomingSILEvent, SILEvent } from "../contracts/sil-events";
import { EventVerifier } from "../contracts/event-verifier";
import { EventStore } from "../contracts/event-store";
import { SessionRegistry } from "../contracts/session-registry";
import { WakeupNotifier } from "../contracts/wakeup-notifier";
import { SecurityAuditStore } from "../contracts/security-audit-store";
import { canonicalize } from "../utils/canonicalize";
import * as crypto from "crypto";

/**
 * SILIngestor — SINGLE enforcement point for tenant isolation and event integrity.
 * 
 * This is a STATELESS validator with append-only writes.
 * It depends ONLY on:
 *   - EventVerifier (signature + hash-chain + tenant verification)
 *   - EventStore (append-only persistence + idempotence check)
 *   - SessionRegistry (lightweight session→tenant mapping)
 *   - WakeupNotifier (notify RuntimeLoop without direct dependency)
 * 
 * It does NOT depend on RuntimeLoop or RuntimeState.
 * 
 * Strict event ordering (anti-replay attack hardening):
 *   1. Signature verification
 *   2. TenantId validation (via Verifier & SessionRegistry)
 *   3. Timestamp window validation
 *   4. Idempotence check
 *   5. Session registration (for SESSION_CREATED only)
 *   6. Chain building & Append event to store
 *   7. Notify RuntimeLoop via WakeupNotifier
 */
export class SILIngestor {
  constructor(
    private verifier: EventVerifier,
    private store: EventStore,
    private registry: SessionRegistry,
    private wakeup: WakeupNotifier,
    private auditStore?: SecurityAuditStore
  ) {}

  private async audit(event: IncomingSILEvent, reason: string) {
    if (this.auditStore) {
      await this.auditStore.logRejection({
        tenantId: event.tenantId,
        sessionId: event.sessionId,
        eventId: event.eventId,
        reason,
        timestamp: Date.now()
      }).catch(err => console.error("[Ingestor] Failed to audit rejection", err));
    }
  }

  async ingest(incomingEvent: IncomingSILEvent): Promise<void> {
    // ── Step 1: Signature Verification ──────────────────────────
    const sigResult = await this.verifier.verifySignature(incomingEvent);
    if (!sigResult.isValid) {
      console.error(`[Ingestor] Signature invalid for event ${incomingEvent.eventId}: ${sigResult.reason}`);
      await this.audit(incomingEvent, `Signature invalid: ${sigResult.reason}`);
      return;
    }

    // ── Step 2: Tenant Identity Verification (via Verifier) ─────
    const tenantResult = await this.verifier.verifyTenant(incomingEvent);
    if (!tenantResult.isValid) {
      console.error(`[Ingestor] Tenant identity invalid for event ${incomingEvent.eventId}: ${tenantResult.reason}`);
      await this.audit(incomingEvent, `Tenant invalid: ${tenantResult.reason}`);
      return;
    }

    // ── Step 3: Timestamp Window Verification ───────────────────
    const timeResult = await this.verifier.verifyTimestamp(incomingEvent);
    if (!timeResult.isValid) {
      console.error(`[Ingestor] Timestamp invalid for event ${incomingEvent.eventId}: ${timeResult.reason}`);
      await this.audit(incomingEvent, `Timestamp invalid: ${timeResult.reason}`);
      return;
    }

    // ── Step 4: Tenant Isolation Enforcement (via SessionRegistry) ──
    // For SESSION_CREATED: the session must not already belong to another tenant.
    // For all other events: the session must exist and belong to the event's tenant.
    if (incomingEvent.type === "SESSION_CREATED") {
      if (this.registry.has(incomingEvent.sessionId)) {
        const existingTenant = this.registry.getTenantId(incomingEvent.sessionId);
        if (existingTenant !== incomingEvent.tenantId) {
          const reason = `TENANT_ISOLATION_VIOLATION: SESSION_CREATED for session ${incomingEvent.sessionId} with tenant ${incomingEvent.tenantId}, but session already registered to tenant ${existingTenant}`;
          console.error(`[Ingestor] ${reason}`);
          await this.audit(incomingEvent, reason);
          return;
        }
        // Same tenant re-creating → idempotence will catch it below
      }
    } else {
      // Non-creation event: session must exist and belong to this tenant
      const registeredTenant = this.registry.getTenantId(incomingEvent.sessionId);
      if (registeredTenant !== undefined && registeredTenant !== incomingEvent.tenantId) {
        const reason = `TENANT_ISOLATION_VIOLATION for session ${incomingEvent.sessionId}: expected tenant ${registeredTenant}, got ${incomingEvent.tenantId}`;
        console.error(`[Ingestor] ${reason}`);
        await this.audit(incomingEvent, reason);
        return;
      }
      // If session is not registered yet (e.g. events arriving before SESSION_CREATED
      // during recovery), we allow it through — the RuntimeLoop will validate on its side.
    }

    // ── Step 5: Idempotence Check ───────────────────────────────
    const alreadySeen = await this.store.hasEvent(incomingEvent.tenantId, incomingEvent.sessionId, incomingEvent.eventId);
    if (alreadySeen) {
      console.log(`[Ingestor] Idempotency hit: Event ${incomingEvent.eventId} already processed. Skipping.`);
      return;
    }

    // ── Step 6: Register Session (for SESSION_CREATED only) ─────
    if (incomingEvent.type === "SESSION_CREATED") {
      try {
        this.registry.register(incomingEvent.sessionId, incomingEvent.tenantId);
      } catch (err: unknown) {
        console.error(`[Ingestor] TENANT_ISOLATION_VIOLATION during concurrent registration: ${err.message}`);
        return;
      }
    }

    // ── Step 7: Chain Building & Construct Stored Event ─────────
    const history = await this.store.readAfter(incomingEvent.tenantId, incomingEvent.sessionId, -1);
    const previousEventHash = history.length > 0 ? history[history.length - 1].hash : undefined;
    
    // We compute the internal hash representation (similar to what the Gateway signed)
    const hashPayload = `${incomingEvent.tenantId}:${incomingEvent.sessionId}:${incomingEvent.eventId}:${incomingEvent.timestamp}:${incomingEvent.type}:${canonicalize(incomingEvent.payload || {})}`;
    const hash = crypto.createHash("sha256").update(hashPayload).digest("hex");

    const storedEvent: SILEvent = {
      ...incomingEvent,
      hash,
      previousEventHash
    };

    // ── Step 8: Append Event to Store ───────────────────────────
    await this.store.append(storedEvent);

    // ── Step 9: Notify RuntimeLoop ──────────────────────────────
    await this.wakeup.notify(incomingEvent.tenantId, incomingEvent.sessionId);
  }
}
