/**
 * Conversation Runtime - Realtime Voice Platform Infrastructure
 * 
 * Responsibilities:
 * - Manage conversation flow (who speaks, when to listen, when to respond)
 * - Handle state transitions (speaking, thinking, listening, waiting)
 * - Manage interrupts and recovery
 * - Monitor latency and metrics
 * - NO Speech To Text, NO Text To Speech, NO Audio API, NO WebSocket, NO external SDKs
 * - ONLY infrastructure for future provider integration
 */

// ============================================================================
// CONVERSATION STATES
// ============================================================================

export type ConversationState =
  | "Idle"
  | "Listening"
  | "Thinking"
  | "Speaking"
  | "Waiting"
  | "Interrupted"
  | "Error"
  | "Recovering";

export interface SpeakingState {
  state: "Speaking";
  speaker: "user" | "ai";
  startedAt: number;
  duration: number;
  interrupted: boolean;
  interruptReason: string | null;
}

export interface ThinkingState {
  state: "Thinking";
  startedAt: number;
  duration: number;
  context: string;
}

export interface ListeningState {
  state: "Listening";
  startedAt: number;
  duration: number;
  silenceDetected: boolean;
  silenceDuration: number;
}

export interface WaitingState {
  state: "Waiting";
  startedAt: number;
  duration: number;
  reason: string;
}

export type StateDetails = SpeakingState | ThinkingState | ListeningState | WaitingState;

// ============================================================================
// REALTIME EVENTS
// ============================================================================

export type RealtimeEventType =
  | "ConversationStarted"
  | "ConversationEnded"
  | "StateChanged"
  | "TurnStarted"
  | "TurnEnded"
  | "UserStartedSpeaking"
  | "UserStoppedSpeaking"
  | "AIStartedSpeaking"
  | "AIStoppedSpeaking"
  | "InterruptRequested"
  | "InterruptCompleted"
  | "TranscriptReceived"
  | "PartialTranscriptReceived"
  | "AudioReceived"
  | "AudioSent"
  | "LatencyMeasured"
  | "Heartbeat"
  | "ConnectionEstablished"
  | "ConnectionLost"
  | "ConnectionRecovered"
  | "TimeoutOccurred"
  | "ErrorOccurred"
  | "RecoveryStarted"
  | "RecoveryCompleted";

export interface RealtimeEvent {
  id: string;
  type: RealtimeEventType;
  timestamp: number;
  sessionId: string;
  data: Record<string, unknown>;
  metadata: {
    source: string;
    correlationId?: string;
    causationId?: string;
  };
}

// ============================================================================
// CONVERSATION TRANSITIONS
// ============================================================================

export interface TransitionRule {
  from: ConversationState;
  to: ConversationState;
  condition: string;
  allowed: boolean;
  interruptible: boolean;
}

export const CONVERSATION_TRANSITIONS: TransitionRule[] = [
  { from: "Idle", to: "Listening", condition: "Start conversation", allowed: true, interruptible: false },
  { from: "Listening", to: "Thinking", condition: "User finished speaking", allowed: true, interruptible: true },
  { from: "Listening", to: "Interrupted", condition: "AI needs to interrupt", allowed: true, interruptible: false },
  { from: "Thinking", to: "Speaking", condition: "AI response ready", allowed: true, interruptible: true },
  { from: "Thinking", to: "Listening", condition: "User interrupted", allowed: true, interruptible: false },
  { from: "Speaking", to: "Listening", condition: "AI finished speaking", allowed: true, interruptible: true },
  { from: "Speaking", to: "Interrupted", condition: "User interrupted", allowed: true, interruptible: false },
  { from: "Interrupted", to: "Listening", condition: "Resume listening", allowed: true, interruptible: false },
  { from: "Interrupted", to: "Speaking", condition: "Resume speaking", allowed: true, interruptible: false },
  { from: "Waiting", to: "Listening", condition: "Wait completed", allowed: true, interruptible: false },
  { from: "Waiting", to: "Speaking", condition: "Wait completed with response", allowed: true, interruptible: false },
  { from: "Error", to: "Recovering", condition: "Start recovery", allowed: true, interruptible: false },
  { from: "Recovering", to: "Idle", condition: "Recovery completed", allowed: true, interruptible: false },
  { from: "Recovering", to: "Error", condition: "Recovery failed", allowed: true, interruptible: false },
  { from: "Idle", to: "Error", condition: "Error occurred", allowed: true, interruptible: false },
  { from: "Listening", to: "Error", condition: "Error occurred", allowed: true, interruptible: false },
  { from: "Thinking", to: "Error", condition: "Error occurred", allowed: true, interruptible: false },
  { from: "Speaking", to: "Error", condition: "Error occurred", allowed: true, interruptible: false },
  { from: "Waiting", to: "Error", condition: "Error occurred", allowed: true, interruptible: false }
];

