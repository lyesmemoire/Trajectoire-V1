import type { QuestionExecution } from "../entities/QuestionExecution.js";
import type { InterviewPhase } from "../types.js";

export class IsUnderPressureSpec {
  public isSatisfiedBy(currentPhase: InterviewPhase, currentExecution: QuestionExecution | null): boolean {
    if (currentPhase !== "pressure") {
      return false;
    }

    if (currentExecution && currentExecution.isMunition && !currentExecution.abandoned && !currentExecution.success) {
      return true;
    }

    return false;
  }
}
