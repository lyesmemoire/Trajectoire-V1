// @ts-nocheck
import type { DomainEvent } from "./DomainEvent.js";
import type { TurnId, Transcript, AnswerEvaluation, FeedbackSignal, InterviewPhase } from "../types.js";
export interface InterviewSessionStarted extends DomainEvent {
  readonly type: "InterviewSessionStarted";
  readonly targetRole: string;
}
export interface InterviewSessionPaused extends DomainEvent {
  readonly type: "InterviewSessionPaused";
}
export interface InterviewSessionResumed extends DomainEvent {
  readonly type: "InterviewSessionResumed";
}
export interface VoiceTurnStarted extends DomainEvent {
  readonly type: "VoiceTurnStarted";
  readonly turnId: TurnId;
}
export interface CandidateTranscriptReceived extends DomainEvent {
  readonly type: "CandidateTranscriptReceived";
  readonly turnId: TurnId;
  readonly transcript: Transcript;
}
export interface AnswerEvaluationCompleted extends DomainEvent {
  readonly type: "AnswerEvaluationCompleted";
  readonly turnId: TurnId;
  readonly evaluation: AnswerEvaluation;
}
export interface FeedbackSignalComputed extends DomainEvent {
  readonly type: "FeedbackSignalComputed";
  readonly turnId: TurnId;
  readonly signal: FeedbackSignal;
}
export interface PhaseAdvanced extends DomainEvent {
  readonly type: "PhaseAdvanced";
  readonly fromPhase: InterviewPhase;
  readonly toPhase: InterviewPhase;
}
export interface VoiceTurnCompleted extends DomainEvent {
  readonly type: "VoiceTurnCompleted";
  readonly turnId: TurnId;
}
export interface InterviewSessionCompleted extends DomainEvent {
  readonly type: "InterviewSessionCompleted";
  readonly totalTurns: number;
  readonly durationMs: number;
}
export interface InterviewSessionAborted extends DomainEvent {
  readonly type: "InterviewSessionAborted";
  readonly reason: string;
}