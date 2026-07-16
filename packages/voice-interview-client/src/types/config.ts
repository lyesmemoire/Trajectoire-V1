/**
 * SDK Configuration types.
 * Framework-agnostic. No runtime dependencies.
 */

export interface ConnectionConfig {
  /** Base URL of the backend REST API (e.g. "https://api.example.com") */
  readonly baseUrl: string;
  /** WebSocket URL (e.g. "wss://api.example.com/voice") */
  readonly wsUrl: string;
  /** Heartbeat interval in milliseconds. Default: 15000 */
  readonly heartbeatIntervalMs: number;
  /** Connection timeout in milliseconds. Default: 10000 */
  readonly connectionTimeoutMs: number;
  /** Maximum reconnection attempts. Default: 5 */
  readonly maxReconnectAttempts: number;
  /** Initial backoff delay in milliseconds. Default: 1000 */
  readonly initialBackoffMs: number;
  /** Maximum backoff delay in milliseconds. Default: 30000 */
  readonly maxBackoffMs: number;
  /** Backoff multiplier. Default: 2 */
  readonly backoffMultiplier: number;
}

export interface AudioConfig {
  /** Sample rate in Hz. Default: 16000 */
  readonly sampleRate: number;
  /** Number of audio channels. Default: 1 (mono) */
  readonly channelCount: number;
  /** Enable echo cancellation. Default: true */
  readonly echoCancellation: boolean;
  /** Enable noise suppression. Default: true */
  readonly noiseSuppression: boolean;
  /** Enable automatic gain control. Default: true */
  readonly autoGainControl: boolean;
  /** VAD energy threshold (0-1). Default: 0.01 */
  readonly vadThreshold: number;
  /** VAD silence duration before triggering speech end (ms). Default: 1500 */
  readonly vadSilenceMs: number;
  /** MIME type for MediaRecorder. Default: "audio/webm;codecs=opus" */
  readonly mimeType: string;
  /** Enable barge-in (interrupt TTS on user speech). Default: true */
  readonly bargeInEnabled: boolean;
}

export interface TelemetryConfig {
  /** Enable client-side telemetry. Default: true */
  readonly enabled: boolean;
  /** Enable debug overlay in developer mode. Default: false */
  readonly debugOverlay: boolean;
  /** Custom telemetry endpoint (optional). */
  readonly exporterUrl: string | null;
  /** Sampling rate (0-1). Default: 1.0 */
  readonly samplingRate: number;
}

export interface FeatureFlags {
  /** Enable Voice Activity Detection. Default: true */
  readonly vad: boolean;
  /** Enable barge-in. Default: true */
  readonly bargeIn: boolean;
  /** Enable debug overlay. Default: false */
  readonly debugOverlay: boolean;
  /** Enable audio visualizer. Default: true */
  readonly audioVisualizer: boolean;
}

export interface VoiceClientConfig {
  readonly connection: ConnectionConfig;
  readonly audio: AudioConfig;
  readonly telemetry: TelemetryConfig;
  readonly features: FeatureFlags;
}

export const DEFAULT_CONNECTION_CONFIG: ConnectionConfig = Object.freeze({
  baseUrl: "",
  wsUrl: "",
  heartbeatIntervalMs: 15_000,
  connectionTimeoutMs: 10_000,
  maxReconnectAttempts: 5,
  initialBackoffMs: 1_000,
  maxBackoffMs: 30_000,
  backoffMultiplier: 2,
});

export const DEFAULT_AUDIO_CONFIG: AudioConfig = Object.freeze({
  sampleRate: 16_000,
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  vadThreshold: 0.01,
  vadSilenceMs: 1_500,
  mimeType: "audio/webm;codecs=opus",
  bargeInEnabled: true,
});

export const DEFAULT_TELEMETRY_CONFIG: TelemetryConfig = Object.freeze({
  enabled: true,
  debugOverlay: false,
  exporterUrl: null,
  samplingRate: 1.0,
});

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = Object.freeze({
  vad: true,
  bargeIn: true,
  debugOverlay: false,
  audioVisualizer: true,
});

export const DEFAULT_CONFIG: VoiceClientConfig = Object.freeze({
  connection: DEFAULT_CONNECTION_CONFIG,
  audio: DEFAULT_AUDIO_CONFIG,
  telemetry: DEFAULT_TELEMETRY_CONFIG,
  features: DEFAULT_FEATURE_FLAGS,
});

export type DeepPartial<T> = {
  readonly [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export function mergeConfig(partial: DeepPartial<VoiceClientConfig>): VoiceClientConfig {
  return Object.freeze({
    connection: Object.freeze({ ...DEFAULT_CONNECTION_CONFIG, ...partial.connection }),
    audio: Object.freeze({ ...DEFAULT_AUDIO_CONFIG, ...partial.audio }),
    telemetry: Object.freeze({ ...DEFAULT_TELEMETRY_CONFIG, ...partial.telemetry }),
    features: Object.freeze({ ...DEFAULT_FEATURE_FLAGS, ...partial.features }),
  });
}
