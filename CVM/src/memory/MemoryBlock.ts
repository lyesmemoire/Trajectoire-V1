/**
 * Memory Block Implementation
 * Represents a unit of allocated memory in the cognitive memory system
 */

import { MemoryType } from './types';

export class MemoryBlock {
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

  constructor(
    id: string,
    memoryType: MemoryType,
    sessionId: string,
    size: number,
    data: Buffer,
    metadata?: Map<string, unknown>
  ) {
    this.id = id;
    this.memoryType = memoryType;
    this.sessionId = sessionId;
    this.size = size;
    this.data = data;
    this.allocatedAt = Date.now();
    this.lastAccessed = this.allocatedAt;
    this.accessCount = 0;
    this.version = 1;
    this.compressed = false;
    this.metadata = metadata || new Map();
  }

  /**
   * Record an access to this memory block
   */
  recordAccess(): void {
    this.lastAccessed = Date.now();
    this.accessCount++;
  }

  /**
   * Update the version of this memory block
   */
  updateVersion(): void {
    this.version++;
  }

  /**
   * Set time-to-live for this memory block
   */
  setTTL(ttl: number): void {
    this.ttl = ttl;
    this.expiresAt = Date.now() + ttl;
  }

  /**
   * Check if this memory block has expired
   */
  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return Date.now() > this.expiresAt;
  }

  /**
   * Get the age of this memory block in milliseconds
   */
  getAge(): number {
    return Date.now() - this.allocatedAt;
  }

  /**
   * Get the time since last access in milliseconds
   */
  getTimeSinceLastAccess(): number {
    return Date.now() - this.lastAccessed;
  }

  /**
   * Get the access frequency (accesses per second)
   */
  getAccessFrequency(): number {
    const ageInSeconds = this.getAge() / 1000;
    if (ageInSeconds === 0) return 0;
    return this.accessCount / ageInSeconds;
  }

  /**
   * Create a deep copy of this memory block
   */
  clone(): MemoryBlock {
    return new MemoryBlock(
      this.id,
      this.memoryType,
      this.sessionId,
      this.size,
      Buffer.from(this.data),
      new Map(this.metadata)
    );
  }

  /**
   * Get metadata value by key
   */
  getMetadata(key: string): unknown {
    return this.metadata.get(key);
  }

  /**
   * Set metadata value
   */
  setMetadata(key: string, value: unknown): void {
    this.metadata.set(key, value);
  }

  /**
   * Check if this block matches a predicate
   */
  matches(predicate: (block: MemoryBlock) => boolean): boolean {
    return predicate(this);
  }
}
