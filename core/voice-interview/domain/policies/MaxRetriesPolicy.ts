import { PolicyResult } from "./PhaseTransitionPolicy.js";

export class MaxRetriesPolicy {
  private static readonly MAX_RETRIES = 3;

  public evaluate(attempts: number): PolicyResult {
    if (attempts >= MaxRetriesPolicy.MAX_RETRIES) {
      return PolicyResult.deny(`Maximum retries (${MaxRetriesPolicy.MAX_RETRIES}) reached for the current question.`);
    }
    return PolicyResult.allow();
  }
}
