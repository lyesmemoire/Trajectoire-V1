# Intelligence Runtime Public API

## Overview

**Date**: 2026-07-13  
**Module**: lib/intelligence-runtime  
**Status**: Public API Definition  
**Related**: ADR-021-INTELLIGENCE-RUNTIME.md, INTELLIGENCE_RUNTIME_ARCHITECTURE.md

---

## API Design Principles

1. **Interface-First**: Define interfaces before implementations
2. **Port-Based**: Use ports for external dependencies
3. **Type-Safe**: Leverage TypeScript for type safety
4. **Minimal**: Provide only essential public APIs
5. **Extensible**: Design for future extensions without breaking changes

---

## Public Interfaces

### ContextBuilder

**Responsibility**: Build context from multiple sources for AI prompts

**Interface**:

```typescript
export interface ContextBuilder {
  /**
   * Build context from CandidateGraph, CandidateAIBrain, and other engines
   * @param sources - Context sources to build from
   * @returns Built context as key-value pairs
   */
  buildContext(sources: ContextSources): Promise<Context>;

  /**
   * Build candidate profile from CandidateGraph
   * @param candidateGraph - Candidate data
   * @returns Candidate profile
   */
  buildCandidateProfile(candidateGraph: CandidateGraph): CandidateProfile;

  /**
   * Build historical observations from CandidateAIBrain
   * @param limit - Maximum number of observations
   * @returns Historical observations
   */
  buildHistoricalObservations(limit?: number): Promise<Observation[]>;

  /**
   * Build current goals from CandidateAIBrain
   * @returns Current goals
   */
  buildCurrentGoals(): Promise<Goal[]>;

  /**
   * Build context from other engines via DependencyManager
   * @param engineSources - Engine sources to extract from
   * @returns Engine context
   */
  buildEngineContext(engineSources: EngineSource[]): Promise<EngineContext>;
}

export interface ContextSources {
  candidateGraph: CandidateGraph;
  brain: BrainPort;
  engines?: EngineSource[];
}

export interface Context {
  candidateProfile: CandidateProfile;
  historicalObservations: Observation[];
  currentGoals: Goal[];
  engineContext?: EngineContext;
  metadata: ContextMetadata;
}

export interface ContextMetadata {
  builtAt: string;
  sources: string[];
  version: string;
}
```

**Usage Example**:

```typescript
const context = await contextBuilder.buildContext({
  candidateGraph,
  brain: candidateAIBrain,
  engines: [
    { source: "career-copilot-success", limit: 1 },
    { source: "career-copilot-scenario", limit: 1 },
  ],
});
```

---

### DependencyManager

**Responsibility**: Resolve engine-to-engine dependencies via Brain

**Interface**:

```typescript
export interface DependencyManager {
  /**
   * Get engine output from Brain observations
   * @param source - Engine source
   * @param maxLength - Maximum length of output
   * @returns Engine output as string
   */
  getEngineOutput(source: string, maxLength?: number): Promise<string>;

  /**
   * Get engine history from Brain observations
   * @param source - Engine source
   * @param limit - Maximum number of history entries
   * @returns Engine history as string
   */
  getEngineHistory(source: string, limit?: number): Promise<string>;

  /**
   * Get engine current state
   * @param engine - Engine instance
   * @param fallback - Fallback value if state unavailable
   * @returns Engine current state
   */
  getEngineCurrentState(engine: unknown, fallback: string): Promise<string>;

  /**
   * Resolve multiple dependencies
   * @param dependencies - Dependencies to resolve
   * @returns Resolved dependencies
   */
  resolveDependencies(dependencies: Dependency[]): Promise<ResolvedDependencies>;
}

export interface Dependency {
  source: string;
  limit?: number;
  maxLength?: number;
  fallback?: string;
}

export interface ResolvedDependencies {
  [source: string]: string;
}
```

**Usage Example**:

