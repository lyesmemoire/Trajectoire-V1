import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";

/**
 * Interface for the persistent event store.
 * Replaces InMemoryRuntimeEventStore for production.
 */
export interface PersistentEventStore {
  /** 
   * Append a single event transactionally. 
   * Must reject duplicates (by eventId) and ensure append-only semantics.
   */
  append(event: InterviewRuntimeEvent, replayHash: string): Promise<void>;

  /** 
   * Retrieve all events for a session strictly after the given sequence.
   * Events must be returned in strict deterministic order (sorted by sequence).
   */
  getEventsSince(sessionId: string, sequence: number): Promise<readonly InterviewRuntimeEvent[]>;
}
