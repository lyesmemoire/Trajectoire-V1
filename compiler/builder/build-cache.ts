/**
 * Blueprint DSL Build Cache
 * 
 * Caches build artifacts to speed up incremental builds.
 */

import { BytecodeModule } from '../bytecode/bytecode-generator';
import { ASTNode } from '../parser/parser';

export interface CacheEntry {
  key: string;
  ast: ASTNode;
  bytecode: BytecodeModule;
  timestamp: number;
  hash: string;
  size: number;
}

export interface CacheStatistics {
  hits: number;
  misses: number;
  size: number;
  entries: number;
  hitRate: number;
}

export class BuildCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize: number;
  private maxEntries: number;
  private hits: number = 0;
  private misses: number = 0;

  constructor(maxSize: number = 100 * 1024 * 1024, maxEntries: number = 1000) {
    this.maxSize = maxSize;
    this.maxEntries = maxEntries;
  }

  /**
   * Get a cache entry
   */
  public get(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    
    if (entry) {
      this.hits++;
      return entry;
    }

    this.misses++;
    return null;
  }

  /**
   * Set a cache entry
   */
  public set(key: string, ast: ASTNode, bytecode: BytecodeModule): void {
    const hash = this.computeHash(ast);
    const size = this.computeSize(ast, bytecode);

    // Check if entry already exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Check cache size limits
    this.evictIfNeeded(size);

    // Add entry
    const entry: CacheEntry = {
      key,
      ast,
      bytecode,
      timestamp: Date.now(),
      hash,
      size,
    };

    this.cache.set(key, entry);
  }

  /**
   * Delete a cache entry
   */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear the cache
   */
  public clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Check if a key exists in the cache
   */
  public has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Get cache statistics
   */
  public getStatistics(): CacheStatistics {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? this.hits / totalRequests : 0;

    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += entry.size;
    }

    return {
      hits: this.hits,
      misses: this.misses,
      size: totalSize,
      entries: this.cache.size,
      hitRate,
    };
  }

  /**
   * Evict entries if needed
   */
  private evictIfNeeded(newEntrySize: number): void {
    // Check entry count limit
    while (this.cache.size >= this.maxEntries) {
      this.evictLRU();
    }

    // Check size limit
    let currentSize = this.getCurrentSize();
    while (currentSize + newEntrySize > this.maxSize && this.cache.size > 0) {
      const evicted = this.evictLRU();
      currentSize -= evicted.size;
    }
  }

  /**
   * Evict the least recently used entry
   */
  private evictLRU(): CacheEntry {
    let lruKey: string | null = null;
    let lruTimestamp = Infinity;

    for (const [key, entry] of this.cache) {
      if (entry.timestamp < lruTimestamp) {
        lruTimestamp = entry.timestamp;
        lruKey = key;
      }
    }

    if (lruKey) {
      const entry = this.cache.get(lruKey)!;
      this.cache.delete(lruKey);
      return entry;
    }

    // Fallback: evict first entry
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      const entry = this.cache.get(firstKey)!;
      this.cache.delete(firstKey);
      return entry;
    }

    throw new Error('No entries to evict');
  }

  /**
   * Get current cache size
   */
  private getCurrentSize(): number {
    let size = 0;
    for (const entry of this.cache.values()) {
      size += entry.size;
    }
    return size;
  }

  /**
   * Compute hash of AST
   */
  private computeHash(ast: ASTNode): string {
    // Simplified implementation
    // In a real implementation, this would compute a cryptographic hash
    const json = JSON.stringify(ast);
    let hash = 0;
    for (let i = 0; i < json.length; i++) {
      const char = json.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Compute size of cache entry
   */
  private computeSize(ast: ASTNode, bytecode: BytecodeModule): number {
    const astSize = JSON.stringify(ast).length * 2; // UTF-16
    const bytecodeSize = this.computeBytecodeSize(bytecode);
    return astSize + bytecodeSize;
  }

  /**
   * Compute bytecode size
   */
  private computeBytecodeSize(bytecode: BytecodeModule): number {
    let size = 0;
    for (const func of bytecode.functions) {
      size += func.bytecode.length * 4; // Each instruction is 4 bytes
      size += func.constants.length * 8; // Each constant is 8 bytes
    }
    return size;
  }

  /**
   * Invalidate entries based on a predicate
   */
  public invalidate(predicate: (entry: CacheEntry) => boolean): number {
    let count = 0;
    for (const [key, entry] of this.cache) {
      if (predicate(entry)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Invalidate entries older than a given timestamp
   */
  public invalidateOlderThan(timestamp: number): number {
    return this.invalidate(entry => entry.timestamp < timestamp);
  }

  /**
   * Get all keys in the cache
   */
  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all entries in the cache
   */
  public entries(): CacheEntry[] {
    return Array.from(this.cache.values());
  }

  /**
   * Save cache to disk
   */
  public async saveToDisk(path: string): Promise<void> {
    // In a real implementation, this would serialize the cache to disk
    const data = {
      entries: Array.from(this.cache.entries()),
      statistics: this.getStatistics(),
    };
    // await fs.writeFile(path, JSON.stringify(data));
  }

  /**
   * Load cache from disk
   */
  public async loadFromDisk(path: string): Promise<void> {
    // In a real implementation, this would deserialize the cache from disk
    // const data = JSON.parse(await fs.readFile(path, 'utf-8'));
    // this.cache = new Map(data.entries);
    // this.hits = data.statistics.hits;
    // this.misses = data.statistics.misses;
  }
}
