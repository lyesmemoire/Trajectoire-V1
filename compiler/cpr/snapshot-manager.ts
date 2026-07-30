/**
 * Blueprint DSL CPR Snapshot Manager
 * 
 * Manages distributed snapshots for cluster state.
 */

import { ClusterManager, NodeStatus } from './cluster-manager';
import { DistributedMemory } from './distributed-memory';

export interface ClusterSnapshot {
  id: string;
  timestamp: number;
  term: number;
  nodes: Map<string, NodeSnapshot>;
  memory: Map<string, MemorySnapshot>;
  metadata: Record<string, unknown>;
}

export interface NodeSnapshot {
  nodeId: string;
  status: NodeStatus;
  lastHeartbeat: number;
  metadata: Record<string, unknown>;
}

export interface MemorySnapshot {
  blockId: string;
  nodeId: string;
  version: number;
  checksum: string;
}

export interface SnapshotOptions {
  includeMemory?: boolean;
  includeMetadata?: boolean;
}

export class SnapshotManager {
  private clusterManager: ClusterManager;
  private memoryManager: DistributedMemory;
  private snapshots: Map<string, ClusterSnapshot> = new Map();
  private snapshotCounter: number = 0;

  constructor(clusterManager: ClusterManager, memoryManager: DistributedMemory) {
    this.clusterManager = clusterManager;
    this.memoryManager = memoryManager;
  }

  /**
   * Create cluster snapshot
   */
  public createSnapshot(options: SnapshotOptions = {}, metadata: Record<string, unknown> = {}): ClusterSnapshot {
    const nodes = new Map<string, NodeSnapshot>();
    const memory = new Map<string, MemorySnapshot>();

    // Snapshot nodes
    for (const node of this.clusterManager.getAllNodes()) {
      nodes.set(node.id, {
        nodeId: node.id,
        status: node.status,
        lastHeartbeat: node.lastHeartbeat,
        metadata: node.metadata,
      });
    }

    // Snapshot memory if requested
    if (options.includeMemory) {
      for (const block of this.memoryManager.getAllBlocks()) {
        memory.set(block.id, {
          blockId: block.id,
          nodeId: block.nodeId,
          version: block.version,
          checksum: this.calculateChecksum(block.data),
        });
      }
    }

    const snapshot: ClusterSnapshot = {
      id: `snapshot_${this.snapshotCounter++}`,
      timestamp: Date.now(),
      term: this.clusterManager.getTerm(),
      nodes,
      memory,
      metadata: options.includeMetadata ? metadata : {},
    };

    this.snapshots.set(snapshot.id, snapshot);
    return snapshot;
  }

  /**
   * Get snapshot by id
   */
  public getSnapshot(id: string): ClusterSnapshot | null {
    const snapshot = this.snapshots.get(id);
    return snapshot ? { ...snapshot, nodes: new Map(snapshot.nodes), memory: new Map(snapshot.memory) } : null;
  }

  /**
   * Get all snapshots
   */
  public getAllSnapshots(): ClusterSnapshot[] {
    return Array.from(this.snapshots.values()).map(s => ({
      ...s,
      nodes: new Map(s.nodes),
      memory: new Map(s.memory),
    }));
  }

  /**
   * Get snapshots in time range
   */
  public getSnapshotsInRange(start: number, end: number): ClusterSnapshot[] {
    return Array.from(this.snapshots.values())
      .filter(s => s.timestamp >= start && s.timestamp <= end)
      .map(s => ({ ...s, nodes: new Map(s.nodes), memory: new Map(s.memory) }));
  }

  /**
   * Restore cluster from snapshot
   */
  public restoreSnapshot(id: string): boolean {
    const snapshot = this.snapshots.get(id);

    if (!snapshot) {
      return false;
    }

    // Restore nodes
    for (const [nodeId, nodeSnapshot] of snapshot.nodes) {
      const node = this.clusterManager.getNode(nodeId);
      if (node) {
        this.clusterManager.updateNodeStatus(nodeId, nodeSnapshot.status);
      }
    }

    // Restore memory checksums
    for (const [blockId, memorySnapshot] of snapshot.memory) {
      const block = this.memoryManager.getBlock(blockId);
      if (block) {
        const currentChecksum = this.calculateChecksum(block.data);
        if (currentChecksum !== memorySnapshot.checksum) {
          console.warn(`Memory block ${blockId} checksum mismatch`);
        }
      }
    }

    return true;
  }

