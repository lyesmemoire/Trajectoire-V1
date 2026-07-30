// ===================================================================
// EVENT STORE — Abstraction for Event Sourcing
// ===================================================================

export interface StoredEvent {
  id: string;
  sessionId: string;
  sequence: number;
  eventType: string;
  engine: string;
  engineVersion: string;
  payload: any;
  createdAt: Date;
  metadata?: {
    traceId?: string;
    correlationId?: string;
    ruleId?: string;
    ruleVersion?: string;
    aggregateId?: string;
  };
}

export interface EventStreamOptions {
  sessionId?: string;
  eventType?: string;
  engine?: string;
  traceId?: string;
  aggregateId?: string;
  fromSequence?: number;
  toSequence?: number;
  fromTimestamp?: Date;
  toTimestamp?: Date;
  limit?: number;
  offset?: number;
}

export interface EventStreamResult {
  events: StoredEvent[];
  total: number;
  hasMore: boolean;
  lastSequence?: number;
}

export interface EventStore {
  /**
   * Append an event to the store
   */
  append(event: StoredEvent): void;

  /**
   * Append multiple events atomically
   */
  appendAll(events: StoredEvent[]): void;

  /**
   * Stream events with filtering options
   */
  stream(options?: EventStreamOptions): EventStreamResult;

  /**
   * Replay events for a session
   */
  replay(sessionId: string, fromSequence?: number): StoredEvent[];

  /**
   * Stream events by trace ID
   */
  streamByTrace(traceId: string, options?: Omit<EventStreamOptions, 'traceId'>): EventStreamResult;

  /**
   * Stream events by aggregate ID
   */
  streamByAggregate(aggregateId: string, options?: Omit<EventStreamOptions, 'aggregateId'>): EventStreamResult;

  /**
   * Rebuild state from events for a session
   */
  rebuild(sessionId: string, fromSequence?: number): any;

  /**
   * Get latest sequence number for a session
   */
  getLatestSequence(sessionId: string): number;

  /**
   * Find event by ID
   */
  findById(id: string): StoredEvent | undefined;

  /**
   * Get all events
   */
  getAll(): StoredEvent[];

  /**
   * Clear all events
   */
  clear(): void;

  /**
   * Get statistics
   */
  getStatistics(): {
    totalEvents: number;
    eventsBySession: Record<string, number>;
    eventsByType: Record<string, number>;
    eventsByEngine: Record<string, number>;
    oldestEvent?: Date;
    newestEvent?: Date;
  };
}
