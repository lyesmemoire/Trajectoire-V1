// @ts-nocheck
// types/premium-interview.ts

export type RecruiterPersona =
  | "big_tech_senior"
  | "startup_founder"
  | "corporate_hr"
  | "technical_lead"
  | "aggressive_recruiter";

export type InterviewPhase =
  | "intro"
  | "cv_deep_dive"
  | "technical_case"
  | "behavioral"
  | "pressure_test"
  | "closing";

export interface PremiumInterviewSession {
  id: string;
  userId: string;
  jobTitle: string;
  company?: string;
  persona: RecruiterPersona;
  difficulty: "normal" | "hard" | "elite";
  phase: InterviewPhase;
  stressLevel: number;
  technicalScore: number;
  coherenceScore: number;
  confidenceScore: number;
  transcript: {
    role: "interviewer" | "candidate";
    content: string;
  }[];
  memory?: {
    structuredSummary?: string;
    keyStrengths?: string[];
    keyWeaknesses?: string[];
  };
}