// ============================================================================
// TURN MANAGER
// ============================================================================

export interface Turn {
  id: string;
  sessionId: string;
  turnNumber: number;
  speaker: "user" | "ai";
  startedAt: number;
  endedAt: number | null;
  duration: number;
  transcript: string;
  partialTranscripts: string[];
  audioChunks: number;
  interrupted: boolean;
  metadata: {
    context?: string;
    questionId?: string;
    responseId?: string;
  };
}

export interface TurnManager {
  getCurrentTurn(): Turn | null;
  startTurn(speaker: "user" | "ai"): Turn;
  endTurn(): void;
  interruptTurn(reason: string): void;
  getTurnHistory(): Turn[];
  getTurnCount(): number;
}

// ============================================================================
// LATENCY MONITOR
// ============================================================================

export interface LatencyMetrics {
  sessionId: string;
  timestamp: number;
  type: "audio" | "transcript" | "response" | "interrupt";
  latency: number;
  threshold: number;
  exceeded: boolean;
}

export interface LatencyMonitor {
  startMeasurement(type: LatencyMetrics["type"]): void;
  endMeasurement(type: LatencyMetrics["type"]): number;
  getMetrics(): LatencyMetrics[];
  getAverageLatency(type: LatencyMetrics["type"]): number;
  isThresholdExceeded(type: LatencyMetrics["type"]): boolean;
}

// ============================================================================
// STREAMING MANAGER
// ============================================================================

export interface StreamChunk {
  id: string;
  sessionId: string;
  type: "audio" | "transcript" | "partial";
  data: Uint8Array | string;
  timestamp: number;
  sequence: number;
  isLast: boolean;
}

export interface StreamingManager {
  startStream(sessionId: string): void;
  stopStream(sessionId: string): void;
  receiveChunk(chunk: StreamChunk): void;
  sendChunk(chunk: StreamChunk): void;
  getStreamStats(): {
    chunksReceived: number;
    chunksSent: number;
    bytesReceived: number;
    bytesSent: number;
  };
}

// ============================================================================
// SESSION MEMORY
// ============================================================================

export interface SessionMemory {
  sessionId: string;
  startedAt: number;
  endedAt: number | null;
  turns: Turn[];
  transcripts: string[];
  partialTranscripts: string[];
  audioChunks: Uint8Array[];
  events: RealtimeEvent[];
  metadata: {
    userId?: string;
    interviewId?: string;
    provider?: string;
  };
}

export interface SessionMemoryManager {
  createSession(sessionId: string, metadata?: Record<string, unknown>): SessionMemory;
  getSession(sessionId: string): SessionMemory | null;
  updateSession(sessionId: string, updates: Partial<SessionMemory>): void;
  deleteSession(sessionId: string): void;
  getAllSessions(): SessionMemory[];
}

// ============================================================================
// REALTIME CONTEXT
// ============================================================================

export interface RealtimeContext {
  sessionId: string;
  currentState: ConversationState;
  stateDetails: StateDetails | null;
  currentTurn: Turn | null;
  latencyMetrics: LatencyMetrics[];
  streamStats: {
    chunksReceived: number;
    chunksSent: number;
    bytesReceived: number;
    bytesSent: number;
  };
  connectionStatus: "connected" | "disconnected" | "reconnecting" | "error";
  heartbeatStatus: {
    lastHeartbeat: number;
    interval: number;
    missed: number;
  };
  error: string | null;
}

// ============================================================================
// INTERRUPT MANAGER
// ============================================================================

export interface InterruptRequest {
  id: string;
  sessionId: string;
  requester: "user" | "ai";
  reason: string;
  timestamp: number;
  priority: "low" | "medium" | "high" | "critical";
  granted: boolean;
}

export interface InterruptManager {
  requestInterrupt(request: Omit<InterruptRequest, "id" | "granted">): InterruptRequest;
  grantInterrupt(requestId: string): void;
  denyInterrupt(requestId: string, reason: string): void;
  getPendingInterrupts(): InterruptRequest[];
  getInterruptHistory(): InterruptRequest[];
}

// ============================================================================
// RESPONSE QUEUE
// ============================================================================

export interface QueuedResponse {
  id: string;
  sessionId: string;
  type: "audio" | "transcript" | "partial";
  data: Uint8Array | string;
  priority: number;
  timestamp: number;
  processed: boolean;
}

