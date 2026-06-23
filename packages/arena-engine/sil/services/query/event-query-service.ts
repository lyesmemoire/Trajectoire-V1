import { EventQueryService } from "../../contracts/query";
import { EventStore } from "../../contracts/event-store";
import { SILEvent } from "../../contracts/sil-events";

export class DefaultEventQueryService implements EventQueryService {
  constructor(private readonly store: EventStore) {}

  async getSessionEvents(tenantId: string, sessionId: string): Promise<SILEvent[]> {
    return this.store.readAll(tenantId, sessionId);
  }

  async getEventRange(tenantId: string, sessionId: string, from: number, to: number): Promise<SILEvent[]> {
    const events = await this.store.readAll(tenantId, sessionId);
    return events.slice(from, to + 1);
  }

  async getLastEvent(tenantId: string, sessionId: string): Promise<SILEvent | null> {
    const events = await this.store.readAll(tenantId, sessionId);
    if (events.length === 0) return null;
    return events[events.length - 1];
  }
}
