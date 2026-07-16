/**
 * Embedding Metrics Provider
 *
 * Responsibilities:
 * - Implement ProviderMetricsProvider interface for Embedding
 * - Collect metrics from Embedding
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY metrics collection
 */
// @ts-nocheck


import {
  ProviderMetricsProvider,
  ProviderMetrics,
  ProviderMetricsCapabilities
} from "../ProviderAbstractionLayer";

// ============================================================================
// EMBEDDING METRICS COLLECTOR
// ============================================================================

export interface EmbeddingMetricsCollector {
  collectMetrics(sessionId: string): {
    embedding: {
      latency: number;
      duration: number;
      textLength: number;
      dimensions: number;
    };
    batch: {
      batchSize: number;
      totalTexts: number;
      totalDimensions: number;
    };
    usage: {
      totalEmbeddings: number;
      totalTokens: number;
      totalCost: number;
    };
  };
}

// ============================================================================
// EMBEDDING METRICS PROVIDER IMPLEMENTATION
// ============================================================================

export class EmbeddingMetricsProviderImpl implements ProviderMetricsProvider {
  private metricsCollector: EmbeddingMetricsCollector;

  constructor(metricsCollector: EmbeddingMetricsCollector) {
    this.metricsCollector = metricsCollector;
  }

  async getMetrics(providerId: string): Promise<ProviderMetrics> {
    const metrics = this.metricsCollector.collectMetrics(providerId);
    return {
      providerId,
      latency: [
        {
          providerId,
          type: "request",
          latency: metrics.embedding.latency,
          timestamp: Date.now(),
          metadata: {}
        },
        {
          providerId,
          type: "response",
          latency: metrics.embedding.duration,
          timestamp: Date.now(),
          metadata: {}
        },
        {
          providerId,
          type: "total",
          latency: metrics.embedding.latency + metrics.embedding.duration,
          timestamp: Date.now(),
          metadata: {}
        }
      ],
      cost: [
        {
          providerId,
          cost: metrics.usage.totalCost,
          tokens: metrics.usage.totalTokens,
          timestamp: Date.now(),
          metadata: {}
        }
      ],
      usage: {
        providerId,
        requests: metrics.usage.totalEmbeddings,
        tokens: metrics.usage.totalTokens,
        cost: metrics.usage.totalCost,
        timestamp: Date.now()
      },
      availability: {
        providerId,
        availability: 1,
        uptime: 1,
        downtime: 0,
        lastDowntime: 0,
        timestamp: Date.now()
      },
      errors: []
    };
  }

  async getMetricsHistory(_providerId: string): Promise<ProviderMetrics[]> {
    return [];
  }

  getCapabilities(): ProviderMetricsCapabilities {
    return {
      latencyMetrics: true,
      costMetrics: true,
      usageMetrics: true,
      errorMetrics: true
    };
  }
}
