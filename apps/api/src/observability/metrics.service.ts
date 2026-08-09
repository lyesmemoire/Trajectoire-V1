/**
 * Metrics Service
 * Provides custom metrics collection for the application
 */

import { Injectable } from '@nestjs/common';
import {
  metrics,
  ObservableGauge,
  Counter,
  Histogram,
  UpDownCounter,
} from '@opentelemetry/api';

export interface MetricOptions {
  name: string;
  description: string;
  unit?: string;
}

export interface CounterOptions extends MetricOptions {
  increment?: number;
}

export interface HistogramOptions extends MetricOptions {
  value: number;
  attributes?: Record<string, string | number | boolean>;
}

export interface GaugeOptions extends MetricOptions {
  value: number;
}

@Injectable()
export class MetricsService {
  private readonly meter = metrics.getMeter('trajectoire-api', '1.0.0');
  private counters: Map<string, Counter> = new Map();
  private histograms: Map<string, Histogram> = new Map();
  private gauges: Map<string, ObservableGauge> = new Map();
  private upDownCounters: Map<string, UpDownCounter> = new Map();

  /**
   * Create or get a counter
   */
  getOrCreateCounter(options: MetricOptions): Counter {
    if (!this.counters.has(options.name)) {
      const counter = this.meter.createCounter(options.name, {
        description: options.description,
        ...(options.unit && { unit: options.unit }),
      });
      this.counters.set(options.name, counter);
    }
    return this.counters.get(options.name)!;
  }

  /**
   * Increment a counter
   */
  incrementCounter(options: CounterOptions): void {
    const counter = this.getOrCreateCounter(options);
    counter.add(options.increment || 1);
  }

  /**
   * Decrement a counter (using up-down counter)
   */
  decrementCounter(options: CounterOptions): void {
    const upDownCounter = this.getOrCreateUpDownCounter(options);
    upDownCounter.add(-(options.increment || 1));
  }

  /**
   * Create or get a histogram
   */
  getOrCreateHistogram(options: MetricOptions): Histogram {
    if (!this.histograms.has(options.name)) {
      const histogram = this.meter.createHistogram(options.name, {
        description: options.description,
        ...(options.unit && { unit: options.unit }),
      });
      this.histograms.set(options.name, histogram);
    }
    return this.histograms.get(options.name)!;
  }

  /**
   * Record a histogram value
   */
  recordHistogram(options: HistogramOptions): void {
    const histogram = this.getOrCreateHistogram(options);
    histogram.record(options.value, options.attributes);
  }

  /**
   * Create or get an up-down counter
   */
  getOrCreateUpDownCounter(options: MetricOptions): UpDownCounter {
    if (!this.upDownCounters.has(options.name)) {
      const upDownCounter = this.meter.createUpDownCounter(options.name, {
        description: options.description,
        ...(options.unit && { unit: options.unit }),
      });
      this.upDownCounters.set(options.name, upDownCounter);
    }
    return this.upDownCounters.get(options.name)!;
  }

  /**
   * Increment an up-down counter
   */
  incrementUpDownCounter(options: CounterOptions): void {
    const upDownCounter = this.getOrCreateUpDownCounter(options);
    upDownCounter.add(options.increment || 1);
  }

  /**
   * Decrement an up-down counter
   */
  decrementUpDownCounter(options: CounterOptions): void {
    const upDownCounter = this.getOrCreateUpDownCounter(options);
    upDownCounter.add(-(options.increment || 1));
  }

  /**
   * Track HTTP request count
   */
  trackHttpRequest(method: string, path: string, statusCode: number): void {
    this.incrementCounter({
      name: 'http.requests.total',
      description: 'Total number of HTTP requests',
      increment: 1,
    });

    this.incrementCounter({
      name: 'http.requests.by_method',
      description: 'HTTP requests by method',
      increment: 1,
    });

    this.incrementCounter({
      name: 'http.requests.by_status',
      description: 'HTTP requests by status code',
      increment: 1,
    });
  }

  /**
   * Track HTTP request duration
   */
  trackHttpRequestDuration(
    method: string,
    path: string,
    duration: number,
  ): void {
    this.recordHistogram({
      name: 'http.request.duration',
      description: 'HTTP request duration in milliseconds',
      unit: 'ms',
      value: duration,
      attributes: {
        'http.method': method,
        'http.path': path,
      },
    });
  }

  /**
   * Track graph operation count
   */
  trackGraphOperation(operation: string, graphId: string): void {
    this.incrementCounter({
      name: 'graph.operations.total',
      description: 'Total number of graph operations',
      increment: 1,
    });

    this.incrementCounter({
      name: 'graph.operations.by_type',
      description: 'Graph operations by type',
      increment: 1,
    });
  }

