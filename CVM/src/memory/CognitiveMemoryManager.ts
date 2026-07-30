/**
 * Cognitive Memory Manager - Main Implementation
 * Production-grade memory management system for cognitive workloads
 */

import {
  MemoryType,
  AllocationResult,
  DeallocationResult,
  MemorySnapshot,
  MemoryVersion,
  MemoryMetrics,
  MemoryTypeMetrics,
  EvictionPolicy,
  MemoryManagerConfig
} from './types';
import { MemoryBlock } from './MemoryBlock';
import { MemoryQuota } from './MemoryQuota';
import { SpecializedMemoryManager } from './SpecializedMemoryManager';

export class CognitiveMemoryManager {
  config: MemoryManagerConfig;
  quotas: Map<MemoryType, MemoryQuota> = new Map();
  memoryBlocks: Map<string, MemoryBlock> = new Map();
  memoryByType: Map<MemoryType, Set<string>> = new Map();
  memoryBySession: Map<string, Set<string>> = new Map();
  snapshots: Map<string, MemorySnapshot> = new Map();
  versions: Map<string, MemoryVersion[]> = new Map();
  metrics: MemoryMetrics;
  typeMetrics: Map<MemoryType, MemoryTypeMetrics> = new Map();
  specializedManagers: Map<MemoryType, SpecializedMemoryManager> = new Map();
  
  private initialized: boolean = false;
  private cleanupInterval?: NodeJS.Timeout;
  private metricsInterval?: NodeJS.Timeout;

  constructor(config: MemoryManagerConfig) {
    this.config = config;
    
    this.metrics = {
      totalAllocated: 0,
      totalFreed: 0,
      currentUsage: 0,
      peakUsage: 0,
      allocationCount: 0,
      deallocationCount: 0,
      evictionCount: 0,
      compressionCount: 0,
      decompressionCount: 0,
      snapshotCount: 0,
      restoreCount: 0,
      rollbackCount: 0,
      hitRate: 0,
      missRate: 0,
      averageAccessTime: 0
    };

    this.initializeMemoryTypes();
  }