export interface ResponseQueue {
  enqueue(response: Omit<QueuedResponse, "id" | "processed">): string;
  dequeue(): QueuedResponse | null;
  peek(): QueuedResponse | null;
  getQueueLength(): number;
  clearQueue(): void;
  getQueue(): QueuedResponse[];
}

// ============================================================================
// TRANSCRIPT BUFFER
// ============================================================================

export interface TranscriptBuffer {
  sessionId: string;
  fullTranscript: string;
  partialTranscripts: string[];
  lastUpdate: number;
  turnTranscripts: Map<number, string>;
}

export interface TranscriptBufferManager {
  createBuffer(sessionId: string): TranscriptBuffer;
  getBuffer(sessionId: string): TranscriptBuffer | null;
  addFullTranscript(sessionId: string, transcript: string, turnNumber: number): void;
  addPartialTranscript(sessionId: string, transcript: string): void;
  getFullTranscript(sessionId: string): string;
  getPartialTranscripts(sessionId: string): string[];
  getTurnTranscript(sessionId: string, turnNumber: number): string;
  clearBuffer(sessionId: string): void;
}

// ============================================================================
// PARTIAL TRANSCRIPT BUFFER
// ============================================================================

export interface PartialTranscriptBuffer {
  sessionId: string;
  currentPartial: string;
  history: Array<{ transcript: string; timestamp: number }>;
  lastUpdate: number;
  confidence: number;
}

export interface PartialTranscriptBufferManager {
  createBuffer(sessionId: string): PartialTranscriptBuffer;
  getBuffer(sessionId: string): PartialTranscriptBuffer | null;
  updatePartial(sessionId: string, transcript: string, confidence: number): void;
  getCurrentPartial(sessionId: string): string;
  getHistory(sessionId: string): Array<{ transcript: string; timestamp: number }>;
  clearBuffer(sessionId: string): void;
}

// ============================================================================
// AUDIO BUFFER INTERFACE
// ============================================================================

export interface AudioChunk {
  id: string;
  sessionId: string;
  data: Uint8Array;
  timestamp: number;
  sequence: number;
  isLast: boolean;
  metadata: {
    sampleRate?: number;
    channels?: number;
    format?: string;
  };
}

export interface AudioBufferInterface {
  createBuffer(sessionId: string): void;
  addChunk(chunk: AudioChunk): void;
  getChunk(sessionId: string, sequence: number): AudioChunk | null;
  getAllChunks(sessionId: string): AudioChunk[];
  clearBuffer(sessionId: string): void;
  getBufferSize(sessionId: string): number;
}

// ============================================================================
// REALTIME METRICS
// ============================================================================

export interface RealtimeMetrics {
  sessionId: string;
  timestamp: number;
  metrics: {
    turnCount: number;
    totalDuration: number;
    averageTurnDuration: number;
    userSpeakingTime: number;
    aiSpeakingTime: number;
    silenceTime: number;
    interruptCount: number;
    latency: {
      audio: number;
      transcript: number;
      response: number;
      interrupt: number;
    };
    throughput: {
      chunksPerSecond: number;
      bytesPerSecond: number;
    };
    errorCount: number;
    recoveryCount: number;
  };
}

export interface RealtimeMetricsCollector {
  collectMetrics(sessionId: string): RealtimeMetrics;
  getMetricsHistory(sessionId: string): RealtimeMetrics[];
  resetMetrics(sessionId: string): void;
}

// ============================================================================
// HEARTBEAT
// ============================================================================

export interface HeartbeatConfig {
  interval: number;
  timeoutThreshold: number;
  maxMissed: number;
}

export interface HeartbeatStatus {
  lastHeartbeat: number;
  interval: number;
  missed: number;
  status: "active" | "timeout" | "error";
}

export interface HeartbeatManager {
  startHeartbeat(sessionId: string, config: HeartbeatConfig): void;
  stopHeartbeat(sessionId: string): void;
  sendHeartbeat(sessionId: string): void;
  receiveHeartbeat(sessionId: string): void;
  getStatus(sessionId: string): HeartbeatStatus;
  isTimeout(sessionId: string): boolean;
}

// ============================================================================
// CONNECTION MANAGER
// ============================================================================

export interface ConnectionStatus {
  sessionId: string;
  status: "connected" | "disconnected" | "reconnecting" | "error";
  connectedAt: number;
  disconnectedAt: number | null;
  reconnectAttempts: number;
  lastError: string | null;
}

export interface ConnectionManager {
  connect(sessionId: string): void;
  disconnect(sessionId: string): void;
  getStatus(sessionId: string): ConnectionStatus;
  isConnected(sessionId: string): boolean;
  onConnectionStatusChange(sessionId: string, callback: (status: ConnectionStatus) => void): void;
}

