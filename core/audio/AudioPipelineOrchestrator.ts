/**
 * Audio Pipeline Orchestrator
 *
 * Responsibilities:
 * - Connect Audio Input Adapter to Runtime
 * - Connect Runtime to Audio Output Adapter
 * - Coordinate audio pipeline lifecycle
 * - Propagate errors via Runtime events
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY audio pipeline coordination
 */

import { AudioConfiguration } from "./AudioConfiguration";
import { AudioInputAdapter, AudioInputEvent } from "./AudioInputAdapter";
import { AudioOutputAdapter, AudioOutputEvent } from "./AudioOutputAdapter";
import { AudioStreamingOrchestrator } from "../providers/runtime/AudioStreamingOrchestrator";

// ============================================================================
// AUDIO PIPELINE STATE
// ============================================================================

export type AudioPipelineState =
  | "Idle"
  | "Initializing"
  | "Running"
  | "Paused"
  | "Error";

// ============================================================================
// AUDIO PIPELINE EVENTS
// ============================================================================

export type AudioPipelineEvent =
  | "AudioPipelineInitializing"
  | "AudioPipelineInitialized"
  | "AudioPipelineStarting"
  | "AudioPipelineStarted"
  | "AudioPipelinePausing"
  | "AudioPipelinePaused"
  | "AudioPipelineResuming"
  | "AudioPipelineResumed"
  | "AudioPipelineStopping"
  | "AudioPipelineStopped"
  | "AudioPipelineError";

// ============================================================================
// AUDIO PIPELINE ORCHESTRATOR INTERFACE
// ============================================================================

export interface AudioPipelineOrchestrator {
  startPipeline(config: AudioConfiguration, audioStreamingOrchestrator: AudioStreamingOrchestrator): Promise<void>;
  stopPipeline(): Promise<void>;
  pausePipeline(): Promise<void>;
  resumePipeline(): Promise<void>;
  getPipelineState(): AudioPipelineState;
  subscribeToEvents(callback: (event: AudioPipelineEvent, metadata?: Record<string, unknown>) => void): void;
}

// ============================================================================
// AUDIO PIPELINE ORCHESTRATOR IMPLEMENTATION
// ============================================================================

export class AudioPipelineOrchestratorImpl implements AudioPipelineOrchestrator {
  private state: AudioPipelineState = "Idle";
  private audioInputAdapter: AudioInputAdapter;
  private audioOutputAdapter: AudioOutputAdapter;
  private audioStreamingOrchestrator: AudioStreamingOrchestrator | null = null;
  private streamId: string | null = null;
  private eventCallbacks: Array<(event: AudioPipelineEvent, metadata?: Record<string, unknown>) => void> = [];
  private inputInterval: NodeJS.Timeout | null = null;
  private outputInterval: NodeJS.Timeout | null = null;

  constructor(
    audioInputAdapter: AudioInputAdapter,
    audioOutputAdapter: AudioOutputAdapter
  ) {
    this.audioInputAdapter = audioInputAdapter;
    this.audioOutputAdapter = audioOutputAdapter;

    // Subscribe to input adapter events
    this.audioInputAdapter.subscribeToEvents((event, metadata) => {
      this.handleInputEvent(event, metadata);
    });

    // Subscribe to output adapter events
    this.audioOutputAdapter.subscribeToEvents((event, metadata) => {
      this.handleOutputEvent(event, metadata);
    });
  }

  async startPipeline(config: AudioConfiguration, audioStreamingOrchestrator: AudioStreamingOrchestrator): Promise<void> {
    this.state = "Initializing";
    this.audioStreamingOrchestrator = audioStreamingOrchestrator;
    this.emitEvent("AudioPipelineInitializing");

    try {
      // Start audio input capture
      await this.audioInputAdapter.startCapture(config);

      // Start audio output playback
      await this.audioOutputAdapter.startPlayback(config);

      this.state = "Running";
      this.emitEvent("AudioPipelineInitialized");
      this.emitEvent("AudioPipelineStarted");

      // Start input processing loop
      this.startInputProcessing();

      // Start output processing loop
      this.startOutputProcessing();

    } catch (error) {
      this.state = "Error";
      this.emitEvent("AudioPipelineError", { error: error instanceof Error ? error.message : "Unknown error" });
      throw error;
    }
  }

