/**
 * Client event types — discriminated union map for the typed EventEmitter.
 */

import type { FeedbackSignal } from "./protocol.js";

export interface StateChangeEvent {
  readonly previousState: string;
  readonly currentState: string;
  readonly timestamp: number;
}

export interface QuestionEvent {
  readonly sessionId: string;
  readonly text: string;
  readonly feedbackSignal: FeedbackSignal | null;
}

export interface AudioEvent {
  readonly sessionId: string;
  readonly audioChunk: string;
}

export interface TranscriptEvent {
  readonly sessionId: string;
  readonly text: string;
  readonly isFinal: boolean;
}

export interface CompletedEvent {
  readonly sessionId: string;
  readonly timestamp: number;
}

export interface ErrorEvent {
  readonly code: number;
  readonly message: string;
  readonly correlationId: string | null;
  readonly recoverable: boolean;
}

export interface ConnectionEvent {
  readonly status: "connected" | "disconnected" | "reconnecting";
  readonly attempt: number;
  readonly latencyMs: number | null;
}

export interface AudioLevelEvent {
  readonly level: number;
  readonly isSpeaking: boolean;
}

export interface VoiceClientEventMap {
  readonly stateChanged: StateChangeEvent;
  readonly question: QuestionEvent;
  readonly audio: AudioEvent;
  readonly transcript: TranscriptEvent;
  readonly completed: CompletedEvent;
  readonly error: ErrorEvent;
  readonly connection: ConnectionEvent;
  readonly audioLevel: AudioLevelEvent;
}

export type VoiceClientEventName = keyof VoiceClientEventMap;
