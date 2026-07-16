// @ts-nocheck
import type { UseCase, CommandContext, Result } from "../types.js";
import { success, failure, ApplicationError } from "../types.js";
import type { ProcessTurnRequest, ProcessTurnResponse } from "../dtos/index.js";
import type {
  InterviewSessionRepository,
  EventPublisherPort,
  TextEvaluationPort,
  QuestionGenerationPort,
  SpeechSynthesisPort,
  TransactionPort,
  LoggingPort,
  ClockPort,
  UUIDPort
} from "../ports/index.js";
import { SessionId, TurnId, Transcript, TurnTiming } from "../../domain/types.js";
import { VoiceTurn } from "../../domain/entities/VoiceTurn.js";
import { InterviewFlowService } from "../../domain/services/InterviewFlowService.js";
import type { AggregateServices } from "../../domain/aggregates/InterviewSessionAggregate.js";

export class SessionNotFoundError extends ApplicationError {
  constructor(sessionId: string) { super(`Session ${sessionId} not found`, "SESSION_NOT_FOUND"); }
}

export class ProcessTurnError extends ApplicationError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message, "PROCESS_TURN_ERROR");
  }
}

export class ProcessVoiceTurnUseCase implements UseCase<ProcessTurnRequest, ProcessTurnResponse, ApplicationError> {
  constructor(
    private readonly repo: InterviewSessionRepository,
    private readonly evalPort: TextEvaluationPort,
    private readonly questionPort: QuestionGenerationPort,
    private readonly speechPort: SpeechSynthesisPort,
    private readonly eventPublisher: EventPublisherPort,
    private readonly transactionPort: TransactionPort,
    private readonly logger: LoggingPort,
    private readonly clockPort: ClockPort,
    private readonly uuidPort: UUIDPort
  ) {}

  async execute(request: ProcessTurnRequest, context: CommandContext): Promise<Result<ProcessTurnResponse, ApplicationError>> {
    try {
      return await this.transactionPort.run(async () => {
        const sessionId = SessionId.create(request.sessionId);
        const session = await this.repo.findById(sessionId);

        if (!session) {
          return failure(new SessionNotFoundError(request.sessionId));
        }

        const aggregateServices: AggregateServices = { clock: this.clockPort, idGenerator: this.uuidPort };
        const turnId = TurnId.create(request.turnId);
        const transcriptObj = Transcript.create(request.transcript);
        const timing = TurnTiming.create(request.timingMs, request.timingMs);

        let turn = VoiceTurn.create({
          id: turnId,
          transcript: transcriptObj,
          intent: request.intent,
          evaluation: null,
          aiResponse: null,
          feedbackSignal: null,
          timing
        });

        const evalContext = { targetRole: "Role", currentPhase: session.phase };
        const evaluation = await this.evalPort.evaluateAnswer(request.transcript, evalContext);

        const flowService = new InterviewFlowService();
        const flowResult = flowService.computeNextStep({
          currentPhase: session.phase,
          lastScore: evaluation.score,
          scoresInCurrentPhase: session.timeline.lastScores(5).map(s => s.value),
          topicsCovered: 1
        });

        turn = turn.withEvaluation(evaluation, flowResult.nextFeedback);

        const nextText = await this.questionPort.generateNext(flowResult.nextPhase, null, []);
        const nextAudio = await this.speechPort.synthesize(nextText);

        session.recordVoiceTurn(turn, aggregateServices);
        if (flowResult.nextPhase !== session.phase) {
          session.advancePhase(flowResult.nextPhase, aggregateServices);
        }

        await this.repo.save(session);

        const events = session.pullDomainEvents();
        await this.eventPublisher.publish(events, context.correlationId);
        session.clearDomainEvents();

        return success({
          audioChunk: nextAudio,
          generatedText: nextText,
          isFinished: false,
          feedbackSignal: flowResult.nextFeedback
        });
      });
    } catch (error) {
      this.logger.error("Process voice turn failed", error instanceof Error ? error : new Error(String(error)));
      return failure(new ProcessTurnError("Failed to process voice turn", error));
    }
  }
}
