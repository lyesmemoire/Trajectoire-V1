/**
 * Provider Metrics Collector
 *
 * Passive collector for Provider metrics.
 * Observes Provider state without modifying it.
 */
// @ts-nocheck


import { ProviderMetrics } from "./types";
import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";

export class ProviderMetricsCollector {
  private metrics: ProviderMetrics;
  private eventRecorder: DiagnosticEventRecorder;

  constructor(eventRecorder: DiagnosticEventRecorder) {
    this.eventRecorder = eventRecorder;
    this.metrics = {
      activeProvider: null,
      providerState: "Idle",
      connectionState: "disconnected",
      reconnectionCount: 0,
      heartbeatActive: false,
      lastHeartbeatTimestamp: null,
      errorCount: 0,
      lastErrorTimestamp: null,
      lastErrorMessage: null,
    };
  }

  /**
   * Update active provider
   */
  updateActiveProvider(provider: string | null): void {
    this.metrics.activeProvider = provider;

    this.eventRecorder.recordEvent("provider", "active_provider_change", {
      provider,
      timestamp: new Date(),
    });
  }

  /**
   * Update provider state
   */
  updateProviderState(state: string): void {
    this.metrics.providerState = state;

    this.eventRecorder.recordEvent("provider", "provider_state_change", {
      state,
      timestamp: new Date(),
    });
  }

  /**
   * Update connection state
   */
  updateConnectionState(state: ProviderMetrics["connectionState"]): void {
    const previousState = this.metrics.connectionState;
    this.metrics.connectionState = state;

    if (state === "connected" && previousState !== "connected") {
      this.metrics.reconnectionCount++;
    }

    this.eventRecorder.recordEvent("provider", "connection_state_change", {
      from: previousState,
      to: state,
      timestamp: new Date(),
    });
  }

  /**
   * Record heartbeat
   */
  recordHeartbeat(): void {
    this.metrics.heartbeatActive = true;
    this.metrics.lastHeartbeatTimestamp = new Date();

    this.eventRecorder.recordEvent("provider", "heartbeat", {
      timestamp: this.metrics.lastHeartbeatTimestamp,
    });
  }

  /**
   * Record error
   */
  recordError(message: string): void {
    this.metrics.errorCount++;
    this.metrics.lastErrorTimestamp = new Date();
    this.metrics.lastErrorMessage = message;

    this.eventRecorder.recordEvent("provider", "error", {
      message,
      timestamp: this.metrics.lastErrorTimestamp,
      errorCount: this.metrics.errorCount,
    });
  }

  /**
   * Get current metrics
   */
  getMetrics(): ProviderMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      activeProvider: null,
      providerState: "Idle",
      connectionState: "disconnected",
      reconnectionCount: 0,
      heartbeatActive: false,
      lastHeartbeatTimestamp: null,
      errorCount: 0,
      lastErrorTimestamp: null,
      lastErrorMessage: null,
    };

    this.eventRecorder.recordEvent("provider", "metrics_reset", {
      timestamp: new Date(),
    });
  }
}
