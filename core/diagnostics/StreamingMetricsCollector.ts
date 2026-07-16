/**
 * Streaming Metrics Collector
 *
 * Passive collector for Streaming metrics.
 * Observes Streaming state without modifying it.
 */

import { StreamingMetrics } from "./types";
import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";

export class StreamingMetricsCollector {
  private metrics: StreamingMetrics;
  private eventRecorder: DiagnosticEventRecorder;
  private startTime: Date | null = null;
  private bytesSent: number = 0;
  private bytesReceived: number = 0;

  constructor(eventRecorder: DiagnosticEventRecorder) {
    this.eventRecorder = eventRecorder;
    this.metrics = {
      totalChunks: 0,
      chunksSent: 0,
      chunksReceived: 0,
      chunksPerSecond: 0,
      bytesPerSecond: 0,
      lastChunkTimestamp: null,
    };
  }

  /**
   * Record chunk sent
   */
  recordChunkSent(size: number): void {
    this.metrics.chunksSent++;
    this.metrics.totalChunks++;
    this.bytesSent += size;
    this.metrics.lastChunkTimestamp = new Date();

    if (!this.startTime) {
      this.startTime = new Date();
    }

    this.updateRates();

    this.eventRecorder.recordEvent("streaming", "chunk_sent", {
      size,
      totalSent: this.metrics.chunksSent,
      timestamp: this.metrics.lastChunkTimestamp,
    });
  }

  /**
   * Record chunk received
   */
  recordChunkReceived(size: number): void {
    this.metrics.chunksReceived++;
    this.metrics.totalChunks++;
    this.bytesReceived += size;
    this.metrics.lastChunkTimestamp = new Date();

    if (!this.startTime) {
      this.startTime = new Date();
    }

    this.updateRates();

    this.eventRecorder.recordEvent("streaming", "chunk_received", {
      size,
      totalReceived: this.metrics.chunksReceived,
      timestamp: this.metrics.lastChunkTimestamp,
    });
  }

  /**
   * Update rates
   */
  private updateRates(): void {
    if (!this.startTime) return;

    const elapsedSeconds = (Date.now() - this.startTime.getTime()) / 1000;
    if (elapsedSeconds > 0) {
      this.metrics.chunksPerSecond = this.metrics.totalChunks / elapsedSeconds;
      this.metrics.bytesPerSecond = (this.bytesSent + this.bytesReceived) / elapsedSeconds;
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): StreamingMetrics {
    this.updateRates();
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.startTime = null;
    this.bytesSent = 0;
    this.bytesReceived = 0;
    this.metrics = {
      totalChunks: 0,
      chunksSent: 0,
      chunksReceived: 0,
      chunksPerSecond: 0,
      bytesPerSecond: 0,
      lastChunkTimestamp: null,
    };

    this.eventRecorder.recordEvent("streaming", "metrics_reset", {
      timestamp: new Date(),
    });
  }
}
