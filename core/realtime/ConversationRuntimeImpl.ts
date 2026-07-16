import {
  Turn,
  TurnManager,
  LatencyMetrics,
  LatencyMonitor,
  StreamChunk,
  StreamingManager,
  SessionMemory,
  SessionMemoryManager,
  InterruptRequest,
  InterruptManager,
  QueuedResponse,
  ResponseQueue,
  TranscriptBuffer,
  TranscriptBufferManager,
  PartialTranscriptBuffer,
  PartialTranscriptBufferManager,
  AudioChunk,
  AudioBufferInterface,
  RealtimeMetrics,
  RealtimeMetricsCollector,
  HeartbeatConfig,
  HeartbeatStatus,
  HeartbeatManager,
  ConnectionStatus,
  ConnectionManager,
  RecoveryStrategy,
  RecoveryStatus,
  RecoveryManager,
  TimeoutConfig,
  TimeoutStatus,
  TimeoutManager,
  TimelineEvent,
  ConversationTimeline,
  ConversationTimelineManager,
  RealtimeEventBus,
  ConversationStateMachine,
  ConversationState,
  RealtimeEvent,
  RealtimeEventType,
  CONVERSATION_TRANSITIONS
} from "./ConversationRuntime";

// ============================================================================
// TURN MANAGER IMPLEMENTATION
// ============================================================================

export class TurnManagerImpl implements TurnManager {
  private currentTurn: Turn | null = null;
  private turnHistory: Turn[] = [];
  private turnCounter = 0;

  getCurrentTurn(): Turn | null {
    return this.currentTurn;
  }

  startTurn(speaker: "user" | "ai"): Turn {
    this.turnCounter++;
    const turn: Turn = {
      id: `turn_${this.turnCounter}`,
      sessionId: "",
      turnNumber: this.turnCounter,
      speaker,
      startedAt: Date.now(),
      endedAt: null,
      duration: 0,
      transcript: "",
      partialTranscripts: [],
      audioChunks: 0,
      interrupted: false,
      metadata: {}
    };
    this.currentTurn = turn;
    return turn;
  }

  endTurn(): void {
    if (this.currentTurn) {
      this.currentTurn.endedAt = Date.now();
      this.currentTurn.duration = this.currentTurn.endedAt - this.currentTurn.startedAt;
      this.turnHistory.push(this.currentTurn);
      this.currentTurn = null;
    }
  }

  interruptTurn(_reason: string): void {
    if (this.currentTurn) {
      this.currentTurn.interrupted = true;
      this.currentTurn.endedAt = Date.now();
      this.currentTurn.duration = this.currentTurn.endedAt - this.currentTurn.startedAt;
      this.turnHistory.push(this.currentTurn);
      this.currentTurn = null;
    }
  }

  getTurnHistory(): Turn[] {
    return [...this.turnHistory];
  }

  getTurnCount(): number {
    return this.turnCounter;
  }
}

// ============================================================================
// LATENCY MONITOR IMPLEMENTATION
// ============================================================================

export class LatencyMonitorImpl implements LatencyMonitor {
  private measurements: Map<string, number> = new Map();
  private metrics: LatencyMetrics[] = [];
  private thresholds: Record<string, number> = {
    audio: 100,
    transcript: 500,
    response: 1000,
    interrupt: 200
  };

  startMeasurement(type: LatencyMetrics["type"]): void {
    this.measurements.set(type, Date.now());
  }

  endMeasurement(type: LatencyMetrics["type"]): number {
    const startTime = this.measurements.get(type);
    if (!startTime) return 0;
    const latency = Date.now() - startTime;
    this.measurements.delete(type);
    
    const metric: LatencyMetrics = {
      sessionId: "",
      timestamp: Date.now(),
      type,
      latency,
      threshold: this.thresholds[type],
      exceeded: latency > this.thresholds[type]
    };
    this.metrics.push(metric);
    return latency;
  }

  getMetrics(): LatencyMetrics[] {
    return [...this.metrics];
  }

