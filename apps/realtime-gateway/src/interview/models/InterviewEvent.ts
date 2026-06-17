// apps/realtime-gateway/src/interview/models/InterviewEvent.ts

export type InterviewEventType =
  | "session_created"
  | "session_started"
  | "question_selected"
  | "question_generated"
  | "question_asked"
  | "candidate_answer_received"
  | "candidate_interrupted"
  | "score_updated"
  | "difficulty_changed"
  | "phase_changed"
  | "memory_compressed"
  | "warning_triggered"
  | "policy_blocked"
  | "interview_completed"
  | "interview_timeout"
  | "manual_stop";

export interface InterviewEvent {
  id: string; // UUID
  version: number; // schema version for this event type
  type: InterviewEventType;
  sessionId: string;
  timestamp: number; // epoch ms
  source?: "system" | "candidate" | "llm" | "policy";
  payload?: Record<string, unknown>;
}
