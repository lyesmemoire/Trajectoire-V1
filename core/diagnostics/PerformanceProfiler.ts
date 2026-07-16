/**
 * Performance Profiler
 *
 * Automatic timing measurement for component performance.
 * Pure chronometry, no business logic.
 */

import { ProcessingTimeTracker } from "./ProcessingTimeTracker";
import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";

export interface ComponentPerformance {
  component: string;
  averageTime: number;
  maxTime: number;
  minTime: number;
  sampleCount: number;
  lastSampleTimestamp: Date | null;
}

export interface PerformanceReport {
  components: ComponentPerformance[];
  totalSamples: number;
  averageComponentTime: number;
  slowestComponent: string;
  fastestComponent: string;
  timestamp: Date;
}

export class PerformanceProfiler {
  private processingTimeTracker: ProcessingTimeTracker;
  private eventRecorder: DiagnosticEventRecorder;

  constructor(processingTimeTracker: ProcessingTimeTracker, eventRecorder: DiagnosticEventRecorder) {
    this.processingTimeTracker = processingTimeTracker;
    this.eventRecorder = eventRecorder;
  }

  /**
   * Start profiling a component
   */
  startProfiling(component: string): void {
    this.processingTimeTracker.startTiming(component);
  }

  /**
   * Stop profiling a component
   */
  stopProfiling(component: string): void {
    this.processingTimeTracker.stopTiming(component);
  }

  /**
   * Profile a component operation automatically
   */
  async profileOperation<T>(component: string, operation: () => Promise<T> | T): Promise<T> {
    this.startProfiling(component);
    try {
      const result = await operation();
      return result;
    } finally {
      this.stopProfiling(component);
    }
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): PerformanceReport {
    const metrics = this.processingTimeTracker.getAllMetrics();
    const components: ComponentPerformance[] = [];

    let totalSamples = 0;
    let totalTime = 0;
    let slowestTime = 0;
    let fastestTime = Infinity;
    let slowestComponent = "";
    let fastestComponent = "";

    for (const [component, metric] of Object.entries(metrics)) {
      components.push({
        component,
        averageTime: metric.averageTime,
        maxTime: metric.maxTime,
        minTime: metric.minTime,
        sampleCount: metric.sampleCount,
        lastSampleTimestamp: metric.lastSampleTimestamp,
      });

      totalSamples += metric.sampleCount;
      totalTime += metric.averageTime * metric.sampleCount;

      if (metric.maxTime > slowestTime) {
        slowestTime = metric.maxTime;
        slowestComponent = component;
      }

      if (metric.minTime < fastestTime) {
        fastestTime = metric.minTime;
        fastestComponent = component;
      }
    }

    const averageComponentTime = totalSamples > 0 ? totalTime / totalSamples : 0;

    return {
      components: components.sort((a, b) => b.averageTime - a.averageTime),
      totalSamples,
      averageComponentTime,
      slowestComponent,
      fastestComponent,
      timestamp: new Date(),
    };
  }

  /**
   * Get formatted performance report
   */
  getFormattedReport(): string {
    const report = this.getPerformanceReport();
    const lines: string[] = [];

    lines.push("Performance Profile");
    lines.push(`Total Samples: ${report.totalSamples}`);
    lines.push(`Average Component Time: ${report.averageComponentTime.toFixed(2)}ms`);
    lines.push(`Slowest: ${report.slowestComponent || "N/A"}`);
    lines.push(`Fastest: ${report.fastestComponent || "N/A"}`);
    lines.push(``);

    for (const component of report.components) {
      lines.push(`${component.component}`);
      lines.push(`  ${component.averageTime.toFixed(1)}ms (avg)`);
      lines.push(`  ${component.maxTime.toFixed(1)}ms (max)`);
      lines.push(`  ${component.minTime.toFixed(1)}ms (min)`);
      lines.push(`  ${component.sampleCount} samples`);
      lines.push(``);
    }

    return lines.join('\n');
  }

  /**
   * Get performance comparison (before/after)
   */
  comparePerformance(before: PerformanceReport, after: PerformanceReport): {
    improved: string[];
    degraded: string[];
    unchanged: string[];
  } {
    const improved: string[] = [];
    const degraded: string[] = [];
    const unchanged: string[] = [];

    const beforeMap = new Map(before.components.map(c => [c.component, c]));
    const afterMap = new Map(after.components.map(c => [c.component, c]));

    for (const [component, afterMetric] of afterMap) {
      const beforeMetric = beforeMap.get(component);

      if (!beforeMetric) {
        unchanged.push(component);
        continue;
      }

      const diff = afterMetric.averageTime - beforeMetric.averageTime;
      const percentChange = (diff / beforeMetric.averageTime) * 100;

      if (Math.abs(percentChange) < 5) {
        unchanged.push(component);
      } else if (diff < 0) {
        improved.push(`${component} (${percentChange.toFixed(1)}% faster)`);
      } else {
        degraded.push(`${component} (${percentChange.toFixed(1)}% slower)`);
      }
    }

    return { improved, degraded, unchanged };
  }

  /**
   * Reset profiling data
   */
  resetProfiling(): void {
    this.processingTimeTracker.resetAllMetrics();

    this.eventRecorder.recordEvent("runtime", "performance_profiling_reset", {
      timestamp: new Date(),
    });
  }

  /**
   * Reset profiling data for a specific component
   */
  resetComponentProfiling(component: string): void {
    this.processingTimeTracker.resetComponentMetrics(component);

    this.eventRecorder.recordEvent("runtime", "component_profiling_reset", {
      component,
      timestamp: new Date(),
    });
  }
}