  /**
   * Track graph operation duration
   */
  trackGraphOperationDuration(
    operation: string,
    graphId: string,
    duration: number,
  ): void {
    this.recordHistogram({
      name: 'graph.operation.duration',
      description: 'Graph operation duration in milliseconds',
      unit: 'ms',
      value: duration,
      attributes: {
        'graph.operation': operation,
        'graph.id': graphId,
      },
    });
  }

  /**
   * Track matching operation count
   */
  trackMatchingOperation(candidateId: string, jobId: string): void {
    this.incrementCounter({
      name: 'matching.operations.total',
      description: 'Total number of matching operations',
      increment: 1,
    });
  }

  /**
   * Track matching operation duration
   */
  trackMatchingOperationDuration(
    candidateId: string,
    jobId: string,
    duration: number,
  ): void {
    this.recordHistogram({
      name: 'matching.operation.duration',
      description: 'Matching operation duration in milliseconds',
      unit: 'ms',
      value: duration,
      attributes: {
        'candidate.id': candidateId,
        'job.id': jobId,
      },
    });
  }

  /**
   * Track search operation count
   */
  trackSearchOperation(query: string): void {
    this.incrementCounter({
      name: 'search.operations.total',
      description: 'Total number of search operations',
      increment: 1,
    });
  }

  /**
   * Track search operation duration
   */
  trackSearchOperationDuration(query: string, duration: number): void {
    this.recordHistogram({
      name: 'search.operation.duration',
      description: 'Search operation duration in milliseconds',
      unit: 'ms',
      value: duration,
      attributes: {
        'search.query': query,
      },
    });
  }

  /**
   * Track copilot operation count
   */
  trackCopilotOperation(sessionId: string, operation: string): void {
    this.incrementCounter({
      name: 'copilot.operations.total',
      description: 'Total number of copilot operations',
      increment: 1,
    });

    this.incrementCounter({
      name: 'copilot.operations.by_type',
      description: 'Copilot operations by type',
      increment: 1,
    });
  }

  /**
   * Track copilot operation duration
   */
  trackCopilotOperationDuration(
    sessionId: string,
    operation: string,
    duration: number,
  ): void {
    this.recordHistogram({
      name: 'copilot.operation.duration',
      description: 'Copilot operation duration in milliseconds',
      unit: 'ms',
      value: duration,
      attributes: {
        'session.id': sessionId,
        'copilot.operation': operation,
      },
    });
  }

  /**
   * Track dashboard operation count
   */
  trackDashboardOperation(userId: string, operation: string): void {
    this.incrementCounter({
      name: 'dashboard.operations.total',
      description: 'Total number of dashboard operations',
      increment: 1,
    });

    this.incrementCounter({
      name: 'dashboard.operations.by_type',
      description: 'Dashboard operations by type',
      increment: 1,
    });
  }

  /**
   * Track dashboard operation duration
   */
  trackDashboardOperationDuration(
    userId: string,
    operation: string,
    duration: number,
  ): void {
    this.recordHistogram({
      name: 'dashboard.operation.duration',
      description: 'Dashboard operation duration in milliseconds',
      unit: 'ms',
      value: duration,
      attributes: {
        'user.id': userId,
        'dashboard.operation': operation,
      },
    });
  }

  /**
   * Track error count
   */
  trackError(errorType: string, errorMessage: string): void {
    this.incrementCounter({
      name: 'errors.total',
      description: 'Total number of errors',
      increment: 1,
    });

    this.incrementCounter({
      name: 'errors.by_type',
      description: 'Errors by type',
      increment: 1,
    });
  }

  /**
   * Track active graph executions
   */
  trackActiveGraphExecutions(count: number): void {
    this.incrementUpDownCounter({
      name: 'graph.executions.active',
      description: 'Number of active graph executions',
      increment: count,
    });
  }

  /**
   * Track active matching operations
   */
  trackActiveMatchingOperations(count: number): void {
    this.incrementUpDownCounter({
      name: 'matching.operations.active',
      description: 'Number of active matching operations',
      increment: count,
    });
  }

  /**
   * Track active search operations
   */
  trackActiveSearchOperations(count: number): void {
    this.incrementUpDownCounter({
      name: 'search.operations.active',
      description: 'Number of active search operations',
      increment: count,
    });
  }

  /**
   * Track active copilot sessions
   */
  trackActiveCopilotSessions(count: number): void {
    this.incrementUpDownCounter({
      name: 'copilot.sessions.active',
      description: 'Number of active copilot sessions',
      increment: count,
    });
  }
}
