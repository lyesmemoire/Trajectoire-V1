import {
  RuntimeMetrics,
  EngineSpecificMetrics,
  RuntimeMetricsSnapshot,
  RuntimeMetricsAggregator as IRuntimeMetricsAggregator,
} from "./interfaces/IRuntimeMetrics";

// ===================================================================
// RUNTIME METRICS AGGREGATOR — In-Memory Implementation
// ===================================================================

export class RuntimeMetricsAggregator implements IRuntimeMetricsAggregator {
  private metrics: Map<string, RuntimeMetrics> = new Map();
  private snapshots: RuntimeMetricsSnapshot[] = [];

  startExecution(executionId: string, graphId: string, sessionId: string, traceId: string): void {
    const metrics: RuntimeMetrics = {
      executionId,
      graphId,
      sessionId,
      traceId,
      startTime: new Date(),
      llmCost: 0,
      llmTime: 0,
      llmTokens: { input: 0, output: 0, total: 0 },
      llmCalls: 0,
      llmErrors: 0,
      typescriptTime: 0,
      policyTime: 0,
      policyEvaluations: 0,
      policyHits: 0,
      policyMisses: 0,
      reducerTime: 0,
      reducerInvocations: 0,
      cacheHits: 0,
      cacheMisses: 0,
      cacheHitRate: 0,
      retries: 0,
      retrySuccess: 0,
      retryFailure: 0,
      memoryUsed: 0,
      memoryPeak: 0,
      memoryLeaked: 0,
      factsConsumed: 0,
      factsProduced: 0,
      factsByType: {},
      engineMetrics: {},
      errors: 0,
      warnings: 0,
      customMetrics: {},
    };

    this.metrics.set(executionId, metrics);
  }

  endExecution(executionId: string): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      metrics.endTime = new Date();
      metrics.duration = metrics.endTime.getTime() - metrics.startTime.getTime();

