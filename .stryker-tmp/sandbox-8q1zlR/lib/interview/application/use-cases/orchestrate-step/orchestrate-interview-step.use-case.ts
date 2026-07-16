// @ts-nocheck
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, ok, fail } from "@/lib/core/result";
import { InterviewRepositoryPort } from "../../../ports/interview-repository.port";
import { InterviewOrchestrationContext } from "../../contexts/interview-orchestration.context";
import { InterviewAnswer } from "../../../domain/value-objects/interview-answer.vo";
import { Clock } from "@/lib/core/time/Clock";
import { ApplicationError } from "@/lib/core/errors";

import { AnalyzeAnswerStep } from "./steps/analyze-answer.step";
import { EvaluatePressureStep } from "./steps/evaluate-pressure.step";
import { GenerateQuestionStep } from "./steps/generate-question.step";
import { PersistSessionStep } from "./steps/persist-session.step";

export interface OrchestrateStepCommand {
  sessionId: string;
  userId: string;
  userAnswer: string;
  currentQuestion: string;
  metrics?: {
    silenceDuration?: number;
    wordCount?: number;
    consecutiveHesitations?: number;
  };
}

export interface OrchestrateStepResult {
  nextQuestion: string;
  pressureLevel: number;
  isRecovery: boolean;
}

export class OrchestrateInterviewStepUseCase extends UseCase<OrchestrateStepCommand, OrchestrateStepResult> {
  constructor(
    private readonly repository: InterviewRepositoryPort,
    private readonly analyzeStep: AnalyzeAnswerStep,
    private readonly pressureStep: EvaluatePressureStep,
    private readonly generateStep: GenerateQuestionStep,
    private readonly persistStep: PersistSessionStep
  ) {
    super();
  }

  protected async run(command: OrchestrateStepCommand): Promise<Result<OrchestrateStepResult>> {
    // 1. Load Session
    const sessionResult = await this.repository.getById(command.sessionId);
    if (sessionResult.isFailure()) return fail(sessionResult.unwrapError());

    const session = sessionResult.unwrap();
    if (session.userId !== command.userId) {
      return fail(new ApplicationError("Unauthorized to access this session", "UNAUTHORIZED_SESSION_ACCESS"));
    }
    if (session.currentState === "COMPLETED") {
      return fail(new ApplicationError("Interview is already completed", "INTERVIEW_COMPLETED"));
    }

    // 2. Initialize Context
    const context = new InterviewOrchestrationContext();
    context.session = session;
    context.incomingAnswer = InterviewAnswer.create({
      content: command.userAnswer,
      submittedAt: Clock.now(),
      metrics: command.metrics,
    });

    // 3. Execute Pipeline Steps
    const analyzeResult = await this.analyzeStep.execute(context, command.currentQuestion);
    if (analyzeResult.isFailure()) return fail(analyzeResult.unwrapError());

    const pressureResult = await this.pressureStep.execute(context);
    if (pressureResult.isFailure()) return fail(pressureResult.unwrapError());

    const generateResult = await this.generateStep.execute(context);
    if (generateResult.isFailure()) return fail(generateResult.unwrapError());

    const persistResult = await this.persistStep.execute(context);
    if (persistResult.isFailure()) return fail(persistResult.unwrapError());

    // 4. Return Data for the API
    return ok({
      nextQuestion: context.nextQuestion!.content,
      pressureLevel: context.session.pressureLevel.value,
      isRecovery: context.isRecoveryTriggered,
    });
  }
}
