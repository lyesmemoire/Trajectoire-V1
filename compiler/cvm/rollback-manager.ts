/**
 * Blueprint DSL CVM Rollback Manager
 * 
 * Manages state snapshots and rollback for error recovery.
 */

import { ExecutionContext } from './execution-context';

export interface Snapshot {
  id: number;
  timestamp: number;
  programCounter: number;
  stack: number[];
  registers: Map<number, number>;
  heap: unknown[];
  callFrames: unknown[];
  metadata: Record<string, unknown>;
}

export interface RollbackOptions {
  maxSnapshots?: number;
  autoSnapshot?: boolean;
}

export class RollbackManager {
  private context: ExecutionContext;
  private snapshots: Map<number, Snapshot> = new Map();
  private snapshotCounter: number = 0;
  private options: RollbackOptions;
  private currentSnapshot: number | null = null;

  constructor(context: ExecutionContext, options: RollbackOptions = {}) {
    this.context = context;
    this.options = {
      maxSnapshots: options.maxSnapshots || 10,
      autoSnapshot: options.autoSnapshot !== false,
    };
  }

  /**
   * Create snapshot
   */
  public createSnapshot(metadata: Record<string, unknown> = {}): number {
    const snapshot: Snapshot = {
      id: this.snapshotCounter++,
      timestamp: Date.now(),
      programCounter: this.context.getProgramCounter(),
      stack: this.context.getStack().getSnapshot(),
      registers: new Map(),
      heap: this.context.getHeap().getAllBlocks(),
      callFrames: this.context.getCallFrames().getAllFrames(),
      metadata,
    };

    this.snapshots.set(snapshot.id, snapshot);
    this.currentSnapshot = snapshot.id;

    // Evict old snapshots if needed
    this.evictIfNeeded();

    return snapshot.id;
  }

  /**
   * Restore snapshot
   */
  public restoreSnapshot(id: number): boolean {
    const snapshot = this.snapshots.get(id);

    if (!snapshot) {
      return false;
    }

    // Restore state
    this.context.setProgramCounter(snapshot.programCounter);
    this.context.getStack().restoreSnapshot(snapshot.stack);
    this.context.getHeap().clear();

    // Restore heap blocks
    for (const block of snapshot.heap) {
      this.context.getHeap().allocate(block.size);
      this.context.getHeap().write(block.address, block.data);
    }

    // Restore call frames
    this.context.getCallFrames().clear();
    for (const frame of snapshot.callFrames) {
      this.context.getCallFrames().createFrame(frame.returnAddress, frame.basePointer, frame.stackPointer, frame.functionName);
    }

    this.currentSnapshot = id;
    return true;
  }

  /**
   * Delete snapshot
   */
  public deleteSnapshot(id: number): boolean {
    if (this.currentSnapshot === id) {
      this.currentSnapshot = null;
    }

    return this.snapshots.delete(id);
  }

  /**
   * Get snapshot
   */
  public getSnapshot(id: number): Snapshot | null {
    const snapshot = this.snapshots.get(id);
    return snapshot ? { ...snapshot } : null;
  }

  /**
   * Get current snapshot
   */
  public getCurrentSnapshot(): Snapshot | null {
    if (this.currentSnapshot === null) {
      return null;
    }

    return this.getSnapshot(this.currentSnapshot);
  }

  /**
   * Get all snapshots
   */
  public getAllSnapshots(): Snapshot[] {
    return Array.from(this.snapshots.values()).map(s => ({ ...s }));
  }

  /**
   * Clear all snapshots
   */
  public clearSnapshots(): void {
    this.snapshots.clear();
    this.snapshotCounter = 0;
    this.currentSnapshot = null;
  }

  /**
   * Evict old snapshots if needed
   */
  private evictIfNeeded(): void {
    if (this.snapshots.size <= this.options.maxSnapshots!) {
      return;
    }

    // Remove oldest snapshot
    let oldestId: number | null = null;
    let oldestTimestamp = Infinity;

    for (const [id, snapshot] of this.snapshots) {
      if (snapshot.timestamp < oldestTimestamp) {
        oldestTimestamp = snapshot.timestamp;
        oldestId = id;
      }
    }

    if (oldestId !== null) {
      this.snapshots.delete(oldestId);
    }
  }

  /**
   * Auto-snapshot if enabled
   */
  public autoSnapshot(): number | null {
    if (!this.options.autoSnapshot) {
      return null;
    }

    return this.createSnapshot({ auto: true });
  }

  /**
   * Rollback to previous snapshot
   */
  public rollback(): boolean {
    if (this.currentSnapshot === null) {
      return false;
    }

    return this.restoreSnapshot(this.currentSnapshot);
  }

  /**
   * Rollback to specific snapshot
   */
  public rollbackTo(id: number): boolean {
    return this.restoreSnapshot(id);
  }

  /**
   * Get snapshot count
   */
  public getSnapshotCount(): number {
    return this.snapshots.size;
  }

  /**
   * Get max snapshots
   */
  public getMaxSnapshots(): number {
    return this.options.maxSnapshots!;
  }

  /**
   * Set max snapshots
   */
  public setMaxSnapshots(max: number): void {
    this.options.maxSnapshots = max;
    this.evictIfNeeded();
  }

  /**
   * Enable auto-snapshot
   */
  public enableAutoSnapshot(): void {
    this.options.autoSnapshot = true;
  }

  /**
   * Disable auto-snapshot
   */
  public disableAutoSnapshot(): void {
    this.options.autoSnapshot = false;
  }

  /**
   * Check if auto-snapshot is enabled
   */
  public isAutoSnapshotEnabled(): boolean {
    return this.options.autoSnapshot!;
  }

  /**
   * Validate rollback manager state
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

      if (snapshot.stack.length === 0) {
        errors.push(`Empty stack in snapshot ${id}`);
      }
    }

    if (this.currentSnapshot !== null && !this.snapshots.has(this.currentSnapshot)) {
      errors.push('Current snapshot does not exist');
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
    maxSnapshots: number;
    autoSnapshot: boolean;
    currentSnapshot: number | null;
    utilization: number;
  } {
    return {
      snapshotCount: this.snapshots.size,
      maxSnapshots: this.options.maxSnapshots!,
      autoSnapshot: this.options.autoSnapshot!,
      currentSnapshot: this.currentSnapshot,
      utilization: this.snapshots.size / this.options.maxSnapshots!,
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
