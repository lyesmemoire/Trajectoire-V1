/**
 * Blueprint DSL CVM Memory Manager
 * 
 * Manages memory allocation and access control.
 */

import { Heap } from '../cbs/heap';
import { Stack } from '../cbs/stack';
import { MemoryAddressing, MemoryPermissions } from '../cbs/memory-addressing';
import { ExecutionContext } from './execution-context';

export interface MemoryStatistics {
  totalAllocated: number;
  totalFreed: number;
  currentUsage: number;
  peakUsage: number;
  allocationCount: number;
  freeCount: number;
}

export interface MemoryManagerOptions {
  enableProtection?: boolean;
  enableTracking?: boolean;
  maxMemory?: number;
}

export class MemoryManager {
  private context: ExecutionContext;
  private heap: Heap;
  private stack: Stack;
  private addressing: MemoryAddressing;
  private options: MemoryManagerOptions;
  private statistics: MemoryStatistics;
  private allocations: Map<number, number> = new Map();
  private peakUsage: number = 0;
  private handleTable: Map<number, any> = new Map();
  private handleCounter: number = 0;

  constructor(context: ExecutionContext, options: MemoryManagerOptions = {}) {
    this.context = context;
    this.heap = context.getHeap();
    this.stack = context.getStack();
    this.addressing = new MemoryAddressing();
    this.options = {
      enableProtection: options.enableProtection !== false,
      enableTracking: options.enableTracking !== false,
      maxMemory: options.maxMemory || 1024 * 1024 * 1024, // 1GB
    };
    this.statistics = this.initializeStatistics();
  }

  /**
   * Initialize statistics
   */
  private initializeStatistics(): MemoryStatistics {
    return {
      totalAllocated: 0,
      totalFreed: 0,
      currentUsage: 0,
      peakUsage: 0,
      allocationCount: 0,
      freeCount: 0,
    };
  }

  /**
   * Allocate memory
   */
  public allocate(size: number, permissions: MemoryPermissions = MemoryPermissions.READ_WRITE): number {
    const result = this.heap.allocate(size);

    if (this.options.enableTracking) {
      this.allocations.set(result.address, result.size);
      this.statistics.totalAllocated += result.size;
      this.statistics.allocationCount++;
      this.updateUsage();
    }

    // Synchronize with MemoryAddressing for access control
    if (this.options.enableProtection) {
      this.addressing.addRegion({
        start: result.address,
        end: result.address + result.size,
        name: `allocation_${result.address}`,
        permissions: permissions
      });
    }

    return result.address;
  }

  /**
   * Free memory
   */
  public free(address: number): void {
    // Remove region from MemoryAddressing if protection is enabled
    if (this.options.enableProtection) {
      this.addressing.removeRegion(`allocation_${address}`);
    }

    if (this.options.enableTracking) {
      const size = this.allocations.get(address) || 0;
      this.allocations.delete(address);
      this.statistics.totalFreed += size;
      this.statistics.freeCount++;
      this.updateUsage();
    }

    this.heap.free(address);
  }

  /**
   * Read memory
   */
  public read(address: number, size: number): Uint8Array {
    if (this.options.enableProtection) {
      if (!this.checkAccess(address, MemoryPermissions.READ)) {
        throw new Error(`Access violation: read at ${address}`);
      }
    }

    return this.heap.read(address, size);
  }

  /**
   * Write memory
   */
  public write(address: number, data: Uint8Array): void {
    if (this.options.enableProtection) {
      if (!this.checkAccess(address, MemoryPermissions.WRITE)) {
        throw new Error(`Access violation: write at ${address}`);
      }
    }

    this.heap.write(address, data);
  }

  /**
   * Check memory access
   */
  private checkAccess(address: number, permission: MemoryPermissions): boolean {
    return this.addressing.isAccessible(address, permission);
  }

