// @ts-nocheck
import { Policy } from "@/lib/core/application/Policy";
import { InterviewState } from "../aggregates/interview-state-machine";

export interface PressurePolicyContext {
  currentState: InterviewState;
  confidenceScore: number;
}

export class CanIncreasePressurePolicy implements Policy<PressurePolicyContext> {
  evaluate(context: PressurePolicyContext): boolean {
    // Only increase pressure if confidence is acceptable and state is appropriate
    if (context.currentState === "RECOVERY" || context.currentState === "INTRODUCTION" || context.currentState === "COMPLETED") {
      return false;
    }

    return context.confidenceScore >= 60;
  }
}
