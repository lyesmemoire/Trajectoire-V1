// src/interview/runtime/fsm/types/InterviewRuntimeEvent.ts

export type RuntimeEventType =
  | 'VOICE_STARTED'
  | 'VOICE_ENDED'
  | 'SILENCE_DETECTED'
  | 'INTERRUPTION_DETECTED'
  | 'TIMEOUT'
  | 'QUESTION_EMITTED'
  | 'ANSWER_RECEIVED'
  | 'FSM_TRANSITION'
  | 'POLICY_VIOLATION'
  | 'RECOVERY_TRIGGERED'
  | 'SESSION_ENDED'
  | 'SESSION_STARTED'
  | 'SESSION_RESTORED'
  | 'QUESTION_TIMEOUT'
  | 'AUDIO_STREAM_ERROR'
  | 'RECOVERY_COMPLETED';

/**
 * Base fields present on every runtime event. All values are deterministic and serializable.
 */
export interface BaseRuntimeEvent {
  /** Unique identifier for the event (UUID or deterministic hash) */
  readonly eventId: string;
  /** Identifier of the interview session */
  readonly sessionId: string;
  /** Milliseconds since epoch – must be provided by caller (no Date.now inside) */
  readonly timestamp: number;
  /** Monotonically increasing sequence number for ordering */
  readonly sequence: number;
  /** Source of the event – e.g. 'voice', 'system', 'policy' */
  readonly source: string;
  /** Discriminant for the concrete event type */
  readonly type: RuntimeEventType;
}

/** Specific event types – extend BaseRuntimeEvent with any payload needed */
export interface VoiceStartedEvent extends BaseRuntimeEvent {
  type: 'VOICE_STARTED';
}
export interface VoiceEndedEvent extends BaseRuntimeEvent {
  type: 'VOICE_ENDED';
}
export interface SilenceDetectedEvent extends BaseRuntimeEvent {
  type: 'SILENCE_DETECTED';
}
export interface InterruptionDetectedEvent extends BaseRuntimeEvent {
  type: 'INTERRUPTION_DETECTED';
}
export interface TimeoutEvent extends BaseRuntimeEvent {
  type: 'TIMEOUT';
}
export interface QuestionEmittedEvent extends BaseRuntimeEvent {
  type: 'QUESTION_EMITTED';
  payload: { questionId: string };
}
export interface AnswerReceivedEvent extends BaseRuntimeEvent {
  type: 'ANSWER_RECEIVED';
  payload: { questionId: string; answer: string };
}
export interface FsmTransitionEvent extends BaseRuntimeEvent {
  type: 'FSM_TRANSITION';
  payload: { from: string; to: string };
}
export interface PolicyViolationEvent extends BaseRuntimeEvent {
  type: 'POLICY_VIOLATION';
  payload: { reason: string };
}
export interface RecoveryTriggeredEvent extends BaseRuntimeEvent {
  type: 'RECOVERY_TRIGGERED';
}
export interface SessionEndedEvent extends BaseRuntimeEvent {
  type: 'SESSION_ENDED';
}
export interface SessionStartedEvent extends BaseRuntimeEvent {
  type: 'SESSION_STARTED';
}
export interface SessionRestoredEvent extends BaseRuntimeEvent {
  type: 'SESSION_RESTORED';
}
export interface QuestionTimeoutEvent extends BaseRuntimeEvent {
  type: 'QUESTION_TIMEOUT';
}
export interface AudioStreamErrorEvent extends BaseRuntimeEvent {
  type: 'AUDIO_STREAM_ERROR';
  payload: { error: string };
}
export interface RecoveryCompletedEvent extends BaseRuntimeEvent {
  type: 'RECOVERY_COMPLETED';
}

/** Union of all concrete event interfaces */
export type InterviewRuntimeEvent =
  | VoiceStartedEvent
  | VoiceEndedEvent
  | SilenceDetectedEvent
  | InterruptionDetectedEvent
  | TimeoutEvent
  | QuestionEmittedEvent
  | AnswerReceivedEvent
  | FsmTransitionEvent
  | PolicyViolationEvent
  | RecoveryTriggeredEvent
  | SessionEndedEvent
  | SessionStartedEvent
  | SessionRestoredEvent
  | QuestionTimeoutEvent
  | AudioStreamErrorEvent
  | RecoveryCompletedEvent;