  getAverageLatency(type: LatencyMetrics["type"]): number {
    const typeMetrics = this.metrics.filter(m => m.type === type);
    if (typeMetrics.length === 0) return 0;
    const sum = typeMetrics.reduce((acc, m) => acc + m.latency, 0);
    return sum / typeMetrics.length;
  }

  isThresholdExceeded(type: LatencyMetrics["type"]): boolean {
    const typeMetrics = this.metrics.filter(m => m.type === type);
    if (typeMetrics.length === 0) return false;
    return typeMetrics.some(m => m.exceeded);
  }
}

// ============================================================================
// STREAMING MANAGER IMPLEMENTATION
// ============================================================================

export class StreamingManagerImpl implements StreamingManager {
  private activeStreams: Set<string> = new Set();
  private stats: Map<string, { chunksReceived: number; chunksSent: number; bytesReceived: number; bytesSent: number }> = new Map();

  startStream(sessionId: string): void {
    this.activeStreams.add(sessionId);
    this.stats.set(sessionId, { chunksReceived: 0, chunksSent: 0, bytesReceived: 0, bytesSent: 0 });
  }

  stopStream(sessionId: string): void {
    this.activeStreams.delete(sessionId);
  }

  receiveChunk(chunk: StreamChunk): void {
    const stats = this.stats.get(chunk.sessionId);
    if (stats) {
      stats.chunksReceived++;
      if (typeof chunk.data === "object" && chunk.data instanceof Uint8Array) {
        stats.bytesReceived += chunk.data.length;
      }
    }
  }

  sendChunk(chunk: StreamChunk): void {
    const stats = this.stats.get(chunk.sessionId);
    if (stats) {
      stats.chunksSent++;
      if (typeof chunk.data === "object" && chunk.data instanceof Uint8Array) {
        stats.bytesSent += chunk.data.length;
      }
    }
  }

  getStreamStats(): { chunksReceived: number; chunksSent: number; bytesReceived: number; bytesSent: number } {
    const total = { chunksReceived: 0, chunksSent: 0, bytesReceived: 0, bytesSent: 0 };
    this.stats.forEach(stats => {
      total.chunksReceived += stats.chunksReceived;
      total.chunksSent += stats.chunksSent;
      total.bytesReceived += stats.bytesReceived;
      total.bytesSent += stats.bytesSent;
    });
    return total;
  }
}

// ============================================================================
// SESSION MEMORY MANAGER IMPLEMENTATION
// ============================================================================

export class SessionMemoryManagerImpl implements SessionMemoryManager {
  private sessions: Map<string, SessionMemory> = new Map();

  createSession(sessionId: string, metadata?: Record<string, unknown>): SessionMemory {
    const session: SessionMemory = {
      sessionId,
      startedAt: Date.now(),
      endedAt: null,
      turns: [],
      transcripts: [],
      partialTranscripts: [],
      audioChunks: [],
      events: [],
      metadata: metadata || {}
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): SessionMemory | null {
    return this.sessions.get(sessionId) || null;
  }

  updateSession(sessionId: string, updates: Partial<SessionMemory>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
    }
  }

  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  getAllSessions(): SessionMemory[] {
    return Array.from(this.sessions.values());
  }
}

// ============================================================================
// INTERRUPT MANAGER IMPLEMENTATION
// ============================================================================

export class InterruptManagerImpl implements InterruptManager {
  private pendingInterrupts: InterruptRequest[] = [];
  private interruptHistory: InterruptRequest[] = [];
  private counter = 0;

  requestInterrupt(request: Omit<InterruptRequest, "id" | "granted">): InterruptRequest {
    this.counter++;
    const interrupt: InterruptRequest = {
      id: `interrupt_${this.counter}`,
      ...request,
      granted: false
    };
    this.pendingInterrupts.push(interrupt);
    return interrupt;
  }

