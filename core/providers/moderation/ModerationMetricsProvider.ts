/**
 * Moderation Metrics Provider
 *
 * Responsibilities:
 * - Implement ProviderMetricsProvider interface for Moderation
 * - Collect metrics from Moderation
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY metrics collection
 */

import {
  ProviderMetricsProvider,
  ProviderMetrics,
  ProviderMetricsCapabilities
} from "../ProviderAbstractionLayer";

// ============================================================================
// MODERATION METRICS COLLECTOR
// ============================================================================

export interface ModerationMetricsCollector {
  collectMetrics(sessionId: string): {
    moderation: {
      latency: number;
      duration: number;
      textLength: number;
      imageSize: number;
    };
    batch: {
      batchSize: number;
      totalTexts: number;
      totalImages: number;
    };
    usage: {
      totalModerations: number;
      totalTokens: number;
      totalCost: number;
    };
  };
}

// ============================================================================
// MODERATION METRICS PROVIDER IMPLEMENTATION
// ============================================================================

export class ModerationMetricsProviderImpl implements ProviderMetricsProvider {
  private metricsCollector: ModerationMetricsCollector;

  constructor(metricsCollector: ModerationMetricsCollector) {
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
          latency: metrics.moderation.latency,
          timestamp: Date.now(),
          metadata: {}
        },
        {
          providerId,
          type: "response",
          latency: metrics.moderation.duration,
          timestamp: Date.now(),
          metadata: {}
        },
        {
          providerId,
          type: "total",
          latency: metrics.moderation.latency + metrics.moderation.duration,
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
        requests: metrics.usage.totalModerations,
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
