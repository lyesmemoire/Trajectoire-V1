/**
 * Metrics Collector
 * Collects and aggregates AI operation metrics
 */

export interface MetricData {
  timestamp: number;
  model: string;
  endpoint: string;
  latency: number;
  tokens: number;
  cost: number;
  success: boolean;
}

export interface AggregatedMetrics {
  totalCalls: number;
  successRate: number;
  averageLatency: number;
  averageCost: number;
  averageTokens: number;
  totalCost: number;
  errorCount: number;
  callsByModel: Record<string, number>;
  callsByEndpoint: Record<string, number>;
}

export class MetricsCollector {
  private static metrics: MetricData[] = [];
  private static maxMetrics = 10000;

  /**
   * Collect a metric
   * @param data - Metric data
   */
  public static collect(data: MetricData): void {
    this.metrics.push(data);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Get aggregated metrics
   * @returns Aggregated metrics
   */
  public static getAggregatedMetrics(): AggregatedMetrics {
    if (this.metrics.length === 0) {
      return {
        totalCalls: 0,
        successRate: 0,
        averageLatency: 0,
        averageCost: 0,
        averageTokens: 0,
        totalCost: 0,
        errorCount: 0,
        callsByModel: {},
        callsByEndpoint: {},
      };
    }

    const successMetrics = this.metrics.filter((m) => m.success);
    const totalLatency = this.metrics.reduce((sum, m) => sum + m.latency, 0);
    const totalCost = this.metrics.reduce((sum, m) => sum + m.cost, 0);
    const totalTokens = this.metrics.reduce((sum, m) => sum + m.tokens, 0);

    const callsByModel: Record<string, number> = {};
    const callsByEndpoint: Record<string, number> = {};

    for (const metric of this.metrics) {
      callsByModel[metric.model] = (callsByModel[metric.model] || 0) + 1;
      callsByEndpoint[metric.endpoint] = (callsByEndpoint[metric.endpoint] || 0) + 1;
    }

    return {
      totalCalls: this.metrics.length,
      successRate: (successMetrics.length / this.metrics.length) * 100,
      averageLatency: totalLatency / this.metrics.length,
      averageCost: totalCost / this.metrics.length,
      averageTokens: totalTokens / this.metrics.length,
      totalCost,
      errorCount: this.metrics.length - successMetrics.length,
      callsByModel,
      callsByEndpoint,
    };
  }

  /**
   * Get metrics by model
   * @param model - Model name
   * @returns Metrics for the model
   */
  public static getMetricsByModel(model: string): MetricData[] {
    return this.metrics.filter((m) => m.model === model);
  }

  /**
   * Get metrics by endpoint
   * @param endpoint - Endpoint name
   * @returns Metrics for the endpoint
   */
  public static getMetricsByEndpoint(endpoint: string): MetricData[] {
    return this.metrics.filter((m) => m.endpoint === endpoint);
  }

  /**
   * Get metrics for a time range
   * @param startTime - Start timestamp
   * @param endTime - End timestamp
   * @returns Metrics in the time range
   */
  public static getMetricsByTimeRange(startTime: number, endTime: number): MetricData[] {
    return this.metrics.filter((m) => m.timestamp >= startTime && m.timestamp <= endTime);
  }

  /**
   * Get error metrics
   * @returns Error metrics
   */
  public static getErrorMetrics(): MetricData[] {
    return this.metrics.filter((m) => !m.success);
  }

  /**
   * Clear all metrics
   */
  public static clear(): void {
    this.metrics = [];
  }

  /**
   * Get percentile latency
   * @param percentile - Percentile (0-100)
   * @returns Percentile latency
   */
  public static getPercentileLatency(percentile: number): number {
    if (this.metrics.length === 0) {
      return 0;
    }

    const sortedLatencies = this.metrics
      .map((m) => m.latency)
      .sort((a, b) => a - b);

    const index = Math.floor((percentile / 100) * sortedLatencies.length);
    return sortedLatencies[index];
  }
}
