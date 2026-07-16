/**
 * Barge-In Orchestrator
 *
 * Responsibilities:
 * - Synchronize VAD with Barge-In Manager
 * - Synchronize Barge-In Manager with Audio Interruption Controller
 * - Synchronize with Runtime events
 * - Coordinate barge-in pipeline
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY barge-in orchestration
 */

import { VADAndBargeInConfiguration } from "./VADConfiguration";
import { VoiceActivityDetector, VADEvent, VoiceActivityDetectorImpl } from "./VoiceActivityDetector";
import { BargeInManager, BargeInEvent, BargeInManagerImpl } from "./BargeInManager";
import { AudioInterruptionController, InterruptionControllerEvent, AudioInterruptionControllerImpl } from "./AudioInterruptionController";
import { AudioInputAdapter } from "./AudioInputAdapter";
import { AudioOutputAdapter } from "./AudioOutputAdapter";
import { AudioStreamingOrchestrator } from "../providers/runtime/AudioStreamingOrchestrator";
import { RuntimeEvent } from "../providers/runtime/RuntimeEngine";

// ============================================================================
// BARGE-IN ORCHESTRATOR STATE
// ============================================================================

export type BargeInOrchestratorState =
  | "Idle"
  | "Initializing"
  | "Monitoring"
  | "Interrupting"
  | "Resuming"
  | "Error";

// ============================================================================
// BARGE-IN ORCHESTRATOR EVENTS
// ============================================================================

export type BargeInOrchestratorEvent =
  | "BargeInOrchestratorInitializing"
  | "BargeInOrchestratorInitialized"
  | "BargeInOrchestratorMonitoring"
  | "BargeInOrchestratorInterrupting"
  | "BargeInOrchestratorInterrupted"
  | "BargeInOrchestratorResuming"
  | "BargeInOrchestratorResumed"
  | "BargeInOrchestratorError";

// ============================================================================
// BARGE-IN ORCHESTRATOR INTERFACE
// ============================================================================

export interface BargeInOrchestrator {
  startOrchestration(
    audioInputAdapter: AudioInputAdapter,
    audioOutputAdapter: AudioOutputAdapter,
    audioStreamingOrchestrator: AudioStreamingOrchestrator
  ): Promise<void>;
  stopOrchestration(): Promise<void>;
  getOrchestratorState(): BargeInOrchestratorState;
  subscribeToEvents(callback: (event: BargeInOrchestratorEvent, metadata?: Record<string, unknown>) => void): void;
}

// ============================================================================
// BARGE-IN ORCHESTRATOR IMPLEMENTATION
// ============================================================================

export class BargeInOrchestratorImpl implements BargeInOrchestrator {
  private config: VADAndBargeInConfiguration;
  private state: BargeInOrchestratorState = "Idle";
  private vad: VoiceActivityDetector;
  private bargeInManager: BargeInManager;
  private interruptionController: AudioInterruptionController;
  private eventCallbacks: Array<(event: BargeInOrchestratorEvent, metadata?: Record<string, unknown>) => void> = [];
  private vadInterval: NodeJS.Timeout | null = null;

  constructor(config: VADAndBargeInConfiguration) {
    this.config = config;
    this.vad = new VoiceActivityDetectorImpl(config.vad);
    this.bargeInManager = new BargeInManagerImpl(config.bargeIn);
    this.interruptionController = new AudioInterruptionControllerImpl();

    // Subscribe to VAD events
    this.vad.subscribeToEvents((event, metadata) => {
      this.handleVADEvent(event, metadata);
    });

    // Subscribe to Barge-In events
    this.bargeInManager.subscribeToEvents((event, metadata) => {
      this.handleBargeInEvent(event, metadata);
    });

    // Subscribe to Interruption Controller events
    this.interruptionController.subscribeToEvents((event, metadata) => {
      this.handleInterruptionControllerEvent(event, metadata);
    });
  }

  async startOrchestration(
    audioInputAdapter: AudioInputAdapter,
    audioOutputAdapter: AudioOutputAdapter,
    _audioStreamingOrchestrator: AudioStreamingOrchestrator
  ): Promise<void> {
    this.state = "Initializing";
    this.emitEvent("BargeInOrchestratorInitializing");

    try {
      // Start Barge-In Manager monitoring
      this.bargeInManager.startMonitoring(audioOutputAdapter);

      // Start Interruption Controller
      this.interruptionController.startControl(audioOutputAdapter);

      // Start VAD processing loop
      this.startVADProcessing(audioInputAdapter);

      this.state = "Monitoring";
      this.emitEvent("BargeInOrchestratorInitialized");
      this.emitEvent("BargeInOrchestratorMonitoring");

    } catch (error) {
      this.state = "Error";
      this.emitEvent("BargeInOrchestratorError", { error: error instanceof Error ? error.message : "Unknown error" });
      throw error;
    }
  }

