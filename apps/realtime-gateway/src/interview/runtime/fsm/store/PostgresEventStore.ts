import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { PersistentEventStore } from "./PersistentEventStore";
import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";
import { deepFreeze } from "../../utils/deepFreeze";

/**
 * Supabase PostgreSQL implementation of the PersistentEventStore.
 * Ensures append-only, deterministic event sourcing using a JSONB column.
 */
export class PostgresEventStore implements PersistentEventStore {
  private readonly supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseServiceKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  /**
   * Append an event to the `runtime_events` table.
   * Leverages Postgres unique constraints on (session_id, sequence) and (event_id)
   * to guarantee idempotence and prevent duplicates.
   */
  async append(event: InterviewRuntimeEvent, replayHash: string): Promise<void> {
    const { error } = await this.supabase
      .from('runtime_events')
      .insert({
        session_id: event.sessionId,
        sequence: event.sequence,
        event_id: event.eventId,
        event_type: event.type,
        replay_hash: replayHash,
        payload: event // JSONB auto-serialization
      });

    if (error) {
      // 23505 is the Postgres code for unique_violation.
      // This happens if a duplicate event_id or (session_id, sequence) is pushed.
      if (error.code === '23505') {
        // Idempotent rejection: we log or simply ignore, since the state already contains this sequence/event.
        console.warn(`[PostgresEventStore] Duplicate event rejected: ${event.eventId} (seq: ${event.sequence})`);
        return;
      }
      throw new Error(`[PostgresEventStore] Failed to append event: ${error.message}`);
    }
  }

  /**
   * Load events for a given session.
   * Crucially orders by sequence ASC to guarantee deterministic replay order.
   */
  async getEventsSince(sessionId: string, sequence: number): Promise<readonly InterviewRuntimeEvent[]> {
    const { data, error } = await this.supabase
      .from('runtime_events')
      .select('payload')
      .eq('session_id', sessionId)
      .gt('sequence', sequence)
      .order('sequence', { ascending: true });

    if (error) {
      throw new Error(`[PostgresEventStore] Failed to fetch events: ${error.message}`);
    }

    const events = data.map(row => row.payload as InterviewRuntimeEvent);
    
    // Return a deep frozen array to maintain immutability contract
    return deepFreeze(events) as readonly InterviewRuntimeEvent[];
  }
}
