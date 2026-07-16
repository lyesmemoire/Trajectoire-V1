// @ts-nocheck
import { InterviewOrchestrationContext } from "../../../contexts/interview-orchestration.context";
import { PressureEngine } from "../../../../domain/services/pressure-engine.service";
import { Result, ok } from "@/lib/core/result";

export class EvaluatePressureStep {
  constructor(private readonly pressureEngine: PressureEngine) {}

  async execute(context: InterviewOrchestrationContext): Promise<Result<void>> {
    if (!context.analysis) {
      return ok(undefined); // Should not happen if steps are ordered correctly
    }

    const decision = this.pressureEngine.compute(
      context.session.currentState,
      context.session.pressureLevel,
      context.analysis,
      context.incomingAnswer
    );

    context.suggestedStrategy = decision.suggestedStrategy;

    if (decision.triggerRecovery) {
      context.isRecoveryTriggered = true;
      context.session.triggerRecovery(decision.newPressure);
    } else {
      context.session.adjustPressure(decision.newPressure);
    }

    return ok(undefined);
  }
}
