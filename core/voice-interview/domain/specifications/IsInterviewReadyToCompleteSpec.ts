import type { InterviewPhase } from "../types.js";

export interface ReadyToCompleteContext {
  readonly currentPhase: InterviewPhase;
  readonly totalTurns: number;
  readonly targetPhasesCompleted: boolean;
  readonly isForcedByAntiLoop: boolean;
}

export class IsInterviewReadyToCompleteSpec {
  public isSatisfiedBy(context: ReadyToCompleteContext): boolean {
    if (context.isForcedByAntiLoop) {
      return true;
    }

    if (context.currentPhase === "wrap-up" && context.targetPhasesCompleted) {
      return true;
    }

    // Example minimal condition if not wrap-up
    if (context.totalTurns >= 15 && context.targetPhasesCompleted) {
      return true;
    }

    return false;
  }
}