  grantInterrupt(requestId: string): void {
    const interrupt = this.pendingInterrupts.find(i => i.id === requestId);
    if (interrupt) {
      interrupt.granted = true;
      this.interruptHistory.push(interrupt);
      this.pendingInterrupts = this.pendingInterrupts.filter(i => i.id !== requestId);
    }
  }

  denyInterrupt(requestId: string, _reason: string): void {
    this.pendingInterrupts = this.pendingInterrupts.filter(i => i.id !== requestId);
  }

  getPendingInterrupts(): InterruptRequest[] {
    return [...this.pendingInterrupts];
  }

  getInterruptHistory(): InterruptRequest[] {
    return [...this.interruptHistory];
  }
}

// ============================================================================
// RESPONSE QUEUE IMPLEMENTATION
// ============================================================================

export class ResponseQueueImpl implements ResponseQueue {
  private queue: QueuedResponse[] = [];
  private counter = 0;

  enqueue(response: Omit<QueuedResponse, "id" | "processed">): string {
    this.counter++;
    const queued: QueuedResponse = {
      id: `response_${this.counter}`,
      ...response,
      processed: false
    };
    this.queue.push(queued);
    this.queue.sort((a, b) => b.priority - a.priority);
    return queued.id;
  }

  dequeue(): QueuedResponse | null {
    const response = this.queue.shift();
    if (response) {
      response.processed = true;
    }
    return response || null;
  }

  peek(): QueuedResponse | null {
    return this.queue[0] || null;
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  clearQueue(): void {
    this.queue = [];
  }

  getQueue(): QueuedResponse[] {
    return [...this.queue];
  }
}

// ============================================================================
// TRANSCRIPT BUFFER MANAGER IMPLEMENTATION
// ============================================================================

export class TranscriptBufferManagerImpl implements TranscriptBufferManager {
  private buffers: Map<string, TranscriptBuffer> = new Map();

  createBuffer(sessionId: string): TranscriptBuffer {
    const buffer: TranscriptBuffer = {
      sessionId,
      fullTranscript: "",
      partialTranscripts: [],
      lastUpdate: Date.now(),
      turnTranscripts: new Map()
    };
    this.buffers.set(sessionId, buffer);
    return buffer;
  }

  getBuffer(sessionId: string): TranscriptBuffer | null {
    return this.buffers.get(sessionId) || null;
  }

  addFullTranscript(sessionId: string, transcript: string, turnNumber: number): void {
    const buffer = this.buffers.get(sessionId);
    if (buffer) {
      buffer.fullTranscript += (buffer.fullTranscript ? " " : "") + transcript;
      buffer.turnTranscripts.set(turnNumber, transcript);
      buffer.lastUpdate = Date.now();
    }
  }

  addPartialTranscript(sessionId: string, transcript: string): void {
    const buffer = this.buffers.get(sessionId);
    if (buffer) {
      buffer.partialTranscripts.push(transcript);
      buffer.lastUpdate = Date.now();
    }
  }

  getFullTranscript(sessionId: string): string {
    const buffer = this.buffers.get(sessionId);
    return buffer?.fullTranscript || "";
  }

  getPartialTranscripts(sessionId: string): string[] {
    const buffer = this.buffers.get(sessionId);
    return buffer?.partialTranscripts || [];
  }

  getTurnTranscript(sessionId: string, turnNumber: number): string {
    const buffer = this.buffers.get(sessionId);
    return buffer?.turnTranscripts.get(turnNumber) || "";
  }

  clearBuffer(sessionId: string): void {
    this.buffers.delete(sessionId);
  }
}

// ============================================================================
// PARTIAL TRANSCRIPT BUFFER MANAGER IMPLEMENTATION
// ============================================================================

export class PartialTranscriptBufferManagerImpl implements PartialTranscriptBufferManager {
  private buffers: Map<string, PartialTranscriptBuffer> = new Map();

  createBuffer(sessionId: string): PartialTranscriptBuffer {
    const buffer: PartialTranscriptBuffer = {
      sessionId,
      currentPartial: "",
      history: [],
      lastUpdate: Date.now(),
      confidence: 0
    };
    this.buffers.set(sessionId, buffer);
    return buffer;
  }

