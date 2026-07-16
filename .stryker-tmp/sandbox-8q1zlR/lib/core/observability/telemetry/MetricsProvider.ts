// @ts-nocheck
export interface MetricsTags {
  [key: string]: string;
}

export interface MetricsProvider {
  /**
   * Increment a counter metric.
   * Used for counting events like API calls, errors, etc.
   */
  increment(name: string, value?: number, tags?: MetricsTags): void;

  /**
   * Set a gauge metric.
   * Used for current values like active connections, queue size, etc.
   */
  gauge(name: string, value: number, tags?: MetricsTags): void;

  /**
   * Record a histogram metric.
   * Used for distributions like request duration, response size, etc.
   */
  histogram(name: string, value: number, tags?: MetricsTags): void;

  /**
   * Record a timing metric (convenience for histogram).
   * Used for measuring execution time.
   */
  timing(name: string, durationMs: number, tags?: MetricsTags): void;
}
