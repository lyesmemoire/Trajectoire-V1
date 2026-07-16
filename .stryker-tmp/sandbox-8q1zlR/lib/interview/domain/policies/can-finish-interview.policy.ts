// @ts-nocheck
import { Policy } from "@/lib/core/application/Policy";

export interface FinishPolicyContext {
  questionCount: number;
  maxQuestions: number;
  timeElapsedMs: number;
  timeLimitMs: number;
}

export class CanFinishInterviewPolicy implements Policy<FinishPolicyContext> {
  evaluate(context: FinishPolicyContext): boolean {
    return context.questionCount >= context.maxQuestions || context.timeElapsedMs >= context.timeLimitMs;
  }
}
