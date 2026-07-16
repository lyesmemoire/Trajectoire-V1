/**
 * Runtime ↔ Voice Interview Engine Connector
 *
 * Responsibilities:
 * - Connect Runtime to Voice Interview Engine
 * - Route Runtime events to Voice Interview Engine
 * - Route Voice Interview actions to Runtime
 * - Maintain event ordering
 * - Ensure thread safety
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY technical connection between Runtime and Voice Interview Engine
 */
// @ts-nocheck


import { RuntimeEngine, RuntimeEvent } from "../providers/runtime/RuntimeEngine";
import { RuntimeEventEmitterImpl, EventRecord } from "../providers/runtime/RuntimeEvents";
import { AudioStreamingOrchestrator } from "../providers/runtime/AudioStreamingOrchestrator";
import { AudioPipelineOrchestrator } from "../audio/AudioPipelineOrchestrator";
import { BargeInOrchestrator } from "../audio/BargeInOrchestrator";
import { AudioConfiguration } from "../audio/AudioConfiguration";

// ============================================================================
// VOICE INTERVIEW ACTIONS
// ============================================================================

export type VoiceInterviewAction =
  | "StartCapture"
  | "StopCapture"
  | "PauseCapture"
  | "ResumeCapture"
  | "StartPlayback"
  | "StopPlayback"
  | "PausePlayback"
  | "ResumePlayback"
  | "StartSession"
  | "StopSession"
  | "InterruptPlayback"
  | "WaitForResponse";

// ============================================================================
// VOICE INTERVIEW EVENTS
// ============================================================================

export type VoiceInterviewEvent =
  | "SessionStarted"
  | "SessionEnded"
  | "UserSpeechStarted"
  | "UserSpeechEnded"
  | "AssistantSpeechStarted"
  | "AssistantSpeechEnded"
  | "AudioInterrupted"
  | "ProviderConnected"
  | "ProviderDisconnected"
  | "ProviderError"
  | "InterviewError";

// ============================================================================
// CONNECTOR STATE
// ============================================================================

export type ConnectorState =
  | "Idle"
  | "Connecting"
  | "Connected"
  | "Disconnecting"
  | "Error";

// ============================================================================
// RUNTIME VOICE INTERVIEW CONNECTOR INTERFACE
// ============================================================================

export interface RuntimeVoiceInterviewConnector {
  connect(runtimeEngine: RuntimeEngine, audioStreamingOrchestrator: AudioStreamingOrchestrator, audioPipelineOrchestrator: AudioPipelineOrchestrator, bargeInOrchestrator: BargeInOrchestrator): Promise<void>;
  disconnect(): Promise<void>;
  executeAction(action: VoiceInterviewAction, metadata?: Record<string, unknown>): Promise<void>;
  subscribeToVoiceInterviewEvents(callback: (event: VoiceInterviewEvent, metadata?: Record<string, unknown>) => void): void;
  getConnectorState(): ConnectorState;
}

// ============================================================================
// RUNTIME VOICE INTERVIEW CONNECTOR IMPLEMENTATION
// ============================================================================

export class RuntimeVoiceInterviewConnectorImpl implements RuntimeVoiceInterviewConnector {
  private state: ConnectorState = "Idle";
  private runtimeEngine: RuntimeEngine | null = null;
  private audioStreamingOrchestrator: AudioStreamingOrchestrator | null = null;
  private audioPipelineOrchestrator: AudioPipelineOrchestrator | null = null;
  private bargeInOrchestrator: BargeInOrchestrator | null = null;
  private runtimeEventEmitter: RuntimeEventEmitterImpl | null = null;
  private voiceInterviewEventCallbacks: Array<(event: VoiceInterviewEvent, metadata?: Record<string, unknown>) => void> = [];
  private eventQueue: Array<{ event: RuntimeEvent; metadata?: Record<string, unknown> }> = [];
  private isProcessingQueue: boolean = false;