  private initializeMemoryTypes(): void {
    const memoryTypes = [
      MemoryType.WORKING,
      MemoryType.CONVERSATION,
      MemoryType.REASONING,
      MemoryType.KNOWLEDGE,
      MemoryType.SEMANTIC,
      MemoryType.EVIDENCE,
      MemoryType.EXECUTION,
      MemoryType.LONG_TERM,
      MemoryType.SHORT_TERM,
      MemoryType.EPISODE,
      MemoryType.CONTEXT,
      MemoryType.SESSION
    ];

    for (const memoryType of memoryTypes) {
      const quota = this.getDefaultQuota(memoryType);
      this.quotas.set(memoryType, quota);
      
      this.typeMetrics.set(memoryType, {
        memoryType,
        allocated: 0,
        freed: 0,
        currentUsage: 0,
        blockCount: 0,
        averageBlockSize: 0,
        evictionCount: 0,
        compressionRatio: 0,
        hitRate: 0
      });
      
      this.memoryByType.set(memoryType, new Set());
      
      const manager = new SpecializedMemoryManager(
        memoryType,
        quota,
        this.config.enableCompression,
        this.config.compressionAlgorithm
      );
      this.specializedManagers.set(memoryType, manager);
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.cleanupInterval = setInterval(async () => {
      await this.cleanupExpired();
    }, 60000);

    if (this.config.enableMetrics) {
      this.metricsInterval = setInterval(() => {
        this.updateMetrics();
      }, this.config.metricsInterval);
    }
  }

  async allocate(
    memoryType: MemoryType,
    sessionId: string,
    size: number,
    data: Buffer,
    metadata?: Map<string, unknown>
  ): Promise<AllocationResult> {
    if (!this.initialized) {
      await this.initialize();
    }

    const manager = this.specializedManagers.get(memoryType);
    if (!manager) {
      return {
        success: false,
        error: `No manager for memory type ${memoryType}`
      };
    }

    if (this.metrics.currentUsage + size > this.config.totalMemoryLimit) {
      await this.triggerEviction();
    }

    const result = await manager.allocate(sessionId, size, data, metadata);
    
    if (result.success && result.blockId) {
      const block = manager.getBlock(result.blockId);
      if (block) {
        this.memoryBlocks.set(result.blockId, block);
        this.memoryByType.get(memoryType)!.add(result.blockId);
        
        if (!this.memoryBySession.has(sessionId)) {
          this.memoryBySession.set(sessionId, new Set());
        }
        this.memoryBySession.get(sessionId)!.add(result.blockId);
        
        this.metrics.totalAllocated += size;
        this.metrics.currentUsage += size;
        this.metrics.allocationCount++;
        
        if (this.metrics.currentUsage > this.metrics.peakUsage) {
          this.metrics.peakUsage = this.metrics.currentUsage;
        }
        
        this.recordVersion(result.blockId, 'CREATE', size);
      }
    }

    return result;
  }

  async deallocate(blockId: string): Promise<DeallocationResult> {
    const block = this.memoryBlocks.get(blockId);
    if (!block) {
      return {
        success: false,
        freedSize: 0,
        error: 'Block not found'
      };
    }

    const manager = this.specializedManagers.get(block.memoryType);
    if (!manager) {
      return {
        success: false,
        freedSize: 0,
        error: 'Manager not found'
      };
    }

    const result = await manager.deallocate(blockId);
    
    if (result.success) {
      this.memoryBlocks.delete(blockId);
      this.memoryByType.get(block.memoryType)!.delete(blockId);
      this.memoryBySession.get(block.sessionId)!.delete(blockId);
      
      this.metrics.totalFreed += result.freedSize;
      this.metrics.currentUsage -= result.freedSize;
      this.metrics.deallocationCount++;
      
      this.recordVersion(blockId, 'DELETE', result.freedSize);
    }

    return result;
  }

  async access(blockId: string): Promise<MemoryBlock | null> {
    const startTime = Date.now();
    const block = this.memoryBlocks.get(blockId);
    
    if (!block) {
      this.metrics.missRate++;
      return null;
    }

    const manager = this.specializedManagers.get(block.memoryType);
    if (manager) {
      await manager.access(blockId);
    }
    
    block.recordAccess();
    this.metrics.hitRate++;
    
    const accessTime = Date.now() - startTime;
    this.updateAverageAccessTime(accessTime);
    
    return block;
  }

  async update(blockId: string, data: Buffer): Promise<void> {
    const block = this.memoryBlocks.get(blockId);
    if (!block) {
      throw new Error('Block not found');
    }

    const oldSize = block.size;
    block.data = data;
    block.size = data.length;
    block.updateVersion();

    const sizeDelta = data.length - oldSize;
    this.metrics.currentUsage += sizeDelta;
    
    this.recordVersion(blockId, 'UPDATE', data.length);
  }

  get(blockId: string): Buffer | null {
    const block = this.memoryBlocks.get(blockId);
    return block ? block.data : null;
  }

  setQuota(memoryType: MemoryType, quota: MemoryQuota): void {
    this.quotas.set(memoryType, quota);
    
    const manager = this.specializedManagers.get(memoryType);
    if (manager) {
      manager.updateQuota(quota);
    }
  }

  getQuota(memoryType: MemoryType): MemoryQuota | null {
    return this.quotas.get(memoryType) || null;
  }

  async evict(memoryType: MemoryType, policy: EvictionPolicy, count: number): Promise<number> {
    const manager = this.specializedManagers.get(memoryType);
    if (!manager) {
      return 0;
    }

    const evictedSize = await manager.evict(policy, count);
    this.metrics.evictionCount += count;
    this.metrics.currentUsage -= evictedSize;

    return evictedSize;
  }

  async compress(blockId: string): Promise<void> {
    const block = this.memoryBlocks.get(blockId);
    if (!block) {
      return;
    }

    const manager = this.specializedManagers.get(block.memoryType);
    if (manager) {
      await manager.compress(blockId);
      this.metrics.compressionCount++;
    }
  }

  async decompress(blockId: string): Promise<void> {
    const block = this.memoryBlocks.get(blockId);
    if (!block) {
      return;
    }

    const manager = this.specializedManagers.get(block.memoryType);
    if (manager) {
      await manager.decompress(blockId);
      this.metrics.decompressionCount++;
    }
  }

  async createSnapshot(sessionId: string): Promise<string> {
    const snapshotId = `snapshot_${sessionId}_${Date.now()}`;
    const sessionBlocks = this.memoryBySession.get(sessionId);
    
    if (!sessionBlocks) {
      throw new Error('Session not found');
    }

    const blocks = new Map<string, MemoryBlock>();
    let totalSize = 0;

    for (const blockId of sessionBlocks) {
      const block = this.memoryBlocks.get(blockId);
      if (block) {
        blocks.set(blockId, block.clone());
        totalSize += block.size;
      }
    }

    const snapshot: MemorySnapshot = {
      id: snapshotId,
      sessionId,
      timestamp: Date.now(),
      blocks,
      totalSize,
      checksum: this.calculateChecksum(blocks)
    };

    this.snapshots.set(snapshotId, snapshot);
    this.metrics.snapshotCount++;

    this.enforceSnapshotLimit();

    return snapshotId;
  }

  async restoreSnapshot(snapshotId: string): Promise<void> {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) {
      throw new Error('Snapshot not found');
    }

    const sessionBlocks = this.memoryBySession.get(snapshot.sessionId);
    if (sessionBlocks) {
      for (const blockId of sessionBlocks) {
        await this.deallocate(blockId);
      }
    }

    for (const [blockId, block] of snapshot.blocks.entries()) {
      await this.allocate(
        block.memoryType,
        block.sessionId,
        block.size,
        block.data,
        block.metadata
      );
    }

    this.metrics.restoreCount++;
  }

