import { Policy } from "@/lib/core/application/Policy";
import { InterviewState } from "../aggregates/interview-state-machine";

export interface RecoverPolicyContext {
  currentState: InterviewState;
  confidenceScore: number;
  consecutiveHesitations: number;
}

export class CanRecoverPolicy implements Policy<RecoverPolicyContext> {
  evaluate(context: RecoverPolicyContext): boolean {
    // Cannot recover if already in recovery or completed/intro
    if (context.currentState === "RECOVERY" || context.currentState === "COMPLETED" || context.currentState === "INTRODUCTION") {
      return false;
    }

    // Trigger recovery if confidence drops too low or too many hesitations
    return context.confidenceScore < 40 || context.consecutiveHesitations >= 2;
  }
}
