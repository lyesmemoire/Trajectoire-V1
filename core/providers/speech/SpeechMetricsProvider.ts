/**
 * Speech-To-Text Metrics Provider
 * 
 * Responsibilities:
 * - Implement ProviderMetricsProvider interface for Speech-to-Text
 * - Collect metrics from Speech-to-Text
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY metrics collection
 */

import {
  ProviderMetricsProvider,
  ProviderMetrics,
  ProviderMetricsCapabilities
} from "../ProviderAbstractionLayer";

// ============================================================================
// SPEECH METRICS COLLECTOR
// ============================================================================

export interface SpeechMetricsCollector {
  collectMetrics(sessionId: string): {
    latency: {
      audio: number;
      transcript: number;
      total: number;
    };
    usage: {
      audioDuration: number;
      transcriptLength: number;
      language: string;
    };
  };
}

// ============================================================================
// SPEECH METRICS PROVIDER IMPLEMENTATION
// ============================================================================

export class SpeechMetricsProviderImpl implements ProviderMetricsProvider {
  private metricsCollector: SpeechMetricsCollector;

  constructor(metricsCollector: SpeechMetricsCollector) {
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
          latency: metrics.latency.audio,
          timestamp: Date.now(),
          metadata: {}
        },
        {
          providerId,
          type: "response",
          latency: metrics.latency.transcript,
          timestamp: Date.now(),
          metadata: {}
        },
        {
          providerId,
          type: "total",
          latency: metrics.latency.total,
          timestamp: Date.now(),
          metadata: {}
        }
      ],
      cost: [
        {
          providerId,
          cost: 0,
          tokens: metrics.usage.transcriptLength,
          timestamp: Date.now(),
          metadata: {}
        }
      ],
      usage: {
        providerId,
        requests: 0,
        tokens: metrics.usage.transcriptLength,
        cost: 0,
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
