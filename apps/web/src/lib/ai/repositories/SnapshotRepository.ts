// ===================================================================
// SNAPSHOT REPOSITORY — Abstraction for CognitiveState Snapshots
// ===================================================================

export interface Snapshot {
  id: string;
  sessionId: string;
  timestamp: Date;
  state: any; // CognitiveState serialized
  version: string;
  metadata?: {
    totalFacts: number;
    totalEvents: number;
    engineVersions: Record<string, string>;
  };
}

export interface SnapshotQueryOptions {
  sessionId?: string;
  before?: Date;
  after?: Date;
  limit?: number;
  offset?: number;
}

export interface SnapshotQueryResult {
  snapshots: Snapshot[];
  total: number;
  hasMore: boolean;
}

export interface SnapshotRepository {
  /**
   * Save a snapshot
   */
  save(snapshot: Snapshot): void;

  /**
   * Find a snapshot by ID
   */
  findById(id: string): Snapshot | undefined;

  /**
   * Find latest snapshot for a session
   */
  findLatest(sessionId: string): Snapshot | undefined;

  /**
   * Find snapshots by session
   */
  findBySession(sessionId: string, options?: SnapshotQueryOptions): SnapshotQueryResult;

  /**
   * Find snapshots by time range
   */
  findByTimeRange(options: SnapshotQueryOptions): SnapshotQueryResult;

  /**
   * Get all snapshots
   */
  getAll(): Snapshot[];

  /**
   * Remove a snapshot by ID
   */
  remove(id: string): boolean;

  /**
   * Clear all snapshots
   */
  clear(): void;

  /**
   * Get statistics
   */
  getStatistics(): {
    totalSnapshots: number;
    snapshotsBySession: Record<string, number>;
    oldestSnapshot?: Date;
    newestSnapshot?: Date;
  };
}
