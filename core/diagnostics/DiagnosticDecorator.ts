/**
 * Diagnostic Decorator
 *
 * Automatic instrumentation middleware for components.
 * Wraps components with diagnostic capabilities without code pollution.
 */

import { CorrelationManager } from "./CorrelationManager";
import { EventTraceRecorder } from "./EventTraceRecorder";
import { PerformanceProfiler } from "./PerformanceProfiler";

export interface InstrumentationConfig {
  enabled: boolean;
  recordTraces: boolean;
  profilePerformance: boolean;
  trackCorrelation: boolean;
}

export class DiagnosticDecorator {
  private config: InstrumentationConfig;
  private correlationManager: CorrelationManager;
  private eventTraceRecorder: EventTraceRecorder;
  private performanceProfiler: PerformanceProfiler;

  constructor(
    correlationManager: CorrelationManager,
    eventTraceRecorder: EventTraceRecorder,
    performanceProfiler: PerformanceProfiler,
    config: Partial<InstrumentationConfig> = {}
  ) {
    this.correlationManager = correlationManager;
    this.eventTraceRecorder = eventTraceRecorder;
    this.performanceProfiler = performanceProfiler;
    this.config = {
      enabled: true,
      recordTraces: true,
      profilePerformance: true,
      trackCorrelation: true,
      ...config,
    };
  }

  /**
   * Decorate a synchronous function
   */
  decorateSync<T extends (...args: unknown[]) => unknown>(
    fn: T,
    componentName: string,
    source: string,
    destination: string
  ): T {
    if (!this.config.enabled) {
      return fn;
    }

    return ((...args: unknown[]) => {
      const correlationId = this.config.trackCorrelation 
        ? this.correlationManager.getContext()?.correlationId ?? null 
        : null;

      if (this.config.trackCorrelation && !correlationId) {
        // Auto-create correlation context if none exists
        const context = this.correlationManager.createContext();
        this.correlationManager.setContext(context);
      }

      let traceId: string | null = null;
      if (this.config.recordTraces) {
        traceId = this.eventTraceRecorder.startTrace(
          `${componentName}.execute`,
          source,
          destination,
          { args: this.sanitizeArgs(args) }
        );
      }

      if (this.config.profilePerformance) {
        this.performanceProfiler.startProfiling(componentName);
      }

      try {
        const result = fn(...args);

        if (this.config.recordTraces && traceId) {
          this.eventTraceRecorder.endTrace(traceId, { status: "success" });
        }

        if (this.config.profilePerformance) {
          this.performanceProfiler.stopProfiling(componentName);
        }

        return result;
      } catch (error) {
        if (this.config.recordTraces && traceId) {
          this.eventTraceRecorder.endTrace(traceId, { 
            status: "error",
            error: error instanceof Error ? error.message : String(error)
          });
        }

        if (this.config.profilePerformance) {
          this.performanceProfiler.stopProfiling(componentName);
        }

        throw error;
      }
    }) as T;
  }