  async deleteSnapshot(snapshotId: string): Promise<void> {
    this.snapshots.delete(snapshotId);
  }

  async rollback(sessionId: string, version: number): Promise<void> {
    const sessionVersions = this.versions.get(sessionId);
    if (!sessionVersions) {
      throw new Error('No versions found for session');
    }

    const targetVersion = sessionVersions.find(v => v.version === version);
    if (!targetVersion) {
      throw new Error('Version not found');
    }

    this.metrics.rollbackCount++;
  }

  setTTL(blockId: string, ttl: number): void {
    const block = this.memoryBlocks.get(blockId);
    if (block) {
      block.setTTL(ttl);
    }
  }

  async cleanupExpired(): Promise<number> {
    let cleanedCount = 0;
    const expiredBlocks: string[] = [];

    for (const [blockId, block] of this.memoryBlocks.entries()) {
      if (block.isExpired()) {
        expiredBlocks.push(blockId);
      }
    }

    for (const blockId of expiredBlocks) {
      await this.deallocate(blockId);
      cleanedCount++;
    }

    return cleanedCount;
  }

  getMetrics(): MemoryMetrics {
    return { ...this.metrics };
  }

  getTypeMetrics(memoryType: MemoryType): MemoryTypeMetrics | null {
    const manager = this.specializedManagers.get(memoryType);
    return manager ? manager.getMetrics() : null;
  }

  getSessionMemory(sessionId: string): Map<string, MemoryBlock> {
    const sessionBlocks = this.memoryBySession.get(sessionId);
    if (!sessionBlocks) {
      return new Map();
    }

    const blocks = new Map<string, MemoryBlock>();
    for (const blockId of sessionBlocks) {
      const block = this.memoryBlocks.get(blockId);
      if (block) {
        blocks.set(blockId, block);
      }
    }

    return blocks;
  }

  async shutdown(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    for (const manager of this.specializedManagers.values()) {
      manager.clear();
    }

    this.memoryBlocks.clear();
    this.memoryByType.clear();
    this.memoryBySession.clear();
    this.snapshots.clear();
    this.versions.clear();
  }

