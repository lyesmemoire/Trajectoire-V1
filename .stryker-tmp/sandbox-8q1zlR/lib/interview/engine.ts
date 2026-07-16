// @ts-nocheck
export type InterviewMode = "diagnostic" | "simulation";

export type InterviewContext = "direction" | "pression_strategique" | "codir";

export type InterviewPhase =
  | "positionnement"
  | "impact"
  | "contradiction"
  | "pression"
  | "codir";

export interface InterviewState {
  mode: InterviewMode;
  context: InterviewContext;
  currentPhase: InterviewPhase;
  questionIndex: number;
  stressLevel: number; // 0 → 1
  startTime: number;
  timeLimit: number;
  dominantPosture?: string;
}

export class InterviewEngine {
  state: InterviewState;

  constructor(mode: InterviewMode, context: InterviewContext) {
    const timeLimit = mode === "diagnostic" ? 10 * 60 * 1000 : 20 * 60 * 1000;

    this.state = {
      mode,
      context,
      currentPhase: "positionnement",
      questionIndex: 0,
      stressLevel: 0.2,
      startTime: Date.now(),
      timeLimit,
    };
  }

  getTimeRemaining() {
    return this.state.timeLimit - (Date.now() - this.state.startTime);
  }

  nextPhase() {
    const phaseOrderDiagnostic: InterviewPhase[] = [
      "positionnement",
      "impact",
      "contradiction",
      "pression",
    ];
    const phaseOrderSimulation: InterviewPhase[] = [
      "positionnement",
      "impact",
      "contradiction",
      "pression",
      "codir",
    ];

    const order =
      this.state.mode === "diagnostic"
        ? phaseOrderDiagnostic
        : phaseOrderSimulation;

    const currentIndex = order.indexOf(this.state.currentPhase);
    if (currentIndex < order.length - 1) {
      const nextPhase = order[currentIndex + 1];
      if (nextPhase) {
        this.state.currentPhase = nextPhase;
      }
      this.state.stressLevel = Math.min(
        1,
        this.state.stressLevel + 0.2
      );
    }
  }

  registerAnswer(dominantPosture?: string) {
    this.state.questionIndex++;
    if (dominantPosture) {
      this.state.dominantPosture = dominantPosture;
    }
  }

  shouldInterrupt() {
    return this.state.stressLevel > 0.7;
  }

  shouldEnd() {
    return this.getTimeRemaining() <= 0;
  }
}
