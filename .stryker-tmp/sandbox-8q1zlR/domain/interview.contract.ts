// @ts-nocheck
export type InterviewState =
  | "created"
  | "running"
  | "paused"
  | "analyzing"
  | "completed";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface StandardInterviewSession {
  id: string;
  userId: string;
  questions: string[];
  answers: string[];
  status: InterviewState;
  score?: number;
  feedback?: string;
}

export interface PremiumInterviewSession {
  id: string;
  userId: string;
  transcript: Message[];
  memory: Record<string, any>;
  persona: string;
  phases: string[];
  scores?: {
    technical: number;
    communication: number;
    confidence: number;
    stress: number;
  };
  status: InterviewState;
}

export interface InterviewAnalyticsProjection {
  sessionId: string;
  userId: string;

  behavioralScores: {
    clarity: number;
    confidence: number;
    ownership: number;
    specificity: number;
    authenticity: number;
  };

  archetype: string;
  pressureCurve: number[];
  progressionIndex: number;
  modelVersion?: number;
}

export interface UnifiedInterviewView {
  id: string;
  userId: string;
  type: "standard" | "premium";
  status: InterviewState;
  
  // Unified data for UI consumption
  history: Message[];
  score?: number;
  analytics?: InterviewAnalyticsProjection;
  
  createdAt: string;
  completedAt?: string;
}

export function mergeInterviewViews(
  standard?: StandardInterviewSession,
  premium?: PremiumInterviewSession,
  analytics?: InterviewAnalyticsProjection
): UnifiedInterviewView {
  if (!standard && !premium) {
    throw new Error("Must provide at least one session type");
  }

  const session = premium || standard!;
  const isPremium = !!premium;

  return {
    id: session.id,
    userId: session.userId,
    type: isPremium ? "premium" : "standard",
    status: session.status,
    history: isPremium ? (session as PremiumInterviewSession).transcript : [],
    score: isPremium && (session as PremiumInterviewSession).scores 
      ? (session as PremiumInterviewSession).scores!.technical 
      : (session as StandardInterviewSession).score,
    analytics,
    createdAt: new Date().toISOString(), // Mocking for now, normally taken from db
  };
}

// ── Row types used by validators ──────────────────────────────────────────────
// These are structural aliases — they mirror the Supabase DB schema shape.
export type StandardSessionRow = {
  id: string;
  user_id: string;
  job_title?: string;
  job_description?: string | null;
  candidate_summary?: string | null;
  questions: string[];
  answers: string[];
  status: "active" | "completed";
  score?: number | null;
  final_score?: number | null;
  level?: string | null;
  feedback_json?: Record<string, unknown> | null;
  created_at: string;
  completed_at?: string | null;
  updated_at?: string | null;
};

export type PremiumSessionRow = {
  id: string;
  user_id: string;
  job_title?: string;
  company?: string | null;
  persona: "big_tech_senior" | "startup_founder" | "corporate_hr" | "technical_lead" | "aggressive_recruiter";
  difficulty: "normal" | "hard" | "elite";
  phase: "intro" | "cv_deep_dive" | "technical_case" | "behavioral" | "pressure_test" | "closing";
  transcript: Array<{ role: "interviewer" | "candidate"; content: string }>;
  memory?: { structuredSummary?: string; keyStrengths?: string[]; keyWeaknesses?: string[] } | null;
  is_processing: boolean;
  status: "active" | "completed";
  score: number;
  technical_score?: number | null;
  communication_score?: number | null;
  confidence_score?: number | null;
  stress_score?: number | null;
  tags: string[];
  started_at: string;
  completed_at?: string | null;
  created_at: string;
  updated_at?: string | null;
};
