/**
 * Processing Time Tracker
 *
 * Passive tracker for component processing times.
 * Measures processing time without modifying system behavior.
 */

import { ProcessingTimeMetrics } from "./types";
import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";

export class ProcessingTimeTracker {
  private metrics: Map<string, ProcessingTimeMetrics>;
  private eventRecorder: DiagnosticEventRecorder;
  private activeTimers: Map<string, number>;

  constructor(eventRecorder: DiagnosticEventRecorder) {
    this.eventRecorder = eventRecorder;
    this.metrics = new Map();
    this.activeTimers = new Map();
  }

  /**
   * Start timing a component operation
   */
  startTiming(component: string): void {
    this.activeTimers.set(component, Date.now());

    this.eventRecorder.recordEvent("runtime", "timing_start", {
      component,
      timestamp: new Date(),
    });
  }

  /**
   * Stop timing a component operation
   */
  stopTiming(component: string): void {
    const startTime = this.activeTimers.get(component);
    if (!startTime) return;

    const duration = Date.now() - startTime;
    this.activeTimers.delete(component);

    this.recordSample(component, duration);

    this.eventRecorder.recordEvent("runtime", "timing_stop", {
      component,
      duration,
      timestamp: new Date(),
    });
  }

  /**
   * Record a timing sample
   */
  recordSample(component: string, duration: number): void {
    let metrics = this.metrics.get(component);

    if (!metrics) {
      metrics = {
        component,
        averageTime: duration,
        maxTime: duration,
        minTime: duration,
        sampleCount: 1,
        lastSampleTimestamp: new Date(),
      };
      this.metrics.set(component, metrics);
    } else {
      // Update running average
      const newAverage = (metrics.averageTime * metrics.sampleCount + duration) / (metrics.sampleCount + 1);
      metrics.averageTime = newAverage;
      metrics.maxTime = Math.max(metrics.maxTime, duration);
      metrics.minTime = Math.min(metrics.minTime, duration);
      metrics.sampleCount++;
      metrics.lastSampleTimestamp = new Date();
    }

    this.eventRecorder.recordEvent("runtime", "processing_time_sample", {
      component,
      duration,
      average: metrics.averageTime,
      max: metrics.maxTime,
      min: metrics.minTime,
      sampleCount: metrics.sampleCount,
    });
  }

  /**
   * Get metrics for a component
   */
  getMetrics(component: string): ProcessingTimeMetrics | null {
    const metrics = this.metrics.get(component);
    return metrics ? { ...metrics } : null;
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, ProcessingTimeMetrics> {
    const result: Record<string, ProcessingTimeMetrics> = {};
    for (const [component, metrics] of this.metrics.entries()) {
      result[component] = { ...metrics };
    }
    return result;
  }

  /**
   * Reset metrics for a component
   */
  resetComponentMetrics(component: string): void {
    this.metrics.delete(component);
    this.activeTimers.delete(component);

    this.eventRecorder.recordEvent("runtime", "processing_time_reset", {
      component,
      timestamp: new Date(),
    });
  }

  /**
   * Reset all metrics
   */
  resetAllMetrics(): void {
    this.metrics.clear();
    this.activeTimers.clear();

    this.eventRecorder.recordEvent("runtime", "all_processing_time_reset", {
      timestamp: new Date(),
    });
  }
}
