/**
 * Cognitive Memory Manager Type Definitions
 * Production-ready types for the cognitive memory management system
 */

export enum MemoryType {
  WORKING = 'WORKING',
  CONVERSATION = 'CONVERSATION',
  REASONING = 'REASONING',
  KNOWLEDGE = 'KNOWLEDGE',
  SEMANTIC = 'SEMANTIC',
  EVIDENCE = 'EVIDENCE',
  EXECUTION = 'EXECUTION',
  LONG_TERM = 'LONG_TERM',
  SHORT_TERM = 'SHORT_TERM',
  EPISODE = 'EPISODE',
  CONTEXT = 'CONTEXT',
  SESSION = 'SESSION'
}

export enum EvictionPolicy {
  LRU = 'LRU',
  LFU = 'LFU',
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  TTL = 'TTL',
  SIZE = 'SIZE',
  RANDOM = 'RANDOM'
}

export enum CompressionAlgorithm {
  NONE = 'NONE',
  GZIP = 'GZIP',
  BROTLI = 'BROTLI',
  LZ4 = 'LZ4',
  ZSTD = 'ZSTD'
}

export interface MemoryBlock {
  id: string;
  memoryType: MemoryType;
  sessionId: string;
  size: number;
  allocatedAt: number;
  lastAccessed: number;
  accessCount: number;
  ttl?: number;
  expiresAt?: number;
  version: number;
  compressed: boolean;
  compressionRatio?: number;
  metadata: Map<string, unknown>;
  data: Buffer;
}

export interface MemoryQuota {
  memoryType: MemoryType;
  maxSize: number;
  maxBlocks: number;
  maxBlockSize: number;
  softLimit: number;
  hardLimit: number;
  evictionThreshold: number;
}

export interface AllocationResult {
  success: boolean;
  blockId?: string;
  error?: string;
  quotaExceeded?: boolean;
}

export interface DeallocationResult {
  success: boolean;
  freedSize: number;
  error?: string;
}

export interface MemorySnapshot {
  id: string;
  sessionId: string;
  timestamp: number;
  blocks: Map<string, MemoryBlock>;
  totalSize: number;
  checksum: string;
}

export interface MemoryVersion {
  version: number;
  timestamp: number;
  blockId: string;
  parentId?: string;
  changeType: 'CREATE' | 'UPDATE' | 'DELETE';
  size: number;
}

export interface MemoryMetrics {
  totalAllocated: number;
  totalFreed: number;
  currentUsage: number;
  peakUsage: number;
  allocationCount: number;
  deallocationCount: number;
  evictionCount: number;
  compressionCount: number;
  decompressionCount: number;
  snapshotCount: number;
  restoreCount: number;
  rollbackCount: number;
  hitRate: number;
  missRate: number;
  averageAccessTime: number;
}

export interface MemoryTypeMetrics {
  memoryType: MemoryType;
  allocated: number;
  freed: number;
  currentUsage: number;
  blockCount: number;
  averageBlockSize: number;
  evictionCount: number;
  compressionRatio: number;
  hitRate: number;
}

export interface MemoryManagerConfig {
  totalMemoryLimit: number;
  enableCompression: boolean;
  compressionAlgorithm: CompressionAlgorithm;
  compressionThreshold: number;
  enableSnapshots: boolean;
  snapshotInterval: number;
  maxSnapshots: number;
  enableVersioning: boolean;
  maxVersions: number;
  defaultTTL: number;
  enableMetrics: boolean;
  metricsInterval: number;
}
