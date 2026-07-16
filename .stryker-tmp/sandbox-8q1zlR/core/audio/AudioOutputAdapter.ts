/**
 * Audio Output Adapter
 *
 * Responsibilities:
 * - Receive audio buffers from Runtime
 * - Play audio via Web Audio API
 * - Clean up AudioContext resources
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY audio output adaptation
 */
// @ts-nocheck


import { AudioConfiguration } from "./AudioConfiguration";

// ============================================================================
// AUDIO OUTPUT STATE
// ============================================================================

export type AudioOutputState =
  | "Idle"
  | "Playing"
  | "Paused"
  | "Error";

// ============================================================================
// AUDIO OUTPUT EVENTS
// ============================================================================

export type AudioOutputEvent =
  | "AudioOutputStarted"
  | "AudioOutputStopped"
  | "AudioOutputPaused"
  | "AudioOutputResumed"
  | "AudioOutputError"
  | "AudioChunkPlayed";

// ============================================================================
// AUDIO OUTPUT ADAPTER INTERFACE
// ============================================================================

export interface AudioOutputAdapter {
  startPlayback(config: AudioConfiguration): Promise<void>;
  stopPlayback(): Promise<void>;
  pausePlayback(): Promise<void>;
  resumePlayback(): Promise<void>;
  playChunk(chunk: Uint8Array): Promise<void>;
  getState(): AudioOutputState;
  subscribeToEvents(callback: (event: AudioOutputEvent, metadata?: Record<string, unknown>) => void): void;
}

// ============================================================================
// AUDIO OUTPUT ADAPTER IMPLEMENTATION
// ============================================================================

export class AudioOutputAdapterImpl implements AudioOutputAdapter {
  private state: AudioOutputState = "Idle";
  private config: AudioConfiguration | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private eventCallbacks: Array<(event: AudioOutputEvent, metadata?: Record<string, unknown>) => void> = [];
  private playbackQueue: Uint8Array[] = [];
  private isCleaningUp: boolean = false;
  private isPlaying: boolean = false;

  async startPlayback(config: AudioConfiguration): Promise<void> {
    if (this.state === "Playing") {
      return;
    }

    this.config = config;
    this.isCleaningUp = false;
    
    try {
      // Create audio context
      this.audioContext = new AudioContext({
        sampleRate: config.sampleRate
      });

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.0;
      this.gainNode.connect(this.audioContext.destination);

      this.state = "Playing";
      this.isPlaying = true;
      this.emitEvent("AudioOutputStarted");

    } catch (error) {
      this.state = "Error";
      this.emitEvent("AudioOutputError", { error: error instanceof Error ? error.message : "Unknown error" });
      await this.cleanup();
      throw error;
    }
  }

  async stopPlayback(): Promise<void> {
    if (this.state === "Idle") {
      return;
    }

    this.state = "Idle";
    this.isPlaying = false;
    this.emitEvent("AudioOutputStopped");

    await this.cleanup();
  }

  async pausePlayback(): Promise<void> {
    if (this.state !== "Playing") {
      return;
    }

    this.state = "Paused";
    this.isPlaying = false;
    this.emitEvent("AudioOutputPaused");

    // Stop current source
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
      } catch {
        // Ignore if already stopped
      }
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.audioContext) {
      await this.audioContext.suspend();
    }
  }

  async resumePlayback(): Promise<void> {
    if (this.state !== "Paused") {
      return;
    }

    this.state = "Playing";
    this.isPlaying = true;
    this.emitEvent("AudioOutputResumed");

    if (this.audioContext) {
      await this.audioContext.resume();
    }

    // Process queued chunks
    this.processPlaybackQueue();
  }

  async playChunk(chunk: Uint8Array): Promise<void> {
    if (this.isCleaningUp) {
      return;
    }

    if (this.state !== "Playing" || !this.audioContext || !this.isPlaying) {
      this.playbackQueue.push(chunk);
      return;
    }

    try {
      // Convert PCM16 to AudioBuffer
      const audioBuffer = this.convertFromPCM16(chunk);
      
      // Create source node
      const sourceNode = this.audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(this.gainNode!);
      
      // Play audio
      sourceNode.start();
      
      // Cleanup after playback
      sourceNode.onended = () => {
        if (!this.isCleaningUp) {
          sourceNode.disconnect();
          this.emitEvent("AudioChunkPlayed", { size: chunk.length });
        }
      };

      // Process queued chunks
      this.processPlaybackQueue();

    } catch (error) {
      this.emitEvent("AudioOutputError", { error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  getState(): AudioOutputState {
    return this.state;
  }

  subscribeToEvents(callback: (event: AudioOutputEvent, metadata?: Record<string, unknown>) => void): void {
    this.eventCallbacks.push(callback);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private convertFromPCM16(pcm16: Uint8Array): AudioBuffer {
    if (!this.config || !this.audioContext) {
      throw new Error("Audio context or config not set");
    }

    const int16Array = new Int16Array(pcm16.buffer);
    const audioBuffer = this.audioContext.createBuffer(
      this.config.channels,
      int16Array.length / this.config.channels,
      this.config.sampleRate
    );

    for (let channel = 0; channel < this.config.channels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      
      for (let i = 0; i < channelData.length; i++) {
        // Convert int16 (-32768 to 32767) to float32 (-1 to 1)
        const sample = int16Array[i * this.config.channels + channel];
        channelData[i] = sample < 0 ? sample / 0x8000 : sample / 0x7FFF;
      }
    }

    return audioBuffer;
  }

  private processPlaybackQueue(): void {
    while (this.playbackQueue.length > 0 && this.state === "Playing" && this.isPlaying && !this.isCleaningUp) {
      const chunk = this.playbackQueue.shift();
      if (chunk) {
        this.playChunk(chunk).catch(console.error);
      }
    }
  }

  private async cleanup(): Promise<void> {
    this.isCleaningUp = true;
    this.isPlaying = false;

    // Stop current source
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
      } catch {
        // Ignore if already stopped
      }
      this.sourceNode.disconnect();
      this.sourceNode.onended = null;
      this.sourceNode = null;
    }

    // Disconnect gain node
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

    // Close audio context
    if (this.audioContext) {
      try {
        if (this.audioContext.state !== 'closed') {
          await this.audioContext.close();
        }
      } catch (error) {
        console.error("Error closing audio context:", error);
      }
      this.audioContext = null;
    }

    // Clear playback queue
    this.playbackQueue = [];
    this.isCleaningUp = false;
  }

  private emitEvent(event: AudioOutputEvent, metadata?: Record<string, unknown>): void {
    this.eventCallbacks.forEach(callback => {
      try {
        callback(event, metadata);
      } catch (error) {
        console.error("Error in event callback:", error);
      }
    });
  }
}
