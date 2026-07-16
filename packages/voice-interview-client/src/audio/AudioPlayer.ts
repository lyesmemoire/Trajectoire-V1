/**
 * Audio player: decodes and plays base64-encoded TTS audio chunks.
 */

import type { PlaybackState } from "../types/audio.js";
import { AudioError } from "../errors/AudioError.js";

export interface AudioPlayerCallbacks {
  readonly onPlaybackStarted: () => void;
  readonly onPlaybackEnded: () => void;
  readonly onError: (error: AudioError) => void;
}

export class AudioPlayer {
  private context: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private _state: PlaybackState = "idle";
  private callbacks: AudioPlayerCallbacks | null = null;
  private readonly queue: string[] = [];
  private isProcessing: boolean = false;

  get state(): PlaybackState {
    return this._state;
  }

  async initialize(): Promise<void> {
    if (this.context) return;
    this.context = new AudioContext();
    if (this.context.state === "suspended") {
      await this.context.resume();
    }
  }

  setCallbacks(callbacks: AudioPlayerCallbacks): void {
    this.callbacks = callbacks;
  }

  enqueue(base64Audio: string): void {
    this.queue.push(base64Audio);
    void this.processQueue();
  }

  async stopPlayback(): Promise<void> {
    if (this.currentSource) {
      this.currentSource.onended = null;
      this.currentSource.stop();
      this.currentSource.disconnect();
      this.currentSource = null;
    }
    this.queue.length = 0;
    this.isProcessing = false;
    this._state = "idle";
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const base64 = this.queue.shift()!;
      await this.playChunk(base64);
    }

    this.isProcessing = false;
    this._state = "idle";
    this.callbacks?.onPlaybackEnded();
  }

  private async playChunk(base64Audio: string): Promise<void> {
    if (!this.context) {
      await this.initialize();
    }

    this._state = "loading";
    let audioBuffer: AudioBuffer;

    try {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      audioBuffer = await this.context!.decodeAudioData(bytes.buffer);
    } catch (error: unknown) {
      this._state = "error";
      this.callbacks?.onError(
        AudioError.playbackFailed(error instanceof Error ? error.message : "Decode failed")
      );
      return;
    }

    return new Promise<void>((resolve) => {
      this._state = "playing";
      this.callbacks?.onPlaybackStarted();

      const source = this.context!.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.context!.destination);

      source.onended = () => {
        source.disconnect();
        this.currentSource = null;
        resolve();
      };

      this.currentSource = source;
      source.start(0);
    });
  }

  destroy(): void {
    void this.stopPlayback();
    if (this.context && this.context.state !== "closed") {
      void this.context.close();
    }
    this.context = null;
    this.callbacks = null;
  }
}
