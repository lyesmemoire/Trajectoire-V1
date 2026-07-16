/**
 * Audio Metrics Collector
 *
 * Passive collector for Audio metrics.
 * Observes Audio state without modifying it.
 */

import { AudioMetrics } from "./types";
import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";

export class AudioMetricsCollector {
  private metrics: AudioMetrics;
  private eventRecorder: DiagnosticEventRecorder;

  constructor(eventRecorder: DiagnosticEventRecorder) {
    this.eventRecorder = eventRecorder;
    this.metrics = {
      inputBufferSize: 0,
      outputBufferSize: 0,
      inputBufferMaxSize: 0,
      outputBufferMaxSize: 0,
      backpressure: false,
      overflowCount: 0,
      underflowCount: 0,
      lastOverflowTimestamp: null,
      lastUnderflowTimestamp: null,
    };
  }

  /**
   * Update input buffer size
   */
  updateInputBufferSize(size: number, maxSize: number): void {
    this.metrics.inputBufferSize = size;
    this.metrics.inputBufferMaxSize = maxSize;
    this.metrics.backpressure = size > maxSize * 0.8;

    this.eventRecorder.recordEvent("audio", "input_buffer_update", {
      size,
      maxSize,
      backpressure: this.metrics.backpressure,
      timestamp: new Date(),
    });
  }

  /**
   * Update output buffer size
   */
  updateOutputBufferSize(size: number, maxSize: number): void {
    this.metrics.outputBufferSize = size;
    this.metrics.outputBufferMaxSize = maxSize;
    this.metrics.backpressure = this.metrics.backpressure || size > maxSize * 0.8;

    this.eventRecorder.recordEvent("audio", "output_buffer_update", {
      size,
      maxSize,
      backpressure: this.metrics.backpressure,
      timestamp: new Date(),
    });
  }

  /**
   * Record overflow
   */
  recordOverflow(): void {
    this.metrics.overflowCount++;
    this.metrics.lastOverflowTimestamp = new Date();

    this.eventRecorder.recordEvent("audio", "buffer_overflow", {
      timestamp: this.metrics.lastOverflowTimestamp,
      overflowCount: this.metrics.overflowCount,
    });
  }

  /**
   * Record underflow
   */
  recordUnderflow(): void {
    this.metrics.underflowCount++;
    this.metrics.lastUnderflowTimestamp = new Date();

    this.eventRecorder.recordEvent("audio", "buffer_underflow", {
      timestamp: this.metrics.lastUnderflowTimestamp,
      underflowCount: this.metrics.underflowCount,
    });
  }

  /**
   * Get current metrics
   */
  getMetrics(): AudioMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      inputBufferSize: 0,
      outputBufferSize: 0,
      inputBufferMaxSize: 0,
      outputBufferMaxSize: 0,
      backpressure: false,
      overflowCount: 0,
      underflowCount: 0,
      lastOverflowTimestamp: null,
      lastUnderflowTimestamp: null,
    };

    this.eventRecorder.recordEvent("audio", "metrics_reset", {
      timestamp: new Date(),
    });
  }
}
