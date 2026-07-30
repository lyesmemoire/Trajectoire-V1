export interface InterviewBudget {
  maxDurationMinutes: number;
  remainingMinutes: number;
  maxQuestions: number;
  remainingQuestions: number;
  tokenBudget: number;
  tokensConsumed: number;
}

export interface CognitiveContext {
  sessionId: string;
  currentGoal: string | null;
  currentRisk: string | null;
  remainingUnknowns: string[];
  budget: InterviewBudget;
  lastDecisions: string[];
  conversationMomentum: "high" | "neutral" | "low";
  stressLevel: number; // 0.0 to 1.0
  confidenceTrend: "increasing" | "stable" | "decreasing";
  priorityQueue: Array<{
    priority: number;
    competency: string;
    risk: string | null;
    expectedEvidence: string;
    remainingConfidence: number;
    deadline?: number; // Question limit or time
  }>;
}

export const createInitialCognitiveContext = (sessionId: string, maxDurationMinutes = 45, maxQuestions = 20): CognitiveContext => ({
  sessionId,
  currentGoal: null,
  currentRisk: null,
  remainingUnknowns: [],
  budget: {
    maxDurationMinutes,
    remainingMinutes: maxDurationMinutes,
    maxQuestions,
    remainingQuestions: maxQuestions,
    tokenBudget: 50000,
    tokensConsumed: 0
  },
  lastDecisions: [],
  conversationMomentum: "neutral",
  stressLevel: 0.5,
  confidenceTrend: "stable",
  priorityQueue: []
});
