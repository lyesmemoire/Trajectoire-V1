/**
 * Runtime Inspector Types
 *
 * Pure observation types for Runtime Inspector.
 * No business logic, no state modification, only read access.
 */
// @ts-nocheck


// ============================================================================
// RUNTIME STATE
// ============================================================================

export interface RuntimeState {
  currentState: string;
  previousState: string;
  uptime: number;
  transitionCount: number;
  stateMachineState: string;
  lastTransitionTimestamp: Date;
}

export interface RuntimeContext {
  sessionId: string | null;
  userId: string | null;
  pipelineId: string | null;
  metadata: Record<string, unknown>;
}

export interface RuntimeQueue {
  pendingOperations: number;
  activeOperations: number;
  completedOperations: number;
  failedOperations: number;
  queueSize: number;
}

export interface RuntimeLifecycle {
  status: "idle" | "initializing" | "running" | "paused" | "stopping" | "stopped" | "error";
  startTime: Date | null;
  stopTime: Date | null;
  duration: number;
}

// ============================================================================
// PROVIDER STATE
// ============================================================================

export interface ProviderState {
  activeProvider: string | null;
  providerState: string;
  connectionState: "connected" | "disconnected" | "connecting" | "error";
  runtimeState: string;
  health: "healthy" | "degraded" | "unhealthy";
  metrics: ProviderMetrics;
}

export interface ProviderMetrics {
  uptime: number;
  requestCount: number;
  errorCount: number;
  averageLatency: number;
  lastRequestTimestamp:(Date | null);
}

// ============================================================================
// AUDIO STATE
// ============================================================================

export interface AudioState {
  microphone: MicrophoneState;
  speaker: SpeakerState;
  buffers: BufferState;
  vad: VADState;
  bargeIn: BargeInState;
  streaming: StreamingState;
}

export interface MicrophoneState {
  active: boolean;
  deviceId: string | null;
  sampleRate: number;
  channels: number;
  lastActivity: Date | null;
}

export interface SpeakerState {
  active: boolean;
  deviceId: string | null;
  volume: number;
  muted: boolean;
  lastActivity: Date | null;
}

export interface BufferState {
  inputBufferSize: number;
  inputBufferMaxSize: number;
  outputBufferSize: number;
  outputBufferMaxSize: number;
  backpressure: boolean;
}

export interface VADState {
  state: "speaking" | "silence" | "unknown";
  confidence: number;
  lastDetection: Date | null;
}

export interface BargeInState {
  state: "idle" | "detecting" | "interrupted";
  threshold: number;
  lastInterruption: Date | null;
}

export interface StreamingState {
  active: boolean;
  chunksSent: number;
  chunksReceived: number;
  bytesPerSecond: number;
  lastChunkTimestamp: Date | null;
}

// ============================================================================
// SESSION STATE
// ============================================================================

export interface SessionState {
  active: boolean;
  sessionId: string | null;
  duration: number;
  messageCount: number;
  interruptionCount: number;
  status: string;
  startTime: Date | null;
  endTime: Date | null;
}

// ============================================================================
// DIGITAL TWIN STATE
// ============================================================================

export interface DigitalTwinState {
  candidate: CandidateContext;
  jobOffer: JobOfferContext;
  matching: MatchingContext;
  transferableSkills: TransferableSkillsContext;
  gap: GapContext;
  interviewPreparation: InterviewPreparationContext;
  voiceInterview: VoiceInterviewContext;
  runtime: RuntimeContext;
  provider: ProviderContext;
}

export interface CandidateContext {
  candidateId: string | null;
  name: string | null;
  email: string | null;
  profile: Record<string, unknown> | null;
}

export interface JobOfferContext {
  jobOfferId: string | null;
  title: string | null;
  company: string | null;
  description: string | null;
  requirements: string[] | null;
}

export interface MatchingContext {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  confidence: number;
}

export interface TransferableSkillsContext {
  identifiedSkills: string[];
  transferableSkills: string[];
  confidence: number;
}

export interface GapContext {
  skillGaps: string[];
  experienceGaps: string[];
  recommendations: string[];
}

export interface InterviewPreparationContext {
  preparedQuestions: string[];
  focusAreas: string[];
  readinessScore: number;
}

export interface VoiceInterviewContext {
  currentQuestion: string | null;
  answerCount: number;
  averageAnswerDuration: number;
  feedbackCount: number;
}

export interface ProviderContext {
  provider: string | null;
  model: string | null;
  configuration: Record<string, unknown> | null;
}

// ============================================================================
// PIPELINE STATE
// ============================================================================

export interface PipelineState {
  stages: PipelineStage[];
  currentStage: string | null;
  overallProgress: number;
  startTime: Date | null;
  endTime: Date | null;
  duration: number;
}

export interface PipelineStage {
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  startTime: Date | null;
  endTime: Date | null;
  duration: number;
  metadata: Record<string, unknown>;
}

// ============================================================================
// INSPECTOR SNAPSHOT
// ============================================================================

export interface InspectorSnapshot {
  timestamp: Date;
  runtime: {
    state: RuntimeState;
    context: RuntimeContext;
    queue: RuntimeQueue;
    lifecycle: RuntimeLifecycle;
  };
  provider: ProviderState;
  audio: AudioState;
  session: SessionState;
  digitalTwin: DigitalTwinState;
  pipeline: PipelineState;
  diagnostics: {
    health: string;
    performance: Record<string, number>;
    timeline: string;
  };
}
