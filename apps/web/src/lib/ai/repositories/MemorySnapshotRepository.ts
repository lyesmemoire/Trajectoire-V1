import { SnapshotRepository, Snapshot, SnapshotQueryOptions, SnapshotQueryResult } from "./SnapshotRepository";

// ===================================================================
// MEMORY SNAPSHOT REPOSITORY — In-Memory Implementation of SnapshotRepository
// ===================================================================

export class MemorySnapshotRepository implements SnapshotRepository {
  private snapshots: Map<string, Snapshot> = new Map();

  save(snapshot: Snapshot): void {
    this.snapshots.set(snapshot.id, snapshot);
  }

  findById(id: string): Snapshot | undefined {
    return this.snapshots.get(id);
  }

  findLatest(sessionId: string): Snapshot | undefined {
    const sessionSnapshots = this.findBySession(sessionId).snapshots;
    if (sessionSnapshots.length === 0) {
      return undefined;
    }
    return sessionSnapshots.reduce((latest, current) => 
      current.timestamp > latest.timestamp ? current : latest
    );
  }

  findBySession(sessionId: string, options?: SnapshotQueryOptions): SnapshotQueryResult {
    const allSnapshots = this.getAll();
    let filtered = allSnapshots.filter(s => s.sessionId === sessionId);

    const { before, after, limit, offset = 0 } = options || {};

    if (before) {
      filtered = filtered.filter(s => s.timestamp <= before);
    }

    if (after) {
      filtered = filtered.filter(s => s.timestamp >= after);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const paginated = limit ? filtered.slice(offset, offset + limit) : filtered;

    return {
      snapshots: paginated,
      total: filtered.length,
      hasMore: limit ? offset + limit < filtered.length : false,
    };
  }

  findByTimeRange(options: SnapshotQueryOptions): SnapshotQueryResult {
    const allSnapshots = this.getAll();
    let filtered = [...allSnapshots];

    const { sessionId, before, after, limit, offset = 0 } = options || {};

    if (sessionId) {
      filtered = filtered.filter(s => s.sessionId === sessionId);
    }

    if (before) {
      filtered = filtered.filter(s => s.timestamp <= before);
    }

    if (after) {
      filtered = filtered.filter(s => s.timestamp >= after);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const paginated = limit ? filtered.slice(offset, offset + limit) : filtered;

    return {
      snapshots: paginated,
      total: filtered.length,
      hasMore: limit ? offset + limit < filtered.length : false,
    };
  }

  getAll(): Snapshot[] {
    return Array.from(this.snapshots.values());
  }

  remove(id: string): boolean {
    return this.snapshots.delete(id);
  }

  clear(): void {
    this.snapshots.clear();
  }

  getStatistics(): {
    totalSnapshots: number;
    snapshotsBySession: Record<string, number>;
    oldestSnapshot?: Date;
    newestSnapshot?: Date;
  } {
    const allSnapshots = this.getAll();
    const snapshotsBySession: Record<string, number> = {};
    let oldestSnapshot: Date | undefined;
    let newestSnapshot: Date | undefined;

    for (const snapshot of allSnapshots) {
      snapshotsBySession[snapshot.sessionId] = (snapshotsBySession[snapshot.sessionId] || 0) + 1;

      if (!oldestSnapshot || snapshot.timestamp < oldestSnapshot) {
        oldestSnapshot = snapshot.timestamp;
      }

      if (!newestSnapshot || snapshot.timestamp > newestSnapshot) {
        newestSnapshot = snapshot.timestamp;
      }
    }

    return {
      totalSnapshots: allSnapshots.length,
      snapshotsBySession,
      oldestSnapshot,
      newestSnapshot,
    };
  }
}
