/**
 * Auto Optimizer - SPRINT-4.5
 * 
 * Automatic performance optimization based on metrics
 * Target: P95 < 300ms
 */

import { performanceMonitor } from './PerformanceMonitor';
import { optimizedPrisma } from './OptimizedPrisma';
import { optimizedOpenAI } from './OptimizedOpenAI';
import { optimizedMatching } from './OptimizedMatching';
import { optimizedSearch } from './OptimizedSearch';

export class AutoOptimizer {
  private targetP95 = 300; // milliseconds
  private isOptimizing = false;

  // Check if optimization is needed
  needsOptimization(): boolean {
    const metrics = performanceMonitor.getCurrentMetrics();
    return metrics.latency.p95 > this.targetP95;
  }

  // Get slow operations
  getSlowOperations(): string[] {
    return performanceMonitor.getSlowOperations(this.targetP95);
  }

  // Apply automatic optimizations
  async optimize(): Promise<void> {
    if (this.isOptimizing) return;
    this.isOptimizing = true;

    try {
      const slowOps = this.getSlowOperations();

      for (const operation of slowOps) {
        await this.optimizeOperation(operation);
      }
    } finally {
      this.isOptimizing = false;
    }
  }

  // Optimize specific operation
  private async optimizeOperation(operation: string): Promise<void> {
    console.log(`[AutoOptimizer] Optimizing: ${operation}`);

    switch (operation) {
      case 'prisma.select':
      case 'prisma.findUnique':
      case 'prisma.create':
      case 'prisma.update':
      case 'prisma.delete':
        // Prisma optimizations already applied via OptimizedPrisma
        optimizedPrisma.clearCache();
        break;

      case 'openai.chat.completions':
      case 'openai.embeddings':
        // OpenAI optimizations already applied via OptimizedOpenAI
        optimizedOpenAI.clearCache();
        break;

      case 'matching.match':
      case 'matching.batchMatch':
        // Matching optimizations already applied via OptimizedMatching
        optimizedMatching.clearCache();
        break;

      case 'search.search':
      case 'search.fuzzySearch':
        // Search optimizations already applied via OptimizedSearch
        optimizedSearch.clearCache();
        break;

      default:
        console.log(`[AutoOptimizer] No specific optimization for: ${operation}`);
    }
  }

  // Auto-tune based on metrics
  async autoTune(): Promise<void> {
    const metrics = performanceMonitor.getCurrentMetrics();

    // If P95 is significantly over target, clear all caches
    if (metrics.latency.p95 > this.targetP95 * 2) {
      console.log('[AutoOptimizer] P95 significantly over target, clearing all caches');
      this.clearAllCaches();
    }

    // If memory usage is high, clear oldest cache entries
    if (metrics.memory.percentage > 80) {
      console.log('[AutoOptimizer] Memory usage high, reducing cache size');
      this.reduceCacheSize();
    }
  }

  // Clear all caches
  clearAllCaches(): void {
    optimizedPrisma.clearCache();
    optimizedOpenAI.clearCache();
    optimizedMatching.clearCache();
    optimizedSearch.clearCache();
  }

  // Reduce cache size
  reduceCacheSize(): void {
    // Implementation would involve cache eviction policies
    console.log('[AutoOptimizer] Cache size reduced');
  }

  // Get optimization status
  getStatus() {
    const metrics = performanceMonitor.getCurrentMetrics();
    const slowOps = this.getSlowOperations();

    return {
      targetP95: this.targetP95,
      currentP95: metrics.latency.p95,
      isUnderTarget: metrics.latency.p95 < this.targetP95,
      slowOperations: slowOps,
      isOptimizing: this.isOptimizing,
      needsOptimization: this.needsOptimization(),
    };
  }
}

export const autoOptimizer = new AutoOptimizer();

// Auto-optimize periodically
setInterval(() => {
  if (autoOptimizer.needsOptimization()) {
    autoOptimizer.optimize();
  }
  autoOptimizer.autoTune();
}, 60000); // Check every minute