  getBuffer(sessionId: string): PartialTranscriptBuffer | null {
    return this.buffers.get(sessionId) || null;
  }

  updatePartial(sessionId: string, transcript: string, confidence: number): void {
    const buffer = this.buffers.get(sessionId);
    if (buffer) {
      if (buffer.currentPartial) {
        buffer.history.push({ transcript: buffer.currentPartial, timestamp: buffer.lastUpdate });
      }
      buffer.currentPartial = transcript;
      buffer.confidence = confidence;
      buffer.lastUpdate = Date.now();
    }
  }

  getCurrentPartial(sessionId: string): string {
    const buffer = this.buffers.get(sessionId);
    return buffer?.currentPartial || "";
  }

  getHistory(sessionId: string): Array<{ transcript: string; timestamp: number }> {
    const buffer = this.buffers.get(sessionId);
    return buffer?.history || [];
  }

  clearBuffer(sessionId: string): void {
    this.buffers.delete(sessionId);
  }
}

// ============================================================================
// AUDIO BUFFER INTERFACE IMPLEMENTATION
// ============================================================================

export class AudioBufferInterfaceImpl implements AudioBufferInterface {
  private buffers: Map<string, Map<number, AudioChunk>> = new Map();

  createBuffer(sessionId: string): void {
    this.buffers.set(sessionId, new Map());
  }

  addChunk(chunk: AudioChunk): void {
    const buffer = this.buffers.get(chunk.sessionId);
    if (buffer) {
      buffer.set(chunk.sequence, chunk);
    }
  }

  getChunk(sessionId: string, sequence: number): AudioChunk | null {
    const buffer = this.buffers.get(sessionId);
    return buffer?.get(sequence) || null;
  }

  getAllChunks(sessionId: string): AudioChunk[] {
    const buffer = this.buffers.get(sessionId);
    if (!buffer) return [];
    return Array.from(buffer.values()).sort((a, b) => a.sequence - b.sequence);
  }

  clearBuffer(sessionId: string): void {
    this.buffers.delete(sessionId);
  }

  getBufferSize(sessionId: string): number {
    const buffer = this.buffers.get(sessionId);
    return buffer?.size || 0;
  }
}

// ============================================================================
// REALTIME METRICS COLLECTOR IMPLEMENTATION
// ============================================================================

export class RealtimeMetricsCollectorImpl implements RealtimeMetricsCollector {
  private metricsHistory: Map<string, RealtimeMetrics[]> = new Map();

  collectMetrics(sessionId: string): RealtimeMetrics {
    const metrics: RealtimeMetrics = {
      sessionId,
      timestamp: Date.now(),
      metrics: {
        turnCount: 0,
        totalDuration: 0,
        averageTurnDuration: 0,
        userSpeakingTime: 0,
        aiSpeakingTime: 0,
        silenceTime: 0,
        interruptCount: 0,
        latency: {
          audio: 0,
          transcript: 0,
          response: 0,
          interrupt: 0
        },
        throughput: {
          chunksPerSecond: 0,
          bytesPerSecond: 0
        },
        errorCount: 0,
        recoveryCount: 0
      }
    };

    const history = this.metricsHistory.get(sessionId) || [];
    history.push(metrics);
    this.metricsHistory.set(sessionId, history);
    return metrics;
  }

  getMetricsHistory(sessionId: string): RealtimeMetrics[] {
    return this.metricsHistory.get(sessionId) || [];
  }

  resetMetrics(sessionId: string): void {
    this.metricsHistory.delete(sessionId);
  }
}

// ============================================================================
// HEARTBEAT MANAGER IMPLEMENTATION
// ============================================================================

export class HeartbeatManagerImpl implements HeartbeatManager {
  private configs: Map<string, HeartbeatConfig> = new Map();
  private statuses: Map<string, HeartbeatStatus> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  startHeartbeat(sessionId: string, config: HeartbeatConfig): void {
    this.configs.set(sessionId, config);
    this.statuses.set(sessionId, {
      lastHeartbeat: Date.now(),
      interval: config.interval,
      missed: 0,
      status: "active"
    });

    const timer = setInterval(() => {
      this.checkHeartbeat(sessionId);
    }, config.interval);
    this.timers.set(sessionId, timer);
  }

