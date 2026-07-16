import type { InterviewPhase, FeedbackSignal, ScoreSignal } from "../types.js";
import { PhaseTransitionPolicy } from "../policies/PhaseTransitionPolicy.js";

export interface FlowContext {
  readonly currentPhase: InterviewPhase;
  readonly lastScore: ScoreSignal;
  readonly scoresInCurrentPhase: number[];
  readonly topicsCovered: number;
}

export interface FlowResult {
  readonly nextPhase: InterviewPhase;
  readonly nextFeedback: FeedbackSignal;
}

export class InterviewFlowService {
  private readonly transitionPolicy: PhaseTransitionPolicy;

  constructor() {
    this.transitionPolicy = new PhaseTransitionPolicy();
  }

  public computeNextStep(context: FlowContext): FlowResult {
    const feedback = this.computeFeedback(context.lastScore.value);
    let nextPhase = context.currentPhase;

    if (feedback === "move-on") {
      const targetPhase = this.determineTargetPhase(context.currentPhase);
      if (targetPhase !== context.currentPhase) {
        const policyResult = this.transitionPolicy.evaluate({
          currentPhase: context.currentPhase,
          targetPhase,
          scoresInCurrentPhase: context.scoresInCurrentPhase,
          topicsCovered: context.topicsCovered
        });

        if (policyResult.allowed) {
          nextPhase = targetPhase;
        }
      }
    }

    return { nextPhase, nextFeedback: feedback };
  }

  private computeFeedback(score: number): FeedbackSignal {
    if (score >= 80) return "move-on";
    if (score >= 60) return "deepen";
    return "probe";
  }

  private determineTargetPhase(currentPhase: InterviewPhase): InterviewPhase {
    switch (currentPhase) {
      case "opening": return "exploration";
      case "exploration": return "pressure";
      case "pressure": return "wrap-up";
      case "wrap-up": return "wrap-up";
      default: return currentPhase;
    }
  }
}
