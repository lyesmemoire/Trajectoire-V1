import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { SnapshotStore, RuntimeSnapshot } from "./SnapshotStore";
import { deepFreeze } from "../../utils/deepFreeze";

/**
 * Supabase PostgreSQL implementation of SnapshotStore.
 */
export class PostgresSnapshotStore implements SnapshotStore {
  private readonly supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseServiceKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async saveSnapshot(snapshot: RuntimeSnapshot): Promise<void> {
    const { error } = await this.supabase
      .from('runtime_snapshots')
      .upsert({
        session_id: snapshot.sessionId,
        sequence: snapshot.sequence,
        replay_hash: snapshot.replayHash,
        snapshot: {
          fsmState: snapshot.fsmState,
          transitionId: snapshot.transitionId
        } // JSONB payload
      }, { onConflict: 'session_id,sequence' });

    if (error) {
      throw new Error(`[PostgresSnapshotStore] Failed to save snapshot: ${error.message}`);
    }
  }

  async getLatestSnapshot(sessionId: string): Promise<RuntimeSnapshot | null> {
    const { data, error } = await this.supabase
      .from('runtime_snapshots')
      .select('session_id, sequence, replay_hash, snapshot')
      .eq('session_id', sessionId)
      .order('sequence', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // PostgREST code for "No rows found"
        return null;
      }
      throw new Error(`[PostgresSnapshotStore] Failed to load snapshot: ${error.message}`);
    }

    if (!data) return null;

    const snap: RuntimeSnapshot = {
      sessionId: data.session_id,
      sequence: Number(data.sequence),
      replayHash: data.replay_hash,
      fsmState: data.snapshot.fsmState,
      transitionId: data.snapshot.transitionId
    };

    return deepFreeze(snap) as RuntimeSnapshot;
  }
}
