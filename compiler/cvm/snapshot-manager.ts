/**
 * Blueprint DSL CVM Snapshot Manager
 * 
 * Manages execution snapshots for debugging and replay.
 */

import { ExecutionContext } from './execution-context';

export interface Snapshot {
  id: number;
  timestamp: number;
  programCounter: number;
  stack: number[];
  heap: unknown[];
  registers: Map<number, number>;
  callFrames: unknown[];
  metadata: Record<string, unknown>;
}

export interface SnapshotOptions {
  includeStack?: boolean;
  includeHeap?: boolean;
  includeRegisters?: boolean;
  includeCallFrames?: boolean;
}

export class SnapshotManager {
  private context: ExecutionContext;
  private snapshots: Map<number, Snapshot> = new Map();
  private snapshotCounter: number = 0;

  constructor(context: ExecutionContext) {
    this.context = context;
  }

  /**
   * Create snapshot
   */
  public createSnapshot(options: SnapshotOptions = {}, metadata: Record<string, unknown> = {}): number {
    const snapshot: Snapshot = {
      id: this.snapshotCounter++,
      timestamp: Date.now(),
      programCounter: this.context.getProgramCounter(),
      stack: options.includeStack !== false ? this.context.getStack().getSnapshot() : [],
      heap: options.includeHeap !== false ? this.context.getHeap().getAllBlocks() : [],
      registers: new Map(),
      callFrames: options.includeCallFrames !== false ? this.context.getCallFrames().getAllFrames() : [],
      metadata,
    };

    this.snapshots.set(snapshot.id, snapshot);
    return snapshot.id;
  }

  /**
   * Get snapshot
   */
  public getSnapshot(id: number): Snapshot | null {
    const snapshot = this.snapshots.get(id);
    return snapshot ? { ...snapshot } : null;
  }

  /**
   * Get all snapshots
   */
  public getAllSnapshots(): Snapshot[] {
    return Array.from(this.snapshots.values()).map(s => ({ ...s }));
  }

  /**
   * Delete snapshot
   */
  public deleteSnapshot(id: number): boolean {
    return this.snapshots.delete(id);
  }

  /**
   * Clear all snapshots
   */
  public clearSnapshots(): void {
    this.snapshots.clear();
    this.snapshotCounter = 0;
  }

  /**
   * Compare two snapshots
   */
  public compareSnapshots(id1: number, id2: number): {
    stackDiff: number[];
    heapDiff: unknown[];
    registerDiff: Map<number, { before: number; after: number }>;
    pcDiff: number;
  } | null {
    const s1 = this.snapshots.get(id1);
    const s2 = this.snapshots.get(id2);

    if (!s1 || !s2) {
      return null;
    }

    const stackDiff = this.compareArrays(s1.stack, s2.stack);
    const heapDiff = this.compareArrays(s1.heap, s2.heap);
    const registerDiff = this.compareMaps(s1.registers, s2.registers);
    const pcDiff = s2.programCounter - s1.programCounter;

    return {
      stackDiff,
      heapDiff,
      registerDiff,
      pcDiff,
    };
  }

  /**
   * Compare two arrays
   */
  private compareArrays<T>(a: T[], b: T[]): T[] {
    const diff: T[] = [];

    const maxLength = Math.max(a.length, b.length);

    for (let i = 0; i < maxLength; i++) {
      if (a[i] !== b[i]) {
        diff.push(b[i]);
      }
    }

    return diff;
  }

  /**
   * Compare two maps
   */
  private compareMaps<K, V>(a: Map<K, V>, b: Map<K, V>): Map<K, { before: V; after: V }> {
    const diff = new Map<K, { before: V; after: V }>();

    for (const [key, value] of b) {
      const before = a.get(key);

      if (before !== undefined && before !== value) {
        diff.set(key, { before, after: value });
      }
    }

    return diff;
  }

  /**
   * Get snapshot count
   */
  public getSnapshotCount(): number {
    return this.snapshots.size;
  }

  /**
   * Get snapshot by timestamp
   */
  public getSnapshotByTimestamp(timestamp: number): Snapshot | null {
    for (const snapshot of this.snapshots.values()) {
      if (snapshot.timestamp === timestamp) {
        return { ...snapshot };
      }
    }
    return null;
  }

  /**
   * Get snapshots in time range
   */
  public getSnapshotsInRange(start: number, end: number): Snapshot[] {
    return Array.from(this.snapshots.values())
      .filter(s => s.timestamp >= start && s.timestamp <= end)
      .map(s => ({ ...s }));
  }

  /**
   * Export snapshots to JSON
   */
  public exportSnapshots(): string {
    const data = Array.from(this.snapshots.values());
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import snapshots from JSON
   */
  public importSnapshots(json: string): void {
    const data = JSON.parse(json) as Snapshot[];

    for (const snapshot of data) {
      this.snapshots.set(snapshot.id, snapshot);
      this.snapshotCounter = Math.max(this.snapshotCounter, snapshot.id + 1);
    }
  }

  /**
   * Validate snapshot manager state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, snapshot] of this.snapshots) {
      if (snapshot.id !== id) {
        errors.push(`Snapshot ID mismatch at ${id}`);
      }

      if (snapshot.programCounter < 0) {
        errors.push(`Invalid program counter in snapshot ${id}`);
      }

      if (snapshot.timestamp < 0) {
        errors.push(`Invalid timestamp in snapshot ${id}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    snapshotCount: number;
    totalSize: number;
    averageSize: number;
  } {
    const snapshots = Array.from(this.snapshots.values());
    const totalSize = snapshots.reduce((sum, s) => {
      return sum + s.stack.length + s.heap.length + s.callFrames.length;
    }, 0);

    return {
      snapshotCount: this.snapshots.size,
      totalSize,
      averageSize: snapshots.length > 0 ? totalSize / snapshots.length : 0,
    };
  }

  /**
   * Set execution context
   */
  public setContext(context: ExecutionContext): void {
    this.context = context;
  }

  /**
   * Get execution context
   */
  public getContext(): ExecutionContext {
    return this.context;
  }
}
