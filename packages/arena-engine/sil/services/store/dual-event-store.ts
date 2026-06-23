import { EventStore } from "../../contracts/event-store";
import { SILEvent } from "../../contracts/sil-events";
import { SILCheckpoint } from "../../contracts/session-state";
import { MerkleLedgerWriter } from "../ledger/merkle-ledger";

export class DualEventStore implements EventStore {
  constructor(
    private primary: EventStore,   // MemoryEventStore
    private shadow: EventStore,    // PostgresEventStore
    private ledger?: MerkleLedgerWriter
  ) {}

  async append(event: SILEvent): Promise<void> {
    // 1. CRITICAL PATH (never fail)
    await this.primary.append(event);

    // 2. SHADOW (non-blocking)
    this.shadow.append(event).catch((err) => {
      console.error("[ShadowStore] append failed", err);
    });

    // 3. LEDGER (non-blocking)
    this.ledger?.append({
      tenantId: event.tenantId,
      sessionId: event.sessionId,
      eventId: event.eventId,
      hash: event.hash,
      previousHash: event.previousEventHash,
      sequence: (event as any).sequence ?? 0,
    }).catch(() => {});
  }

  async readAll(tenantId: string, sessionId: string): Promise<SILEvent[]> {
    return this.primary.readAll(tenantId, sessionId);
  }

  async readAfter(
    tenantId: string,
    sessionId: string,
    afterSequence: number
  ): Promise<SILEvent[]> {
    // ALWAYS source of truth = primary
    return this.primary.readAfter(tenantId, sessionId, afterSequence);
  }

  async getLastEvent(
    tenantId: string,
    sessionId: string
  ): Promise<SILEvent | null> {
    return this.primary.getLastEvent(tenantId, sessionId);
  }

  async hasEvent(tenantId: string, sessionId: string, eventId: string): Promise<boolean> {
    return this.primary.hasEvent(tenantId, sessionId, eventId);
  }

  async getCheckpoint(tenantId: string, sessionId: string): Promise<SILCheckpoint | null> {
    return this.primary.getCheckpoint(tenantId, sessionId);
  }

  async saveCheckpoint(tenantId: string, checkpoint: SILCheckpoint): Promise<void> {
    await this.primary.saveCheckpoint(tenantId, checkpoint);
    // Shadow checkpoint save could be done here if needed, but the focus is events.
    this.shadow.saveCheckpoint(tenantId, checkpoint).catch((err) => {
       console.error("[ShadowStore] saveCheckpoint failed", err);
    });
  }
}
