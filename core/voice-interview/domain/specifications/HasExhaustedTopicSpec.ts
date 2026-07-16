import type { QuestionExecution } from "../entities/QuestionExecution.js";

export class HasExhaustedTopicSpec {
  public isSatisfiedBy(execution: QuestionExecution, maxRetriesReached: boolean): boolean {
    if (execution.success) {
      return true;
    }

    if (execution.abandoned) {
      return true;
    }

    if (maxRetriesReached) {
      return true;
    }

    return false;
  }
}
