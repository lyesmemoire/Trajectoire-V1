/**
 * Performance Monitor Service
 * Tracks performance metrics for SQL, OpenAI, API, Controller, Service, Repository layers
 * Provides request-id, duration, memory, CPU metrics
 */

export interface PerformanceMetric {
  requestId: string;
  layer: "sql" | "openai" | "api" | "controller" | "service" | "repository";
  operation: string;
  duration: number; // in milliseconds
  timestamp: number;
  memory?: number; // in MB
  cpu?: number; // percentage
  metadata?: Record<string, unknown>;
}

export interface PerformanceStats {
  totalRequests: number;
  averageDuration: number;
  maxDuration: number;
  minDuration: number;
  p50Duration: number;
  p95Duration: number;
  p99Duration: number;
  errorRate: number;
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private activeRequests: Map<string, number> = new Map(); // requestId -> startTime

  /**
   * Start tracking a request
   * @param requestId - Unique request identifier
   * @returns Request ID
   */
  startRequest(requestId?: string): string {
    const id = requestId || this.generateRequestId();
    this.activeRequests.set(id, Date.now());
    return id;
  }

  /**
   * End tracking a request
   * @param requestId - Request identifier
   * @param layer - Layer being tracked
   * @param operation - Operation name
   * @param metadata - Additional metadata
   */
  endRequest(
    requestId: string,
    layer: PerformanceMetric["layer"],
    operation: string,
    metadata?: Record<string, unknown>
  ): void {
    const startTime = this.activeRequests.get(requestId);
    if (!startTime) {
      return; // Request not found
    }

    const duration = Date.now() - startTime;
    this.activeRequests.delete(requestId);

    const metric: PerformanceMetric = {
      requestId,
      layer,
      operation,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    // Add memory and CPU if available
    if (typeof process !== "undefined" && process.memoryUsage) {
      metric.memory = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    }

    // Store metric
    const layerMetrics = this.metrics.get(layer) || [];
    layerMetrics.push(metric);
    this.metrics.set(layer, layerMetrics);

    // Keep only last 1000 metrics per layer
    if (layerMetrics.length > 1000) {
      layerMetrics.shift();
    }
  }

  /**
   * Track a metric directly (for external timing)
   */
  trackMetric(metric: PerformanceMetric): void {
    const layerMetrics = this.metrics.get(metric.layer) || [];
    layerMetrics.push(metric);
    this.metrics.set(metric.layer, layerMetrics);

    if (layerMetrics.length > 1000) {
      layerMetrics.shift();
    }
  }

  /**
   * Get statistics for a specific layer
   */
  getStats(layer: PerformanceMetric["layer"]): PerformanceStats {
    const metrics = this.metrics.get(layer) || [];
    
    if (metrics.length === 0) {
      return {
        totalRequests: 0,
        averageDuration: 0,
        maxDuration: 0,
        minDuration: 0,
        p50Duration: 0,
        p95Duration: 0,
        p99Duration: 0,
        errorRate: 0,
      };
    }

    const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
    const total = durations.reduce((sum, d) => sum + d, 0);

    return {
      totalRequests: metrics.length,
      averageDuration: total / metrics.length,
      maxDuration: durations[durations.length - 1],
      minDuration: durations[0],
      p50Duration: durations[Math.floor(durations.length * 0.5)],
      p95Duration: durations[Math.floor(durations.length * 0.95)],
      p99Duration: durations[Math.floor(durations.length * 0.99)],
      errorRate: 0, // Would need error tracking
    };
  }

  /**
   * Get all statistics
   */
  getAllStats(): Record<PerformanceMetric["layer"], PerformanceStats> {
    const layers: PerformanceMetric["layer"][] = [
      "sql",
      "openai",
      "api",
      "controller",
      "service",
      "repository",
    ];

    const stats: Record<string, PerformanceStats> = {};
    for (const layer of layers) {
      stats[layer] = this.getStats(layer);
    }
    return stats as Record<PerformanceMetric["layer"], PerformanceStats>;
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.activeRequests.clear();
  }

  /**
   * Clear metrics for a specific layer
   */
  clearLayerMetrics(layer: PerformanceMetric["layer"]): void {
    this.metrics.delete(layer);
  }

  /**
   * Get recent metrics for a layer
   */
  getRecentMetrics(
    layer: PerformanceMetric["layer"],
    limit: number = 100
  ): PerformanceMetric[] {
    const metrics = this.metrics.get(layer) || [];
    return metrics.slice(-limit);
  }

  /**
   * Generate a unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
let monitorInstance: PerformanceMonitor | null = null;

/**
 * Get the singleton performance monitor instance
 */
export function getPerformanceMonitor(): PerformanceMonitor {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor();
  }
  return monitorInstance;
}

/**
 * Decorator to track method performance
 */
export function trackPerformance(layer: PerformanceMetric["layer"], operation: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const monitor = getPerformanceMonitor();
      const requestId = monitor.startRequest();

      try {
        const result = await originalMethod.apply(this, args);
        monitor.endRequest(requestId, layer, operation);
        return result;
      } catch (error) {
        monitor.endRequest(requestId, layer, operation, { error: true });
        throw error;
      }
    };

    return descriptor;
  };
}
