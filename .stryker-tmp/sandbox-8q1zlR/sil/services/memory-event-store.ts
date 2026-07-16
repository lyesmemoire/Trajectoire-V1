// @ts-nocheck
import { EventStore } from "../contracts/event-store";
import { SILCheckpoint } from "../contracts/session-state";
import { SILEvent } from "../contracts/sil-events";

import { buildTenantKey } from "../utils/tenant-key";

export class MemoryEventStore implements EventStore {
  private events: SILEvent[] = [];
  private checkpoints: Map<string, SILCheckpoint> = new Map();
  private eventIds: Set<string> = new Set();

  async append(event: SILEvent): Promise<void> {
    this.events.push(event);
    const idempotenceKey = `${event.tenantId}:${event.sessionId}:${event.eventId}`;
    this.eventIds.add(idempotenceKey);
  }

  async readAll(tenantId: string, sessionId: string): Promise<SILEvent[]> {
    return this.events.filter(e => e.sessionId === sessionId && e.tenantId === tenantId);
  }

  async readAfter(tenantId: string, sessionId: string, pointer: number): Promise<SILEvent[]> {
    // Filter events by sessionId and tenantId, then slice after the pointer
    const sessionEvents = await this.readAll(tenantId, sessionId);
    return sessionEvents.slice(pointer + 1);
  }

  async getCheckpoint(tenantId: string, sessionId: string): Promise<SILCheckpoint | null> {
    const key = buildTenantKey(tenantId, sessionId);
    return this.checkpoints.get(key) || null;
  }

  async saveCheckpoint(tenantId: string, checkpoint: SILCheckpoint): Promise<void> {
    const key = buildTenantKey(tenantId, checkpoint.sessionId);
    this.checkpoints.set(key, checkpoint);
  }

  async hasEvent(tenantId: string, sessionId: string, eventId: string): Promise<boolean> {
    const idempotenceKey = `${tenantId}:${sessionId}:${eventId}`;
    return this.eventIds.has(idempotenceKey);
  }
}
