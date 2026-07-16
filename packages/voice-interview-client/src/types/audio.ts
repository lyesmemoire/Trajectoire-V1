/**
 * Audio-related types for the SDK.
 */

export interface AudioConstraints {
  readonly sampleRate: number;
  readonly channelCount: number;
  readonly echoCancellation: boolean;
  readonly noiseSuppression: boolean;
  readonly autoGainControl: boolean;
}

export interface AudioLevel {
  /** RMS level 0–1 */
  readonly rms: number;
  /** Peak level 0–1 */
  readonly peak: number;
  /** Whether the level exceeds the VAD threshold */
  readonly isSpeaking: boolean;
}

export interface AudioChunk {
  /** Raw audio data as base64-encoded string */
  readonly data: string;
  /** Duration of this chunk in milliseconds */
  readonly durationMs: number;
  /** Sequence number for ordering */
  readonly sequence: number;
}

export type MicrophoneState = "inactive" | "requesting" | "active" | "error";

export type PlaybackState = "idle" | "loading" | "playing" | "paused" | "error";

export interface AudioDeviceInfo {
  readonly deviceId: string;
  readonly label: string;
  readonly isDefault: boolean;
}
