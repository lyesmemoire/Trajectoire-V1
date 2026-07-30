/**
 * Specialized Memory Manager Implementation
 * Manages a specific memory type with quota enforcement and eviction policies
 */

import {
  MemoryType,
  AllocationResult,
  DeallocationResult,
  MemoryTypeMetrics,
  EvictionPolicy,
  CompressionAlgorithm
} from './types';
import { MemoryBlock } from './MemoryBlock';
import { MemoryQuota } from './MemoryQuota';

export class SpecializedMemoryManager {
  memoryType: MemoryType;
  quota: MemoryQuota;
  blocks: Map<string, MemoryBlock>;
  metrics: MemoryTypeMetrics;
  private compressionEnabled: boolean;
  private compressionAlgorithm: CompressionAlgorithm;

  constructor(
    memoryType: MemoryType,
    quota: MemoryQuota,
    compressionEnabled: boolean = false,
    compressionAlgorithm: CompressionAlgorithm = CompressionAlgorithm.NONE
  ) {
    this.memoryType = memoryType;
    this.quota = quota;
    this.blocks = new Map();
    this.compressionEnabled = compressionEnabled;
    this.compressionAlgorithm = compressionAlgorithm;
    
    this.metrics = {
      memoryType,
      allocated: 0,
      freed: 0,
      currentUsage: 0,
      blockCount: 0,
      averageBlockSize: 0,
      evictionCount: 0,
      compressionRatio: 0,
      hitRate: 0
    };
  }

  /**
   * Allocate memory for this memory type
   */
  async allocate(
    sessionId: string,
    size: number,
    data: Buffer,
    metadata?: Map<string, unknown>
  ): Promise<AllocationResult> {
    if (!this.quota.canAllocate(size, this.metrics.currentUsage, this.metrics.blockCount)) {
      return {
        success: false,
        error: 'Quota exceeded',
        quotaExceeded: true
      };
    }

    const blockId = this.generateBlockId();
    const block = new MemoryBlock(blockId, this.memoryType, sessionId, size, data, metadata);
    
    this.blocks.set(blockId, block);
    this.metrics.allocated += size;
    this.metrics.currentUsage += size;
    this.metrics.blockCount++;
    this.updateAverageBlockSize();

    return {
      success: true,
      blockId
    };
  }

  /**
   * Deallocate memory block
   */
  async deallocate(blockId: string): Promise<DeallocationResult> {
    const block = this.blocks.get(blockId);
    if (!block) {
      return {
        success: false,
        freedSize: 0,
        error: 'Block not found'
      };
    }

    const size = block.size;
    this.blocks.delete(blockId);
    this.metrics.freed += size;
    this.metrics.currentUsage -= size;
    this.metrics.blockCount--;
    this.updateAverageBlockSize();

    return {
      success: true,
      freedSize: size
    };
  }

  /**
   * Access a memory block
   */
  async access(blockId: string): Promise<MemoryBlock | null> {
    const block = this.blocks.get(blockId);
    if (!block) {
      return null;
    }

    block.recordAccess();
    return block;
  }

  /**
   * Evict blocks based on policy
   */
  async evict(policy: EvictionPolicy, count: number): Promise<number> {
    const blocksToEvict = this.selectBlocksForEviction(policy, count);
    let evictedSize = 0;

    for (const blockId of blocksToEvict) {
      const result = await this.deallocate(blockId);
      if (result.success) {
        evictedSize += result.freedSize;
        this.metrics.evictionCount++;
      }
    }

    return evictedSize;
  }

  /**
   * Compress a memory block
   */
  async compress(blockId: string): Promise<void> {
    const block = this.blocks.get(blockId);
    if (!block || block.compressed) {
      return;
    }

    const compressedData = await this.compressData(block.data, this.compressionAlgorithm);
    const compressionRatio = compressedData.length / block.data.length;

    block.data = compressedData;
    block.compressed = true;
    block.compressionRatio = compressionRatio;
    block.size = compressedData.length;

    this.metrics.currentUsage -= (block.data.length - compressedData.length);
  }

