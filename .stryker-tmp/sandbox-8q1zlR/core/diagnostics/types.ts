/**
 * Diagnostic Mode Types
 *
 * Pure observation types for Runtime Diagnostic Mode.
 * No business logic, no state modification, only data collection.
 */
// @ts-nocheck


// ============================================================================
// CORRELATION ID
// ============================================================================

export interface CorrelationContext {
  correlationId: string;
  parentId: string | null;
  traceId: string;
}

// ============================================================================
// EVENT TRACE
// ============================================================================

export interface EventTrace {
  eventId: string;
  eventType: string;
  timestamp: Date;
  source: string;
  destination: string;
  duration: number;
  correlationId: string | null;
  traceId: string | null;
  metadata: Record<string, unknown>;
}

// ============================================================================
// RUNTIME METRICS
// ============================================================================

export interface RuntimeMetrics {
  currentState: string;
  previousState: string;
  uptime: number;
  transitionCount: number;
  stateMachineState: string;
  lastTransitionTimestamp: Date;
}

// ============================================================================
// PROVIDER METRICS
// ============================================================================

export interface ProviderMetrics {
  activeProvider: string | null;
  providerState: string;
  connectionState: "connected" | "disconnected" | "connecting" | "error";
  reconnectionCount: number;
  heartbeatActive: boolean;
  lastHeartbeatTimestamp: Date | null;
  errorCount: number;
  lastErrorTimestamp: Date | null;
  lastErrorMessage: string | null;
}

// ============================================================================
// SESSION METRICS
// ============================================================================

export interface SessionMetrics {
  activeSession: boolean;
  sessionId: string | null;
  sessionDuration: number;
  messageCount: number;
  sessionStatus: string;
  sessionStartTime: Date | null;
}

// ============================================================================
// WEBSOCKET METRICS
// ============================================================================

export interface WebSocketMetrics {
  connected: boolean;
  disconnected: boolean;
  reconnectionCount: number;
  lastPingTimestamp: Date | null;
  lastPongTimestamp: Date | null;
  averageResponseTime: number;
  connectionUptime: number;
}

// ============================================================================
// AUDIO METRICS
// ============================================================================

export interface AudioMetrics {
  inputBufferSize: number;
  outputBufferSize: number;
  inputBufferMaxSize: number;
  outputBufferMaxSize: number;
  backpressure: boolean;
  overflowCount: number;
  underflowCount: number;
  lastOverflowTimestamp: Date | null;
  lastUnderflowTimestamp: Date | null;
}

// ============================================================================
// STREAMING METRICS
// ============================================================================

export interface StreamingMetrics {
  totalChunks: number;
  chunksSent: number;
  chunksReceived: number;
  chunksPerSecond: number;
  bytesPerSecond: number;
  lastChunkTimestamp: Date | null;
}

// ============================================================================
// VOICE ACTIVITY METRICS
// ============================================================================

export interface VoiceActivityMetrics {
  vadState: "speaking" | "silence" | "unknown";
  bargeInState: "idle" | "detecting" | "interrupted";
  interruptionCount: number;
  lastInterruptionTimestamp: Date | null;
  silenceDuration: number;
  speakingDuration: number;
}

// ============================================================================
// LATENCY METRICS
// ============================================================================

export interface LatencyMetrics {
  microphoneToProvider: number;
  providerToFirstToken: number;
  firstTokenToFirstAudio: number;
  totalResponseTime: number;
  averageLatency: number;
  maxLatency: number;
  minLatency: number;
}

// ============================================================================
// PROCESSING TIME METRICS
// ============================================================================

export interface ProcessingTimeMetrics {
  component: string;
  averageTime: number;
  maxTime: number;
  minTime: number;
  sampleCount: number;
  lastSampleTimestamp: Date | null;
}

// ============================================================================
// EVENT RECORDING
// ============================================================================

export interface DiagnosticEvent {
  id: string;
  source: "runtime" | "provider" | "audio" | "streaming" | "session" | "connector" | "orchestrator";
  eventType: string;
  timestamp: Date;
  data: Record<string, unknown>;
}

// ============================================================================
// DIAGNOSTIC SNAPSHOT
// ============================================================================

export interface DiagnosticSnapshot {
  timestamp: Date;
  runtime: RuntimeMetrics;
  provider: ProviderMetrics;
  session: SessionMetrics;
  webSocket: WebSocketMetrics;
  audio: AudioMetrics;
  streaming: StreamingMetrics;
  voiceActivity: VoiceActivityMetrics;
  latency: LatencyMetrics;
  processingTimes: Record<string, ProcessingTimeMetrics>;
  events: DiagnosticEvent[];
  timeline: TimelineEntry[];
}

// ============================================================================
// TIMELINE
// ============================================================================

export interface TimelineEntry {
  timestamp: Date;
  component: string;
  eventType: string;
  description: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// CONNECTION STATE
// ============================================================================

export interface ConnectionState {
  component: string;
  state: "connected" | "disconnected" | "connecting" | "error";
  timestamp: Date;
  previousState: string | null;
}
