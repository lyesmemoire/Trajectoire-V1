// apps/realtime-gateway/src/interview/models/InterviewQuestion.ts

import type { QuestionType, InterviewPhase, DifficultyLevel } from "./Enums";

export interface InterviewQuestion {
  id: string; // UUID string
  type: QuestionType;
  topic: string;
  difficulty: DifficultyLevel;
  generatedAt: number; // epoch ms when engine generated the meta object
  askedAt?: number; // epoch ms when sent to candidate
  answeredAt?: number; // epoch ms when answer received
  expectedSkills?: string[]; // skills the question targets
  followupTo?: string; // id of parent question if this is a follow‑up
  phase: InterviewPhase;
  // New fields for production‑grade traceability
  reason: string; // why this question is asked (explainability)
  validationTargets?: string[]; // keys of data the LLM should validate (e.g., claim ids)
  followupCandidates?: string[]; // ids of potential follow‑up questions
  generatedPrompt?: string; // raw prompt sent to LLM before phrasing
}
