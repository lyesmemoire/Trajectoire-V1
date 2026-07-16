/**
 * Microphone manager: getUserMedia, MediaRecorder, and audio level monitoring.
 */

import type { AudioConfig } from "../types/config.js";
import type { MicrophoneState } from "../types/audio.js";
import { AudioProcessingPipeline } from "./AudioProcessingPipeline.js";
import { VoiceActivityDetector, type VADCallback } from "./VoiceActivityDetector.js";
import { AudioError } from "../errors/AudioError.js";

export interface MicrophoneCallbacks {
  readonly onAudioData: (base64Data: string) => void;
  readonly onSpeechStart: () => void;
  readonly onSpeechEnd: () => void;
  readonly onLevelChange: (rms: number, peak: number, isSpeaking: boolean) => void;
  readonly onError: (error: AudioError) => void;
}

export class MicrophoneManager {
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private readonly pipeline: AudioProcessingPipeline;
  private readonly vad: VoiceActivityDetector;
  private readonly config: AudioConfig;
  private _state: MicrophoneState = "inactive";
  private callbacks: MicrophoneCallbacks | null = null;
  private levelIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(config: AudioConfig) {
    this.config = config;
    this.pipeline = new AudioProcessingPipeline();
    this.vad = new VoiceActivityDetector({
      threshold: config.vadThreshold,
      silenceMs: config.vadSilenceMs,
    });
  }

  get state(): MicrophoneState {
    return this._state;
  }

  async start(callbacks: MicrophoneCallbacks): Promise<void> {
    if (this._state === "active") return;

    this._state = "requesting";
    this.callbacks = callbacks;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.config.sampleRate,
          channelCount: this.config.channelCount,
          echoCancellation: this.config.echoCancellation,
          noiseSuppression: this.config.noiseSuppression,
          autoGainControl: this.config.autoGainControl,
        },
        video: false,
      });
    } catch (error: unknown) {
      this._state = "error";
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          callbacks.onError(AudioError.microphonePermissionDenied());
          return;
        }
        if (error.name === "NotFoundError") {
          callbacks.onError(AudioError.microphoneNotFound());
          return;
        }
        if (error.name === "NotReadableError") {
          callbacks.onError(AudioError.microphoneInUse());
          return;
        }
      }
      callbacks.onError(AudioError.recordingFailed(
        error instanceof Error ? error.message : "Unknown error"
      ));
      return;
    }

    try {
      const processedStream = await this.pipeline.initialize(this.stream, this.config.sampleRate);
      this.setupRecorder(processedStream, callbacks);
      this.startVAD(callbacks);
      this.startLevelMonitoring(callbacks);
      this._state = "active";
    } catch (error: unknown) {
      this._state = "error";
      callbacks.onError(AudioError.audioContextFailed(
        error instanceof Error ? error.message : "Pipeline initialization failed"
      ));
    }
  }

  stop(): void {
    this.vad.stop();
    this.stopLevelMonitoring();

    if (this.recorder && this.recorder.state !== "inactive") {
      this.recorder.stop();
    }
    this.recorder = null;

    if (this.stream) {
      for (const track of this.stream.getTracks()) {
        track.stop();
      }
      this.stream = null;
    }

    this.pipeline.destroy();
    this._state = "inactive";
    this.callbacks = null;
  }

  setGain(value: number): void {
    this.pipeline.setGain(value);
  }

  mute(): void {
    if (this.stream) {
      for (const track of this.stream.getAudioTracks()) {
        track.enabled = false;
      }
    }
  }

  unmute(): void {
    if (this.stream) {
      for (const track of this.stream.getAudioTracks()) {
        track.enabled = true;
      }
    }
  }

  getFrequencyData(): Float32Array {
    return this.pipeline.getFrequencyData();
  }

  getTimeDomainData(): Float32Array {
    return this.pipeline.getTimeDomainData();
  }

  private setupRecorder(stream: MediaStream, callbacks: MicrophoneCallbacks): void {
    const mimeType = MediaRecorder.isTypeSupported(this.config.mimeType)
      ? this.config.mimeType
      : "audio/webm";

    this.recorder = new MediaRecorder(stream, { mimeType });

    this.recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            // Strip data URL prefix to get raw base64
            const base64 = reader.result.split(",")[1] ?? "";
            callbacks.onAudioData(base64);
          }
        };
        reader.readAsDataURL(event.data);
      }
    };

    this.recorder.onerror = () => {
      callbacks.onError(AudioError.recordingFailed("MediaRecorder error"));
    };

    // Collect data every 250ms for streaming
    this.recorder.start(250);
  }

  private startVAD(callbacks: MicrophoneCallbacks): void {
    const vadCallback: VADCallback = (isSpeaking: boolean) => {
      if (isSpeaking) {
        callbacks.onSpeechStart();
      } else {
        callbacks.onSpeechEnd();
      }
    };

    this.vad.start(() => this.pipeline.getRmsLevel(), vadCallback);
  }

  private startLevelMonitoring(callbacks: MicrophoneCallbacks): void {
    this.levelIntervalId = setInterval(() => {
      const rms = this.pipeline.getRmsLevel();
      const peak = this.pipeline.getPeakLevel();
      callbacks.onLevelChange(rms, peak, this.vad.speaking);
    }, 50); // 20 FPS updates
  }

  private stopLevelMonitoring(): void {
    if (this.levelIntervalId !== null) {
      clearInterval(this.levelIntervalId);
      this.levelIntervalId = null;
    }
  }

  destroy(): void {
    this.stop();
  }
}
