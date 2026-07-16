import { UseCase, CommandContext, Result, success, failure, ApplicationError } from "../types.js";
import type { ProcessTurnRequest, ProcessTurnResponse } from "../dtos/index.js";
import type { InterviewSessionRepository, EventPublisherPort, TransactionPort } from "../ports/index.js";
import { SessionId } from "../../domain/types.js";
import { SessionNotFoundError } from "./ProcessVoiceTurnUseCase.js";

export class HandleSilenceUseCase implements UseCase<ProcessTurnRequest, ProcessTurnResponse, ApplicationError> {
  constructor(private repo: InterviewSessionRepository, private pub: EventPublisherPort, private tx: TransactionPort) {}
  async execute(request: ProcessTurnRequest, context: CommandContext): Promise<Result<ProcessTurnResponse, ApplicationError>> {
    return this.tx.run(async () => {
      const session = await this.repo.findById(SessionId.create(request.sessionId));
      if (!session) return failure(new SessionNotFoundError(request.sessionId));
      
      // Implement BR026 -> BR030
      // Mock logic for architectural correctness
      
      await this.repo.save(session);
      await this.pub.publish(session.pullDomainEvents(), context.correlationId);
      session.clearDomainEvents();

      return success({
        audioChunk: null,
        generatedText: "Are you still there?",
        isFinished: false,
        feedbackSignal: "clarify"
      });
    });
  }
}

export class HandleInterruptionUseCase implements UseCase<ProcessTurnRequest, ProcessTurnResponse, ApplicationError> {
  constructor(private repo: InterviewSessionRepository, private pub: EventPublisherPort, private tx: TransactionPort) {}
  async execute(request: ProcessTurnRequest, context: CommandContext): Promise<Result<ProcessTurnResponse, ApplicationError>> {
    return this.tx.run(async () => {
      const session = await this.repo.findById(SessionId.create(request.sessionId));
      if (!session) return failure(new SessionNotFoundError(request.sessionId));
      
      // Implement BR021 -> BR025
      
      await this.repo.save(session);
      await this.pub.publish(session.pullDomainEvents(), context.correlationId);
      session.clearDomainEvents();

      return success({
        audioChunk: null,
        generatedText: "Please go ahead.",
        isFinished: false,
        feedbackSignal: "clarify"
      });
    });
  }
}
