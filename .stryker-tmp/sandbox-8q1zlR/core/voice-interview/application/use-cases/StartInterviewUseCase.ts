// @ts-nocheck
import type { UseCase, CommandContext, Result } from "../types.js";
import { success, failure, ApplicationError } from "../types.js";
import type { StartInterviewRequest, StartInterviewResponse } from "../dtos/index.js";
import type { InterviewSessionRepository } from "../ports/InterviewSessionRepository.js";
import type { UUIDPort, EventPublisherPort, QuestionGenerationPort, SpeechSynthesisPort, TransactionPort, LoggingPort, ClockPort } from "../ports/index.js";
import { InterviewSessionAggregate, type AggregateServices } from "../../domain/aggregates/InterviewSessionAggregate.js";
import { SessionId, CandidateId } from "../../domain/types.js";

export class StartInterviewError extends ApplicationError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message, "START_INTERVIEW_ERROR");
  }
}

export class StartInterviewUseCase implements UseCase<StartInterviewRequest, StartInterviewResponse, ApplicationError> {
  constructor(
    private readonly repo: InterviewSessionRepository,
    private readonly uuidPort: UUIDPort,
    private readonly clockPort: ClockPort,
    private readonly eventPublisher: EventPublisherPort,
    private readonly questionPort: QuestionGenerationPort,
    private readonly speechPort: SpeechSynthesisPort,
    private readonly transactionPort: TransactionPort,
    private readonly logger: LoggingPort
  ) {}

  async execute(request: StartInterviewRequest, context: CommandContext): Promise<Result<StartInterviewResponse, ApplicationError>> {
    try {
      return await this.transactionPort.run(async () => {
        const sessionId = SessionId.create(this.uuidPort.generate());
        const candidateId = CandidateId.create(request.candidateId);
        const aggregateServices: AggregateServices = { clock: this.clockPort, idGenerator: this.uuidPort };

        const session = InterviewSessionAggregate.createNew(sessionId, candidateId);
        session.start(request.targetRole, aggregateServices);

        const initialText = await this.questionPort.generateNext(session.phase, null, []);
        const audioChunk = await this.speechPort.synthesize(initialText);

        await this.repo.save(session);

        const events = session.pullDomainEvents();
        await this.eventPublisher.publish(events, context.correlationId);
        session.clearDomainEvents();

        this.logger.info("Interview started successfully", { sessionId: sessionId as string });

        return success({
          sessionId: sessionId as string,
          initialQuestionText: initialText,
          initialAudioChunk: audioChunk
        });
      });
    } catch (error) {
      this.logger.error("Failed to start interview", error instanceof Error ? error : new Error(String(error)));
      return failure(new StartInterviewError("Failed to start interview", error));
    }
  }
}