```typescript
const dependencies = await dependencyManager.resolveDependencies([
  { source: "career-copilot-success", limit: 1 },
  { source: "career-copilot-scenario", limit: 1 },
  { source: "career-copilot-constraint", limit: 1 },
]);
```

---

### EventPublisher

**Responsibility**: Wrapper around EventBus providing engine-specific event publishing API

**Interface**:

```typescript
export interface EventPublisher {
  /**
   * Publish observation event
   * @param source - Engine source
   * @param data - Observation data
   * @param confidence - Confidence score
   * @param metadata - Optional metadata
   */
  publishObservation(
    source: string,
    data: unknown,
    confidence: number,
    metadata?: Record<string, unknown>
  ): Promise<void>;

  /**
   * Publish custom event
   * @param eventType - Event type
   * @param payload - Event payload
   */
  publishCustomEvent<T>(eventType: string, payload: T): Promise<void>;

  /**
   * Subscribe to event type
   * @param eventType - Event type
   * @param handler - Event handler
   * @returns Unsubscribe function
   */
  subscribe<T>(eventType: string, handler: (event: T) => void): () => void;
}

export interface ObservationEvent {
  id: string;
  timestamp: Date;
  source: string;
  type: string;
  data: unknown;
  confidence: number;
  metadata?: Record<string, unknown>;
}
```

**Usage Example**:

```typescript
await eventPublisher.publishObservation(
  "career-copilot-forecast",
  forecastData,
  0.8,
  { engineVersion: "v1" }
);
```

---

### ExecutionPipeline

**Responsibility**: Composable pipeline for AI operations

**Interface**:

```typescript
export interface ExecutionPipeline {
  /**
   * Execute pipeline with stages
   * @param input - Pipeline input
   * @param stages - Pipeline stages
   * @returns Pipeline output
   */
  execute<TInput, TOutput>(
    input: TInput,
    stages: ExecutionStage<TInput, TOutput>[]
  ): Promise<TOutput>;

  /**
   * Add middleware to pipeline
   * @param middleware - Middleware to add
   */
  use(middleware: ExecutionMiddleware): void;

  /**
   * Create pipeline from config
   * @param config - Pipeline configuration
   * @returns Configured pipeline
   */
  fromConfig<TInput, TOutput>(
    config: PipelineConfig<TInput, TOutput>
  ): ExecutionPipeline;
}

export interface ExecutionStage<TInput, TOutput> {
  name: string;
  execute: (input: TInput) => Promise<TOutput>;
}

export interface ExecutionMiddleware {
  name: string;
  before?: (input: unknown) => Promise<unknown>;
  after?: (output: unknown) => Promise<unknown>;
  onError?: (error: Error) => Promise<void>;
}

export interface PipelineConfig<TInput, TOutput> {
  stages: ExecutionStage<TInput, TOutput>[];
  middleware?: ExecutionMiddleware[];
}
```

**Usage Example**:

```typescript
const pipeline = new ExecutionPipeline();
pipeline.use({
  name: "logging",
  before: async (input) => {
    logger.info("Pipeline execution started", { input });
    return input;
  },
});

const result = await pipeline.execute(input, [
  { name: "validation", execute: validateInput },
  { name: "enrichment", execute: enrichContext },
  { name: "execution", execute: executeAI },
  { name: "post-processing", execute: postProcess },
]);
```

---

### RuntimeContext

**Responsibility**: Runtime context for AI operations

**Interface**:

```typescript
export interface RuntimeContext {
  /**
   * Get context value
   * @param key - Context key
   * @returns Context value
   */
  get<T>(key: string): T | undefined;

  /**
   * Set context value
   * @param key - Context key
   * @param value - Context value
   */
  set<T>(key: string, value: T): void;

  /**
   * Check if context has key
   * @param key - Context key
   * @returns True if key exists
   */
  has(key: string): boolean;

  /**
   * Get all context keys
   * @returns Context keys
   */
  keys(): string[];

  /**
   * Clear all context
   */
  clear(): void;

  /**
   * Create child context
   * @returns Child context
   */
  child(): RuntimeContext;
}

export interface RuntimeContextOptions {
  parent?: RuntimeContext;
  immutable?: boolean;
}
```

