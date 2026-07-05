/**
 * Performance Tracker
 * Measures and tracks performance metrics for API calls, database queries, and AI calls
 */

import { LoggerProvider } from "../logger";

const logger = LoggerProvider.getLogger();

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class PerformanceTracker {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private activeTimers: Map<string, number> = new Map();

  /**
   * Start tracking a performance metric
   */
  start(name: string): string {
    const timerId = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.activeTimers.set(timerId, Date.now());
    return timerId;
  }

  /**
   * Stop tracking a performance metric
   */
  stop(timerId: string, name: string, metadata?: Record<string, any>): number {
    const startTime = this.activeTimers.get(timerId);
    if (!startTime) {
      logger.warn("Performance timer not found", { timerId });
      return 0;
    }

    const duration = Date.now() - startTime;
    this.activeTimers.delete(timerId);

    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: new Date(),
      metadata,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(metric);

    logger.debug("Performance metric recorded", { name, duration, metadata });
    return duration;
  }

  /**
   * Record a performance metric directly
   */
  record(name: string, duration: number, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: new Date(),
      metadata,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(metric);

    logger.debug("Performance metric recorded", { name, duration, metadata });
  }

  /**
   * Get statistics for a specific metric
   */
  getStats(name: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
    p50: number;
    p95: number;
    p99: number;
  } | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) {
      return null;
    }

    const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
    const count = durations.length;
    const sum = durations.reduce((a, b) => a + b, 0);
    const avg = sum / count;
    const min = durations[0] || 0;
    const max = durations[count - 1] || 0;
    const p50 = durations[Math.floor(count * 0.5)] || 0;
    const p95 = durations[Math.floor(count * 0.95)] || 0;
    const p99 = durations[Math.floor(count * 0.99)] || 0;

    return { count, avg, min, max, p50, p95, p99 };
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Map<string, PerformanceMetric[]> {
    return this.metrics;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.activeTimers.clear();
  }

  /**
   * Clear metrics for a specific name
   */
  clearName(name: string): void {
    this.metrics.delete(name);
  }
}

// Singleton instance
let performanceTracker: PerformanceTracker | null = null;

export function getPerformanceTracker(): PerformanceTracker {
  if (!performanceTracker) {
    performanceTracker = new PerformanceTracker();
  }
  return performanceTracker;
}

/**
 * Decorator to track function performance
 */
export function trackPerformance(name: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const tracker = getPerformanceTracker();

    descriptor.value = async function (...args: any[]) {
      const timerId = tracker.start(name);
      try {
        const result = await originalMethod.apply(this, args);
        tracker.stop(timerId, name);
        return result;
      } catch (error) {
        tracker.stop(timerId, name, { error: "failed" });
        throw error;
      }
    };

    return descriptor;
  };
}