  /**
   * Update current usage
   */
  private updateUsage(): void {
    this.statistics.currentUsage = this.statistics.totalAllocated - this.statistics.totalFreed;

    if (this.statistics.currentUsage > this.peakUsage) {
      this.peakUsage = this.statistics.currentUsage;
    }

    this.statistics.peakUsage = this.peakUsage;
  }

  /**
   * Get allocation size
   */
  public getAllocationSize(address: number): number {
    return this.allocations.get(address) || 0;
  }

  /**
   * Check if address is allocated
   */
  public isAllocated(address: number): boolean {
    return this.allocations.has(address);
  }

  /**
   * Get all allocations
   */
  public getAllocations(): Map<number, number> {
    return new Map(this.allocations);
  }

  /**
   * Clear all allocations
   */
  public clearAllocations(): void {
    this.allocations.clear();
    this.statistics = this.initializeStatistics();
    this.peakUsage = 0;
  }

  /**
   * Create handle for memory address
   */
  public createHandle(address: number): number {
    const handle = this.handleCounter++;
    this.handleTable.set(handle, address);
    return handle;
  }

  /**
   * Get address from handle
   */
  public getHandleAddress(handle: number): number | null {
    return this.handleTable.get(handle) || null;
  }

  /**
   * Release handle
   */
  public releaseHandle(handle: number): void {
    this.handleTable.delete(handle);
  }

  /**
   * Get all handles
   */
  public getHandles(): Map<number, number> {
    return new Map(this.handleTable);
  }

  /**
   * Clear all handles
   */
  public clearHandles(): void {
    this.handleTable.clear();
    this.handleCounter = 0;
  }

  /**
   * Get statistics
   */
  public getStatistics(): MemoryStatistics {
    return { ...this.statistics };
  }

  /**
   * Get heap statistics
   */
  public getHeapStatistics() {
    return this.heap.getStatistics();
  }

  /**
   * Get stack statistics
   */
  public getStackStatistics() {
    return this.stack.getStatistics();
  }

  /**
   * Enable protection
   */
  public enableProtection(): void {
    this.options.enableProtection = true;
  }

  /**
   * Disable protection
   */
  public disableProtection(): void {
    this.options.enableProtection = false;
  }

  /**
   * Check if protection is enabled
   */
  public isProtectionEnabled(): boolean {
    return this.options.enableProtection!;
  }

  /**
   * Enable tracking
   */
  public enableTracking(): void {
    this.options.enableTracking = true;
  }

  /**
   * Disable tracking
   */
  public disableTracking(): void {
    this.options.enableTracking = false;
  }

  /**
   * Check if tracking is enabled
   */
  public isTrackingEnabled(): boolean {
    return this.options.enableTracking!;
  }

  /**
   * Set max memory
   */
  public setMaxMemory(max: number): void {
    this.options.maxMemory = max;
  }

  /**
   * Get max memory
   */
  public getMaxMemory(): number {
    return this.options.maxMemory!;
  }

  /**
   * Check memory limit
   */
  public checkMemoryLimit(): boolean {
    return this.statistics.currentUsage < this.options.maxMemory!;
  }

  /**
   * Validate memory manager state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.statistics.totalAllocated < 0) {
      errors.push('Invalid total allocated');
    }

    if (this.statistics.totalFreed < 0) {
      errors.push('Invalid total freed');
    }

    if (this.statistics.currentUsage < 0) {
      errors.push('Invalid current usage');
    }

    if (this.statistics.allocationCount < 0) {
      errors.push('Invalid allocation count');
    }

    if (this.statistics.freeCount < 0) {
      errors.push('Invalid free count');
    }

    if (this.statistics.currentUsage > this.options.maxMemory!) {
      errors.push('Memory limit exceeded');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Set execution context
   */
  public setContext(context: ExecutionContext): void {
    this.context = context;
    this.heap = context.getHeap();
    this.stack = context.getStack();
  }

  /**
   * Get execution context
   */
  public getContext(): ExecutionContext {
    return this.context;
  }
}
