/**
 * Audio Configuration
 *
 * Responsibilities:
 * - Centralize audio configuration
 * - Define audio parameters
 * - Avoid configuration duplication
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY audio configuration
 */
// @ts-nocheck


// ============================================================================
// AUDIO CONFIGURATION
// ============================================================================

export interface AudioConfiguration {
  sampleRate: number;
  channels: number;
  bufferSize: number;
  format: "pcm16" | "mulaw" | "alaw";
  latency: number;
  inputDeviceId?: string;
  outputDeviceId?: string;
}

// ============================================================================
// DEFAULT AUDIO CONFIGURATION
// ============================================================================

export const DEFAULT_AUDIO_CONFIGURATION: AudioConfiguration = {
  sampleRate: 48000,
  channels: 1,
  bufferSize: 4096,
  format: "pcm16",
  latency: 20
};

// ============================================================================
// AUDIO CONFIGURATION VALIDATOR
// ============================================================================

export interface AudioConfigurationValidator {
  validate(config: AudioConfiguration): boolean;
  getSupportedSampleRates(): number[];
  getSupportedChannels(): number[];
  getSupportedBufferSizes(): number[];
}

export class AudioConfigurationValidatorImpl implements AudioConfigurationValidator {
  validate(config: AudioConfiguration): boolean {
    const supportedSampleRates = this.getSupportedSampleRates();
    const supportedChannels = this.getSupportedChannels();
    const supportedBufferSizes = this.getSupportedBufferSizes();

    return (
      supportedSampleRates.includes(config.sampleRate) &&
      supportedChannels.includes(config.channels) &&
      supportedBufferSizes.includes(config.bufferSize) &&
      config.latency >= 0
    );
  }

  getSupportedSampleRates(): number[] {
    return [8000, 16000, 24000, 48000];
  }

  getSupportedChannels(): number[] {
    return [1, 2];
  }

  getSupportedBufferSizes(): number[] {
    return [512, 1024, 2048, 4096, 8192];
  }
}
