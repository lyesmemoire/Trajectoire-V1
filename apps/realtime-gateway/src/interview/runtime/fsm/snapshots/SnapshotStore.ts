/**
 * Immutable snapshot structure for the runtime FSM.
 */
export interface RuntimeSnapshot {
  sessionId: string;
  sequence: number;
  replayHash: string;
  fsmState: unknown;
  transitionId: string;
}

/**
 * Interface for saving and loading FSM snapshots.
 */
export interface SnapshotStore {
  /**
   * Save a snapshot. Must be idempotent (upsert or ignore duplicate on sequence).
   */
  saveSnapshot(snapshot: RuntimeSnapshot): Promise<void>;

  /**
   * Load the most recent snapshot for a session, or null if none exists.
   */
  getLatestSnapshot(sessionId: string): Promise<RuntimeSnapshot | null>;
}
