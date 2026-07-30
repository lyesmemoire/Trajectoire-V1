import { z } from "zod";

// ===================================================================
// INTERVIEW BUDGET — The finite resources available for the interview
// The engine must manage its time, questions, and cognitive load.
// ===================================================================

export const InterviewBudgetSchema = z.object({
  maxDurationMinutes: z.number().positive(),
  remainingMinutes: z.number().nonnegative(),
  maxQuestions: z.number().int().positive(),
  remainingQuestions: z.number().int().nonnegative(),
  competenciesTotal: z.number().int().positive(),
  competenciesEvaluated: z.number().int().nonnegative(),
  fatigueLevel: z.number().min(0).max(1).default(0),
  globalConfidence: z.number().min(0).max(1).default(0),
  challengeBudget: z.number().int().nonnegative().default(4),
  followUpBudget: z.number().int().nonnegative().default(8),
  deepDiveBudget: z.number().int().nonnegative().default(3),
  tokenBudget: z.number().int().nonnegative().default(50000),
  tokensConsumed: z.number().int().nonnegative().default(0),
});

export type InterviewBudget = z.infer<typeof InterviewBudgetSchema>;

/**
 * Pure function: creates an initial budget for a new interview.
 */
export function createInitialBudget(
  durationMinutes: number = 45,
  maxQuestions: number = 35,
  competenciesTotal: number = 12
): InterviewBudget {
  return {
    maxDurationMinutes: durationMinutes,
    remainingMinutes: durationMinutes,
    maxQuestions,
    remainingQuestions: maxQuestions,
    competenciesTotal,
    competenciesEvaluated: 0,
    fatigueLevel: 0,
    globalConfidence: 0,
    challengeBudget: 4,
    followUpBudget: 8,
    deepDiveBudget: 3,
    tokenBudget: 50000,
    tokensConsumed: 0,
  };
}

/**
 * Pure function: decrements the appropriate budget counters.
 * Returns a new InterviewBudget (immutable).
 */
export function consumeBudget(
  budget: InterviewBudget,
  action: "question" | "challenge" | "follow_up" | "deep_dive",
  elapsedMinutes: number = 0,
  tokensUsed: number = 0
): InterviewBudget {
  return {
    ...budget,
    remainingMinutes: Math.max(0, budget.remainingMinutes - elapsedMinutes),
    remainingQuestions:
      action === "question"
        ? Math.max(0, budget.remainingQuestions - 1)
        : budget.remainingQuestions,
    challengeBudget:
      action === "challenge"
        ? Math.max(0, budget.challengeBudget - 1)
        : budget.challengeBudget,
    followUpBudget:
      action === "follow_up"
        ? Math.max(0, budget.followUpBudget - 1)
        : budget.followUpBudget,
    deepDiveBudget:
      action === "deep_dive"
        ? Math.max(0, budget.deepDiveBudget - 1)
        : budget.deepDiveBudget,
    tokensConsumed: budget.tokensConsumed + tokensUsed,
  };
}

/**
 * Pure function: checks if the interview has exceeded any critical budget.
 */
export function isBudgetExhausted(budget: InterviewBudget): boolean {
  return (
    budget.remainingMinutes <= 0 ||
    budget.remainingQuestions <= 0 ||
    budget.tokensConsumed >= budget.tokenBudget
  );
}