  /**
   * Compare two snapshots
   */
  public compareSnapshots(id1: string, id2: string): {
    nodeDifferences: Map<string, NodeStatus>;
    memoryDifferences: Map<string, number>;
  } | null {
    const s1 = this.snapshots.get(id1);
    const s2 = this.snapshots.get(id2);

    if (!s1 || !s2) {
      return null;
    }

    const nodeDifferences = new Map<string, NodeStatus>();
    const memoryDifferences = new Map<string, number>();

    // Compare nodes
    for (const [nodeId, node1] of s1.nodes) {
      const node2 = s2.nodes.get(nodeId);
      if (node2 && node1.status !== node2.status) {
        nodeDifferences.set(nodeId, node2.status);
      }
    }

    // Compare memory versions
    for (const [blockId, mem1] of s1.memory) {
      const mem2 = s2.memory.get(blockId);
      if (mem2 && mem1.version !== mem2.version) {
        memoryDifferences.set(blockId, mem2.version);
      }
    }

    return {
      nodeDifferences,
      memoryDifferences,
    };
  }

  /**
   * Delete snapshot
   */
  public deleteSnapshot(id: string): boolean {
    return this.snapshots.delete(id);
  }

  /**
   * Clear all snapshots
   */
  public clear(): void {
    this.snapshots.clear();
    this.snapshotCounter = 0;
  }

  /**
   * Calculate checksum
   */
  private calculateChecksum(data: Uint8Array): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data[i];
      hash |= 0;
    }
    return hash.toString(16);
  }

  /**
   * Get snapshot count
   */
  public getSnapshotCount(): number {
    return this.snapshots.size;
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

      if (snapshot.timestamp < 0) {
        errors.push(`Invalid timestamp in snapshot ${id}`);
      }

      if (snapshot.term < 0) {
        errors.push(`Invalid term in snapshot ${id}`);
      }

      for (const [nodeId, nodeSnapshot] of snapshot.nodes) {
        if (!this.clusterManager.getNode(nodeId)) {
          errors.push(`Snapshot ${id} references non-existent node ${nodeId}`);
        }
      }

      for (const [blockId, memorySnapshot] of snapshot.memory) {
        if (!this.memoryManager.getBlock(blockId)) {
          errors.push(`Snapshot ${id} references non-existent memory block ${blockId}`);
        }
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
    oldestSnapshot: number;
    newestSnapshot: number;
  } {
    const snapshots = Array.from(this.snapshots.values());
    const timestamps = snapshots.map(s => s.timestamp);

    return {
      snapshotCount: this.snapshots.size,
      totalSize: snapshots.reduce((sum, s) => sum + s.nodes.size + s.memory.size, 0),
      averageSize: snapshots.length > 0 ? (snapshots.reduce((sum, s) => sum + s.nodes.size + s.memory.size, 0) / snapshots.length) : 0,
      oldestSnapshot: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      newestSnapshot: timestamps.length > 0 ? Math.max(...timestamps) : 0,
    };
  }

  /**
   * Export snapshots to JSON
   */
  public export(): string {
    const data = Array.from(this.snapshots.values());
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import snapshots from JSON
   */
  public import(json: string): void {
    const data = JSON.parse(json) as ClusterSnapshot[];

    for (const snapshot of data) {
      this.snapshots.set(snapshot.id, {
        ...snapshot,
        nodes: new Map(Object.entries(snapshot.nodes)),
        memory: new Map(Object.entries(snapshot.memory)),
      });
      this.snapshotCounter = Math.max(this.snapshotCounter, parseInt(snapshot.id.split('_')[1]) + 1);
    }
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }

  /**
   * Set memory manager
   */
  public setMemoryManager(memoryManager: DistributedMemory): void {
    this.memoryManager = memoryManager;
  }
}