      // Calculate cache hit rate
      const totalCacheOps = metrics.cacheHits + metrics.cacheMisses;
      metrics.cacheHitRate = totalCacheOps > 0 ? metrics.cacheHits / totalCacheOps : 0;
    }
  }

  recordLLMMetrics(executionId: string, cost: number, time: number, tokens: { input: number; output: number }): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      metrics.llmCost += cost;
      metrics.llmTime += time;
      metrics.llmTokens.input += tokens.input;
      metrics.llmTokens.output += tokens.output;
      metrics.llmTokens.total += tokens.input + tokens.output;
      metrics.llmCalls += 1;
    }
  }

  recordTypeScriptTime(executionId: string, time: number): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      metrics.typescriptTime += time;
    }
  }

  recordPolicyTime(executionId: string, time: number, evaluations: number, hits: number, misses: number): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      metrics.policyTime += time;
      metrics.policyEvaluations += evaluations;
      metrics.policyHits += hits;
      metrics.policyMisses += misses;
    }
  }

  recordReducerTime(executionId: string, time: number, invocations: number): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      metrics.reducerTime += time;
      metrics.reducerInvocations += invocations;
    }
  }

  recordCacheMetrics(executionId: string, hits: number, misses: number): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      metrics.cacheHits += hits;
      metrics.cacheMisses += misses;

      const totalCacheOps = metrics.cacheHits + metrics.cacheMisses;
      metrics.cacheHitRate = totalCacheOps > 0 ? metrics.cacheHits / totalCacheOps : 0;
    }
  }

  recordRetryMetrics(executionId: string, retries: number, success: number, failure: number): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      metrics.retries += retries;
      metrics.retrySuccess += success;
      metrics.retryFailure += failure;
    }
  }

  recordMemoryMetrics(executionId: string, used: number, peak: number, leaked: number): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      metrics.memoryUsed = Math.max(metrics.memoryUsed, used);
      metrics.memoryPeak = Math.max(metrics.memoryPeak, peak);
      metrics.memoryLeaked += leaked;
    }
  }

  recordFactMetrics(executionId: string, consumed: number, produced: number, byType: Record<string, number>): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      metrics.factsConsumed += consumed;
      metrics.factsProduced += produced;

      for (const [type, count] of Object.entries(byType)) {
        metrics.factsByType[type] = (metrics.factsByType[type] || 0) + count;
      }
    }
  }

  recordEngineMetrics(executionId: string, engineId: string, engineMetrics: Partial<EngineSpecificMetrics>): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      const existing = metrics.engineMetrics[engineId] || {
        engineId,
        engineVersion: "1.0.0",
        executionTime: 0,
        cost: 0,
        confidence: 0,
        outputCount: 0,
        metadata: {},
      };

      metrics.engineMetrics[engineId] = {
        ...existing,
        ...engineMetrics,
        engineId,
      };
    }
  }

  recordError(executionId: string): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      metrics.errors += 1;
    }
  }

  recordWarning(executionId: string): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      metrics.warnings += 1;
    }
  }

  recordCustomMetric(executionId: string, key: string, value: number): void {
    const metrics = this.metrics.get(executionId);
    if (metrics) {
      metrics.customMetrics[key] = (metrics.customMetrics[key] || 0) + value;
    }
  }

  getMetrics(executionId: string): RuntimeMetrics | undefined {
    return this.metrics.get(executionId);
  }

  getSessionMetrics(sessionId: string): RuntimeMetrics | undefined {
    const sessionMetrics = Array.from(this.metrics.values()).filter(m => m.sessionId === sessionId);

    if (sessionMetrics.length === 0) {
      return undefined;
    }

    return this.aggregateMetrics(sessionMetrics);
  }

  getGraphMetrics(graphId: string): RuntimeMetrics | undefined {
    const graphMetrics = Array.from(this.metrics.values()).filter(m => m.graphId === graphId);

    if (graphMetrics.length === 0) {
      return undefined;
    }

    return this.aggregateMetrics(graphMetrics);
  }

  getAllMetrics(): RuntimeMetrics[] {
    return Array.from(this.metrics.values());
  }

  createSnapshot(): RuntimeMetricsSnapshot {
    const snapshot: RuntimeMetricsSnapshot = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      metrics: this.aggregateMetrics(this.getAllMetrics()),
    };

    this.snapshots.push(snapshot);

    return snapshot;
  }

  clear(): void {
    this.metrics.clear();
    this.snapshots = [];
  }

  private aggregateMetrics(metricsList: RuntimeMetrics[]): RuntimeMetrics {
    if (metricsList.length === 0) {
      throw new Error("Cannot aggregate empty metrics list");
    }

    const first = metricsList[0];
    const aggregated: RuntimeMetrics = {
      executionId: "aggregated",
      graphId: first.graphId,
      sessionId: first.sessionId,
      traceId: first.traceId,
      startTime: new Date(Math.min(...metricsList.map(m => m.startTime.getTime()))),
      endTime: new Date(Math.max(...metricsList.map(m => m.endTime?.getTime() || 0))),
      duration: metricsList.reduce((sum, m) => sum + (m.duration || 0), 0),
      llmCost: metricsList.reduce((sum, m) => sum + m.llmCost, 0),
      llmTime: metricsList.reduce((sum, m) => sum + m.llmTime, 0),
      llmTokens: {
        input: metricsList.reduce((sum, m) => sum + m.llmTokens.input, 0),
        output: metricsList.reduce((sum, m) => sum + m.llmTokens.output, 0),
        total: metricsList.reduce((sum, m) => sum + m.llmTokens.total, 0),
      },
      llmCalls: metricsList.reduce((sum, m) => sum + m.llmCalls, 0),
      llmErrors: metricsList.reduce((sum, m) => sum + m.llmErrors, 0),
      typescriptTime: metricsList.reduce((sum, m) => sum + m.typescriptTime, 0),
      policyTime: metricsList.reduce((sum, m) => sum + m.policyTime, 0),
      policyEvaluations: metricsList.reduce((sum, m) => sum + m.policyEvaluations, 0),
      policyHits: metricsList.reduce((sum, m) => sum + m.policyHits, 0),
      policyMisses: metricsList.reduce((sum, m) => sum + m.policyMisses, 0),
      reducerTime: metricsList.reduce((sum, m) => sum + m.reducerTime, 0),
      reducerInvocations: metricsList.reduce((sum, m) => sum + m.reducerInvocations, 0),
      cacheHits: metricsList.reduce((sum, m) => sum + m.cacheHits, 0),
      cacheMisses: metricsList.reduce((sum, m) => sum + m.cacheMisses, 0),
      cacheHitRate: 0, // Recalculated below
      retries: metricsList.reduce((sum, m) => sum + m.retries, 0),
      retrySuccess: metricsList.reduce((sum, m) => sum + m.retrySuccess, 0),
      retryFailure: metricsList.reduce((sum, m) => sum + m.retryFailure, 0),
      memoryUsed: Math.max(...metricsList.map(m => m.memoryUsed)),
      memoryPeak: Math.max(...metricsList.map(m => m.memoryPeak)),
      memoryLeaked: metricsList.reduce((sum, m) => sum + m.memoryLeaked, 0),
      factsConsumed: metricsList.reduce((sum, m) => sum + m.factsConsumed, 0),
      factsProduced: metricsList.reduce((sum, m) => sum + m.factsProduced, 0),
      factsByType: this.aggregateFactTypes(metricsList),
      engineMetrics: this.aggregateEngineMetrics(metricsList),
      errors: metricsList.reduce((sum, m) => sum + m.errors, 0),
      warnings: metricsList.reduce((sum, m) => sum + m.warnings, 0),
      customMetrics: this.aggregateCustomMetrics(metricsList),
    };

    // Recalculate cache hit rate
    const totalCacheOps = aggregated.cacheHits + aggregated.cacheMisses;
    aggregated.cacheHitRate = totalCacheOps > 0 ? aggregated.cacheHits / totalCacheOps : 0;

    return aggregated;
  }

  private aggregateFactTypes(metricsList: RuntimeMetrics[]): Record<string, number> {
    const aggregated: Record<string, number> = {};

    for (const metrics of metricsList) {
      for (const [type, count] of Object.entries(metrics.factsByType)) {
        aggregated[type] = (aggregated[type] || 0) + count;
      }
    }

    return aggregated;
  }

  private aggregateEngineMetrics(metricsList: RuntimeMetrics[]): Record<string, EngineSpecificMetrics> {
    const aggregated: Record<string, EngineSpecificMetrics> = {};

    for (const metrics of metricsList) {
      for (const [engineId, engineMetrics] of Object.entries(metrics.engineMetrics)) {
        const existing = aggregated[engineId] || {
          engineId,
          engineVersion: engineMetrics.engineVersion,
          executionTime: 0,
          cost: 0,
          confidence: 0,
          outputCount: 0,
          metadata: {},
        };

        aggregated[engineId] = {
          ...existing,
          executionTime: existing.executionTime + engineMetrics.executionTime,
          cost: existing.cost + engineMetrics.cost,
          confidence: (existing.confidence + engineMetrics.confidence) / 2,
          outputCount: existing.outputCount + engineMetrics.outputCount,
          metadata: { ...existing.metadata, ...engineMetrics.metadata },
        };
      }
    }

    return aggregated;
  }

  private aggregateCustomMetrics(metricsList: RuntimeMetrics[]): Record<string, number> {
    const aggregated: Record<string, number> = {};

    for (const metrics of metricsList) {
      for (const [key, value] of Object.entries(metrics.customMetrics)) {
        aggregated[key] = (aggregated[key] || 0) + value;
      }
    }

    return aggregated;
  }
}
