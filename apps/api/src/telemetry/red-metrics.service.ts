import { Injectable } from '@nestjs/common';
import { MeterProvider, Meter, Counter, Histogram } from '@opentelemetry/api';

@Injectable()
export class RedMetricsService {
  private meter: Meter | null = null;
  private requestCounters: Map<string, Counter> = new Map();
  private errorCounters: Map<string, Counter> = new Map();
  private durationHistograms: Map<string, Histogram> = new Map();

  constructor() {
    // This will be initialized with the OpenTelemetry meter
    // For now, we'll create placeholder methods
  }

  setMeterProvider(meterProvider: MeterProvider) {
    this.meter = meterProvider.getMeter('red-metrics');
    this.initializeMetrics();
  }

  private initializeMetrics() {
    if (!this.meter) return;
    // Initialize common metrics
    this.createRequestCounter('http_requests_total', 'Total HTTP requests');
    this.createErrorCounter('http_errors_total', 'Total HTTP errors');
    this.createDurationHistogram('http_request_duration_ms', 'HTTP request duration in milliseconds');
  }

  createRequestCounter(name: string, description: string) {
    if (!this.meter) return;
    const counter = this.meter.createCounter(name, { description });
    this.requestCounters.set(name, counter);
  }

  createErrorCounter(name: string, description: string) {
    if (!this.meter) return;
    const counter = this.meter.createCounter(name, { description });
    this.errorCounters.set(name, counter);
  }

  createDurationHistogram(name: string, description: string) {
    if (!this.meter) return;
    const histogram = this.meter.createHistogram(name, {
      description,
      unit: 'ms',
    });
    this.durationHistograms.set(name, histogram);
  }

  incrementRequestCounter(name: string, attributes: Record<string, string> = {}) {
    const counter = this.requestCounters.get(name);
    if (counter) {
      counter.add(1, attributes);
    }
  }

  incrementErrorCounter(name: string, attributes: Record<string, string> = {}) {
    const counter = this.errorCounters.get(name);
    if (counter) {
      counter.add(1, attributes);
    }
  }

  recordDuration(name: string, duration: number, attributes: Record<string, string> = {}) {
    const histogram = this.durationHistograms.get(name);
    if (histogram) {
      histogram.record(duration, attributes);
    }
  }

  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    const attributes = {
      method,
      route,
      status_code: statusCode.toString(),
    };

    this.incrementRequestCounter('http_requests_total', attributes);

    if (statusCode >= 400) {
      this.incrementErrorCounter('http_errors_total', attributes);
    }

    this.recordDuration('http_request_duration_ms', duration, attributes);
  }

  recordGraphqlRequest(operation: string, operationName: string, statusCode: number, duration: number) {
    const attributes = {
      operation,
      operation_name: operationName,
      status_code: statusCode.toString(),
    };

    this.incrementRequestCounter('graphql_requests_total', attributes);

    if (statusCode >= 400) {
      this.incrementErrorCounter('graphql_errors_total', attributes);
    }

    this.recordDuration('graphql_request_duration_ms', duration, attributes);
  }

  recordDatabaseQuery(operation: string, table: string, duration: number, error?: boolean) {
    const attributes = {
      operation,
      table,
      error: error?.toString() || 'false',
    };

    this.incrementRequestCounter('db_queries_total', attributes);

    if (error) {
      this.incrementErrorCounter('db_errors_total', attributes);
    }

    this.recordDuration('db_query_duration_ms', duration, attributes);
  }

  recordCacheOperation(operation: string, key: string, hit: boolean, duration: number) {
    const attributes = {
      operation,
      key: key.substring(0, 50), // Truncate long keys
      hit: hit.toString(),
    };

    this.incrementRequestCounter('cache_operations_total', attributes);
    this.recordDuration('cache_operation_duration_ms', duration, attributes);
  }

  recordExternalServiceCall(service: string, endpoint: string, statusCode: number, duration: number) {
    const attributes = {
      service,
      endpoint,
      status_code: statusCode.toString(),
    };

    this.incrementRequestCounter('external_service_calls_total', attributes);

    if (statusCode >= 400) {
      this.incrementErrorCounter('external_service_errors_total', attributes);
    }

    this.recordDuration('external_service_duration_ms', duration, attributes);
  }
}
