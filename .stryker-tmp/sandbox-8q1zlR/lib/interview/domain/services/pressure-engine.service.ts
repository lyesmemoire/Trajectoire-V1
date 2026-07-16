// @ts-nocheck
import { InterviewState } from "../aggregates/interview-state-machine";
import { AnswerAnalysis } from "../value-objects/answer-analysis.vo";
import { PressureLevel } from "../value-objects/pressure-level.vo";
import { InterviewAnswer } from "../value-objects/interview-answer.vo";
import { CanIncreasePressurePolicy } from "../policies/can-increase-pressure.policy";
import { CanRecoverPolicy } from "../policies/can-recover.policy";

export interface PressureDecision {
  newPressure: PressureLevel;
  triggerRecovery: boolean;
  suggestedStrategy: string;
}

export class PressureEngine {
  private readonly increasePolicy = new CanIncreasePressurePolicy();
  private readonly recoverPolicy = new CanRecoverPolicy();

  public compute(
    currentState: InterviewState,
    currentPressure: PressureLevel,
    analysis: AnswerAnalysis,
    lastAnswer: InterviewAnswer
  ): PressureDecision {
    let newPressure = currentPressure;
    let triggerRecovery = false;
    let strategy = "transition";

    const recoverContext = {
      currentState,
      confidenceScore: analysis.confidenceScore,
      consecutiveHesitations: lastAnswer.metrics?.consecutiveHesitations || 0,
    };

    if (this.recoverPolicy.evaluate(recoverContext)) {
      triggerRecovery = true;
      newPressure = currentPressure.decrease(20);
      strategy = "supportive";
    } else {
      const increaseContext = {
        currentState,
        confidenceScore: analysis.confidenceScore,
      };

      if (this.increasePolicy.evaluate(increaseContext)) {
        newPressure = currentPressure.increase(10);
        strategy = "challenging";
      } else {
        // Maintain pressure, perhaps ask a clarification
        strategy = "clarification";
      }
    }

    return {
      newPressure,
      triggerRecovery,
      suggestedStrategy: strategy,
    };
  }
}
