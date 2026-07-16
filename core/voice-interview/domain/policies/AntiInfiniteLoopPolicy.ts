import { PolicyResult } from "./PhaseTransitionPolicy.js";

export class AntiInfiniteLoopPolicy {
  private static readonly MAX_TURNS = 20;

  public evaluate(currentTurnCount: number): PolicyResult {
    if (currentTurnCount >= AntiInfiniteLoopPolicy.MAX_TURNS) {
      return PolicyResult.deny(`Maximum turns limit reached (${AntiInfiniteLoopPolicy.MAX_TURNS}). Must wrap up.`);
    }
    return PolicyResult.allow();
  }
}