  /**
   * Decorate an asynchronous function
   */
  decorateAsync<T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    componentName: string,
    source: string,
    destination: string
  ): T {
    if (!this.config.enabled) {
      return fn;
    }

    return (async (...args: unknown[]) => {
      const correlationId = this.config.trackCorrelation 
        ? this.correlationManager.getContext()?.correlationId ?? null 
        : null;

      if (this.config.trackCorrelation && !correlationId) {
        // Auto-create correlation context if none exists
        const context = this.correlationManager.createContext();
        this.correlationManager.setContext(context);
      }

      let traceId: string | null = null;
      if (this.config.recordTraces) {
        traceId = this.eventTraceRecorder.startTrace(
          `${componentName}.execute`,
          source,
          destination,
          { args: this.sanitizeArgs(args) }
        );
      }

      if (this.config.profilePerformance) {
        this.performanceProfiler.startProfiling(componentName);
      }

      try {
        const result = await fn(...args);

        if (this.config.recordTraces && traceId) {
          this.eventTraceRecorder.endTrace(traceId, { status: "success" });
        }

        if (this.config.profilePerformance) {
          this.performanceProfiler.stopProfiling(componentName);
        }

        return result;
      } catch (error) {
        if (this.config.recordTraces && traceId) {
          this.eventTraceRecorder.endTrace(traceId, { 
            status: "error",
            error: error instanceof Error ? error.message : String(error)
          });
        }

        if (this.config.profilePerformance) {
          this.performanceProfiler.stopProfiling(componentName);
        }

        throw error;
      }
    }) as T;
  }

  /**
   * Decorate a class method
   */
  decorateMethod<T extends Record<string, unknown>>(
    instance: T,
    methodName: keyof T,
    componentName: string,
    source: string,
    destination: string
  ): void {
    const method = instance[methodName];
    if (typeof method !== "function") {
      return;
    }

    const decorated = this.decorateAsync(
      method as (...args: unknown[]) => Promise<unknown>,
      `${componentName}.${String(methodName)}`,
      source,
      destination
    );

    (instance as Record<string, unknown>)[methodName as string] = decorated;
  }

  /**
   * Decorate a class (all methods)
   */
  decorateClass<T extends Record<string, unknown>>(
    instance: T,
    componentName: string,
    source: string,
    destination: string
  ): void {
    const prototype = Object.getPrototypeOf(instance);
    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      name => typeof prototype[name] === "function" && name !== "constructor"
    );

    for (const methodName of methodNames) {
      this.decorateMethod(instance, methodName as keyof T, componentName, source, destination);
    }
  }

  /**
   * Create a correlation-scoped operation
   */
  withCorrelation<T>(operation: () => T, correlationId?: string): T {
    if (!this.config.enabled || !this.config.trackCorrelation) {
      return operation();
    }

    const context = correlationId 
      ? { correlationId, parentId: null, traceId: this.correlationManager.getContext()?.traceId ?? "" }
      : this.correlationManager.createContext();

    this.correlationManager.pushContext(context);

    try {
      return operation();
    } finally {
      this.correlationManager.popContext();
    }
  }

  /**
   * Create a correlation-scoped async operation
   */
  async withCorrelationAsync<T>(operation: () => Promise<T>, correlationId?: string): Promise<T> {
    if (!this.config.enabled || !this.config.trackCorrelation) {
      return operation();
    }

    const context = correlationId 
      ? { correlationId, parentId: null, traceId: this.correlationManager.getContext()?.traceId ?? "" }
      : this.correlationManager.createContext();

    this.correlationManager.pushContext(context);

    try {
      return await operation();
    } finally {
      this.correlationManager.popContext();
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<InstrumentationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): InstrumentationConfig {
    return { ...this.config };
  }

  /**
   * Enable/disable all instrumentation
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Sanitize arguments for logging (remove sensitive data)
   */
  private sanitizeArgs(args: unknown[]): unknown[] {
    return args.map(arg => {
      if (typeof arg === "string" && (arg.includes("password") || arg.includes("token") || arg.includes("secret"))) {
        return "[REDACTED]";
      }
      if (typeof arg === "object" && arg !== null) {
        return this.sanitizeObject(arg);
      }
      return arg;
    });
  }

  /**
   * Sanitize object for logging
   */
  private sanitizeObject(obj: unknown): unknown {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (key.toLowerCase().includes("password") || 
          key.toLowerCase().includes("token") || 
          key.toLowerCase().includes("secret")) {
        sanitized[key] = "[REDACTED]";
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
}

/**
 * Instrumentation Middleware Factory
 *
 * Creates pre-configured decorators for common scenarios.
 */
export class InstrumentationMiddleware {
  static createFullInstrumentation(
    correlationManager: CorrelationManager,
    eventTraceRecorder: EventTraceRecorder,
    performanceProfiler: PerformanceProfiler
  ): DiagnosticDecorator {
    return new DiagnosticDecorator(
      correlationManager,
      eventTraceRecorder,
      performanceProfiler,
      {
        enabled: true,
        recordTraces: true,
        profilePerformance: true,
        trackCorrelation: true,
      }
    );
  }

  static createPerformanceOnly(
    correlationManager: CorrelationManager,
    eventTraceRecorder: EventTraceRecorder,
    performanceProfiler: PerformanceProfiler
  ): DiagnosticDecorator {
    return new DiagnosticDecorator(
      correlationManager,
      eventTraceRecorder,
      performanceProfiler,
      {
        enabled: true,
        recordTraces: false,
        profilePerformance: true,
        trackCorrelation: false,
      }
    );
  }

  static createTraceOnly(
    correlationManager: CorrelationManager,
    eventTraceRecorder: EventTraceRecorder,
    performanceProfiler: PerformanceProfiler
  ): DiagnosticDecorator {
    return new DiagnosticDecorator(
      correlationManager,
      eventTraceRecorder,
      performanceProfiler,
      {
        enabled: true,
        recordTraces: true,
        profilePerformance: false,
        trackCorrelation: true,
      }
    );
  }

  static createCorrelationOnly(
    correlationManager: CorrelationManager,
    eventTraceRecorder: EventTraceRecorder,
    performanceProfiler: PerformanceProfiler
  ): DiagnosticDecorator {
    return new DiagnosticDecorator(
      correlationManager,
      eventTraceRecorder,
      performanceProfiler,
      {
        enabled: true,
        recordTraces: false,
        profilePerformance: false,
        trackCorrelation: true,
      }
    );
  }
}
