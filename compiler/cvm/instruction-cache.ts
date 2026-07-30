/**
 * Blueprint DSL CVM Instruction Cache
 * 
 * Caches instructions for improved fetch performance.
 */

import { Instruction, InstructionTable } from '../cbs/instruction-table';

export interface CacheEntry {
  address: number;
  instruction: Instruction;
  size: number;
  accessCount: number;
  lastAccess: number;
}

export interface CacheStatistics {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  maxSize: number;
  evictions: number;
}

export class InstructionCache {
  private cache: Map<number, CacheEntry> = new Map();
  private maxSize: number;
  private statistics: CacheStatistics;
  private accessCounter: number = 0;

  constructor(maxSize: number = 256) {
    this.maxSize = maxSize;
    this.statistics = this.initializeStatistics();
  }

  /**
   * Initialize statistics
   */
  private initializeStatistics(): CacheStatistics {
    return {
      hits: 0,
      misses: 0,
      hitRate: 0,
      size: 0,
      maxSize: this.maxSize,
      evictions: 0,
    };
  }

  /**
   * Get instruction from cache
   */
  public get(address: number): Instruction | null {
    const entry = this.cache.get(address);

    if (entry) {
      this.statistics.hits++;
      entry.accessCount++;
      entry.lastAccess = this.accessCounter++;
      this.updateHitRate();
      return entry.instruction;
    }

    this.statistics.misses++;
    this.updateHitRate();
    return null;
  }

  /**
   * Put instruction in cache
   */
  public put(address: number, instruction: Instruction, size: number): void {
    const entry: CacheEntry = {
      address,
      instruction,
      size,
      accessCount: 1,
      lastAccess: this.accessCounter++,
    };

    this.cache.set(address, entry);
    this.statistics.size = this.cache.size;

    this.evictIfNeeded();
  }

  /**
   * Evict entry if cache is full
   */
  private evictIfNeeded(): void {
    if (this.cache.size <= this.maxSize) {
      return;
    }

    // LRU eviction
    let oldestAddress: number | null = null;
    let oldestAccess = Infinity;

    for (const [address, entry] of this.cache) {
      if (entry.lastAccess < oldestAccess) {
        oldestAccess = entry.lastAccess;
        oldestAddress = address;
      }
    }

    // oldestAddress is guaranteed to be non-null here because:
    // - cache.size > maxSize (from line 92 check)
    // - maxSize >= 0 (cache size cannot be negative)
    // - Therefore cache.size >= 1
    // - The loop has at least one iteration
    // - oldestAddress is set in the first iteration
    this.cache.delete(oldestAddress);
    this.statistics.evictions++;
    this.statistics.size = this.cache.size;
  }

  /**
   * Check if address is in cache
   */
  public has(address: number): boolean {
    return this.cache.has(address);
  }

  /**
   * Remove entry from cache
   */
  public remove(address: number): boolean {
    const removed = this.cache.delete(address);
    this.statistics.size = this.cache.size;
    return removed;
  }

  /**
   * Clear cache
   */
  public clear(): void {
    this.cache.clear();
    this.statistics = this.initializeStatistics();
    this.accessCounter = 0;
  }

  /**
   * Prefetch instructions
   */
  public prefetch(address: number, bytecode: Uint8Array): void {
    if (this.cache.has(address)) {
      return;
    }

    try {
      const { instruction, nextOffset } = InstructionTable.decode(bytecode, address);
      const size = nextOffset - address;
      this.put(address, instruction, size);
    } catch (error) {
      // Ignore prefetch errors
    }
  }

  /**
   * Prefetch range of instructions
   */
  public prefetchRange(start: number, end: number, bytecode: Uint8Array): void {
    let address = start;

    while (address < end) {
      this.prefetch(address, bytecode);

      try {
        const { nextOffset } = InstructionTable.decode(bytecode, address);
        address = nextOffset;
      } catch (error) {
        break;
      }
    }
  }

  /**
   * Get cache statistics
   */
  public getStatistics(): CacheStatistics {
    return { ...this.statistics };
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    const total = this.statistics.hits + this.statistics.misses;
    // total is guaranteed to be >= 1 here because:
    // - updateHitRate() is only called from get()
    // - get() always increments hits or misses before calling updateHitRate()
    // - Therefore total >= 1
    this.statistics.hitRate = this.statistics.hits / total;
  }

  /**
   * Get cache size
   */
  public getSize(): number {
    return this.cache.size;
  }

  /**
   * Get max size
   */
  public getMaxSize(): number {
    return this.maxSize;
  }

  /**
   * Set max size
   */
  public setMaxSize(size: number): void {
    this.maxSize = size;
    this.statistics.maxSize = size;
    this.evictIfNeeded();
  }

  /**
   * Get all entries
   */
  public getAllEntries(): CacheEntry[] {
    return Array.from(this.cache.values());
  }

  /**
   * Get hot entries (frequently accessed)
   */
  public getHotEntries(threshold: number = 5): CacheEntry[] {
    return Array.from(this.cache.values()).filter(entry => entry.accessCount >= threshold);
  }

  /**
   * Validate cache state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [address, entry] of this.cache) {
      if (entry.address !== address) {
        errors.push(`Entry address mismatch at ${address}`);
      }

      if (entry.accessCount < 0) {
        errors.push(`Invalid access count at ${address}`);
      }

      if (entry.lastAccess < 0) {
        errors.push(`Invalid last access at ${address}`);
      }
    }

    if (this.cache.size > this.maxSize) {
      errors.push('Cache size exceeds maximum');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get utilization
   */
  public getUtilization(): number {
    return this.cache.size / this.maxSize;
  }
}
