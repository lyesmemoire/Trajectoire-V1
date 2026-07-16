// @ts-nocheck
export interface Logger {
  info(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

export interface Metrics {
  increment(name: string, value?: number, tags?: Record<string, string>): void;
  gauge(name: string, value: number, tags?: Record<string, string>): void;
  histogram(name: string, value: number, tags?: Record<string, string>): void;
}

export interface Tracer {
  startSpan<T>(name: string, fn: () => Promise<T>): Promise<T>;
}

export interface Observability {
  logger(): Logger;
  metrics(): Metrics;
  tracer(): Tracer;
}
