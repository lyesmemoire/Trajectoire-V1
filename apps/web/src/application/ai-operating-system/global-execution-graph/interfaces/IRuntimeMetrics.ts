// ===================================================================
// RUNTIME METRICS — Extended Metrics for Runtime Observability
// ===================================================================

export interface RuntimeMetrics {
  // Execution metrics
  executionId: string;
  graphId: string;
  sessionId: string;
  traceId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // milliseconds

  // LLM metrics
  llmCost: number; // dollars
  llmTime: number; // milliseconds
  llmTokens: {
    input: number;
    output: number;
    total: number;
  };
  llmCalls: number;
  llmErrors: number;

  // TypeScript processing time
  typescriptTime: number; // milliseconds

  // Policy evaluation time
  policyTime: number; // milliseconds
  policyEvaluations: number;
  policyHits: number;
  policyMisses: number;

  // Reducer time
  reducerTime: number; // milliseconds
  reducerInvocations: number;

  // Cache metrics
  cacheHits: number;
  cacheMisses: number;
  cacheHitRate: number;

  // Retry metrics
  retries: number;
  retrySuccess: number;
  retryFailure: number;

  // Memory metrics
  memoryUsed: number; // bytes
  memoryPeak: number; // bytes
  memoryLeaked: number; // bytes

  // Fact metrics
  factsConsumed: number;
  factsProduced: number;
  factsByType: Record<string, number>;

  // Engine-specific metrics
  engineMetrics: Record<string, EngineSpecificMetrics>;

  // Error metrics
  errors: number;
  warnings: number;

  // Custom metrics
  customMetrics: Record<string, number>;
}

export interface EngineSpecificMetrics {
  engineId: string;
  engineVersion: string;
  executionTime: number;
  cost: number;
  confidence: number;
  outputCount: number;
  metadata: Record<string, unknown>;
}

export interface RuntimeMetricsSnapshot {
  id: string;
  timestamp: Date;
  metrics: RuntimeMetrics;
}

export interface RuntimeMetricsAggregator {
  /**
   * Start tracking an execution
   */
  startExecution(executionId: string, graphId: string, sessionId: string, traceId: string): void;

  /**
   * End tracking an execution
   */
  endExecution(executionId: string): void;

  /**
   * Record LLM metrics
   */
  recordLLMMetrics(executionId: string, cost: number, time: number, tokens: { input: number; output: number }): void;

  /**
   * Record TypeScript processing time
   */
  recordTypeScriptTime(executionId: string, time: number): void;

  /**
   * Record policy evaluation time
   */
  recordPolicyTime(executionId: string, time: number, evaluations: number, hits: number, misses: number): void;

  /**
   * Record reducer time
   */
  recordReducerTime(executionId: string, time: number, invocations: number): void;

  /**
   * Record cache metrics
   */
  recordCacheMetrics(executionId: string, hits: number, misses: number): void;

  /**
   * Record retry metrics
   */
  recordRetryMetrics(executionId: string, retries: number, success: number, failure: number): void;

  /**
   * Record memory metrics
   */
  recordMemoryMetrics(executionId: string, used: number, peak: number, leaked: number): void;

  /**
   * Record fact metrics
   */
  recordFactMetrics(executionId: string, consumed: number, produced: number, byType: Record<string, number>): void;

  /**
   * Record engine-specific metrics
   */
  recordEngineMetrics(executionId: string, engineId: string, metrics: Partial<EngineSpecificMetrics>): void;

  /**
   * Record error
   */
  recordError(executionId: string): void;

  /**
   * Record warning
   */
  recordWarning(executionId: string): void;

  /**
   * Record custom metric
   */
  recordCustomMetric(executionId: string, key: string, value: number): void;

  /**
   * Get metrics for an execution
   */
  getMetrics(executionId: string): RuntimeMetrics | undefined;

  /**
   * Get aggregated metrics for a session
   */
  getSessionMetrics(sessionId: string): RuntimeMetrics | undefined;

  /**
   * Get aggregated metrics for a graph
   */
  getGraphMetrics(graphId: string): RuntimeMetrics | undefined;

  /**
   * Get all metrics
   */
  getAllMetrics(): RuntimeMetrics[];

  /**
   * Create a snapshot
   */
  createSnapshot(): RuntimeMetricsSnapshot;

  /**
   * Clear metrics
   */
  clear(): void;
}
