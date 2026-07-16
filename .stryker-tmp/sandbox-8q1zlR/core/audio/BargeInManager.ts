/**
 * Barge-In Manager
 *
 * Responsibilities:
 * - Interrupt audio playback when user starts speaking
 * - Notify Runtime
 * - Notify Provider via existing abstractions
 * - Resume pipeline correctly
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY barge-in management
 */
// @ts-nocheck


import { BargeInConfiguration } from "./VADConfiguration";
import { AudioOutputAdapter } from "./AudioOutputAdapter";
import { RuntimeEvent } from "../providers/runtime/RuntimeEngine";

// ============================================================================
// BARGE-IN STATE
// ============================================================================

export type BargeInState =
  | "Idle"
  | "Monitoring"
  | "Interrupting"
  | "Interrupted"
  | "Resuming";

// ============================================================================
// BARGE-IN EVENTS
// ============================================================================

export type BargeInEvent =
  | "BargeInMonitoring"
  | "BargeInInterrupting"
  | "BargeInInterrupted"
  | "BargeInResuming"
  | "BargeInResumed"
  | "BargeInError"
  | "BargeInCooldown";

// ============================================================================
// BARGE-IN MANAGER INTERFACE
// ============================================================================

export interface BargeInManager {
  startMonitoring(audioOutputAdapter: AudioOutputAdapter): void;
  stopMonitoring(): void;
  triggerInterruption(): Promise<void>;
  resumePlayback(): Promise<void>;
  getState(): BargeInState;
  getInterruptionCount(): number;
  subscribeToEvents(callback: (event: BargeInEvent, metadata?: Record<string, unknown>) => void): void;
}

// ============================================================================
// BARGE-IN MANAGER IMPLEMENTATION
// ============================================================================

export class BargeInManagerImpl implements BargeInManager {
  private config: BargeInConfiguration;
  private state: BargeInState = "Idle";
  private audioOutputAdapter: AudioOutputAdapter | null = null;
  private interruptionCount: number = 0;
  private lastInterruptionTime: number = 0;
  private eventCallbacks: Array<(event: BargeInEvent, metadata?: Record<string, unknown>) => void> = [];
  private interruptionTimer: NodeJS.Timeout | null = null;

  constructor(config: BargeInConfiguration) {
    this.config = config;
  }

  startMonitoring(audioOutputAdapter: AudioOutputAdapter): void {
    this.audioOutputAdapter = audioOutputAdapter;
    this.state = "Monitoring";
    this.emitEvent("BargeInMonitoring");
  }

  stopMonitoring(): void {
    this.state = "Idle";
    this.audioOutputAdapter = null;
    
    if (this.interruptionTimer) {
      clearTimeout(this.interruptionTimer);
      this.interruptionTimer = null;
    }
  }

  async triggerInterruption(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    // Check cooldown
    const now = Date.now();
    if (now - this.lastInterruptionTime < this.config.interruptionCooldown) {
      this.emitEvent("BargeInCooldown", { remaining: this.config.interruptionCooldown - (now - this.lastInterruptionTime) });
      return;
    }

    // Check max interruptions
    if (this.interruptionCount >= this.config.maxInterruptions) {
      this.emitEvent("BargeInError", { message: "Max interruptions reached" });
      return;
    }

    this.state = "Interrupting";
    this.emitEvent("BargeInInterrupting");

    // Wait for interruption delay
    await new Promise(resolve => setTimeout(resolve, this.config.interruptionDelay));

    // Pause audio output
    if (this.audioOutputAdapter) {
      await this.audioOutputAdapter.pausePlayback();
    }

    this.state = "Interrupted";
    this.interruptionCount++;
    this.lastInterruptionTime = now;
    this.emitEvent("BargeInInterrupted", { count: this.interruptionCount });
  }

  async resumePlayback(): Promise<void> {
    if (this.state !== "Interrupted") {
      return;
    }

    this.state = "Resuming";
    this.emitEvent("BargeInResuming");

    // Wait for resume delay
    await new Promise(resolve => setTimeout(resolve, this.config.resumeDelay));

    // Resume audio output
    if (this.audioOutputAdapter) {
      await this.audioOutputAdapter.resumePlayback();
    }

    this.state = "Monitoring";
    this.emitEvent("BargeInResumed");
  }

  getState(): BargeInState {
    return this.state;
  }

  getInterruptionCount(): number {
    return this.interruptionCount;
  }

  subscribeToEvents(callback: (event: BargeInEvent, metadata?: Record<string, unknown>) => void): void {
    this.eventCallbacks.push(callback);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private emitEvent(event: BargeInEvent, metadata?: Record<string, unknown>): void {
    this.eventCallbacks.forEach(callback => callback(event, metadata));
  }
}

// ============================================================================
// BARGE-IN EVENT TO RUNTIME EVENT MAPPER
// ============================================================================

export function mapBargeInEventToRuntimeEvent(event: BargeInEvent): RuntimeEvent {
  switch (event) {
    case "BargeInInterrupting":
    case "BargeInInterrupted":
      return "RuntimeShuttingDown";
    case "BargeInResuming":
    case "BargeInResumed":
      return "RuntimeStarted";
    case "BargeInError":
      return "RuntimeError";
    default:
      return "RuntimeStarted";
  }
}