**Usage Example**:

```typescript
const context = new RuntimeContext();
context.set("userId", "user-123");
context.set("engine", "career-copilot-forecast");

const userId = context.get<string>("userId");
```

---

### RuntimeExecution

**Responsibility**: Runtime execution with retry, timeout, and circuit breaker

**Interface**:

```typescript
export interface RuntimeExecution {
  /**
   * Execute operation with runtime policies
   * @param operation - Operation to execute
   * @param options - Execution options
   * @returns Execution result
   */
  execute<T>(
    operation: () => Promise<T>,
    options?: ExecutionOptions
  ): Promise<ExecutionResult<T>>;

  /**
   * Execute with retry only
   * @param operation - Operation to execute
   * @param retryConfig - Retry configuration
   * @returns Execution result
   */
  executeWithRetry<T>(
    operation: () => Promise<T>,
    retryConfig?: RetryConfig
  ): Promise<ExecutionResult<T>>;

  /**
   * Execute with timeout only
   * @param operation - Operation to execute
   * @param timeoutConfig - Timeout configuration
   * @returns Execution result
   */
  executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeoutConfig?: TimeoutConfig
  ): Promise<ExecutionResult<T>>;

  /**
   * Execute with circuit breaker only
   * @param operation - Operation to execute
   * @param circuitBreakerConfig - Circuit breaker configuration
   * @returns Execution result
   */
  executeWithCircuitBreaker<T>(
    operation: () => Promise<T>,
    circuitBreakerConfig?: CircuitBreakerConfig
  ): Promise<ExecutionResult<T>>;
}

export interface ExecutionOptions {
  retry?: RetryConfig;
  timeout?: TimeoutConfig;
  circuitBreaker?: CircuitBreakerConfig;
  telemetry?: boolean;
}

export interface ExecutionResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  metrics?: ExecutionMetrics;
}

export interface ExecutionMetrics {
  duration: number;
  attempts: number;
  circuitBreakerState?: CircuitBreakerState;
}
```

**Usage Example**:

```typescript
const result = await runtimeExecution.execute(
  () => aiOrchestrator.execute(prompt, variables, config),
  {
    retry: { maxRetries: 3, backoff: "exponential" },
    timeout: { duration: 30000 },
    circuitBreaker: { threshold: 5, timeout: 60000 },
    telemetry: true,
  }
);
```

---

### TelemetryPort

**Responsibility**: Port for telemetry collection

**Interface**:

```typescript
export interface TelemetryPort {
  /**
   * Track metric
   * @param name - Metric name
   * @param value - Metric value
   * @param tags - Optional tags
   */
  trackMetric(name: string, value: number, tags?: Record<string, string>): void;

  /**
   * Track event
   * @param name - Event name
   * @param properties - Event properties
   */
  trackEvent(name: string, properties?: Record<string, unknown>): void;

  /**
   * Track error
   * @param error - Error to track
   * @param context - Error context
   */
  trackError(error: Error, context?: Record<string, unknown>): void;

  /**
   * Start span
   * @param name - Span name
   * @returns Span
   */
  startSpan(name: string): TelemetrySpan;

  /**
   * Flush telemetry
   */
  flush(): Promise<void>;
}

export interface TelemetrySpan {
  /**
   * End span
   * @param attributes - Span attributes
   */
  end(attributes?: Record<string, unknown>): void;

  /**
   * Set attribute
   * @param key - Attribute key
   * @param value - Attribute value
   */
  setAttribute(key: string, value: unknown): void;

  /**
   * Record exception
   * @param error - Exception to record
   */
  recordException(error: Error): void;
}
```

**Usage Example**:

