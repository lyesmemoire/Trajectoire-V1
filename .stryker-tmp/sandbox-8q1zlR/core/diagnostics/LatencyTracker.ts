/**
 * Latency Tracker
 *
 * Passive tracker for latency measurements.
 * Measures end-to-end latency without modifying system behavior.
 */
// @ts-nocheck


import { LatencyMetrics } from "./types";
import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";

export class LatencyTracker {
  private metrics: LatencyMetrics;
  private eventRecorder: DiagnosticEventRecorder;
  private latencyHistory: number[] = [];
  private maxHistorySize: number = 1000;

  // Timestamps for tracking
  private microphoneTimestamp: number | null = null;
  private providerTimestamp: number | null = null;
  private firstTokenTimestamp: number | null = null;
  private firstAudioTimestamp: number | null = null;

  constructor(eventRecorder: DiagnosticEventRecorder) {
    this.eventRecorder = eventRecorder;
    this.metrics = {
      microphoneToProvider: 0,
      providerToFirstToken: 0,
      firstTokenToFirstAudio: 0,
      totalResponseTime: 0,
      averageLatency: 0,
      maxLatency: 0,
      minLatency: Infinity,
    };
  }

  /**
   * Mark microphone input
   */
  markMicrophoneInput(): void {
    this.microphoneTimestamp = Date.now();

    this.eventRecorder.recordEvent("runtime", "microphone_input", {
      timestamp: this.microphoneTimestamp,
    });
  }

  /**
   * Mark provider processing start
   */
  markProviderStart(): void {
    this.providerTimestamp = Date.now();

    if (this.microphoneTimestamp) {
      this.metrics.microphoneToProvider = this.providerTimestamp - this.microphoneTimestamp;
    }

    this.eventRecorder.recordEvent("provider", "provider_start", {
      timestamp: this.providerTimestamp,
      microphoneToProvider: this.metrics.microphoneToProvider,
    });
  }

  /**
   * Mark first token received
   */
  markFirstToken(): void {
    this.firstTokenTimestamp = Date.now();

    if (this.providerTimestamp) {
      this.metrics.providerToFirstToken = this.firstTokenTimestamp - this.providerTimestamp;
    }

    this.eventRecorder.recordEvent("provider", "first_token", {
      timestamp: this.firstTokenTimestamp,
      providerToFirstToken: this.metrics.providerToFirstToken,
    });
  }

  /**
   * Mark first audio output
   */
  markFirstAudio(): void {
    this.firstAudioTimestamp = Date.now();

    if (this.firstTokenTimestamp) {
      this.metrics.firstTokenToFirstAudio = this.firstAudioTimestamp - this.firstTokenTimestamp;
    }

    if (this.microphoneTimestamp) {
      this.metrics.totalResponseTime = this.firstAudioTimestamp - this.microphoneTimestamp;
      this.recordLatency(this.metrics.totalResponseTime);
    }

    this.eventRecorder.recordEvent("audio", "first_audio", {
      timestamp: this.firstAudioTimestamp,
      firstTokenToFirstAudio: this.metrics.firstTokenToFirstAudio,
      totalResponseTime: this.metrics.totalResponseTime,
    });
  }

  /**
   * Record latency sample
   */
  private recordLatency(latency: number): void {
    this.latencyHistory.push(latency);

    // Maintain max history size
    if (this.latencyHistory.length > this.maxHistorySize) {
      this.latencyHistory.shift();
    }

    // Update statistics
    this.updateStatistics();

    this.eventRecorder.recordEvent("runtime", "latency_sample", {
      latency,
      average: this.metrics.averageLatency,
      max: this.metrics.maxLatency,
      min: this.metrics.minLatency,
    });
  }

  /**
   * Update statistics
   */
  private updateStatistics(): void {
    if (this.latencyHistory.length === 0) return;

    const sum = this.latencyHistory.reduce((a, b) => a + b, 0);
    this.metrics.averageLatency = sum / this.latencyHistory.length;
    this.metrics.maxLatency = Math.max(...this.latencyHistory);
    this.metrics.minLatency = Math.min(...this.latencyHistory);
  }

  /**
   * Get current metrics
   */
  getMetrics(): LatencyMetrics {
    return { ...this.metrics };
  }

  /**
   * Get latency history
   */
  getLatencyHistory(): number[] {
    return [...this.latencyHistory];
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.microphoneTimestamp = null;
    this.providerTimestamp = null;
    this.firstTokenTimestamp = null;
    this.firstAudioTimestamp = null;
    this.latencyHistory = [];
    this.metrics = {
      microphoneToProvider: 0,
      providerToFirstToken: 0,
      firstTokenToFirstAudio: 0,
      totalResponseTime: 0,
      averageLatency: 0,
      maxLatency: 0,
      minLatency: Infinity,
    };

    this.eventRecorder.recordEvent("runtime", "latency_metrics_reset", {
      timestamp: new Date(),
    });
  }
}
