/**
 * Blueprint DSL CVM Instruction Fetch
 * 
 * Fetches instructions from bytecode for execution.
 */

import { Instruction, InstructionTable } from '../cbs/instruction-table';

export interface FetchResult {
  instruction: Instruction;
  address: number;
  size: number;
}

export interface InstructionCacheOptions {
  size?: number;
  enabled?: boolean;
}

export class InstructionFetch {
  private bytecode: Uint8Array;
  private cache: Map<number, Instruction> = new Map();
  private cacheSize: number;
  private cacheEnabled: boolean;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;

  constructor(bytecode: Uint8Array, options: InstructionCacheOptions = {}) {
    this.bytecode = bytecode;
    this.cacheSize = options.size || 256;
    this.cacheEnabled = options.enabled !== false;
  }

  /**
   * Fetch instruction at address
   */
  public fetch(address: number): FetchResult {
    // Check cache first
    if (this.cacheEnabled && this.cache.has(address)) {
      this.cacheHits++;
      const instruction = this.cache.get(address)!;
      return {
        instruction,
        address,
        size: instruction.size,
      };
    }

    // Fetch from bytecode
    this.cacheMisses++;
    const { instruction, nextOffset } = InstructionTable.decode(this.bytecode, address);
    const size = nextOffset - address;

    // Cache the instruction
    if (this.cacheEnabled) {
      this.cache.set(address, instruction);
      this.evictIfNeeded();
    }

    return {
      instruction,
      address,
      size,
    };
  }

  /**
   * Fetch multiple instructions
   */
  public fetchMultiple(addresses: number[]): FetchResult[] {
    return addresses.map(addr => this.fetch(addr));
  }

  /**
   * Prefetch instructions
   */
  public prefetch(address: number): void {
    if (!this.cacheEnabled) {
      return;
    }

    if (this.cache.has(address)) {
      return;
    }

    try {
      const { instruction } = InstructionTable.decode(this.bytecode, address);
      this.cache.set(address, instruction);
      this.evictIfNeeded();
    } catch (error) {
      // Ignore prefetch errors
    }
  }

  /**
   * Prefetch range of instructions
   */
  public prefetchRange(start: number, end: number): void {
    let address = start;

    while (address < end) {
      this.prefetch(address);

      try {
        const { nextOffset } = InstructionTable.decode(this.bytecode, address);
        address = nextOffset;
      } catch (error) {
        break;
      }
    }
  }

  /**
   * Evict instruction from cache if needed
   */
  private evictIfNeeded(): void {
    if (this.cache.size <= this.cacheSize) {
      return;
    }

    // Simple LRU: remove oldest entry
    const iterator = this.cache.keys();
    const firstKey = iterator.next().value;
    // firstKey is guaranteed to be defined when cache.size > cacheSize
    this.cache.delete(firstKey!);
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  /**
   * Get cache statistics
   */
  public getCacheStatistics(): {
    size: number;
    maxSize: number;
    hits: number;
    misses: number;
    hitRate: number;
  } {
    const total = this.cacheHits + this.cacheMisses;
    const hitRate = total > 0 ? this.cacheHits / total : 0;

    return {
      size: this.cache.size,
      maxSize: this.cacheSize,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate,
    };
  }

  /**
   * Enable cache
   */
  public enableCache(): void {
    this.cacheEnabled = true;
  }

  /**
   * Disable cache
   */
  public disableCache(): void {
    this.cacheEnabled = false;
    this.clearCache();
  }

  /**
   * Set cache size
   */
  public setCacheSize(size: number): void {
    this.cacheSize = size;
    this.evictIfNeeded();
  }

  /**
   * Set bytecode
   */
  public setBytecode(bytecode: Uint8Array): void {
    this.bytecode = bytecode;
    this.clearCache();
  }

  /**
   * Get bytecode
   */
  public getBytecode(): Uint8Array {
    return this.bytecode;
  }

  /**
   * Validate address
   */
  public validateAddress(address: number): boolean {
    return address >= 0 && address < this.bytecode.length;
  }

  /**
   * Get instruction size at address
   */
  public getInstructionSize(address: number): number {
    if (!this.validateAddress(address)) {
      return 0;
    }

    try {
      const { instruction, nextOffset } = InstructionTable.decode(this.bytecode, address);
      return nextOffset - address;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get total instruction count
   */
  public getInstructionCount(): number {
    let count = 0;
    let address = 0;

    while (address < this.bytecode.length) {
      const size = this.getInstructionSize(address);
      if (size === 0) {
        break;
      }

      count++;
      address += size;
    }

    return count;
  }
}
