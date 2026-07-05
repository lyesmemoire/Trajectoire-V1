import { MetricsProvider, MetricsTags } from "./MetricsProvider";

/**
 * No-op metrics provider for development and testing.
 * Does nothing - useful when metrics collection is not needed.
 */
export class NoopMetricsProvider implements MetricsProvider {
  increment(name: string, value: number = 1, tags?: MetricsTags): void {
    // No-op
  }

  gauge(name: string, value: number, tags?: MetricsTags): void {
    // No-op
  }

  histogram(name: string, value: number, tags?: MetricsTags): void {
    // No-op
  }

  timing(name: string, durationMs: number, tags?: MetricsTags): void {
    // No-op
  }
}
