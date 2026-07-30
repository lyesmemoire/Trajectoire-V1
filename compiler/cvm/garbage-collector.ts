/**
 * Blueprint DSL CVM Garbage Collector
 * 
 * Manages garbage collection for heap memory.
 */

import { Heap } from '../cbs/heap';
import { ExecutionContext } from './execution-context';

export interface GCStatistics {
  collectedBlocks: number;
  freedBytes: number;
  totalRuns: number;
  lastRunTime: number;
  averageRunTime: number;
}

export interface GCOptions {
  enabled?: boolean;
  threshold?: number;
  algorithm?: GCAlgorithm;
}

export enum GCAlgorithm {
  MARK_SWEEP = 'MARK_SWEEP',
  REFERENCE_COUNTING = 'REFERENCE_COUNTING',
  GENERATIONAL = 'GENERATIONAL',
}

export class GarbageCollector {
  private context: ExecutionContext;
  private heap: Heap;
  private options: GCOptions;
  private statistics: GCStatistics;
  private runTimes: number[] = [];

  constructor(context: ExecutionContext, options: GCOptions = {}) {
    this.context = context;
    this.heap = context.getHeap();
    this.options = {
      enabled: options.enabled !== false,
      threshold: options.threshold || 0.7,
      algorithm: options.algorithm || GCAlgorithm.MARK_SWEEP,
    };
    this.statistics = this.initializeStatistics();
  }

  /**
   * Initialize statistics
   */
  private initializeStatistics(): GCStatistics {
    return {
      collectedBlocks: 0,
      freedBytes: 0,
      totalRuns: 0,
      lastRunTime: 0,
      averageRunTime: 0,
    };
  }

  /**
   * Run garbage collection
   */
  public collect(): GCStatistics {
    if (!this.options.enabled) {
      return this.statistics;
    }

    const startTime = performance.now();

    switch (this.options.algorithm) {
      case GCAlgorithm.MARK_SWEEP:
        this.markSweep();
        break;

      case GCAlgorithm.REFERENCE_COUNTING:
        this.referenceCounting();
        break;

      case GCAlgorithm.GENERATIONAL:
        this.generational();
        break;
    }

    const endTime = performance.now();
    const runTime = endTime - startTime;

    this.statistics.lastRunTime = runTime;
    this.statistics.totalRuns++;
    this.runTimes.push(runTime);

    if (this.runTimes.length > 100) {
      this.runTimes.shift();
    }

    this.statistics.averageRunTime = this.runTimes.reduce((a, b) => a + b, 0) / this.runTimes.length;

    return this.statistics;
  }

  /**
   * Mark and sweep algorithm
   */
  private markSweep(): void {
    const blocks = this.heap.getAllBlocks();
    const marked = new Set<number>();

    // Mark phase
    this.markReachable(marked);

    // Sweep phase
    for (const block of blocks) {
      if (!marked.has(block.id) && block.allocated) {
        this.heap.free(block.address);
        this.statistics.collectedBlocks++;
        this.statistics.freedBytes += block.size;
      }
    }
  }

  /**
   * Mark reachable blocks
   */
  private markReachable(marked: Set<number>): void {
    // Mark blocks referenced from stack
    const stack = this.context.getStack();
    const stackData = stack.getData();

    for (const value of stackData) {
      const block = this.heap.getAllBlocks().find(b => b.address === value);
      if (block) {
        this.markBlock(block.id, marked);
      }
    }

    // Mark blocks referenced from registers
    const registers = this.context.getCallFrames().getAllFrames();
    for (const frame of registers) {
      for (const [name, value] of frame.locals) {
        if (typeof value === 'number') {
          const block = this.heap.getAllBlocks().find(b => b.address === value);
          if (block) {
            this.markBlock(block.id, marked);
          }
        }
      }
    }
  }

  /**
   * Mark block and its children
   */
  private markBlock(blockId: number, marked: Set<number>): void {
    if (marked.has(blockId)) {
      return;
    }

    marked.add(blockId);

    
  }

  /**
   * Reference counting algorithm
   */
  private referenceCounting(): void {
    const blocks = this.heap.getAllBlocks();
    const referenceCounts = new Map<number, number>();

    // Initialize reference counts
    for (const block of blocks) {
      referenceCounts.set(block.id, 0);
    }

    // Count references from stack
    const stack = this.context.getStack();
    const stackData = stack.getData();

    for (const value of stackData) {
      const block = blocks.find(b => b.address === value);
      if (block) {
        referenceCounts.set(block.id, (referenceCounts.get(block.id) || 0) + 1);
      }
    }

    // Count references from registers
    const frames = this.context.getCallFrames().getAllFrames();
    for (const frame of frames) {
      for (const [name, value] of frame.locals) {
        if (typeof value === 'number') {
          const block = blocks.find(b => b.address === value);
          if (block) {
            referenceCounts.set(block.id, (referenceCounts.get(block.id) || 0) + 1);
          }
        }
      }
    }

    // Free blocks with zero references
    for (const [blockId, count] of referenceCounts) {
      if (count === 0) {
        const block = blocks.find(b => b.id === blockId);
        if (block && block.allocated) {
          this.heap.free(block.address);
          this.statistics.collectedBlocks++;
          this.statistics.freedBytes += block.size;
        }
      }
    }
  }

  /**
   * Generational algorithm
   */
  private generational(): void {
    // Simple implementation: run mark-sweep on young generation
    this.markSweep();
  }

  /**
   * Check if GC should run
   */
  public shouldRun(): boolean {
    if (!this.options.enabled) {
      return false;
    }

    const stats = this.heap.getStatistics();
    const utilization = stats.utilization;

    return utilization >= this.options.threshold!;
  }

  /**
   * Get statistics
   */
  public getStatistics(): GCStatistics {
    return { ...this.statistics };
  }

  /**
   * Reset statistics
   */
  public resetStatistics(): void {
    this.statistics = this.initializeStatistics();
    this.runTimes = [];
  }

  /**
   * Enable GC
   */
  public enable(): void {
    this.options.enabled = true;
  }

  /**
   * Disable GC
   */
  public disable(): void {
    this.options.enabled = false;
  }

  /**
   * Check if GC is enabled
   */
  public isEnabled(): boolean {
    return this.options.enabled!;
  }

  /**
   * Set threshold
   */
  public setThreshold(threshold: number): void {
    this.options.threshold = threshold;
  }

  /**
   * Get threshold
   */
  public getThreshold(): number {
    return this.options.threshold!;
  }

  /**
   * Set algorithm
   */
  public setAlgorithm(algorithm: GCAlgorithm): void {
    this.options.algorithm = algorithm;
  }

  /**
   * Get algorithm
   */
  public getAlgorithm(): GCAlgorithm {
    return this.options.algorithm!;
  }

  /**
   * Validate GC state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.options.threshold! < 0 || this.options.threshold! > 1) {
      errors.push('Invalid threshold');
    }

    if (this.statistics.collectedBlocks < 0) {
      errors.push('Invalid collected blocks count');
    }

    if (this.statistics.freedBytes < 0) {
      errors.push('Invalid freed bytes count');
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
  }

  /**
   * Get execution context
   */
  public getContext(): ExecutionContext {
    return this.context;
  }
}
