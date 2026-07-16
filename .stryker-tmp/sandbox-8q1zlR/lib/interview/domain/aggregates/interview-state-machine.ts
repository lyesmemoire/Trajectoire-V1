// @ts-nocheck
export type InterviewState = 
  | "READY"
  | "INTRODUCTION"
  | "QUESTIONING"
  | "FOLLOW_UP"
  | "RECOVERY"
  | "COMPLETED";

export class InterviewStateMachine {
  public static isValidTransition(current: InterviewState, next: InterviewState): boolean {
    const validTransitions: Record<InterviewState, InterviewState[]> = {
      READY: ["INTRODUCTION", "COMPLETED"],
      INTRODUCTION: ["QUESTIONING", "COMPLETED"],
      QUESTIONING: ["FOLLOW_UP", "RECOVERY", "COMPLETED", "QUESTIONING"],
      FOLLOW_UP: ["QUESTIONING", "RECOVERY", "COMPLETED"],
      RECOVERY: ["QUESTIONING", "COMPLETED"],
      COMPLETED: [],
    };

    return validTransitions[current].includes(next);
  }
}
