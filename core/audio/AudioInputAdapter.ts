/**
 * Audio Input Adapter
 *
 * Responsibilities:
 * - Capture microphone audio
 * - Convert audio stream to AudioStreaming format
 * - Transmit buffers to Runtime
 * - Manage audio permissions
 * - Clean up AudioContext resources
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY audio input adaptation
 */

import { AudioConfiguration } from "./AudioConfiguration";

// ============================================================================
// AUDIO INPUT STATE
// ============================================================================

export type AudioInputState =
  | "Idle"
  | "RequestingPermission"
  | "Capturing"
  | "Paused"
  | "Error";

// ============================================================================
// AUDIO INPUT EVENTS
// ============================================================================

export type AudioInputEvent =
  | "AudioInputRequestingPermission"
  | "AudioInputPermissionGranted"
  | "AudioInputPermissionDenied"
  | "AudioInputStarted"
  | "AudioInputStopped"
  | "AudioInputPaused"
  | "AudioInputResumed"
  | "AudioInputError"
  | "AudioChunkCaptured";

// ============================================================================
// AUDIO INPUT ADAPTER INTERFACE
// ============================================================================

export interface AudioInputAdapter {
  startCapture(config: AudioConfiguration): Promise<void>;
  stopCapture(): Promise<void>;
  pauseCapture(): Promise<void>;
  resumeCapture(): Promise<void>;
  getState(): AudioInputState;
  getCapturedChunk(): Uint8Array | null;
  subscribeToEvents(callback: (event: AudioInputEvent, metadata?: Record<string, unknown>) => void): void;
  checkPermission(): Promise<PermissionState>;
  requestPermission(): Promise<boolean>;
}

// ============================================================================
// AUDIO INPUT ADAPTER IMPLEMENTATION
// ============================================================================

export class AudioInputAdapterImpl implements AudioInputAdapter {
  private state: AudioInputState = "Idle";
  private config: AudioConfiguration | null = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private eventCallbacks: Array<(event: AudioInputEvent, metadata?: Record<string, unknown>) => void> = [];
  private capturedChunk: Uint8Array | null = null;
  private isCleaningUp: boolean = false;

  async startCapture(config: AudioConfiguration): Promise<void> {
    if (this.state === "Capturing") {
      return;
    }

    this.state = "RequestingPermission";
    this.config = config;
    this.isCleaningUp = false;
    this.emitEvent("AudioInputRequestingPermission");

    try {
      // Check permission first
      const permissionState = await this.checkPermission();
      if (permissionState === "denied") {
        throw new Error("Microphone permission denied");
      }

      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: config.inputDeviceId ? { exact: config.inputDeviceId } : undefined,
          sampleRate: config.sampleRate,
          channelCount: config.channels,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.state = "Capturing";
      this.emitEvent("AudioInputPermissionGranted");
      this.emitEvent("AudioInputStarted");

      // Setup audio processing
      await this.setupAudioProcessing();

    } catch (error) {
      this.state = "Error";
      this.emitEvent("AudioInputPermissionDenied");
      this.emitEvent("AudioInputError", { error: error instanceof Error ? error.message : "Unknown error" });
      await this.cleanup();
      throw error;
    }
  }

  async stopCapture(): Promise<void> {
    if (this.state === "Idle") {
      return;
    }

    this.state = "Idle";
    this.emitEvent("AudioInputStopped");

    await this.cleanup();
  }

  async pauseCapture(): Promise<void> {
    if (this.state !== "Capturing") {
      return;
    }

    this.state = "Paused";
    this.emitEvent("AudioInputPaused");

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.enabled = false);
    }

    if (this.audioContext) {
      await this.audioContext.suspend();
    }
  }

  async resumeCapture(): Promise<void> {
    if (this.state !== "Paused") {
      return;
    }

    this.state = "Capturing";
    this.emitEvent("AudioInputResumed");

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.enabled = true);
    }

    if (this.audioContext) {
      await this.audioContext.resume();
    }
  }

  getState(): AudioInputState {
    return this.state;
  }

  getCapturedChunk(): Uint8Array | null {
    const chunk = this.capturedChunk;
    this.capturedChunk = null;
    return chunk;
  }

  subscribeToEvents(callback: (event: AudioInputEvent, metadata?: Record<string, unknown>) => void): void {
    this.eventCallbacks.push(callback);
  }

  async checkPermission(): Promise<PermissionState> {
    if (!navigator.permissions) {
      return "prompt";
    }

    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return permission.state;
    } catch {
      // Fallback if permissions API not supported
      return "prompt";
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private async setupAudioProcessing(): Promise<void> {
    if (!this.mediaStream || !this.config) {
      throw new Error("Media stream or config not set");
    }

    try {
      // Create audio context
      this.audioContext = new AudioContext({
        sampleRate: this.config.sampleRate
      });

      // Create source from media stream
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Create script processor for audio processing
      // Note: ScriptProcessorNode is deprecated but still widely supported
      // For production, consider migrating to AudioWorklet
      this.scriptProcessor = this.audioContext.createScriptProcessor(
        this.config.bufferSize,
        this.config.channels,
        this.config.channels
      );

      // Process audio chunks
      this.scriptProcessor.onaudioprocess = (event) => {
        if (this.isCleaningUp) {
          return;
        }

        const inputData = event.inputBuffer;
        const outputData = event.outputBuffer;

        // Copy input to output
        for (let channel = 0; channel < inputData.numberOfChannels; channel++) {
          const inputChannel = inputData.getChannelData(channel);
          const outputChannel = outputData.getChannelData(channel);
          outputChannel.set(inputChannel);
        }

        // Convert to Uint8Array (PCM16)
        this.capturedChunk = this.convertToPCM16(inputData);
        this.emitEvent("AudioChunkCaptured", { size: this.capturedChunk.length });
      };

      // Connect nodes
      this.sourceNode.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext.destination);

    } catch (error) {
      this.state = "Error";
      this.emitEvent("AudioInputError", { error: error instanceof Error ? error.message : "Unknown error" });
      await this.cleanup();
      throw error;
    }
  }

  private convertToPCM16(audioBuffer: AudioBuffer): Uint8Array {
    const channelData = audioBuffer.getChannelData(0);
    const pcm16 = new Int16Array(channelData.length);
    
    for (let i = 0; i < channelData.length; i++) {
      // Convert float32 (-1 to 1) to int16 (-32768 to 32767)
      const sample = channelData[i] ?? 0;
      const clampedSample = Math.max(-1, Math.min(1, sample));
      pcm16[i] = clampedSample < 0 ? clampedSample * 0x8000 : clampedSample * 0x7FFF;
    }

    return new Uint8Array(pcm16.buffer);
  }

  private async cleanup(): Promise<void> {
    this.isCleaningUp = true;

    // Disconnect script processor
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor.onaudioprocess = null;
      this.scriptProcessor = null;
    }

    // Disconnect source node
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
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

    // Stop media stream tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      this.mediaStream = null;
    }

    this.capturedChunk = null;
    this.isCleaningUp = false;
  }

  private emitEvent(event: AudioInputEvent, metadata?: Record<string, unknown>): void {
    this.eventCallbacks.forEach(callback => {
      try {
        callback(event, metadata);
      } catch (error) {
        console.error("Error in event callback:", error);
      }
    });
  }
}