  async stopOrchestration(): Promise<void> {
    this.state = "Idle";

    // Stop VAD processing
    if (this.vadInterval) {
      clearInterval(this.vadInterval);
      this.vadInterval = null;
    }

    // Stop Barge-In Manager
    this.bargeInManager.stopMonitoring();

    // Stop Interruption Controller
    this.interruptionController.stopControl();

    // Reset VAD
    this.vad.reset();
  }

  getOrchestratorState(): BargeInOrchestratorState {
    return this.state;
  }

  subscribeToEvents(callback: (event: BargeInOrchestratorEvent, metadata?: Record<string, unknown>) => void): void {
    this.eventCallbacks.push(callback);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private startVADProcessing(audioInputAdapter: AudioInputAdapter): void {
    this.vadInterval = setInterval(() => {
      if (this.state !== "Monitoring") {
        return;
      }

      // Get captured chunk from input adapter
      const chunk = audioInputAdapter.getCapturedChunk();
      if (chunk) {
        // Convert to Float32Array for VAD processing
        const float32Array = this.convertPCM16ToFloat32(chunk);
        this.vad.processAudioFrame(float32Array);
      }
    }, 10);
  }

  private convertPCM16ToFloat32(pcm16: Uint8Array): Float32Array {
    const int16Array = new Int16Array(pcm16.buffer);
    const float32Array = new Float32Array(int16Array.length);
    
    for (let i = 0; i < int16Array.length; i++) {
      // Convert int16 (-32768 to 32767) to float32 (-1 to 1)
      const sample = int16Array[i];
      float32Array[i] = sample < 0 ? sample / 0x8000 : sample / 0x7FFF;
    }

    return float32Array;
  }

  private handleVADEvent(event: VADEvent, _metadata?: Record<string, unknown>): void {
    // Map VAD events to orchestrator events
    switch (event) {
      case "VADSpeechStarted":
        // Trigger barge-in when speech is detected
        this.bargeInManager.triggerInterruption().catch(console.error);
        break;
    }
  }

  private handleBargeInEvent(event: BargeInEvent, metadata?: Record<string, unknown>): void {
    // Map Barge-In events to orchestrator events
    switch (event) {
      case "BargeInInterrupting":
        this.state = "Interrupting";
        this.emitEvent("BargeInOrchestratorInterrupting");
        break;
      case "BargeInInterrupted":
        this.state = "Interrupting";
        this.emitEvent("BargeInOrchestratorInterrupted", metadata);
        break;
      case "BargeInResuming":
        this.state = "Resuming";
        this.emitEvent("BargeInOrchestratorResuming");
        break;
      case "BargeInResumed":
        this.state = "Monitoring";
        this.emitEvent("BargeInOrchestratorResumed");
        break;
      case "BargeInError":
        this.state = "Error";
        this.emitEvent("BargeInOrchestratorError", metadata);
        break;
    }
  }

  private handleInterruptionControllerEvent(event: InterruptionControllerEvent, metadata?: Record<string, unknown>): void {
    // Map Interruption Controller events to orchestrator events
    switch (event) {
      case "InterruptionControllerError":
        this.state = "Error";
        this.emitEvent("BargeInOrchestratorError", metadata);
        break;
    }
  }

  private emitEvent(event: BargeInOrchestratorEvent, metadata?: Record<string, unknown>): void {
    this.eventCallbacks.forEach(callback => callback(event, metadata));
  }
}

// ============================================================================
// BARGE-IN ORCHESTRATOR EVENT TO RUNTIME EVENT MAPPER
// ============================================================================

export function mapBargeInOrchestratorEventToRuntimeEvent(event: BargeInOrchestratorEvent): RuntimeEvent {
  switch (event) {
    case "BargeInOrchestratorInterrupting":
    case "BargeInOrchestratorInterrupted":
      return "RuntimeShuttingDown";
    case "BargeInOrchestratorResuming":
    case "BargeInOrchestratorResumed":
      return "RuntimeStarted";
    case "BargeInOrchestratorError":
      return "RuntimeError";
    default:
      return "RuntimeStarted";
  }
}