  stopHeartbeat(sessionId: string): void {
    const timer = this.timers.get(sessionId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(sessionId);
    }
    this.configs.delete(sessionId);
    this.statuses.delete(sessionId);
  }

  sendHeartbeat(sessionId: string): void {
    const status = this.statuses.get(sessionId);
    if (status) {
      status.lastHeartbeat = Date.now();
      status.missed = 0;
      status.status = "active";
    }
  }

  receiveHeartbeat(sessionId: string): void {
    const status = this.statuses.get(sessionId);
    if (status) {
      status.lastHeartbeat = Date.now();
      status.missed = 0;
      status.status = "active";
    }
  }

  getStatus(sessionId: string): HeartbeatStatus {
    const status = this.statuses.get(sessionId);
    return status || {
      lastHeartbeat: 0,
      interval: 0,
      missed: 0,
      status: "error"
    };
  }

  isTimeout(sessionId: string): boolean {
    const status = this.statuses.get(sessionId);
    return status?.status === "timeout" || false;
  }

  private checkHeartbeat(sessionId: string): void {
    const status = this.statuses.get(sessionId);
    const config = this.configs.get(sessionId);
    if (!status || !config) return;

    const elapsed = Date.now() - status.lastHeartbeat;
    if (elapsed > config.timeoutThreshold) {
      status.missed++;
      if (status.missed >= config.maxMissed) {
        status.status = "timeout";
      }
    }
  }
}

// ============================================================================
// CONNECTION MANAGER IMPLEMENTATION
// ============================================================================

export class ConnectionManagerImpl implements ConnectionManager {
  private statuses: Map<string, ConnectionStatus> = new Map();
  private callbacks: Map<string, ((status: ConnectionStatus) => void)[]> = new Map();

  connect(sessionId: string): void {
    const status: ConnectionStatus = {
      sessionId,
      status: "connected",
      connectedAt: Date.now(),
      disconnectedAt: null,
      reconnectAttempts: 0,
      lastError: null
    };
    this.statuses.set(sessionId, status);
    this.notifyCallbacks(sessionId, status);
  }

  disconnect(sessionId: string): void {
    const status = this.statuses.get(sessionId);
    if (status) {
      status.status = "disconnected";
      status.disconnectedAt = Date.now();
      this.notifyCallbacks(sessionId, status);
    }
  }

  getStatus(sessionId: string): ConnectionStatus {
    const status = this.statuses.get(sessionId);
    return status || {
      sessionId,
      status: "disconnected",
      connectedAt: 0,
      disconnectedAt: null,
      reconnectAttempts: 0,
      lastError: null
    };
  }

  isConnected(sessionId: string): boolean {
    const status = this.statuses.get(sessionId);
    return status?.status === "connected" || false;
  }

  onConnectionStatusChange(sessionId: string, callback: (status: ConnectionStatus) => void): void {
    if (!this.callbacks.has(sessionId)) {
      this.callbacks.set(sessionId, []);
    }
    this.callbacks.get(sessionId)!.push(callback);
  }

  private notifyCallbacks(sessionId: string, status: ConnectionStatus): void {
    const callbacks = this.callbacks.get(sessionId);
    if (callbacks) {
      callbacks.forEach(cb => cb(status));
    }
  }
}

// ============================================================================
// RECOVERY MANAGER IMPLEMENTATION
// ============================================================================

export class RecoveryManagerImpl implements RecoveryManager {
  private statuses: Map<string, RecoveryStatus> = new Map();
  private callbacks: Map<string, ((status: RecoveryStatus) => void)[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  startRecovery(sessionId: string, strategy: RecoveryStrategy): void {
    const status: RecoveryStatus = {
      sessionId,
      status: "recovering",
      attempt: 1,
      strategy,
      startedAt: Date.now(),
      completedAt: null,
      error: null
    };
    this.statuses.set(sessionId, status);
    this.notifyCallbacks(sessionId, status);
  }

  stopRecovery(sessionId: string): void {
    const timer = this.timers.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(sessionId);
    }
    const status = this.statuses.get(sessionId);
    if (status) {
      status.status = "idle";
      this.notifyCallbacks(sessionId, status);
    }
  }

