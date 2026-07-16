/**
 * Audio Interruption Controller
 *
 * Responsibilities:
 * - Pause playback
 * - Resume playback
 * - Stop playback
 * - Cleanup resources
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY audio interruption control
 */
// @ts-nocheck


import { AudioOutputAdapter } from "./AudioOutputAdapter";

// ============================================================================
// INTERRUPTION CONTROLLER STATE
// ============================================================================

export type InterruptionControllerState =
  | "Idle"
  | "Controlling"
  | "Paused"
  | "Stopped";

// ============================================================================
// INTERRUPTION CONTROLLER EVENTS
// ============================================================================

export type InterruptionControllerEvent =
  | "InterruptionControllerControlling"
  | "InterruptionControllerPaused"
  | "InterruptionControllerResumed"
  | "InterruptionControllerStopped"
  | "InterruptionControllerError";

// ============================================================================
// INTERRUPTION CONTROLLER INTERFACE
// ============================================================================

export interface AudioInterruptionController {
  startControl(audioOutputAdapter: AudioOutputAdapter): void;
  stopControl(): void;
  pausePlayback(): Promise<void>;
  resumePlayback(): Promise<void>;
  stopPlayback(): Promise<void>;
  getState(): InterruptionControllerState;
  subscribeToEvents(callback: (event: InterruptionControllerEvent, metadata?: Record<string, unknown>) => void): void;
}

// ============================================================================
// INTERRUPTION CONTROLLER IMPLEMENTATION
// ============================================================================

export class AudioInterruptionControllerImpl implements AudioInterruptionController {
  private state: InterruptionControllerState = "Idle";
  private audioOutputAdapter: AudioOutputAdapter | null = null;
  private eventCallbacks: Array<(event: InterruptionControllerEvent, metadata?: Record<string, unknown>) => void> = [];

  startControl(audioOutputAdapter: AudioOutputAdapter): void {
    this.audioOutputAdapter = audioOutputAdapter;
    this.state = "Controlling";
    this.emitEvent("InterruptionControllerControlling");
  }

  stopControl(): void {
    this.state = "Idle";
    this.audioOutputAdapter = null;
  }

  async pausePlayback(): Promise<void> {
    if (!this.audioOutputAdapter) {
      this.emitEvent("InterruptionControllerError", { message: "No audio output adapter" });
      return;
    }

    try {
      await this.audioOutputAdapter.pausePlayback();
      this.state = "Paused";
      this.emitEvent("InterruptionControllerPaused");
    } catch (error) {
      this.emitEvent("InterruptionControllerError", { error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  async resumePlayback(): Promise<void> {
    if (!this.audioOutputAdapter) {
      this.emitEvent("InterruptionControllerError", { message: "No audio output adapter" });
      return;
    }

    try {
      await this.audioOutputAdapter.resumePlayback();
      this.state = "Controlling";
      this.emitEvent("InterruptionControllerResumed");
    } catch (error) {
      this.emitEvent("InterruptionControllerError", { error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  async stopPlayback(): Promise<void> {
    if (!this.audioOutputAdapter) {
      this.emitEvent("InterruptionControllerError", { message: "No audio output adapter" });
      return;
    }

    try {
      await this.audioOutputAdapter.stopPlayback();
      this.state = "Stopped";
      this.emitEvent("InterruptionControllerStopped");
    } catch (error) {
      this.emitEvent("InterruptionControllerError", { error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  getState(): InterruptionControllerState {
    return this.state;
  }

  subscribeToEvents(callback: (event: InterruptionControllerEvent, metadata?: Record<string, unknown>) => void): void {
    this.eventCallbacks.push(callback);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private emitEvent(event: InterruptionControllerEvent, metadata?: Record<string, unknown>): void {
    this.eventCallbacks.forEach(callback => callback(event, metadata));
  }
}
