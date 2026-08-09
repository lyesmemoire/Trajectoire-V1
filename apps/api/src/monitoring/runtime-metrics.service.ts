/**
 * Runtime Metrics Service
 * Collects and provides runtime metrics for the application
 */

import { Injectable } from '@nestjs/common';
import { MetricsService } from '../observability/metrics.service';
import * as os from 'os';

export interface RuntimeMetrics {
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  uptime: number;
  errors: {
    total: number;
    byType: Record<string, number>;
  };
  latency: {
    p50: number;
    p95: number;
    p99: number;
    avg: number;
  };
}

export interface OperationMetrics {
  matching: {
    time: number;
    count: number;
    errors: number;
  };
  search: {
    time: number;
    count: number;
    errors: number;
  };
  graph: {
    time: number;
    count: number;
    errors: number;
  };
  reasoning: {
    time: number;
    count: number;
    errors: number;
  };
}

@Injectable()
export class RuntimeMetricsService {
  private operationTimes: Map<string, number[]> = new Map();
  private operationCounts: Map<string, number> = new Map();
  private operationErrors: Map<string, number> = new Map();
  private errorCounts: Map<string, number> = new Map();
  private startTime: number = Date.now();

  constructor(private readonly metricsService: MetricsService) {
    this.initializeMetrics();
  }

  private initializeMetrics(): void {
    this.operationTimes.set('matching', []);
    this.operationTimes.set('search', []);
    this.operationTimes.set('graph', []);
    this.operationTimes.set('reasoning', []);

    this.operationCounts.set('matching', 0);
    this.operationCounts.set('search', 0);
    this.operationCounts.set('graph', 0);
    this.operationCounts.set('reasoning', 0);

    this.operationErrors.set('matching', 0);
    this.operationErrors.set('search', 0);
    this.operationErrors.set('graph', 0);
    this.operationErrors.set('reasoning', 0);
  }

  /**
   * Get CPU metrics
   */
  getCPUMetrics(): { usage: number; loadAverage: number[] } {
    const cpus = os.cpus();
    const loadAverage = os.loadavg();

    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        const value = (cpu.times as any)[type];
        if (typeof value === 'number') {
          totalTick += value;
        }
      }
      const idleValue = cpu.times.idle;
      if (typeof idleValue === 'number') {
        totalIdle += idleValue;
      }
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = total > 0 ? 1 - idle / total : 0;

    return {
      usage: Math.round(usage * 100) / 100,
      loadAverage,
    };
  }

  /**
   * Get memory metrics
   */
  getMemoryMetrics(): {
    total: number;
    used: number;
    free: number;
    usage: number;
  } {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const usage = used / total;

    return {
      total,
      used,
      free,
      usage: Math.round(usage * 100) / 100,
    };
  }

  /**
   * Get uptime
   */
  getUptime(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Record operation time
   */
  recordOperationTime(operation: string, time: number): void {
    const times = this.operationTimes.get(operation) || [];
    times.push(time);

    // Keep only last 1000 measurements
    if (times.length > 1000) {
      times.shift();
    }

    this.operationTimes.set(operation, times);
  }

  /**
   * Increment operation count
   */
  incrementOperationCount(operation: string): void {
    const count = this.operationCounts.get(operation) || 0;
    this.operationCounts.set(operation, count + 1);
  }

  /**
   * Increment operation error count
   */
  incrementOperationError(operation: string): void {
    const count = this.operationErrors.get(operation) || 0;
    this.operationErrors.set(operation, count + 1);
  }

  /**
   * Record error
   */
  recordError(errorType: string): void {
    const count = this.errorCounts.get(errorType) || 0;
    this.errorCounts.set(errorType, count + 1);
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  /**
   * Calculate average
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  /**
   * Get latency metrics for an operation
   */
  getLatencyMetrics(operation: string): {
    p50: number;
    p95: number;
    p99: number;
    avg: number;
  } {
    const times = this.operationTimes.get(operation) || [];

    return {
      p50: this.calculatePercentile(times, 50),
      p95: this.calculatePercentile(times, 95),
      p99: this.calculatePercentile(times, 99),
      avg: this.calculateAverage(times),
    };
  }

  /**
   * Get operation metrics
   */
  getOperationMetrics(operation: string): {
    time: number;
    count: number;
    errors: number;
  } {
    const times = this.operationTimes.get(operation) || [];
    const count = this.operationCounts.get(operation) || 0;
    const errors = this.operationErrors.get(operation) || 0;
    const avgTime = this.calculateAverage(times);

    return {
      time: avgTime,
      count,
      errors,
    };
  }

  /**
   * Get all runtime metrics
   */
  getRuntimeMetrics(): RuntimeMetrics {
    const cpu = this.getCPUMetrics();
    const memory = this.getMemoryMetrics();
    const uptime = this.getUptime();

    const totalErrors = Array.from(this.errorCounts.values()).reduce(
      (acc, val) => acc + val,
      0,
    );
    const byType = Object.fromEntries(this.errorCounts);

    // Calculate overall latency metrics
    const allTimes = Array.from(this.operationTimes.values()).flat();
    const latency = {
      p50: this.calculatePercentile(allTimes, 50),
      p95: this.calculatePercentile(allTimes, 95),
      p99: this.calculatePercentile(allTimes, 99),
      avg: this.calculateAverage(allTimes),
    };

    return {
      cpu,
      memory,
      uptime,
      errors: {
        total: totalErrors,
        byType,
      },
      latency,
    };
  }

  /**
   * Get all operation metrics
   */
  getAllOperationMetrics(): OperationMetrics {
    return {
      matching: this.getOperationMetrics('matching'),
      search: this.getOperationMetrics('search'),
      graph: this.getOperationMetrics('graph'),
      reasoning: this.getOperationMetrics('reasoning'),
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.operationTimes.clear();
    this.operationCounts.clear();
    this.operationErrors.clear();
    this.errorCounts.clear();
    this.startTime = Date.now();
    this.initializeMetrics();
  }
}
