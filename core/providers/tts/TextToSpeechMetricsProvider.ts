/**
 * Text-To-Speech Metrics Provider
 *
 * Responsibilities:
 * - Implement ProviderMetricsProvider interface for Text-to-Speech
 * - Collect metrics from Text-to-Speech
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY metrics collection
 */

import {
  ProviderMetricsProvider,
  ProviderMetrics,
  ProviderMetricsCapabilities
} from "../ProviderAbstractionLayer";

// ============================================================================
// TTS METRICS COLLECTOR
// ============================================================================

export interface TTSMetricsCollector {
  collectMetrics(sessionId: string): {
    synthesis: {
      latency: number;
      duration: number;
      textLength: number;
    };
    streaming: {
      chunksGenerated: number;
      chunksPlayed: number;
      bytesGenerated: number;
      bytesPlayed: number;
    };
    playback: {
      duration: number;
      position: number;
      volume: number;
    };
  };
}

// ============================================================================
// TEXT-TO-SPEECH METRICS PROVIDER IMPLEMENTATION
// ============================================================================

export class TextToSpeechMetricsProviderImpl implements ProviderMetricsProvider {
  private metricsCollector: TTSMetricsCollector;

  constructor(metricsCollector: TTSMetricsCollector) {
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
          latency: metrics.synthesis.latency,
          timestamp: Date.now(),
          metadata: {}
        },
        {
          providerId,
          type: "response",
          latency: metrics.synthesis.duration,
          timestamp: Date.now(),
          metadata: {}
        },
        {
          providerId,
          type: "total",
          latency: metrics.synthesis.latency + metrics.synthesis.duration,
          timestamp: Date.now(),
          metadata: {}
        }
      ],
      cost: [
        {
          providerId,
          cost: 0,
          tokens: metrics.synthesis.textLength,
          timestamp: Date.now(),
          metadata: {}
        }
      ],
      usage: {
        providerId,
        requests: metrics.streaming.chunksGenerated,
        tokens: metrics.synthesis.textLength,
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
