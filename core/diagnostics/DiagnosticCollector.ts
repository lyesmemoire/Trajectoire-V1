/**
 * Diagnostic Collector
 *
 * Main aggregator for all diagnostic collectors.
 * Passive observation only, no business logic.
 */

import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";
import { RuntimeMetricsCollector } from "./RuntimeMetricsCollector";
import { ProviderMetricsCollector } from "./ProviderMetricsCollector";
import { AudioMetricsCollector } from "./AudioMetricsCollector";
import { StreamingMetricsCollector } from "./StreamingMetricsCollector";
import { VoiceActivityMetricsCollector } from "./VoiceActivityMetricsCollector";
import { LatencyTracker } from "./LatencyTracker";
import { ProcessingTimeTracker } from "./ProcessingTimeTracker";
import { ConnectionStateTracker } from "./ConnectionStateTracker";
import { DiagnosticTimelineBuilder } from "./DiagnosticTimelineBuilder";
import { DiagnosticHealthChecker } from "./DiagnosticHealthChecker";
import { PerformanceProfiler } from "./PerformanceProfiler";
import { CorrelationManager } from "./CorrelationManager";
import { EventTraceRecorder } from "./EventTraceRecorder";
import { DiagnosticDecorator } from "./DiagnosticDecorator";

export class DiagnosticCollector {
  private eventRecorder: DiagnosticEventRecorder;
  private runtimeMetrics: RuntimeMetricsCollector;
  private providerMetrics: ProviderMetricsCollector;
  private audioMetrics: AudioMetricsCollector;
  private streamingMetrics: StreamingMetricsCollector;
  private voiceActivityMetrics: VoiceActivityMetricsCollector;
  private latencyTracker: LatencyTracker;
  private processingTimeTracker: ProcessingTimeTracker;
  private connectionStateTracker: ConnectionStateTracker;
  private performanceProfiler: PerformanceProfiler;
  private correlationManager: CorrelationManager;
  private eventTraceRecorder: EventTraceRecorder;
  private diagnosticDecorator: DiagnosticDecorator;

  constructor() {
    this.eventRecorder = new DiagnosticEventRecorder();
    this.runtimeMetrics = new RuntimeMetricsCollector(this.eventRecorder);
    this.providerMetrics = new ProviderMetricsCollector(this.eventRecorder);
    this.audioMetrics = new AudioMetricsCollector(this.eventRecorder);
    this.streamingMetrics = new StreamingMetricsCollector(this.eventRecorder);
    this.voiceActivityMetrics = new VoiceActivityMetricsCollector(this.eventRecorder);
    this.latencyTracker = new LatencyTracker(this.eventRecorder);
    this.processingTimeTracker = new ProcessingTimeTracker(this.eventRecorder);
    this.connectionStateTracker = new ConnectionStateTracker(this.eventRecorder);
    this.performanceProfiler = new PerformanceProfiler(this.processingTimeTracker, this.eventRecorder);
    this.correlationManager = new CorrelationManager(this.eventRecorder);
    this.eventTraceRecorder = new EventTraceRecorder(this.eventRecorder, this.correlationManager);
    this.diagnosticDecorator = new DiagnosticDecorator(
      this.correlationManager,
      this.eventTraceRecorder,
      this.performanceProfiler
    );
  }

  /**
   * Get event recorder
   */
  getEventRecorder(): DiagnosticEventRecorder {
    return this.eventRecorder;
  }

  /**
   * Get runtime metrics collector
   */
  getRuntimeMetrics(): RuntimeMetricsCollector {
    return this.runtimeMetrics;
  }

  /**
   * Get provider metrics collector
   */
  getProviderMetrics(): ProviderMetricsCollector {
    return this.providerMetrics;
  }

  /**
   * Get audio metrics collector
   */
  getAudioMetrics(): AudioMetricsCollector {
    return this.audioMetrics;
  }

  /**
   * Get streaming metrics collector
   */
  getStreamingMetrics(): StreamingMetricsCollector {
    return this.streamingMetrics;
  }

  /**
   * Get voice activity metrics collector
   */
  getVoiceActivityMetrics(): VoiceActivityMetricsCollector {
    return this.voiceActivityMetrics;
  }

  /**
   * Get latency tracker
   */
  getLatencyTracker(): LatencyTracker {
    return this.latencyTracker;
  }

  /**
   * Get processing time tracker
   */
  getProcessingTimeTracker(): ProcessingTimeTracker {
    return this.processingTimeTracker;
  }

  /**
   * Get connection state tracker
   */
  getConnectionStateTracker(): ConnectionStateTracker {
    return this.connectionStateTracker;
  }

  /**
   * Get performance profiler
   */
  getPerformanceProfiler(): PerformanceProfiler {
    return this.performanceProfiler;
  }

  /**
   * Build timeline
   */
  buildTimeline() {
    return DiagnosticTimelineBuilder.buildTimeline(this.eventRecorder);
  }

  /**
   * Build formatted timeline
   */
  buildFormattedTimeline(): string {
    return DiagnosticTimelineBuilder.buildFormattedTimeline(this.eventRecorder);
  }

  /**
   * Check health
   */
  checkHealth() {
    return DiagnosticHealthChecker.checkHealth(this);
  }

  /**
   * Get health summary
   */
  getHealthSummary(): string {
    return DiagnosticHealthChecker.getHealthSummary(this);
  }

  /**
   * Get correlation manager
   */
  getCorrelationManager(): CorrelationManager {
    return this.correlationManager;
  }

  /**
   * Get event trace recorder
   */
  getEventTraceRecorder(): EventTraceRecorder {
    return this.eventTraceRecorder;
  }

  /**
   * Get diagnostic decorator
   */
  getDiagnosticDecorator(): DiagnosticDecorator {
    return this.diagnosticDecorator;
  }

  /**
   * Reset all metrics
   */
  resetAll(): void {
    this.eventRecorder.clearEvents();
    this.runtimeMetrics.resetMetrics();
    this.providerMetrics.resetMetrics();
    this.audioMetrics.resetMetrics();
    this.streamingMetrics.resetMetrics();
    this.voiceActivityMetrics.resetMetrics();
    this.latencyTracker.resetMetrics();
    this.processingTimeTracker.resetAllMetrics();
    this.connectionStateTracker.resetAllStates();
    this.correlationManager.reset();
    this.eventTraceRecorder.clearTraces();
  }
}
