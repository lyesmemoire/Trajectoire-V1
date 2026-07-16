/**
 * @voice-interview/client — Public API
 *
 * Framework-agnostic SDK for Voice Interview Engine.
 * Works in React, React Native, Electron, Node, Vue, Angular.
 */

// Main client
export { VoiceInterviewClient } from "./VoiceInterviewClient.js";

// Types
export type {
  VoiceClientConfig,
  ConnectionConfig,
  AudioConfig,
  TelemetryConfig,
  FeatureFlags,
  DeepPartial,
} from "./types/index.js";

export {
  DEFAULT_CONFIG,
  mergeConfig,
} from "./types/index.js";

export type {
  VoiceClientEventMap,
  VoiceClientEventName,
  StateChangeEvent,
  QuestionEvent,
  AudioEvent,
  TranscriptEvent,
  CompletedEvent,
  ErrorEvent,
  ConnectionEvent,
  AudioLevelEvent,
} from "./types/index.js";

export type {
  TelemetrySnapshot,
  LatencyMetric,
  SpanContext,
} from "./types/index.js";

export type {
  MicrophoneState,
  PlaybackState,
  AudioLevel,
} from "./types/index.js";

export type {
  OutboundMessage,
  InboundMessage,
  FeedbackSignal,
  TurnIntent,
} from "./types/index.js";

export { PROTOCOL_VERSION } from "./types/index.js";

// State machine
export { ClientState, ClientEvent, TERMINAL_STATES, ACTIVE_STATES } from "./state-machine/index.js";
export type { TransitionResult } from "./state-machine/index.js";

// Errors
export { VoiceClientError } from "./errors/index.js";
export { ConnectionError } from "./errors/index.js";
export { AudioError } from "./errors/index.js";
export { ProtocolError } from "./errors/index.js";
export { StateError } from "./errors/index.js";
