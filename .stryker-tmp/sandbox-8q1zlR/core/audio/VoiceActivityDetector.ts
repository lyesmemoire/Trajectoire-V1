/**
 * Voice Activity Detector
 *
 * Responsibilities:
 * - Detect speech start
 * - Detect speech end
 * - Detect silence
 * - Publish Runtime events
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY voice activity detection
 */
// @ts-nocheck


import { VADConfiguration } from "./VADConfiguration";
import { RuntimeEvent } from "../providers/runtime/RuntimeEngine";

// ============================================================================
// VAD STATE
// ============================================================================

export type VADState =
  | "Idle"
  | "Listening"
  | "SpeechDetected"
  | "SilenceDetected";

// ============================================================================
// VAD EVENTS
// ============================================================================

export type VADEvent =
  | "VADListening"
  | "VADSpeechStarted"
  | "VADSpeechEnded"
  | "VADSilenceDetected"
  | "VADError";

// ============================================================================
// VAD INTERFACE
// ============================================================================

export interface VoiceActivityDetector {
  processAudioFrame(frame: Float32Array): void;
  getState(): VADState;
  getSpeechLevel(): number;
  reset(): void;
  subscribeToEvents(callback: (event: VADEvent, metadata?: Record<string, unknown>) => void): void;
}

// ============================================================================
// VAD IMPLEMENTATION
// ============================================================================

export class VoiceActivityDetectorImpl implements VoiceActivityDetector {
  private config: VADConfiguration;
  private state: VADState = "Idle";
  private speechLevel: number = 0;
  private speechStartTime: number = 0;
  private silenceStartTime: number = 0;
  private eventCallbacks: Array<(event: VADEvent, metadata?: Record<string, unknown>) => void> = [];

  constructor(config: VADConfiguration) {
    this.config = config;
  }

  processAudioFrame(frame: Float32Array): void {
    if (this.state === "Idle") {
      this.state = "Listening";
      this.emitEvent("VADListening");
    }

    // Calculate RMS (Root Mean Square) of the frame
    const rms = this.calculateRMS(frame);
    this.speechLevel = rms;

    // Check if speech is detected
    if (rms > this.config.speechThreshold) {
      if (this.state !== "SpeechDetected") {
        this.state = "SpeechDetected";
        this.speechStartTime = Date.now();
        this.emitEvent("VADSpeechStarted", { level: rms });
      }
    } else if (rms < this.config.silenceThreshold) {
      if (this.state === "SpeechDetected") {
        const speechDuration = Date.now() - this.speechStartTime;
        
        if (speechDuration >= this.config.minSpeechDuration) {
          this.state = "SilenceDetected";
          this.silenceStartTime = Date.now();
          this.emitEvent("VADSpeechEnded", { duration: speechDuration });
        }
      } else if (this.state === "SilenceDetected") {
        const silenceDuration = Date.now() - this.silenceStartTime;
        
        if (silenceDuration >= this.config.silenceDuration) {
          this.emitEvent("VADSilenceDetected", { duration: silenceDuration });
          this.state = "Listening";
        }
      }
    }
  }

  getState(): VADState {
    return this.state;
  }

  getSpeechLevel(): number {
    return this.speechLevel;
  }

  reset(): void {
    this.state = "Idle";
    this.speechLevel = 0;
    this.speechStartTime = 0;
    this.silenceStartTime = 0;
  }

  subscribeToEvents(callback: (event: VADEvent, metadata?: Record<string, unknown>) => void): void {
    this.eventCallbacks.push(callback);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private calculateRMS(frame: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < frame.length; i++) {
      sum += frame[i] * frame[i];
    }
    return Math.sqrt(sum / frame.length);
  }

  private emitEvent(event: VADEvent, metadata?: Record<string, unknown>): void {
    this.eventCallbacks.forEach(callback => callback(event, metadata));
  }
}

// ============================================================================
// VAD EVENT TO RUNTIME EVENT MAPPER
// ============================================================================

export function mapVADEventToRuntimeEvent(event: VADEvent): RuntimeEvent {
  switch (event) {
    case "VADSpeechStarted":
      return "RuntimeStarted";
    case "VADSpeechEnded":
    case "VADSilenceDetected":
      return "RuntimeShuttingDown";
    case "VADError":
      return "RuntimeError";
    default:
      return "RuntimeStarted";
  }
}
