// @ts-nocheck
export type MessageRole = "recruiter" | "candidate";

export type MicroState = "idle" | "listening" | "speaking" | "analyzing" | "thinking";

export type InterviewType = "direction" | "technical" | "commercial" | "hr" | "rh" | "manager" | "executive" | "consulting";

export type Difficulty = "beginner" | "intermediate" | "expert";

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface InterviewConfig {
  duration: "express" | "standard" | "premium";
  language: string;
  interviewType: InterviewType;
  difficulty: Difficulty;
  position: string;
  company: string;
  sector: string;
  experience: string;
}

export interface RecruiterProfile {
  name: string;
  title: string;
  company: string;
  experience: string;
  traits: string[];
  style: string;
  personality: string;
  openingMessage: string;
}

export interface LiveScores {
  communication: number;
  leadership: number;
  structure: number;
  confidence: number;
  impact: number;
  stressManagement: number;
  synthesis: number;
}

export interface PrivateNote {
  id: string;
  content: string;
  timestamp: number;
  category: "positive" | "negative" | "neutral";
}

export interface ConversationContext {
  mentionedNumbers: string[];
  mentionedProjects: string[];
  mentionedTeams: string[];
  mentionedTechnologies: string[];
  mentionedResults: string[];
  mentionedExperiences: string[];
}

export interface RecruiterBehavior {
  isThinking: boolean;
  isTakingNotes: boolean;
  currentExpression: "neutral" | "smiling" | "serious" | "thoughtful" | "encouraging";
  currentFocus: "candidate" | "notes" | "thinking";
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  type: "clarification" | "deepening" | "challenge" | "transition" | "example";
  difficulty: number;
}

export interface InterviewState {
  currentScreen: "presentation" | "configuration" | "checklist" | "tips" | "simulation" | "summary";
  elapsedTime: number;
  conversationHistory: Message[];
  privateNotes: PrivateNote[];
  liveScores: LiveScores;
  context: ConversationContext;
  behavior: RecruiterBehavior;
  isInterviewComplete: boolean;
  difficultyLevel: number;
}
