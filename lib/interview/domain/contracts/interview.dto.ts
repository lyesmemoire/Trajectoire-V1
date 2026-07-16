export type InterviewMessageRole = "user" | "assistant";

export type InterviewLevel = "intern" | "junior" | "mid" | "senior" | "staff" | "executive";
export type InterviewMode = "behavioral" | "technical" | "case-study" | "mixed";
export type InterviewLanguage = "fr" | "en";

export interface InterviewMessage {
  readonly id: string;
  readonly role: InterviewMessageRole;
  readonly content: string;
  readonly createdAtIso: string;
}

export interface InterviewContextOverrides {
  readonly mode?: InterviewMode;
  readonly level?: InterviewLevel;
  readonly language?: InterviewLanguage;
  readonly personaId?: "recruiter" | "hiring-manager" | "executive";
  readonly targetCompetencies?: readonly string[];
  readonly questionLimit?: number;
  readonly responseMaxChars?: number;
}

export interface InterviewInput {
  readonly sessionId: string;
  readonly message: string;
  readonly history: readonly InterviewMessage[];
  readonly contextOverrides?: InterviewContextOverrides;
}

export type InterviewAction =
  | { readonly type: "practice_follow_up"; readonly label: string; readonly questionId: string }
  | { readonly type: "review_score"; readonly label: string; readonly sessionId: string }
  | { readonly type: "continue_interview"; readonly label: string; readonly sessionId: string }
  | { readonly type: "finish_interview"; readonly label: string; readonly sessionId: string };

export interface InterviewMetadata {
  readonly model: string;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly totalTokens: number;
  readonly latencyMs: number;
  readonly contextSources: readonly ("candidate" | "job-offer" | "history" | "goals" | "constraints")[];
  readonly completedAtIso: string;
}

export interface InterviewOutput {
  readonly responseId: string;
  readonly sessionId: string;
  readonly finalAnswer: string;
  readonly actions: readonly InterviewAction[];
  readonly metadata: InterviewMetadata;
}

export interface InterviewCandidateContext {
  readonly candidateId: string;
  readonly targetRole: string;
  readonly yearsOfExperience: number;
  readonly skills: readonly string[];
  readonly summary: string | null;
}

export interface InterviewJobOfferContext {
  readonly offerId: string | null;
  readonly title: string;
  readonly companyName: string | null;
  readonly requiredSkills: readonly string[];
  readonly descriptionSummary: string | null;
}

export interface InterviewHistoryTurn {
  readonly messageId: string;
  readonly role: InterviewMessageRole;
  readonly content: string;
  readonly createdAtIso: string;
}

export interface InterviewObjective {
  readonly id: string;
  readonly label: string;
  readonly priority: "low" | "medium" | "high";
}

export interface InterviewConstraints {
  readonly language: InterviewLanguage;
  readonly mode: InterviewMode;
  readonly level: InterviewLevel;
  readonly maximumQuestions: number;
  readonly maximumResponseChars: number;
  readonly allowFollowUpQuestions: boolean;
}

export interface InterviewContext {
  readonly candidate: InterviewCandidateContext;
  readonly jobOffer: InterviewJobOfferContext;
  readonly history: readonly InterviewHistoryTurn[];
  readonly objectives: readonly InterviewObjective[];
  readonly level: InterviewLevel;
  readonly constraints: InterviewConstraints;
}

