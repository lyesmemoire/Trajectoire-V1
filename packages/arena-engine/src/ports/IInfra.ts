export interface ILogger {
  warn(obj: any, msg?: string): void;
  error(obj: any, msg?: string): void;
}

export interface ILoggerFactory {
  createChildLogger(context: Record<string, any>): ILogger;
}

export interface IEnvProvider {
  NODE_ENV: string;
  get(key: string): string | undefined;
}

export interface IErrorReporter {
  addBreadcrumb(breadcrumb: any): void;
}

export interface ISpan {
  setAttribute(key: string, value: any): void;
  setStatus(status: { code: number; message?: string }): void;
  end(): void;
}

export interface ITracer {
  startActiveSpan<T>(name: string, fn: (span: ISpan) => Promise<T>): Promise<T>;
}

export interface ICounter {
  labels(...labels: string[]): { inc(): void };
}

export interface IHistogram {
  labels(...labels: string[]): { observe(val: number): void };
}

export interface IMetricsProvider {
  createCounter(options: any): ICounter;
  createHistogram(options: any): IHistogram;
}

export interface IRandomProvider {
  next(): number;
}

export type TimerHandle = unknown;

export interface IClock {
  now(): number;
}

export interface ITimer {
  setTimeout(callback: (value?: unknown) => void, ms: number): TimerHandle;
  scheduleAtAbsolute?(absoluteTime: number, callback: () => void): TimerHandle;
  setInterval(callback: () => void, ms: number): TimerHandle;
  clearTimeout(handle: TimerHandle): void;
  clearInterval(handle: TimerHandle): void;
}

export interface IChaosInfra {
  env: IEnvProvider;
  loggerFactory: ILoggerFactory;
  tracer: ITracer;
  metrics: IMetricsProvider;
  errorReporter: IErrorReporter;
  random: IRandomProvider;
  clock: IClock;
  timer: ITimer;
}
