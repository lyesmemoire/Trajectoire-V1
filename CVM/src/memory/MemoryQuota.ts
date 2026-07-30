/**
 * Memory Quota Implementation
 * Defines and enforces memory limits for different memory types
 */

import { MemoryType, MemoryQuota as IMemoryQuota } from './types';

export class MemoryQuota implements IMemoryQuota {
  memoryType: MemoryType;
  maxSize: number;
  maxBlocks: number;
  maxBlockSize: number;
  softLimit: number;
  hardLimit: number;
  evictionThreshold: number;

  constructor(
    memoryType: MemoryType,
    maxSize: number,
    maxBlocks: number,
    maxBlockSize: number
  ) {
    this.memoryType = memoryType;
    this.maxSize = maxSize;
    this.maxBlocks = maxBlocks;
    this.maxBlockSize = maxBlockSize;
    this.softLimit = maxSize * 0.8;
    this.hardLimit = maxSize;
    this.evictionThreshold = maxSize * 0.9;
  }

  /**
   * Check if allocation is allowed given current usage
   */
  canAllocate(size: number, currentUsage: number, currentBlocks: number): boolean {
    if (size > this.maxBlockSize) return false;
    if (currentBlocks >= this.maxBlocks) return false;
    if (currentUsage + size > this.hardLimit) return false;
    return true;
  }

  /**
   * Check if eviction should be triggered
   */
  shouldEvict(currentUsage: number): boolean {
    return currentUsage > this.evictionThreshold;
  }

  /**
   * Check if soft limit is exceeded
   */
  isSoftLimitExceeded(currentUsage: number): boolean {
    return currentUsage > this.softLimit;
  }

  /**
   * Get the soft limit
   */
  getSoftLimit(): number {
    return this.softLimit;
  }

  /**
   * Get the hard limit
   */
  getHardLimit(): number {
    return this.hardLimit;
  }

  /**
   * Get the eviction threshold
   */
  getEvictionThreshold(): number {
    return this.evictionThreshold;
  }

  /**
   * Get the remaining capacity
   */
  getRemainingCapacity(currentUsage: number): number {
    return Math.max(0, this.hardLimit - currentUsage);
  }

  /**
   * Get the capacity utilization percentage
   */
  getUtilization(currentUsage: number): number {
    return (currentUsage / this.hardLimit) * 100;
  }

  /**
   * Update the quota limits
   */
  updateLimits(maxSize: number, maxBlocks: number, maxBlockSize: number): void {
    this.maxSize = maxSize;
    this.maxBlocks = maxBlocks;
    this.maxBlockSize = maxBlockSize;
    this.softLimit = maxSize * 0.8;
    this.hardLimit = maxSize;
    this.evictionThreshold = maxSize * 0.9;
  }

  /**
   * Get quota information
   */
  getInfo(): {
    memoryType: MemoryType;
    maxSize: number;
    maxBlocks: number;
    maxBlockSize: number;
    softLimit: number;
    hardLimit: number;
    evictionThreshold: number;
  } {
    return {
      memoryType: this.memoryType,
      maxSize: this.maxSize,
      maxBlocks: this.maxBlocks,
      maxBlockSize: this.maxBlockSize,
      softLimit: this.softLimit,
      hardLimit: this.hardLimit,
      evictionThreshold: this.evictionThreshold
    };
  }
}
