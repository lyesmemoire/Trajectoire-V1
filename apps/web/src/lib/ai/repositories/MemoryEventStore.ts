import { EventStore, StoredEvent, EventStreamOptions, EventStreamResult } from "./EventStore";

// ===================================================================
// MEMORY EVENT STORE — In-Memory Implementation of EventStore
// ===================================================================

export class MemoryEventStore implements EventStore {
  private events: Map<string, StoredEvent> = new Map();
  private sessionSequences: Map<string, number> = new Map();

  append(event: StoredEvent): void {
    // Ensure sequence is correct for the session
    const currentSequence = this.getLatestSequence(event.sessionId);
    if (event.sequence !== currentSequence + 1) {
      throw new Error(`Invalid sequence for session ${event.sessionId}: expected ${currentSequence + 1}, got ${event.sequence}`);
    }

    this.events.set(event.id, event);
    this.sessionSequences.set(event.sessionId, event.sequence);
  }

  appendAll(events: StoredEvent[]): void {
    // Validate all sequences before appending
    for (const event of events) {
      const currentSequence = this.getLatestSequence(event.sessionId);
      if (event.sequence !== currentSequence + 1) {
        throw new Error(`Invalid sequence for session ${event.sessionId}: expected ${currentSequence + 1}, got ${event.sequence}`);
      }
    }

    // Append all atomically
    for (const event of events) {
      this.events.set(event.id, event);
      this.sessionSequences.set(event.sessionId, event.sequence);
    }
  }

  stream(options?: EventStreamOptions): EventStreamResult {
    const allEvents = this.getAll();
    let filtered = [...allEvents];

    const {
      sessionId,
      eventType,
      engine,
      fromSequence,
      toSequence,
      fromTimestamp,
      toTimestamp,
      limit,
      offset = 0,
    } = options || {};

    if (sessionId) {
      filtered = filtered.filter(e => e.sessionId === sessionId);
    }

    if (eventType) {
      filtered = filtered.filter(e => e.eventType === eventType);
    }

    if (engine) {
      filtered = filtered.filter(e => e.engine === engine);
    }

    if (fromSequence !== undefined) {
      filtered = filtered.filter(e => e.sequence >= fromSequence);
    }

    if (toSequence !== undefined) {
      filtered = filtered.filter(e => e.sequence <= toSequence);
    }

    if (fromTimestamp) {
      filtered = filtered.filter(e => e.createdAt >= fromTimestamp);
    }

    if (toTimestamp) {
      filtered = filtered.filter(e => e.createdAt <= toTimestamp);
    }

    // Sort by sequence ascending
    filtered.sort((a, b) => a.sequence - b.sequence);

    const paginated = limit ? filtered.slice(offset, offset + limit) : filtered;
    const lastSequence = filtered.length > 0 ? filtered[filtered.length - 1].sequence : undefined;

    return {
      events: paginated,
      total: filtered.length,
      hasMore: limit ? offset + limit < filtered.length : false,
      lastSequence,
    };
  }

  replay(sessionId: string, fromSequence?: number): StoredEvent[] {
    const result = this.stream({
      sessionId,
      fromSequence,
    });
    return result.events;
  }

  getLatestSequence(sessionId: string): number {
    return this.sessionSequences.get(sessionId) || 0;
  }

  findById(id: string): StoredEvent | undefined {
    return this.events.get(id);
  }

  getAll(): StoredEvent[] {
    return Array.from(this.events.values());
  }

  clear(): void {
    this.events.clear();
    this.sessionSequences.clear();
  }

  getStatistics(): {
    totalEvents: number;
    eventsBySession: Record<string, number>;
    eventsByType: Record<string, number>;
    eventsByEngine: Record<string, number>;
    oldestEvent?: Date;
    newestEvent?: Date;
  } {
    const allEvents = this.getAll();
    const eventsBySession: Record<string, number> = {};
    const eventsByType: Record<string, number> = {};
    const eventsByEngine: Record<string, number> = {};
    let oldestEvent: Date | undefined;
    let newestEvent: Date | undefined;

    for (const event of allEvents) {
      eventsBySession[event.sessionId] = (eventsBySession[event.sessionId] || 0) + 1;
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      eventsByEngine[event.engine] = (eventsByEngine[event.engine] || 0) + 1;

      if (!oldestEvent || event.createdAt < oldestEvent) {
        oldestEvent = event.createdAt;
      }

      if (!newestEvent || event.createdAt > newestEvent) {
        newestEvent = event.createdAt;
      }
    }

    return {
      totalEvents: allEvents.length,
      eventsBySession,
      eventsByType,
      eventsByEngine,
      oldestEvent,
      newestEvent,
    };
  }
}
