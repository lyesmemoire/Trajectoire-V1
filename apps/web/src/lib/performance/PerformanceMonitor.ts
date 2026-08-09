/**
 * Performance Monitor - SPRINT-4.5
 * 
 * Real-time performance monitoring and optimization
 * Measures: CPU, RAM, Latency, Cold Start, P95, P99
 */

export interface PerformanceMetrics {
  cpu: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  latency: {
    p50: number;
    p95: number;
    p99: number;
    avg: number;
  };
  coldStart: number;
  timestamp: number;
}

export interface OperationMetrics {
  operation: string;
  duration: number;
  cpu: number;
  memory: number;
  success: boolean;
  timestamp: number;
}

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private operationMetrics: OperationMetrics[] = [];
  private startTime: number = Date.now();
  private coldStartTime: number = Date.now();

  // Get CPU usage (Node.js)
  getCpuUsage(): number {
    const cpus = require('os').cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu: any) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    return ((totalTick - totalIdle) / totalTick) * 100;
  }

  // Get memory usage
  getMemoryUsage() {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const total = process.memoryUsage().heapTotal / 1024 / 1024;
    return {
      used,
      total,
      percentage: (used / total) * 100,
    };
  }

  // Record operation duration
  recordOperation(operation: string, duration: number, success: boolean = true) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(duration);

    this.operationMetrics.push({
      operation,
      duration,
      cpu: this.getCpuUsage(),
      memory: this.getMemoryUsage().used,
      success,
      timestamp: Date.now(),
    });

    // Keep only last 1000 measurements
    if (this.metrics.get(operation)!.length > 1000) {
      this.metrics.get(operation)!.shift();
    }
  }

  // Calculate percentiles
  getPercentile(operation: string, percentile: number): number {
    const durations = this.metrics.get(operation);
    if (!durations || durations.length === 0) return 0;

    const sorted = [...durations].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  // Get current performance metrics
  getCurrentMetrics(): PerformanceMetrics {
    const allDurations = Array.from(this.metrics.values()).flat();
    const sorted = allDurations.sort((a, b) => a - b);

    return {
      cpu: this.getCpuUsage(),
      memory: this.getMemoryUsage(),
      latency: {
        p50: sorted[Math.floor(sorted.length * 0.5)] || 0,
        p95: sorted[Math.floor(sorted.length * 0.95)] || 0,
        p99: sorted[Math.floor(sorted.length * 0.99)] || 0,
        avg: sorted.length > 0 ? sorted.reduce((a, b) => a + b, 0) / sorted.length : 0,
      },
      coldStart: this.coldStartTime,
      timestamp: Date.now(),
    };
  }

  // Check if P95 meets target
  isP95UnderTarget(targetMs: number = 300): boolean {
    const metrics = this.getCurrentMetrics();
    return metrics.latency.p95 < targetMs;
  }

  // Get slow operations
  getSlowOperations(thresholdMs: number = 300): string[] {
    const slowOps: string[] = [];
    this.metrics.forEach((durations, operation) => {
      const p95 = this.getPercentile(operation, 95);
      if (p95 > thresholdMs) {
        slowOps.push(operation);
      }
    });
    return slowOps;
  }

  // Reset metrics
  reset() {
    this.metrics.clear();
    this.operationMetrics = [];
    this.startTime = Date.now();
  }

  // Mark cold start complete
  markColdStartComplete() {
    this.coldStartTime = Date.now() - this.startTime;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Performance decorator for automatic measurement
export function measurePerformance(operation: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;
        performanceMonitor.recordOperation(operation, duration, true);
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        performanceMonitor.recordOperation(operation, duration, false);
        throw error;
      }
    };

    return descriptor;
  };
}