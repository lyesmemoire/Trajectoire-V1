export interface PolicyResult {
  readonly allowed: boolean;
  readonly denied: boolean;
  readonly reason?: string;
}

export const PolicyResult = {
  allow(): PolicyResult {
    return Object.freeze({ allowed: true, denied: false });
  },
  deny(reason: string): PolicyResult {
    return Object.freeze({ allowed: false, denied: true, reason });
  }
};

export interface TransitionContext {
  readonly currentPhase: string;
  readonly targetPhase: string;
  readonly scoresInCurrentPhase: number[];
  readonly topicsCovered: number;
}

export class PhaseTransitionPolicy {
  public evaluate(context: TransitionContext): PolicyResult {
    const { currentPhase, targetPhase, scoresInCurrentPhase, topicsCovered } = context;

    if (currentPhase === "exploration" && targetPhase === "pressure") {
      const strongScores = scoresInCurrentPhase.filter(score => score > 60).length;
      if (strongScores >= 3 && topicsCovered >= 2) {
        return PolicyResult.allow();
      }
      return PolicyResult.deny("Must have at least 3 strong scores (>60) and 2 topics covered to enter pressure phase");
    }

    if (currentPhase === "opening" && targetPhase === "exploration") {
      const goodScores = scoresInCurrentPhase.filter(score => score > 50).length;
      if (goodScores >= 1 || scoresInCurrentPhase.length === 0) {
        // Assume allowed if opening didn't have a formal score, or if score > 50
        return PolicyResult.allow();
      }
      return PolicyResult.deny("Must have a score > 50 to transition to exploration");
    }

    // Other transitions are allowed by default if not strictly constrained here
    return PolicyResult.allow();
  }
}