  /**
   * Decompress a memory block
   */
  async decompress(blockId: string): Promise<void> {
    const block = this.blocks.get(blockId);
    if (!block || !block.compressed) {
      return;
    }

    const decompressedData = await this.decompressData(block.data, this.compressionAlgorithm);
    const originalSize = block.size / (block.compressionRatio || 1);

    block.data = decompressedData;
    block.compressed = false;
    block.compressionRatio = undefined;
    block.size = originalSize;

    this.metrics.currentUsage += (decompressedData.length - block.data.length);
  }

  /**
   * Get metrics for this memory type
   */
  getMetrics(): MemoryTypeMetrics {
    return { ...this.metrics };
  }

  /**
   * Clear all blocks
   */
  clear(): void {
    this.blocks.clear();
    this.metrics.currentUsage = 0;
    this.metrics.blockCount = 0;
    this.metrics.averageBlockSize = 0;
  }

  /**
   * Get a specific block
   */
  getBlock(blockId: string): MemoryBlock | undefined {
    return this.blocks.get(blockId);
  }

  /**
   * Get all blocks
   */
  getAllBlocks(): MemoryBlock[] {
    return Array.from(this.blocks.values());
  }

  /**
   * Get blocks by session
   */
  getBlocksBySession(sessionId: string): MemoryBlock[] {
    return Array.from(this.blocks.values()).filter(
      block => block.sessionId === sessionId
    );
  }

  /**
   * Get expired blocks
   */
  getExpiredBlocks(): MemoryBlock[] {
    return Array.from(this.blocks.values()).filter(block => block.isExpired());
  }

  /**
   * Update quota
   */
  updateQuota(quota: MemoryQuota): void {
    this.quota = quota;
  }

  private selectBlocksForEviction(policy: EvictionPolicy, count: number): string[] {
    const blocks = Array.from(this.blocks.values());
    const selected: string[] = [];

    switch (policy) {
      case EvictionPolicy.LRU:
        blocks.sort((a, b) => a.getTimeSinceLastAccess() - b.getTimeSinceLastAccess());
        break;
      case EvictionPolicy.LFU:
        blocks.sort((a, b) => a.accessCount - b.accessCount);
        break;
      case EvictionPolicy.FIFO:
        blocks.sort((a, b) => a.allocatedAt - b.allocatedAt);
        break;
      case EvictionPolicy.LIFO:
        blocks.sort((a, b) => b.allocatedAt - a.allocatedAt);
        break;
      case EvictionPolicy.TTL:
        blocks.sort((a, b) => {
          if (!a.expiresAt) return 1;
          if (!b.expiresAt) return -1;
          return a.expiresAt - b.expiresAt;
        });
        break;
      case EvictionPolicy.SIZE:
        blocks.sort((a, b) => b.size - a.size);
        break;
      case EvictionPolicy.RANDOM:
        for (let i = blocks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
        }
        break;
    }

    for (let i = 0; i < Math.min(count, blocks.length); i++) {
      selected.push(blocks[i].id);
    }

    return selected;
  }

  private async compressData(data: Buffer, algorithm: CompressionAlgorithm): Promise<Buffer> {
    switch (algorithm) {
      case CompressionAlgorithm.GZIP:
        return data;
      case CompressionAlgorithm.BROTLI:
        return data;
      case CompressionAlgorithm.LZ4:
        return data;
      case CompressionAlgorithm.ZSTD:
        return data;
      default:
        return data;
    }
  }

  private async decompressData(data: Buffer, algorithm: CompressionAlgorithm): Promise<Buffer> {
    switch (algorithm) {
      case CompressionAlgorithm.GZIP:
        return data;
      case CompressionAlgorithm.BROTLI:
        return data;
      case CompressionAlgorithm.LZ4:
        return data;
      case CompressionAlgorithm.ZSTD:
        return data;
      default:
        return data;
    }
  }

  private generateBlockId(): string {
    return `${this.memoryType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateAverageBlockSize(): void {
    if (this.metrics.blockCount === 0) {
      this.metrics.averageBlockSize = 0;
    } else {
      this.metrics.averageBlockSize = this.metrics.currentUsage / this.metrics.blockCount;
    }
  }
}