  async stopPipeline(): Promise<void> {
    this.state = "Idle";
    this.emitEvent("AudioPipelineStopping");

    // Stop processing loops
    if (this.inputInterval) {
      clearInterval(this.inputInterval);
      this.inputInterval = null;
    }

    if (this.outputInterval) {
      clearInterval(this.outputInterval);
      this.outputInterval = null;
    }

    // Stop audio adapters
    await this.audioInputAdapter.stopCapture();
    await this.audioOutputAdapter.stopPlayback();

    // Stop audio streaming
    if (this.streamId && this.audioStreamingOrchestrator) {
      await this.audioStreamingOrchestrator.stopAudioStreaming(this.streamId);
      this.streamId = null;
    }

    this.emitEvent("AudioPipelineStopped");
  }

  async pausePipeline(): Promise<void> {
    if (this.state !== "Running") {
      return;
    }

    this.state = "Paused";
    this.emitEvent("AudioPipelinePausing");

    // Pause audio adapters
    await this.audioInputAdapter.pauseCapture();
    await this.audioOutputAdapter.pausePlayback();

    // Pause audio streaming
    if (this.streamId && this.audioStreamingOrchestrator) {
      await this.audioStreamingOrchestrator.pauseAudioStreaming(this.streamId);
    }

    this.emitEvent("AudioPipelinePaused");
  }

  async resumePipeline(): Promise<void> {
    if (this.state !== "Paused") {
      return;
    }

    this.state = "Running";
    this.emitEvent("AudioPipelineResuming");

    // Resume audio adapters
    await this.audioInputAdapter.resumeCapture();
    await this.audioOutputAdapter.resumePlayback();

    // Resume audio streaming
    if (this.streamId && this.audioStreamingOrchestrator) {
      await this.audioStreamingOrchestrator.resumeAudioStreaming(this.streamId);
    }

    this.emitEvent("AudioPipelineResumed");
  }

  getPipelineState(): AudioPipelineState {
    return this.state;
  }

  subscribeToEvents(callback: (event: AudioPipelineEvent, metadata?: Record<string, unknown>) => void): void {
    this.eventCallbacks.push(callback);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private startInputProcessing(): void {
    this.inputInterval = setInterval(async () => {
      if (this.state !== "Running") {
        return;
      }

      // Get captured chunk from input adapter
      const chunk = this.audioInputAdapter.getCapturedChunk();
      if (chunk && this.audioStreamingOrchestrator && this.streamId) {
        try {
          await this.audioStreamingOrchestrator.sendAudio(this.streamId, chunk);
        } catch (error) {
          this.emitEvent("AudioPipelineError", { error: error instanceof Error ? error.message : "Unknown error" });
        }
      }
    }, 10);
  }

  private startOutputProcessing(): void {
    this.outputInterval = setInterval(async () => {
      if (this.state !== "Running") {
        return;
      }

      if (this.audioStreamingOrchestrator && this.streamId) {
        try {
          // Receive chunk from audio streaming orchestrator
          const chunk = await this.audioStreamingOrchestrator.receiveAudio(this.streamId);
          if (chunk) {
            await this.audioOutputAdapter.playChunk(chunk);
          }
        } catch (error) {
          this.emitEvent("AudioPipelineError", { error: error instanceof Error ? error.message : "Unknown error" });
        }
      }
    }, 10);
  }

  private handleInputEvent(event: AudioInputEvent, metadata?: Record<string, unknown>): void {
    // Map input events to pipeline events
    switch (event) {
      case "AudioInputPermissionDenied":
      case "AudioInputError":
        this.emitEvent("AudioPipelineError", metadata);
        break;
    }
  }

  private handleOutputEvent(event: AudioOutputEvent, metadata?: Record<string, unknown>): void {
    // Map output events to pipeline events
    switch (event) {
      case "AudioOutputError":
        this.emitEvent("AudioPipelineError", metadata);
        break;
    }
  }

  private emitEvent(event: AudioPipelineEvent, metadata?: Record<string, unknown>): void {
    this.eventCallbacks.forEach(callback => callback(event, metadata));
  }
}
