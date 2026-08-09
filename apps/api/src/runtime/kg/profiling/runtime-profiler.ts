/**
 * Runtime Graph Profiler
 * Measures performance metrics for Runtime Graph operations
 */

import { performance } from 'perf_hooks';
import { StructuredLoggingService } from '../../../observability/structured-logging.service';

export interface ProfilingResult {
  operation: string;
  duration: number;
  memoryBefore: number;
  memoryAfter: number;
  memoryDelta: number;
  allocations: number;
}

export interface ProfilingSummary {
  results: ProfilingResult[];
  totalDuration: number;
  totalMemoryDelta: number;
  averageDuration: number;
  averageMemoryDelta: number;
}

export class RuntimeProfiler {
  private results: ProfilingResult[] = [];
  private logger: StructuredLoggingService;

  constructor(logger?: StructuredLoggingService) {
    this.logger = logger || new StructuredLoggingService();
  }

  /**
   * Profile a function execution
   */
  profile<T>(operation: string, fn: () => T): T {
    const memoryBefore = process.memoryUsage().heapUsed;
    const startTime = performance.now();

    const result = fn();

    const endTime = performance.now();
    const memoryAfter = process.memoryUsage().heapUsed;

    this.results.push({
      operation,
      duration: endTime - startTime,
      memoryBefore,
      memoryAfter,
      memoryDelta: memoryAfter - memoryBefore,
      allocations: 0, // Would need heap profiler for accurate allocation count
    });

    return result;
  }

  /**
   * Profile an async function execution
   */
  async profileAsync<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const memoryBefore = process.memoryUsage().heapUsed;
    const startTime = performance.now();

    const result = await fn();

    const endTime = performance.now();
    const memoryAfter = process.memoryUsage().heapUsed;

    this.results.push({
      operation,
      duration: endTime - startTime,
      memoryBefore,
      memoryAfter,
      memoryDelta: memoryAfter - memoryBefore,
      allocations: 0,
    });

    return result;
  }

  /**
   * Get profiling summary
   */
  getSummary(): ProfilingSummary {
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    const totalMemoryDelta = this.results.reduce(
      (sum, r) => sum + r.memoryDelta,
      0,
    );
    const averageDuration = totalDuration / this.results.length;
    const averageMemoryDelta = totalMemoryDelta / this.results.length;

    return {
      results: this.results,
      totalDuration,
      totalMemoryDelta,
      averageDuration,
      averageMemoryDelta,
    };
  }

  /**
   * Clear profiling results
   */
  clear(): void {
    this.results = [];
  }

  /**
   * Print profiling results
   */
  printResults(): void {
    this.logger.info('=== Profiling Results ===');
    this.results.forEach((result, index) => {
      this.logger.info(`${index + 1}. ${result.operation}`, {
        duration: result.duration.toFixed(2),
        memoryDeltaMB: (result.memoryDelta / 1024 / 1024).toFixed(2),
      });
    });

    const summary = this.getSummary();
    this.logger.info('=== Summary ===', {
      totalDuration: summary.totalDuration.toFixed(2),
      totalMemoryDeltaMB: (summary.totalMemoryDelta / 1024 / 1024).toFixed(2),
      averageDuration: summary.averageDuration.toFixed(2),
      averageMemoryDeltaMB: (summary.averageMemoryDelta / 1024 / 1024).toFixed(
        2,
      ),
    });
  }
}