```typescript
const span = telemetry.startSpan("forecast-execution");
try {
  const result = await executeForecast();
  telemetry.trackMetric("forecast-duration", duration, { engine: "forecast" });
  telemetry.trackEvent("forecast-completed", { success: true });
  span.end({ success: true });
  return result;
} catch (error) {
  telemetry.trackError(error, { engine: "forecast" });
  span.recordException(error);
  span.end({ success: false });
  throw error;
}
```

---

### MetricsPort

**Responsibility**: Port for metrics collection

**Interface**:

```typescript
export interface MetricsPort {
  /**
   * Increment counter
   * @param name - Counter name
   * @param value - Value to increment
   * @param tags - Optional tags
   */
  increment(name: string, value?: number, tags?: Record<string, string>): void;

  /**
   * Record gauge
   * @param name - Gauge name
   * @param value - Gauge value
   * @param tags - Optional tags
   */
  gauge(name: string, value: number, tags?: Record<string, string>): void;

  /**
   * Record histogram
   * @param name - Histogram name
   * @param value - Histogram value
   * @param tags - Optional tags
   */
  histogram(name: string, value: number, tags?: Record<string, string>): void;

  /**
   * Record timing
   * @param name - Timing name
   * @param duration - Duration in milliseconds
   * @param tags - Optional tags
   */
  timing(name: string, duration: number, tags?: Record<string, string>): void;

  /**
   * Flush metrics
   */
  flush(): Promise<void>;
}
```

**Usage Example**:

```typescript
metrics.increment("forecast-executions", 1, { engine: "forecast" });
metrics.timing("forecast-duration", duration, { engine: "forecast" });
metrics.gauge("forecast-cache-size", cacheSize, { engine: "forecast" });
```

---

### RetryPolicy

**Responsibility**: Retry logic with exponential backoff

**Interface**:

```typescript
export interface RetryPolicy {
  /**
   * Execute operation with retry
   * @param operation - Operation to execute
   * @param config - Retry configuration
   * @returns Operation result
   */
  execute<T>(operation: () => Promise<T>, config?: RetryConfig): Promise<RetryResult<T>>;

  /**
   * Update retry configuration
   * @param config - Partial configuration to update
   */
  updateConfig(config: Partial<RetryConfig>): void;

  /**
   * Get current configuration
   * @returns Current configuration
   */
  getConfig(): RetryConfig;
}

export interface RetryConfig {
  maxRetries: number;
  backoff: "linear" | "exponential";
  initialDelay: number;
  maxDelay: number;
  retryableErrors?: (error: Error) => boolean;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
}
```

**Usage Example**:

```typescript
const result = await retryPolicy.execute(
  () => aiOrchestrator.execute(prompt, variables, config),
  {
    maxRetries: 3,
    backoff: "exponential",
    initialDelay: 1000,
    maxDelay: 10000,
    retryableErrors: (error) => error.name === "NetworkError",
  }
);
```

---

### TimeoutPolicy

**Responsibility**: Timeout wrapper around operations

**Interface**:

```typescript
export interface TimeoutPolicy {
  /**
   * Execute operation with timeout
   * @param operation - Operation to execute
   * @param config - Timeout configuration
   * @returns Operation result
   */
  execute<T>(operation: () => Promise<T>, config?: TimeoutConfig): Promise<T>;

  /**
   * Update timeout configuration
   * @param config - Partial configuration to update
   */
  updateConfig(config: Partial<TimeoutConfig>): void;

  /**
   * Get current configuration
   * @returns Current configuration
   */
  getConfig(): TimeoutConfig;
}

export interface TimeoutConfig {
  duration: number;
  onTimeout?: () => void;
}
```

**Usage Example**:

```typescript
const result = await timeoutPolicy.execute(
  () => aiOrchestrator.execute(prompt, variables, config),
  {
    duration: 30000,
    onTimeout: () => logger.warn("Operation timed out"),
  }
);
```

---

### CircuitBreaker

**Responsibility**: Circuit breaker pattern for preventing cascade failures

