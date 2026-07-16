export type InterviewState = 
  | "READY"
  | "INTRODUCTION"
  | "QUESTIONING"
  | "FOLLOW_UP"
  | "RECOVERY"
  | "COMPLETED"
  // Granular states for pressure management
  | "WARMUP"
  | "DEEP_DIVE"
  | "PRESSURE"
  | "CLOSING";

export class InterviewStateMachine {
  public static isValidTransition(current: InterviewState, next: InterviewState): boolean {
    const validTransitions: Record<InterviewState, InterviewState[]> = {
      READY: ["INTRODUCTION", "WARMUP", "COMPLETED"],
      INTRODUCTION: ["WARMUP", "QUESTIONING", "COMPLETED"],
      WARMUP: ["DEEP_DIVE", "PRESSURE", "QUESTIONING", "COMPLETED"],
      QUESTIONING: ["FOLLOW_UP", "RECOVERY", "DEEP_DIVE", "PRESSURE", "COMPLETED", "QUESTIONING"],
      DEEP_DIVE: ["PRESSURE", "FOLLOW_UP", "RECOVERY", "QUESTIONING", "COMPLETED"],
      PRESSURE: ["DEEP_DIVE", "FOLLOW_UP", "RECOVERY", "QUESTIONING", "COMPLETED"],
      FOLLOW_UP: ["QUESTIONING", "DEEP_DIVE", "PRESSURE", "RECOVERY", "COMPLETED"],
      RECOVERY: ["QUESTIONING", "DEEP_DIVE", "PRESSURE", "COMPLETED"],
      CLOSING: ["COMPLETED"],
      COMPLETED: [],
    };

    return validTransitions[current].includes(next);
  }

  public static getNextState(
    currentState: InterviewState,
    completedQuestions: number,
    totalExpected: number,
  ): InterviewState {
    // Beginning
    if (completedQuestions === 0) return "INTRODUCTION";
    if (completedQuestions === 1) return "WARMUP";

    // End
    if (completedQuestions >= totalExpected - 1) return "CLOSING";
    if (completedQuestions === totalExpected - 2) return "RECOVERY";

    // Middle of interview (alternating deep_dive and pressure)
    if (completedQuestions % 2 === 0) return "DEEP_DIVE";
    return "PRESSURE";
  }

  public static shouldIncreasePressure(
    state: InterviewState,
    confidence: number,
  ): boolean {
    return (state === "PRESSURE" || state === "DEEP_DIVE") && confidence < 70;
  }
}
