/**
 * VAD and Barge-In Configuration
 *
 * Responsibilities:
 * - Centralize VAD parameters
 * - Centralize barge-in parameters
 * - Avoid configuration duplication
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY configuration
 */
// @ts-nocheck


// ============================================================================
// VAD CONFIGURATION
// ============================================================================

export interface VADConfiguration {
  speechThreshold: number;
  silenceThreshold: number;
  minSpeechDuration: number;
  silenceDuration: number;
  frameSize: number;
  sampleRate: number;
}

// ============================================================================
// BARGE-IN CONFIGURATION
// ============================================================================

export interface BargeInConfiguration {
  enabled: boolean;
  interruptionDelay: number;
  resumeDelay: number;
  maxInterruptions: number;
  interruptionCooldown: number;
}

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const DEFAULT_VAD_CONFIGURATION: VADConfiguration = {
  speechThreshold: 0.02,
  silenceThreshold: 0.01,
  minSpeechDuration: 200,
  silenceDuration: 500,
  frameSize: 512,
  sampleRate: 48000
};

export const DEFAULT_BARGE_IN_CONFIGURATION: BargeInConfiguration = {
  enabled: true,
  interruptionDelay: 100,
  resumeDelay: 300,
  maxInterruptions: 10,
  interruptionCooldown: 1000
};

// ============================================================================
// COMBINED CONFIGURATION
// ============================================================================

export interface VADAndBargeInConfiguration {
  vad: VADConfiguration;
  bargeIn: BargeInConfiguration;
}

export const DEFAULT_VAD_AND_BARGE_IN_CONFIGURATION: VADAndBargeInConfiguration = {
  vad: DEFAULT_VAD_CONFIGURATION,
  bargeIn: DEFAULT_BARGE_IN_CONFIGURATION
};