  getStatus(sessionId: string): RecoveryStatus {
    const status = this.statuses.get(sessionId);
    return status || {
      sessionId,
      status: "idle",
      attempt: 0,
      strategy: { type: "reconnect", maxAttempts: 3, delay: 1000, backoffMultiplier: 2 },
      startedAt: 0,
      completedAt: null,
      error: null
    };
  }

  onRecoveryStatusChange(sessionId: string, callback: (status: RecoveryStatus) => void): void {
    if (!this.callbacks.has(sessionId)) {
      this.callbacks.set(sessionId, []);
    }
    this.callbacks.get(sessionId)!.push(callback);
  }

  private notifyCallbacks(sessionId: string, status: RecoveryStatus): void {
    const callbacks = this.callbacks.get(sessionId);
    if (callbacks) {
      callbacks.forEach(cb => cb(status));
    }
  }
}

// ============================================================================
// TIMEOUT MANAGER IMPLEMENTATION
// ============================================================================

export class TimeoutManagerImpl implements TimeoutManager {
  private timeouts: Map<string, Map<string, TimeoutStatus>> = new Map();
  private callbacks: Map<string, ((status: TimeoutStatus) => void)[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  setTimeout(sessionId: string, config: TimeoutConfig): void {
    if (!this.timeouts.has(sessionId)) {
      this.timeouts.set(sessionId, new Map());
    }

    const status: TimeoutStatus = {
      sessionId,
      type: config.type,
      startedAt: Date.now(),
      expiresAt: Date.now() + config.duration,
      triggered: false,
      action: config.action
    };
    this.timeouts.get(sessionId)!.set(config.type, status);

    const timerId = `${sessionId}_${config.type}`;
    const timer = setTimeout(() => {
      this.triggerTimeout(sessionId, config.type);
    }, config.duration);
    this.timers.set(timerId, timer);
  }

  clearTimeout(sessionId: string, type: TimeoutConfig["type"]): void {
    const timerId = `${sessionId}_${type}`;
    const timer = this.timers.get(timerId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(timerId);
    }
    const timeouts = this.timeouts.get(sessionId);
    if (timeouts) {
      timeouts.delete(type);
    }
  }

  checkTimeouts(sessionId: string): TimeoutStatus[] {
    const timeouts = this.timeouts.get(sessionId);
    if (!timeouts) return [];
    return Array.from(timeouts.values());
  }

  onTimeout(sessionId: string, callback: (status: TimeoutStatus) => void): void {
    if (!this.callbacks.has(sessionId)) {
      this.callbacks.set(sessionId, []);
    }
    this.callbacks.get(sessionId)!.push(callback);
  }

  private triggerTimeout(sessionId: string, type: TimeoutConfig["type"]): void {
    const timeouts = this.timeouts.get(sessionId);
    if (!timeouts) return;

    const status = timeouts.get(type);
    if (status && !status.triggered) {
      status.triggered = true;
      const callbacks = this.callbacks.get(sessionId);
      if (callbacks) {
        callbacks.forEach(cb => cb(status));
      }
    }
  }
}

// ============================================================================
// CONVERSATION TIMELINE MANAGER IMPLEMENTATION
// ============================================================================

export class ConversationTimelineManagerImpl implements ConversationTimelineManager {
  private timelines: Map<string, ConversationTimeline> = new Map();
  private counter = 0;

  createTimeline(sessionId: string): ConversationTimeline {
    const timeline: ConversationTimeline = {
      sessionId,
      events: [],
      startedAt: Date.now(),
      endedAt: null
    };
    this.timelines.set(sessionId, timeline);
    return timeline;
  }

