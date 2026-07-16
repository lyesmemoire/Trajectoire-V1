/**
 * Provider Runtime Manager Extension
 *
 * Responsibilities:
 * - Extend Runtime Manager with audio streaming capabilities
 * - Coordinate between Runtime Manager and Audio Streaming Orchestrator
 * - Synchronize events between Runtime and Audio Streaming
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY technical coordination
 */

import { RuntimeManager } from "./RuntimeManager";
import { AudioStreamingOrchestrator } from "./AudioStreamingOrchestrator";
import {
  AudioStreamingProvider,
  AudioStreamConfig
} from "../ProviderAbstractionLayer";

// ============================================================================
// RUNTIME MANAGER EXTENSION INTERFACE
// ============================================================================

export interface RuntimeManagerExtension {
  startAudioStreaming(provider: AudioStreamingProvider, config: AudioStreamConfig): Promise<string>;
  stopAudioStreaming(streamId: string): Promise<void>;
  sendAudio(streamId: string, audio: Uint8Array): Promise<void>;
  receiveAudio(streamId: string): Promise<Uint8Array | null>;
  pauseAudioStreaming(streamId: string): Promise<void>;
  resumeAudioStreaming(streamId: string): Promise<void>;
  getStreamingState(streamId: string): string;
  getStreamingMetrics(streamId: string): object;
  getLifecycleState(streamId: string): string;
}

// ============================================================================
// RUNTIME MANAGER EXTENSION IMPLEMENTATION
// ============================================================================

export class RuntimeManagerExtensionImpl implements RuntimeManagerExtension {
  private runtimeManager: RuntimeManager;
  private audioStreamingOrchestrator: AudioStreamingOrchestrator;

  constructor(
    runtimeManager: RuntimeManager,
    audioStreamingOrchestrator: AudioStreamingOrchestrator
  ) {
    this.runtimeManager = runtimeManager;
    this.audioStreamingOrchestrator = audioStreamingOrchestrator;

    // Subscribe to audio streaming events and map to runtime events
    this.setupEventSynchronization();
  }

  async startAudioStreaming(provider: AudioStreamingProvider, config: AudioStreamConfig): Promise<string> {
    // Check if runtime manager is in valid state
    const runtimeState = this.runtimeManager.getRuntimeState();
    if (runtimeState !== "Running") {
      throw new Error("Runtime Manager is not in running state");
    }

    return this.audioStreamingOrchestrator.startAudioStreaming(provider, config);
  }

  async stopAudioStreaming(streamId: string): Promise<void> {
    return this.audioStreamingOrchestrator.stopAudioStreaming(streamId);
  }

  async sendAudio(streamId: string, audio: Uint8Array): Promise<void> {
    return this.audioStreamingOrchestrator.sendAudio(streamId, audio);
  }

  async receiveAudio(streamId: string): Promise<Uint8Array | null> {
    return this.audioStreamingOrchestrator.receiveAudio(streamId);
  }

  async pauseAudioStreaming(streamId: string): Promise<void> {
    return this.audioStreamingOrchestrator.pauseAudioStreaming(streamId);
  }

  async resumeAudioStreaming(streamId: string): Promise<void> {
    return this.audioStreamingOrchestrator.resumeAudioStreaming(streamId);
  }

  getStreamingState(streamId: string): string {
    return this.audioStreamingOrchestrator.getStreamingState(streamId);
  }

  getStreamingMetrics(streamId: string): object {
    return this.audioStreamingOrchestrator.getStreamingMetrics(streamId);
  }

  getLifecycleState(streamId: string): string {
    return this.audioStreamingOrchestrator.getLifecycleState(streamId);
  }

  private setupEventSynchronization(): void {
    // Audio streaming events are already handled by AudioStreamingOrchestrator
    // This extension ensures coordination with Runtime Manager state
  }
}
