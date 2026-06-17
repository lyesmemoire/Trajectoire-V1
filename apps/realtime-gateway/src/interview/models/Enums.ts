// apps/realtime-gateway/src/interview/models/Enums.ts

export type InterviewPhase =
  | "introduction"
  | "experience"
  | "technical"
  | "behavioral"
  | "final";

export type InterviewMode = "hr" | "technical" | "mixed" | "screening";

export type DifficultyLevel = "easy" | "medium" | "hard" | "expert";

export type QuestionType =
  | "technical"
  | "behavioral"
  | "system_design"
  | "culture_fit"
  | "experience";
