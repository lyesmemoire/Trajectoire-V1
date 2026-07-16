/**
 * Provider Runtime Audio Streaming Orchestrator
 *
 * Responsibilities:
 * - Orchestrate audio streaming between Runtime and Provider
 * - Coordinate with Runtime Engine
 * - Coordinate with Runtime Manager
 * - Coordinate with Buffer Manager
 * - Coordinate with Streaming Lifecycle
 * - Coordinate with Error Handler
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY technical orchestration
 */

import {
  AudioStreamingProvider,
  AudioStreamConfig
} from "../ProviderAbstractionLayer";
import { RuntimeEngine } from "./RuntimeEngine";
import { AudioStreaming, AudioStreamingState, AudioStreamingMetrics } from "./AudioStreaming";
import { BufferManager } from "./BufferManager";
import { StreamingLifecycle, StreamingLifecycleState } from "./StreamingLifecycle";
import { StreamingErrorHandler, StreamingError } from "./StreamingErrorHandler";

// ============================================================================
// AUDIO STREAMING ORCHESTRATOR INTERFACE
// ============================================================================

export interface AudioStreamingOrchestrator {
  startAudioStreaming(provider: AudioStreamingProvider, config: AudioStreamConfig): Promise<string>;
  stopAudioStreaming(streamId: string): Promise<void>;
  sendAudio(streamId: string, audio: Uint8Array): Promise<void>;
  receiveAudio(streamId: string): Promise<Uint8Array | null>;
  pauseAudioStreaming(streamId: string): Promise<void>;
  resumeAudioStreaming(streamId: string): Promise<void>;
  getStreamingState(streamId: string): AudioStreamingState;
  getStreamingMetrics(streamId: string): AudioStreamingMetrics;
  getLifecycleState(streamId: string): StreamingLifecycleState;
}

// ============================================================================
// AUDIO STREAMING ORCHESTRATOR IMPLEMENTATION
// ============================================================================

export class AudioStreamingOrchestratorImpl implements AudioStreamingOrchestrator {
  private audioStreaming: AudioStreaming;
  private bufferManager: BufferManager;
  private streamingLifecycle: StreamingLifecycle;
  private errorHandler: StreamingErrorHandler;
  private runtimeEngine: RuntimeEngine;

  constructor(
    audioStreaming: AudioStreaming,
    bufferManager: BufferManager,
    streamingLifecycle: StreamingLifecycle,
    errorHandler: StreamingErrorHandler,
    runtimeEngine: RuntimeEngine
  ) {
    this.audioStreaming = audioStreaming;
    this.bufferManager = bufferManager;
    this.streamingLifecycle = streamingLifecycle;
    this.errorHandler = errorHandler;
    this.runtimeEngine = runtimeEngine;

    // Start buffer cleanup
    this.bufferManager.startCleanup();

    // Subscribe to errors
    this.errorHandler.subscribeToErrors((error) => {
      this.handleOrchestratorError(error);
    });
  }

  async startAudioStreaming(provider: AudioStreamingProvider, config: AudioStreamConfig): Promise<string> {
    try {
      // Start audio streaming
      const streamId = await this.audioStreaming.startStream(provider, config);

      // Start lifecycle
      await this.streamingLifecycle.startStreaming(this.audioStreaming, streamId);

      return streamId;
    } catch (error) {
      this.errorHandler.handleProviderError("unknown", error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  async stopAudioStreaming(streamId: string): Promise<void> {
    try {
      // Stop lifecycle
      await this.streamingLifecycle.stopStreaming(this.audioStreaming, streamId);

      // Stop audio streaming
      await this.audioStreaming.stopStream(streamId);

      // Clear buffers
      this.bufferManager.clear();
    } catch (error) {
      this.errorHandler.handleProviderError(streamId, error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  async sendAudio(streamId: string, audio: Uint8Array): Promise<void> {
    try {
      // Check if runtime is in valid state
      const runtimeState = this.runtimeEngine.getRuntimeState();
      if (runtimeState !== "Running") {
        throw new Error("Runtime is not in running state");
      }

      // Check if streaming is in valid state
      const streamingState = this.audioStreaming.getStreamingState(streamId);
      if (streamingState !== "Streaming") {
        throw new Error("Streaming is not in streaming state");
      }

      // Send audio chunk
      await this.audioStreaming.sendAudioChunk(streamId, audio);
    } catch (error) {
      this.errorHandler.handleNetworkError(streamId, error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  async receiveAudio(streamId: string): Promise<Uint8Array | null> {
    try {
      // Check if runtime is in valid state
      const runtimeState = this.runtimeEngine.getRuntimeState();
      if (runtimeState !== "Running") {
        throw new Error("Runtime is not in running state");
      }

      // Check if streaming is in valid state
      const streamingState = this.audioStreaming.getStreamingState(streamId);
      if (streamingState !== "Streaming") {
        throw new Error("Streaming is not in streaming state");
      }

      // Receive audio chunk
      const buffer = await this.audioStreaming.receiveAudioChunk(streamId);
      return buffer ? buffer.data : null;
    } catch (error) {
      this.errorHandler.handleNetworkError(streamId, error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }

  async pauseAudioStreaming(streamId: string): Promise<void> {
    try {
      await this.streamingLifecycle.pauseStreaming(this.audioStreaming, streamId);
    } catch (error) {
      this.errorHandler.handleProviderError(streamId, error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  async resumeAudioStreaming(streamId: string): Promise<void> {
    try {
      await this.streamingLifecycle.resumeStreaming(this.audioStreaming, streamId);
    } catch (error) {
      this.errorHandler.handleProviderError(streamId, error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  getStreamingState(streamId: string): AudioStreamingState {
    return this.audioStreaming.getStreamingState(streamId);
  }

  getStreamingMetrics(streamId: string): AudioStreamingMetrics {
    return this.audioStreaming.getStreamingMetrics(streamId);
  }

  getLifecycleState(streamId: string): StreamingLifecycleState {
    return this.streamingLifecycle.getLifecycleState(streamId);
  }

  private handleOrchestratorError(error: StreamingError): void {
    // Log error
    console.error(`AudioStreamingOrchestrator Error: ${error.message}`, error.metadata);

    // If error is not recoverable, close stream
    if (!error.recoverable && error.streamId) {
      this.stopAudioStreaming(error.streamId).catch((err) => {
        console.error("Failed to close stream after error:", err);
      });
    }
  }

  // Cleanup
  destroy(): void {
    this.bufferManager.stopCleanup();
  }
}
