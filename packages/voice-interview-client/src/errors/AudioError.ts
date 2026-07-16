import { VoiceClientError } from "./VoiceClientError.js";

export class AudioError extends VoiceClientError {
  constructor(message: string, code: string, recoverable: boolean = false) {
    super(message, code, recoverable);
    this.name = "AudioError";
  }

  static microphonePermissionDenied(): AudioError {
    return new AudioError("Microphone permission denied by user", "MIC_PERMISSION_DENIED", false);
  }

  static microphoneNotFound(): AudioError {
    return new AudioError("No microphone device found", "MIC_NOT_FOUND", false);
  }

  static microphoneInUse(): AudioError {
    return new AudioError("Microphone is already in use by another application", "MIC_IN_USE", true);
  }

  static recordingFailed(reason: string): AudioError {
    return new AudioError(`Recording failed: ${reason}`, "RECORDING_FAILED", true);
  }

  static playbackFailed(reason: string): AudioError {
    return new AudioError(`Audio playback failed: ${reason}`, "PLAYBACK_FAILED", true);
  }

  static audioContextFailed(reason: string): AudioError {
    return new AudioError(`AudioContext initialization failed: ${reason}`, "AUDIO_CONTEXT_FAILED", false);
  }
}
