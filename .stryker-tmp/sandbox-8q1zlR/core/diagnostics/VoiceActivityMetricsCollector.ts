/**
 * Voice Activity Metrics Collector
 *
 * Passive collector for Voice Activity Detection metrics.
 * Observes VAD and Barge-In state without modifying it.
 */
// @ts-nocheck


import { VoiceActivityMetrics } from "./types";
import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";

export class VoiceActivityMetricsCollector {
  private metrics: VoiceActivityMetrics;
  private eventRecorder: DiagnosticEventRecorder;
  private speakingStartTime: Date | null = null;
  private silenceStartTime: Date | null = null;

  constructor(eventRecorder: DiagnosticEventRecorder) {
    this.eventRecorder = eventRecorder;
    this.metrics = {
      vadState: "unknown",
      bargeInState: "idle",
      interruptionCount: 0,
      lastInterruptionTimestamp: null,
      silenceDuration: 0,
      speakingDuration: 0,
    };
  }

  /**
   * Update VAD state
   */
  updateVADState(state: VoiceActivityMetrics["vadState"]): void {
    const previousState = this.metrics.vadState;
    this.metrics.vadState = state;

    // Track durations
    if (state === "speaking" && previousState !== "speaking") {
      this.speakingStartTime = new Date();
      if (this.silenceStartTime) {
        this.metrics.silenceDuration += Date.now() - this.silenceStartTime.getTime();
        this.silenceStartTime = null;
      }
    } else if (state === "silence" && previousState !== "silence") {
      this.silenceStartTime = new Date();
      if (this.speakingStartTime) {
        this.metrics.speakingDuration += Date.now() - this.speakingStartTime.getTime();
        this.speakingStartTime = null;
      }
    }

    this.eventRecorder.recordEvent("audio", "vad_state_change", {
      from: previousState,
      to: state,
      timestamp: new Date(),
    });
  }

  /**
   * Update Barge-In state
   */
  updateBargeInState(state: VoiceActivityMetrics["bargeInState"]): void {
    const previousState = this.metrics.bargeInState;
    this.metrics.bargeInState = state;

    if (state === "interrupted" && previousState !== "interrupted") {
      this.metrics.interruptionCount++;
      this.metrics.lastInterruptionTimestamp = new Date();
    }

    this.eventRecorder.recordEvent("audio", "barge_in_state_change", {
      from: previousState,
      to: state,
      timestamp: new Date(),
    });
  }

  /**
   * Get current metrics
   */
  getMetrics(): VoiceActivityMetrics {
    // Update ongoing durations
    if (this.speakingStartTime) {
      this.metrics.speakingDuration += Date.now() - this.speakingStartTime.getTime();
      this.speakingStartTime = new Date();
    }
    if (this.silenceStartTime) {
      this.metrics.silenceDuration += Date.now() - this.silenceStartTime.getTime();
      this.silenceStartTime = new Date();
    }

    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.speakingStartTime = null;
    this.silenceStartTime = null;
    this.metrics = {
      vadState: "unknown",
      bargeInState: "idle",
      interruptionCount: 0,
      lastInterruptionTimestamp: null,
      silenceDuration: 0,
      speakingDuration: 0,
    };

    this.eventRecorder.recordEvent("audio", "voice_activity_metrics_reset", {
      timestamp: new Date(),
    });
  }
}