  addEvent(sessionId: string, event: Omit<TimelineEvent, "id">): void {
    this.counter++;
    const timeline = this.timelines.get(sessionId);
    if (timeline) {
      const fullEvent: TimelineEvent = {
        id: `event_${this.counter}`,
        ...event
      };
      timeline.events.push(fullEvent);
    }
  }

  getTimeline(sessionId: string): ConversationTimeline | null {
    return this.timelines.get(sessionId) || null;
  }

  getEvents(sessionId: string, type?: string): TimelineEvent[] {
    const timeline = this.timelines.get(sessionId);
    if (!timeline) return [];
    if (type) {
      return timeline.events.filter(e => e.type === type);
    }
    return timeline.events;
  }

  getEventsInRange(sessionId: string, start: number, end: number): TimelineEvent[] {
    const timeline = this.timelines.get(sessionId);
    if (!timeline) return [];
    return timeline.events.filter(e => e.timestamp >= start && e.timestamp <= end);
  }

  clearTimeline(sessionId: string): void {
    this.timelines.delete(sessionId);
  }
}

// ============================================================================
// REALTIME EVENT BUS IMPLEMENTATION
// ============================================================================

export class RealtimeEventBusImpl implements RealtimeEventBus {
  private subscribers: Map<RealtimeEventType, ((event: RealtimeEvent) => void)[]> = new Map();

  subscribe(eventType: RealtimeEventType, handler: (event: RealtimeEvent) => void): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(handler);
  }

  unsubscribe(eventType: RealtimeEventType, handler: (event: RealtimeEvent) => void): void {
    const handlers = this.subscribers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  publish(event: RealtimeEvent): void {
    const handlers = this.subscribers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
  }

  publishSync(event: RealtimeEvent): void {
    const handlers = this.subscribers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
  }

  getSubscribers(eventType: RealtimeEventType): number {
    const handlers = this.subscribers.get(eventType);
    return handlers?.length || 0;
  }

  clear(): void {
    this.subscribers.clear();
  }
}

// ============================================================================
// CONVERSATION STATE MACHINE IMPLEMENTATION
// ============================================================================

export class ConversationStateMachineImpl implements ConversationStateMachine {
  private currentState: ConversationState = "Idle";
  private stateChangeCallbacks: ((from: ConversationState, to: ConversationState) => void)[] = [];

  getCurrentState(): ConversationState {
    return this.currentState;
  }

  transitionTo(state: ConversationState): boolean {
    if (!this.canTransitionTo(state)) {
      return false;
    }

    const from = this.currentState;
    this.currentState = state;
    this.notifyStateChange(from, state);
    return true;
  }

  canTransitionTo(state: ConversationState): boolean {
    const rule = CONVERSATION_TRANSITIONS.find(
      (r: { from: ConversationState; to: ConversationState; condition: string; allowed: boolean; interruptible: boolean }) => r.from === this.currentState && r.to === state
    );
    return rule?.allowed || false;
  }

  getValidTransitions(): { from: ConversationState; to: ConversationState; condition: string; allowed: boolean; interruptible: boolean }[] {
    return CONVERSATION_TRANSITIONS.filter(
      (r: { from: ConversationState; to: ConversationState; condition: string; allowed: boolean; interruptible: boolean }) => r.from === this.currentState && r.allowed
    );
  }

  onStateChange(callback: (from: ConversationState, to: ConversationState) => void): void {
    this.stateChangeCallbacks.push(callback);
  }

  offStateChange(callback: (from: ConversationState, to: ConversationState) => void): void {
    const index = this.stateChangeCallbacks.indexOf(callback);
    if (index > -1) {
      this.stateChangeCallbacks.splice(index, 1);
    }
  }

  private notifyStateChange(from: ConversationState, to: ConversationState): void {
    this.stateChangeCallbacks.forEach(cb => cb(from, to));
  }
}