**Interface**:

```typescript
export interface CircuitBreaker {
  /**
   * Execute operation with circuit breaker
   * @param operation - Operation to execute
   * @param config - Circuit breaker configuration
   * @returns Operation result
   */
  execute<T>(operation: () => Promise<T>, config?: CircuitBreakerConfig): Promise<T>;

  /**
   * Get current state
   * @returns Current circuit breaker state
   */
  getState(): CircuitBreakerState;

  /**
   * Reset circuit breaker
   */
  reset(): void;

  /**
   * Update circuit breaker configuration
   * @param config - Partial configuration to update
   */
  updateConfig(config: Partial<CircuitBreakerConfig>): void;
}

export interface CircuitBreakerConfig {
  threshold: number;
  timeout: number;
  halfOpenMaxCalls: number;
}

export type CircuitBreakerState = "closed" | "open" | "half-open";
```

**Usage Example**:

```typescript
const result = await circuitBreaker.execute(
  () => aiOrchestrator.execute(prompt, variables, config),
  {
    threshold: 5,
    timeout: 60000,
    halfOpenMaxCalls: 3,
  }
);
```

---

### BrainOrchestrator

**Responsibility**: Orchestrate Brain operations

**Interface**:

```typescript
export interface BrainOrchestrator {
  /**
   * Get observations from Brain
   * @param filter - Optional filter
   * @returns Observations
   */
  getObservations(filter?: ObservationFilter): Promise<Observation[]>;

  /**
   * Add observation to Brain
   * @param observation - Observation to add
   * @returns Added observation
   */
  addObservation(observation: Omit<Observation, "id">): Promise<Observation>;

  /**
   * Get goals from Brain
   * @param status - Optional status filter
   * @returns Goals
   */
  getGoals(status?: GoalStatus): Promise<Goal[]>;

  /**
   * Add goal to Brain
   * @param goal - Goal to add
   * @returns Added goal
   */
  addGoal(goal: Omit<Goal, "id">): Promise<Goal>;

  /**
   * Get insights from Brain
   * @param type - Optional type filter
   * @returns Insights
   */
  getInsights(type?: InsightType): Promise<Insight[]>;

  /**
   * Get patterns from Brain
   * @returns Patterns
   */
  getPatterns(): Promise<Pattern[]>;

  /**
   * Get current Brain state
   * @returns Brain state
   */
  getCurrentState(): Promise<BrainState>;
}

export interface ObservationFilter {
  source?: string;
  type?: string;
  limit?: number;
  after?: Date;
  before?: Date;
}
```

**Usage Example**:

```typescript
const observations = await brainOrchestrator.getObservations({
  source: "career-copilot-forecast",
  limit: 10,
});

await brainOrchestrator.addObservation({
  timestamp: new Date(),
  source: "career-copilot-forecast",
  type: "general",
  data: forecastData,
  confidence: 0.8,
});
```

---

## Public API Exports

### Main Exports

