/**
 * Runtime Metrics Collector
 *
 * Passive collector for Runtime metrics.
 * Observes Runtime state without modifying it.
 */

import { RuntimeMetrics } from "./types";
import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";

export class RuntimeMetricsCollector {
  private metrics: RuntimeMetrics;
  private startTime: Date;
  private eventRecorder: DiagnosticEventRecorder;

  constructor(eventRecorder: DiagnosticEventRecorder) {
    this.startTime = new Date();
    this.eventRecorder = eventRecorder;
    this.metrics = {
      currentState: "Idle",
      previousState: "Idle",
      uptime: 0,
      transitionCount: 0,
      stateMachineState: "Idle",
      lastTransitionTimestamp: new Date(),
    };
  }

  /**
   * Update current state
   */
  updateState(newState: string): void {
    this.metrics.previousState = this.metrics.currentState;
    this.metrics.currentState = newState;
    this.metrics.transitionCount++;
    this.metrics.lastTransitionTimestamp = new Date();
    this.metrics.uptime = Date.now() - this.startTime.getTime();

    this.eventRecorder.recordEvent("runtime", "state_change", {
      from: this.metrics.previousState,
      to: newState,
      timestamp: this.metrics.lastTransitionTimestamp,
    });
  }

  /**
   * Update state machine state
   */
  updateStateMachineState(state: string): void {
    this.metrics.stateMachineState = state;

    this.eventRecorder.recordEvent("runtime", "state_machine_change", {
      state,
      timestamp: new Date(),
    });
  }

  /**
   * Get current metrics
   */
  getMetrics(): RuntimeMetrics {
    return {
      ...this.metrics,
      uptime: Date.now() - this.startTime.getTime(),
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.startTime = new Date();
    this.metrics = {
      currentState: "Idle",
      previousState: "Idle",
      uptime: 0,
      transitionCount: 0,
      stateMachineState: "Idle",
      lastTransitionTimestamp: new Date(),
    };

    this.eventRecorder.recordEvent("runtime", "metrics_reset", {
      timestamp: new Date(),
    });
  }
}