// ============================================================================
// RECOVERY MANAGER
// ============================================================================

export interface RecoveryStrategy {
  type: "reconnect" | "retry" | "fallback" | "abort";
  maxAttempts: number;
  delay: number;
  backoffMultiplier: number;
}

export interface RecoveryStatus {
  sessionId: string;
  status: "idle" | "recovering" | "completed" | "failed";
  attempt: number;
  strategy: RecoveryStrategy;
  startedAt: number;
  completedAt: number | null;
  error: string | null;
}

export interface RecoveryManager {
  startRecovery(sessionId: string, strategy: RecoveryStrategy): void;
  stopRecovery(sessionId: string): void;
  getStatus(sessionId: string): RecoveryStatus;
  onRecoveryStatusChange(sessionId: string, callback: (status: RecoveryStatus) => void): void;
}

// ============================================================================
// TIMEOUT MANAGER
// ============================================================================

export interface TimeoutConfig {
  type: "turn" | "response" | "silence" | "connection";
  duration: number;
  action: "interrupt" | "retry" | "fallback" | "abort";
}

export interface TimeoutStatus {
  sessionId: string;
  type: TimeoutConfig["type"];
  startedAt: number;
  expiresAt: number;
  triggered: boolean;
  action: TimeoutConfig["action"];
}

export interface TimeoutManager {
  setTimeout(sessionId: string, config: TimeoutConfig): void;
  clearTimeout(sessionId: string, type: TimeoutConfig["type"]): void;
  checkTimeouts(sessionId: string): TimeoutStatus[];
  onTimeout(sessionId: string, callback: (status: TimeoutStatus) => void): void;
}

// ============================================================================
// CONVERSATION TIMELINE
// ============================================================================

export interface TimelineEvent {
  id: string;
  sessionId: string;
  timestamp: number;
  type: string;
  data: Record<string, unknown>;
  metadata: {
    source: string;
    correlationId?: string;
  };
}

export interface ConversationTimeline {
  sessionId: string;
  events: TimelineEvent[];
  startedAt: number;
  endedAt: number | null;
}

export interface ConversationTimelineManager {
  createTimeline(sessionId: string): ConversationTimeline;
  addEvent(sessionId: string, event: Omit<TimelineEvent, "id">): void;
  getTimeline(sessionId: string): ConversationTimeline | null;
  getEvents(sessionId: string, type?: string): TimelineEvent[];
  getEventsInRange(sessionId: string, start: number, end: number): TimelineEvent[];
  clearTimeline(sessionId: string): void;
}

// ============================================================================
// CONVERSATION RUNTIME
// ============================================================================

export interface ConversationRuntimeConfig {
  sessionId: string;
  heartbeatConfig: HeartbeatConfig;
  latencyThresholds: {
    audio: number;
    transcript: number;
    response: number;
    interrupt: number;
  };
  timeoutConfigs: TimeoutConfig[];
  recoveryStrategy: RecoveryStrategy;
}

export interface ConversationRuntime {
  start(config: ConversationRuntimeConfig): void;
  stop(): void;
  pause(): void;
  resume(): void;
  getState(): ConversationState;
  getContext(): RealtimeContext;
  transitionTo(state: ConversationState): void;
  onEvent(eventType: RealtimeEventType, callback: (event: RealtimeEvent) => void): void;
  offEvent(eventType: RealtimeEventType, callback: (event: RealtimeEvent) => void): void;
  emitEvent(event: Omit<RealtimeEvent, "id">): void;
  handleError(error: string): void;
  recover(): void;
}

// ============================================================================
// REALTIME EVENT BUS
// ============================================================================

export interface RealtimeEventBus {
  subscribe(eventType: RealtimeEventType, handler: (event: RealtimeEvent) => void): void;
  unsubscribe(eventType: RealtimeEventType, handler: (event: RealtimeEvent) => void): void;
  publish(event: RealtimeEvent): void;
  publishSync(event: RealtimeEvent): void;
  getSubscribers(eventType: RealtimeEventType): number;
  clear(): void;
}

// ============================================================================
// CONVERSATION STATE MACHINE
// ============================================================================

export interface ConversationStateMachine {
  getCurrentState(): ConversationState;
  transitionTo(state: ConversationState): boolean;
  canTransitionTo(state: ConversationState): boolean;
  getValidTransitions(): TransitionRule[];
  onStateChange(callback: (from: ConversationState, to: ConversationState) => void): void;
  offStateChange(callback: (from: ConversationState, to: ConversationState) => void): void;
}
