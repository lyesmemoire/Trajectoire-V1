/**
 * Blueprint DSL CPR Distributed Memory
 * 
 * Manages distributed memory across cluster nodes.
 */

import { ClusterManager, NodeStatus } from './cluster-manager';

export interface MemoryBlock {
  id: string;
  nodeId: string;
  address: number;
  size: number;
  data: Uint8Array;
  replicas: string[];
  version: number;
}

export interface MemoryStatistics {
  totalBlocks: number;
  totalSize: number;
  averageReplication: number;
  nodeDistribution: Map<string, number>;
}

export class DistributedMemory {
  private clusterManager: ClusterManager;
  private blocks: Map<string, MemoryBlock> = new Map();
  private blockCounter: number = 0;
  private replicationFactor: number = 3;

  constructor(clusterManager: ClusterManager, replicationFactor: number = 3) {
    this.clusterManager = clusterManager;
    this.replicationFactor = replicationFactor;
  }

  /**
   * Allocate memory block
   */
  public allocate(size: number, nodeId?: string): MemoryBlock {
    const targetNode = nodeId || this.selectNode();

    if (!targetNode) {
      throw new Error('No available node');
    }

    const block: MemoryBlock = {
      id: `block_${this.blockCounter++}`,
      nodeId: targetNode,
      address: 0,
      size,
      data: new Uint8Array(size),
      replicas: this.selectReplicas(targetNode),
      version: 0,
    };

    this.blocks.set(block.id, block);
    return block;
  }

  /**
   * Select node for allocation
   */
  private selectNode(): string | null {
    const activeNodes = this.clusterManager.getNodesByStatus(NodeStatus.ACTIVE);

    if (activeNodes.length === 0) {
      return null;
    }

    // Simple round-robin selection
    const index = this.blockCounter % activeNodes.length;
    return activeNodes[index].id;
  }

  /**
   * Select replica nodes
   */
  private selectReplicas(primaryNode: string): string[] {
    const activeNodes = this.clusterManager.getNodesByStatus(NodeStatus.ACTIVE);
    const replicas: string[] = [];

    for (const node of activeNodes) {
      if (node.id !== primaryNode && replicas.length < this.replicationFactor - 1) {
        replicas.push(node.id);
      }
    }

    return replicas;
  }

  /**
   * Get block by id
   */
  public getBlock(id: string): MemoryBlock | null {
    const block = this.blocks.get(id);
    return block ? { ...block, replicas: [...block.replicas] } : null;
  }

  /**
   * Get all blocks
   */
  public getAllBlocks(): MemoryBlock[] {
    return Array.from(this.blocks.values()).map(b => ({ ...b, replicas: [...b.replicas] }));
  }

  /**
   * Get blocks by node
   */
  public getBlocksByNode(nodeId: string): MemoryBlock[] {
    return Array.from(this.blocks.values())
      .filter(b => b.nodeId === nodeId || b.replicas.includes(nodeId))
      .map(b => ({ ...b, replicas: [...b.replicas] }));
  }

  /**
   * Read from block
   */
  public read(id: string, offset: number, size: number): Uint8Array {
    const block = this.blocks.get(id);

    if (!block) {
      throw new Error('Block not found');
    }

    if (offset < 0 || offset + size > block.size) {
      throw new Error('Invalid read range');
    }

    return block.data.slice(offset, offset + size);
  }

  /**
   * Write to block
   */
  public write(id: string, offset: number, data: Uint8Array): void {
    const block = this.blocks.get(id);

    if (!block) {
      throw new Error('Block not found');
    }

    if (offset < 0 || offset + data.length > block.size) {
      throw new Error('Invalid write range');
    }

    block.data.set(data, offset);
    block.version++;
  }

  /**
   * Free block
   */
  public free(id: string): boolean {
    return this.blocks.delete(id);
  }

  /**
   * Add replica to block
   */
  public addReplica(blockId: string, nodeId: string): void {
    const block = this.blocks.get(blockId);

    if (block && !block.replicas.includes(nodeId)) {
      block.replicas.push(nodeId);
    }
  }

  /**
   * Remove replica from block
   */
  public removeReplica(blockId: string, nodeId: string): void {
    const block = this.blocks.get(blockId);

    if (block) {
      block.replicas = block.replicas.filter(id => id !== nodeId);
    }
  }

  /**
   * Sync block to replicas
   */
  public syncBlock(id: string): void {
    const block = this.blocks.get(id);

    if (!block) {
      return;
    }

    // In a real implementation, this would send data to replica nodes
    // For now, we just increment the version
    block.version++;
  }

  /**
   * Get block version
   */
  public getVersion(id: string): number {
    const block = this.blocks.get(id);
    return block ? block.version : 0;
  }

  /**
   * Clear all blocks
   */
  public clear(): void {
    this.blocks.clear();
    this.blockCounter = 0;
  }

  /**
   * Set replication factor
   */
  public setReplicationFactor(factor: number): void {
    this.replicationFactor = factor;
  }

  /**
   * Get replication factor
   */
  public getReplicationFactor(): number {
    return this.replicationFactor;
  }

  /**
   * Get memory statistics
   */
  public getStatistics(): MemoryStatistics {
    const totalSize = Array.from(this.blocks.values()).reduce((sum, b) => sum + b.size, 0);
    const totalReplicas = Array.from(this.blocks.values()).reduce((sum, b) => sum + b.replicas.length, 0);
    const averageReplication = this.blocks.size > 0 ? totalReplicas / this.blocks.size : 0;

    const nodeDistribution = new Map<string, number>();

    for (const block of this.blocks.values()) {
      const count = nodeDistribution.get(block.nodeId) || 0;
      nodeDistribution.set(block.nodeId, count + 1);

      for (const replica of block.replicas) {
        const replicaCount = nodeDistribution.get(replica) || 0;
        nodeDistribution.set(replica, replicaCount + 1);
      }
    }

    return {
      totalBlocks: this.blocks.size,
      totalSize,
      averageReplication,
      nodeDistribution,
    };
  }

  /**
   * Validate distributed memory state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, block] of this.blocks) {
      if (block.id !== id) {
        errors.push(`Block ID mismatch at ${id}`);
      }

      if (!this.clusterManager.getNode(block.nodeId)) {
        errors.push(`Block ${id} references non-existent node ${block.nodeId}`);
      }

      for (const replica of block.replicas) {
        if (!this.clusterManager.getNode(replica)) {
          errors.push(`Block ${id} references non-existent replica ${replica}`);
        }
      }

      if (block.size < 0) {
        errors.push(`Invalid size in block ${id}`);
      }

      if (block.data.length !== block.size) {
        errors.push(`Data size mismatch in block ${id}`);
      }

      if (block.version < 0) {
        errors.push(`Invalid version in block ${id}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get cluster manager
   */
  public getClusterManager(): ClusterManager {
    return this.clusterManager;
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }
}