```typescript
// Context building
export { ContextBuilder } from "./application/ContextBuilder";
export type { Context, ContextSources, ContextMetadata } from "./domain/context/Context";

// Dependency management
export { DependencyManager } from "./application/DependencyManager";
export type { Dependency, ResolvedDependencies } from "./domain/dependency/Dependency";

// Event publishing
export { EventPublisher } from "./application/EventPublisher";
export type { ObservationEvent } from "./infrastructure/events/EventBus";

// Execution pipeline
export { ExecutionPipeline } from "./application/ExecutionOrchestrator";
export type {
  ExecutionStage,
  ExecutionMiddleware,
  PipelineConfig,
} from "./domain/execution/ExecutionPipeline";

// Runtime context
export { RuntimeContext } from "./domain/execution/RuntimeContext";
export type { RuntimeContextOptions } from "./domain/execution/RuntimeContext";

// Runtime execution
export { RuntimeExecution } from "./application/RuntimeExecution";
export type {
  ExecutionOptions,
  ExecutionResult,
  ExecutionMetrics,
} from "./application/RuntimeExecution";

// Telemetry
export { TelemetryPort } from "./infrastructure/telemetry/TelemetryPort";
export type { TelemetrySpan } from "./infrastructure/telemetry/TelemetryPort";

// Metrics
export { MetricsPort } from "./infrastructure/metrics/MetricsPort";

// Retry
export { RetryPolicy } from "./infrastructure/retry/RetryPolicy";
export type { RetryConfig, RetryResult } from "./infrastructure/retry/RetryPolicy";

// Timeout
export { TimeoutPolicy } from "./infrastructure/timeout/TimeoutPolicy";
export type { TimeoutConfig } from "./infrastructure/timeout/TimeoutPolicy";

// Circuit breaker
export { CircuitBreaker } from "./infrastructure/circuit-breaker/CircuitBreaker";
export type {
  CircuitBreakerConfig,
  CircuitBreakerState,
} from "./infrastructure/circuit-breaker/CircuitBreaker";

// Brain orchestration
export { BrainOrchestrator } from "./domain/brain/BrainOrchestrator";
export type { ObservationFilter } from "./domain/brain/BrainOrchestrator";
```

---

## Usage Patterns

### Pattern 1: Basic Context Building

```typescript
import { ContextBuilder } from "@/lib/intelligence-runtime";

const contextBuilder = new ContextBuilder();
const context = await contextBuilder.buildContext({
  candidateGraph,
  brain: candidateAIBrain,
});
```

### Pattern 2: Dependency Resolution

```typescript
import { DependencyManager } from "@/lib/intelligence-runtime";

const dependencyManager = new DependencyManager();
const dependencies = await dependencyManager.resolveDependencies([
  { source: "career-copilot-success", limit: 1 },
  { source: "career-copilot-scenario", limit: 1 },
]);
```

### Pattern 3: Event Publishing

```typescript
import { EventPublisher } from "@/lib/intelligence-runtime";

const eventPublisher = new EventPublisher();
await eventPublisher.publishObservation(
  "career-copilot-forecast",
  forecastData,
  0.8
);
```

### Pattern 4: Execution with Retry and Timeout

```typescript
import { RuntimeExecution } from "@/lib/intelligence-runtime";

const runtimeExecution = new RuntimeExecution();
const result = await runtimeExecution.execute(
  () => aiOrchestrator.execute(prompt, variables, config),
  {
    retry: { maxRetries: 3, backoff: "exponential" },
    timeout: { duration: 30000 },
  }
);
```

### Pattern 5: Telemetry and Metrics

```typescript
import { TelemetryPort, MetricsPort } from "@/lib/intelligence-runtime";

const telemetry = new TelemetryPort();
const metrics = new MetricsPort();

const span = telemetry.startSpan("forecast-execution");
try {
  const result = await executeForecast();
  metrics.timing("forecast-duration", duration);
  telemetry.trackEvent("forecast-completed");
  span.end({ success: true });
  return result;
} catch (error) {
  telemetry.trackError(error);
  span.recordException(error);
  span.end({ success: false });
  throw error;
}
```

---

## Versioning

### Semantic Versioning

- **Major (X.0.0)**: Breaking changes to public APIs
- **Minor (0.X.0)**: New features, backward compatible
- **Patch (0.0.X)**: Bug fixes, backward compatible

### Deprecation Policy

- Deprecated APIs marked with `@deprecated` JSDoc
- Deprecated APIs removed in next major version
- Migration guide provided for breaking changes

---

## Conclusion

This public API definition provides the contracts for `lib/intelligence-runtime` without implementation details. The interfaces are designed to be:
- Type-safe with TypeScript
- Minimal and focused
- Extensible for future needs
- Clear in their responsibilities

**Status**: Public API Definition Complete ✅  
**Next Phase**: Sprint 6.12 Implementation (create intelligence-runtime module)
