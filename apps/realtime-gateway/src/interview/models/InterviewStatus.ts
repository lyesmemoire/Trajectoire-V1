// apps/realtime-gateway/src/interview/models/InterviewStatus.ts

export type InterviewStatus =
  | "idle"
  | "active"
  | "paused"
  | "completed"
  | "expired"
  | "failed";