  async connect(
    runtimeEngine: RuntimeEngine,
    audioStreamingOrchestrator: AudioStreamingOrchestrator,
    audioPipelineOrchestrator: AudioPipelineOrchestrator,
    bargeInOrchestrator: BargeInOrchestrator
  ): Promise<void> {
    this.state = "Connecting";
    this.runtimeEngine = runtimeEngine;
    this.audioStreamingOrchestrator = audioStreamingOrchestrator;
    this.audioPipelineOrchestrator = audioPipelineOrchestrator;
    this.bargeInOrchestrator = bargeInOrchestrator;
    this.runtimeEventEmitter = new RuntimeEventEmitterImpl();

    // Subscribe to Runtime events
    this.runtimeEventEmitter.subscribe((record: EventRecord) => {
      this.handleRuntimeEvent(record.event, record.metadata);
    });

    this.state = "Connected";
  }

  async disconnect(): Promise<void> {
    this.state = "Disconnecting";

    // Clear event queue
    this.eventQueue = [];
    this.isProcessingQueue = false;

    // Unsubscribe from Runtime events
    if (this.runtimeEventEmitter) {
      this.runtimeEventEmitter = null;
    }

    this.runtimeEngine = null;
    this.audioStreamingOrchestrator = null;
    this.audioPipelineOrchestrator = null;
    this.bargeInOrchestrator = null;

    this.state = "Idle";
  }

  async executeAction(action: VoiceInterviewAction, metadata?: Record<string, unknown>): Promise<void> {
    if (this.state !== "Connected") {
      throw new Error("Connector not connected");
    }

    switch (action) {
      case "StartCapture":
        await this.audioPipelineOrchestrator?.startPipeline(metadata as unknown as AudioConfiguration, this.audioStreamingOrchestrator!);
        break;
      case "StopCapture":
        await this.audioPipelineOrchestrator?.stopPipeline();
        break;
      case "PauseCapture":
        await this.audioPipelineOrchestrator?.pausePipeline();
        break;
      case "ResumeCapture":
        await this.audioPipelineOrchestrator?.resumePipeline();
        break;
      case "StartPlayback":
        // Playback is managed by AudioPipelineOrchestrator
        break;
      case "StopPlayback":
        await this.audioPipelineOrchestrator?.stopPipeline();
        break;
      case "PausePlayback":
        await this.audioPipelineOrchestrator?.pausePipeline();
        break;
      case "ResumePlayback":
        await this.audioPipelineOrchestrator?.resumePipeline();
        break;
      case "StartSession":
        await this.runtimeEngine?.start();
        break;
      case "StopSession":
        await this.runtimeEngine?.stop();
        break;
      case "InterruptPlayback":
        await this.bargeInOrchestrator?.stopOrchestration();
        break;
      case "WaitForResponse":
        // Wait for response is handled by Voice Interview Engine
        break;
    }
  }

  subscribeToVoiceInterviewEvents(callback: (event: VoiceInterviewEvent, metadata?: Record<string, unknown>) => void): void {
    this.voiceInterviewEventCallbacks.push(callback);
  }

  getConnectorState(): ConnectorState {
    return this.state;
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private handleRuntimeEvent(event: RuntimeEvent, metadata?: Record<string, unknown>): void {
    // Add to event queue for ordered processing
    this.eventQueue.push({ event, metadata });
    
    // Process queue if not already processing
    if (!this.isProcessingQueue) {
      this.processEventQueue();
    }
  }

  private async processEventQueue(): Promise<void> {
    if (this.isProcessingQueue) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.eventQueue.length > 0) {
      const { event, metadata } = this.eventQueue.shift()!;
      await this.mapRuntimeEventToVoiceInterviewEvent(event, metadata);
    }

    this.isProcessingQueue = false;
  }

  private async mapRuntimeEventToVoiceInterviewEvent(event: RuntimeEvent, metadata?: Record<string, unknown>): Promise<void> {
    const voiceInterviewEvent = this.getRuntimeEventMapping(event);
    
    this.voiceInterviewEventCallbacks.forEach(callback => {
      callback(voiceInterviewEvent, metadata);
    });
  }

  private getRuntimeEventMapping(runtimeEvent: RuntimeEvent): VoiceInterviewEvent {
    switch (runtimeEvent) {
      case "RuntimeInitialized":
        return "SessionStarted";
      case "RuntimeShutdown":
        return "SessionEnded";
      case "RuntimeStarted":
        return "UserSpeechStarted";
      case "RuntimeShuttingDown":
        return "UserSpeechEnded";
      case "RuntimeError":
        return "InterviewError";
      default:
        return "InterviewError";
    }
  }
}