  private getDefaultQuota(memoryType: MemoryType): MemoryQuota {
    const quotas: Record<MemoryType, { maxSize: number; maxBlocks: number; maxBlockSize: number }> = {
      [MemoryType.WORKING]: { maxSize: 100 * 1024 * 1024, maxBlocks: 1000, maxBlockSize: 10 * 1024 * 1024 },
      [MemoryType.CONVERSATION]: { maxSize: 50 * 1024 * 1024, maxBlocks: 500, maxBlockSize: 5 * 1024 * 1024 },
      [MemoryType.REASONING]: { maxSize: 200 * 1024 * 1024, maxBlocks: 2000, maxBlockSize: 20 * 1024 * 1024 },
      [MemoryType.KNOWLEDGE]: { maxSize: 500 * 1024 * 1024, maxBlocks: 5000, maxBlockSize: 50 * 1024 * 1024 },
      [MemoryType.SEMANTIC]: { maxSize: 300 * 1024 * 1024, maxBlocks: 3000, maxBlockSize: 30 * 1024 * 1024 },
      [MemoryType.EVIDENCE]: { maxSize: 150 * 1024 * 1024, maxBlocks: 1500, maxBlockSize: 15 * 1024 * 1024 },
      [MemoryType.EXECUTION]: { maxSize: 100 * 1024 * 1024, maxBlocks: 1000, maxBlockSize: 10 * 1024 * 1024 },
      [MemoryType.LONG_TERM]: { maxSize: 1000 * 1024 * 1024, maxBlocks: 10000, maxBlockSize: 100 * 1024 * 1024 },
      [MemoryType.SHORT_TERM]: { maxSize: 50 * 1024 * 1024, maxBlocks: 500, maxBlockSize: 5 * 1024 * 1024 },
      [MemoryType.EPISODE]: { maxSize: 200 * 1024 * 1024, maxBlocks: 2000, maxBlockSize: 20 * 1024 * 1024 },
      [MemoryType.CONTEXT]: { maxSize: 100 * 1024 * 1024, maxBlocks: 1000, maxBlockSize: 10 * 1024 * 1024 },
      [MemoryType.SESSION]: { maxSize: 500 * 1024 * 1024, maxBlocks: 5000, maxBlockSize: 50 * 1024 * 1024 }
    };

    const quota = quotas[memoryType];
    return new MemoryQuota(memoryType, quota.maxSize, quota.maxBlocks, quota.maxBlockSize);
  }

  private async triggerEviction(): Promise<void> {
    for (const [memoryType, manager] of this.specializedManagers.entries()) {
      const quota = this.quotas.get(memoryType);
      if (quota && quota.shouldEvict(manager.metrics.currentUsage)) {
        const evictCount = Math.ceil(manager.metrics.blockCount * 0.1);
        await this.evict(memoryType, EvictionPolicy.LRU, evictCount);
      }
    }
  }

  private recordVersion(blockId: string, changeType: 'CREATE' | 'UPDATE' | 'DELETE', size: number): void {
    const block = this.memoryBlocks.get(blockId);
    if (!block) return;

    const version: MemoryVersion = {
      version: block.version,
      timestamp: Date.now(),
      blockId,
      parentId: block.version > 1 ? `${blockId}_${block.version - 1}` : undefined,
      changeType,
      size
    };

    if (!this.versions.has(block.sessionId)) {
      this.versions.set(block.sessionId, []);
    }

    const sessionVersions = this.versions.get(block.sessionId)!;
    sessionVersions.push(version);

    if (sessionVersions.length > this.config.maxVersions) {
      sessionVersions.shift();
    }
  }

  private calculateChecksum(blocks: Map<string, MemoryBlock>): string {
    const data = Array.from(blocks.entries())
      .map(([id, block]) => `${id}:${block.size}:${block.version}`)
      .join('|');
    
    return Buffer.from(data).toString('base64');
  }

  private enforceSnapshotLimit(): void {
    if (this.snapshots.size <= this.config.maxSnapshots) {
      return;
    }

    const snapshots = Array.from(this.snapshots.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toDelete = snapshots.length - this.config.maxSnapshots;
    for (let i = 0; i < toDelete; i++) {
      this.snapshots.delete(snapshots[i][0]);
    }
  }

  private updateMetrics(): void {
    for (const [memoryType, manager] of this.specializedManagers.entries()) {
      this.typeMetrics.set(memoryType, manager.getMetrics());
    }

    const totalAccesses = this.metrics.hitRate + this.metrics.missRate;
    if (totalAccesses > 0) {
      this.metrics.hitRate = this.metrics.hitRate / totalAccesses;
      this.metrics.missRate = this.metrics.missRate / totalAccesses;
    }
  }

  private updateAverageAccessTime(accessTime: number): void {
    this.metrics.averageAccessTime = 
      (this.metrics.averageAccessTime * 0.9) + (accessTime * 0.1);
  }
}
