// @ts-nocheck
import { MindSnapshot } from "./snapshot-contract.js";

/**
 * Minimal in-memory snapshot store.
 *
 * No disk. No database. No network.
 * Exists solely to support snapshot lifecycle in tests and future runtime use.
 */
export class SnapshotStore {
  private readonly snapshots = new Map<string, MindSnapshot>();

  /** Save a snapshot under a given id. Overwrites if id already exists. */
  save(id: string, snapshot: MindSnapshot): void {
    this.snapshots.set(id, snapshot);
  }

  /** Load a snapshot by id. Returns undefined if not found. */
  load(id: string): MindSnapshot | undefined {
    return this.snapshots.get(id);
  }

  /** Remove all stored snapshots. */
  clear(): void {
    this.snapshots.clear();
  }

  /** Number of snapshots currently stored. */
  get size(): number {
    return this.snapshots.size;
  }
}
