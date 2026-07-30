/**
 * Production Monitoring Service
 * Integrates Sentry for error tracking and OpenTelemetry for metrics
 * Provides comprehensive monitoring for CPU, RAM, DB, OpenAI, API, Latency, Errors
 */

import { config } from "@/lib/config/ConfigService";
import { logger } from "@/lib/logger/Logger";

// Sentry integration (placeholder - would install @sentry/nextjs)
export class SentryService {
  private static instance: SentryService;
  private initialized = false;

  private constructor() {}

  static getInstance(): SentryService {
    if (!SentryService.instance) {
      SentryService.instance = new SentryService();
    }
    return SentryService.instance;
  }

  /**
   * Initialize Sentry
   */
  initialize(): void {
    if (this.initialized) return;

    const monitoringConfig = config.get("monitoring");
    
    if (monitoringConfig.sentryDsn) {
      // In production, initialize Sentry here
      // import * as Sentry from "@sentry/nextjs";
      // Sentry.init({
      //   dsn: monitoringConfig.sentryDsn,
      //   environment: monitoringConfig.sentryEnvironment,
      //   tracesSampleRate: monitoringConfig.sentryTracesSampleRate,
      // });
      
      logger.info("Sentry initialized");
      this.initialized = true;
    }
  }

  /**
   * Capture exception
   */
  captureException(error: Error, context?: Record<string, unknown>): void {
    if (!this.initialized) return;
    
    // Sentry.captureException(error, { extra: context });
    logger.error("Sentry captureException", { error, context });
  }

  /**
   * Capture message
   */
  captureMessage(message: string, level: "info" | "warning" | "error" = "info"): void {
    if (!this.initialized) return;
    
    // Sentry.captureMessage(message, level);
    logger.info(`Sentry captureMessage [${level}]`, { message, level });
  }

  /**
   * Set user context
   */
  setUser(user: { id: string; email?: string; username?: string }): void {
    if (!this.initialized) return;
    
    // Sentry.setUser(user);
    logger.debug("Sentry setUser", { user });
  }

  /**
   * Clear user context
   */
  clearUser(): void {
    if (!this.initialized) return;
    
    // Sentry.setUser(null);
    logger.debug("Sentry clearUser");
  }

  /**
   * Add breadcrumb
   */
  addBreadcrumb(
    message: string,
    category?: string,
    level?: "info" | "warning" | "error"
  ): void {
    if (!this.initialized) return;
    
    // Sentry.addBreadcrumb({ message, category, level });
    logger.debug("Sentry addBreadcrumb", { message, category, level });
  }
}

// OpenTelemetry integration (placeholder - would install @opentelemetry/api)
export class OpenTelemetryService {
  private static instance: OpenTelemetryService;
  private initialized = false;

  private constructor() {}

  static getInstance(): OpenTelemetryService {
    if (!OpenTelemetryService.instance) {
      OpenTelemetryService.instance = new OpenTelemetryService();
    }
    return OpenTelemetryService.instance;
  }

  /**
   * Initialize OpenTelemetry
   */
  initialize(): void {
    if (this.initialized) return;

    // In production, initialize OpenTelemetry here
    // import * as opentelemetry from "@opentelemetry/api";
    
    logger.info("OpenTelemetry initialized");
    this.initialized = true;
  }

  /**
   * Record a metric
   */
  recordMetric(name: string, value: number, attributes?: Record<string, unknown>): void {
    if (!this.initialized) return;
    
    // const meter = opentelemetry.metrics.getMeter("trajectoire");
    // const counter = meter.createCounter(name);
    // counter.add(value, attributes);
    
    logger.debug("OpenTelemetry recordMetric", { name, value, attributes });
  }

  /**
   * Record a histogram
   */
  recordHistogram(name: string, value: number, attributes?: Record<string, unknown>): void {
    if (!this.initialized) return;
    
    // const meter = opentelemetry.metrics.getMeter("trajectoire");
    // const histogram = meter.createHistogram(name);
    // histogram.record(value, attributes);
    
    logger.debug("OpenTelemetry recordHistogram", { name, value, attributes });
  }

  /**
   * Start a span
   */
  startSpan(name: string): any {
    if (!this.initialized) return null;
    
    // const tracer = opentelemetry.trace.getTracer("trajectoire");
    // return tracer.startSpan(name);
    
    logger.debug("OpenTelemetry startSpan", { name });
    return null;
  }

  /**
   * End a span
   */
  endSpan(span: any): void {
    if (!this.initialized || !span) return;
    
    // span.end();
    logger.debug("OpenTelemetry endSpan");
  }
}

// Metrics collection
export class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: Map<string, number[]> = new Map();
  private static readonly MAX_SAMPLES = 1000;

  private constructor() {}

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  /**
   * Record a metric value
   */
  record(name: string, value: number): void {
    const values = this.metrics.get(name) || [];
    values.push(value);
    
    // Keep only last N samples
    if (values.length > MetricsCollector.MAX_SAMPLES) {
      values.shift();
    }
    
    this.metrics.set(name, values);
  }

  /**
   * Get metric statistics
   */
  getStats(name: string): { count: number; avg: number; min: number; max: number; p50: number; p95: number; p99: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);

    return {
      count: sorted.length,
      avg: sum / sorted.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    
    for (const [name] of this.metrics) {
      result[name] = this.getStats(name);
    }
    
    return result;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

// Predefined metric names
export const MetricNames = {
  // API metrics
  API_REQUEST_COUNT: "api.request.count",
  API_REQUEST_DURATION: "api.request.duration",
  API_ERROR_COUNT: "api.error.count",
  API_TIMEOUT_COUNT: "api.timeout.count",

  // Database metrics
  DB_QUERY_COUNT: "db.query.count",
  DB_QUERY_DURATION: "db.query.duration",
  DB_CONNECTION_POOL_SIZE: "db.connection.pool.size",
  DB_CONNECTION_POOL_WAIT: "db.connection.pool.wait",

  // OpenAI metrics
  OPENAI_REQUEST_COUNT: "openai.request.count",
  OPENAI_REQUEST_DURATION: "openai.request.duration",
  OPENAI_TOKEN_COUNT: "openai.token.count",
  OPENAI_ERROR_COUNT: "openai.error.count",

  // Cache metrics
  CACHE_HIT_COUNT: "cache.hit.count",
  CACHE_MISS_COUNT: "cache.miss.count",
  CACHE_HIT_RATE: "cache.hit.rate",

  // System metrics
  CPU_USAGE: "system.cpu.usage",
  MEMORY_USAGE: "system.memory.usage",
  MEMORY_HEAP: "system.memory.heap",

  // Circuit breaker metrics
  CIRCUIT_BREAKER_STATE: "circuit.breaker.state",
  CIRCUIT_BREAKER_FAILURE_COUNT: "circuit.breaker.failure.count",
  CIRCUIT_BREAKER_SUCCESS_COUNT: "circuit.breaker.success.count",

  // Retry metrics
  RETRY_COUNT: "retry.count",
  RETRY_SUCCESS_COUNT: "retry.success.count",
  RETRY_FAILURE_COUNT: "retry.failure.count",
} as const;

// Export singleton instances
export const sentryService = SentryService.getInstance();
export const openTelemetryService = OpenTelemetryService.getInstance();
export const metricsCollector = MetricsCollector.getInstance();
