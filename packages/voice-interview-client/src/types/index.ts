export type {
  VoiceClientConfig,
  ConnectionConfig,
  AudioConfig,
  TelemetryConfig,
  FeatureFlags,
  DeepPartial,
} from "./config.js";

export {
  DEFAULT_CONFIG,
  DEFAULT_CONNECTION_CONFIG,
  DEFAULT_AUDIO_CONFIG,
  DEFAULT_TELEMETRY_CONFIG,
  DEFAULT_FEATURE_FLAGS,
  mergeConfig,
} from "./config.js";

export type {
  InboundMessage,
  InboundStartMessage,
  InboundTurnMessage,
  InboundLifecycleMessage,
  InboundPingMessage,
  BaseInboundMessage,
  InboundMessageType,
  OutboundMessage,
  OutboundAudioMessage,
  OutboundTextMessage,
  OutboundStateMessage,
  OutboundErrorMessage,
  OutboundCompletedMessage,
  OutboundPongMessage,
  OutboundMessageType,
  TurnIntent,
  FeedbackSignal,
  TicketResponse,
} from "./protocol.js";

export { PROTOCOL_VERSION } from "./protocol.js";

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
} from "./events.js";

export type {
  AudioConstraints,
  AudioLevel,
  AudioChunk,
  MicrophoneState,
  PlaybackState,
  AudioDeviceInfo,
} from "./audio.js";

export type {
  LatencyMetric,
  SpanContext,
  TelemetrySnapshot,
  TelemetryExporterSink,
} from "./telemetry.js";
