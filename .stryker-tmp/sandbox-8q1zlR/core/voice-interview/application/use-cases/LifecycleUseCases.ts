// @ts-nocheck
import type { UseCase, CommandContext, Result, ApplicationError } from "../types.js";
import { success, failure } from "../types.js";
import type { PauseInterviewRequest, ResumeInterviewRequest, StopInterviewRequest } from "../dtos/index.js";
import type { InterviewSessionRepository, EventPublisherPort, TransactionPort, ClockPort, UUIDPort } from "../ports/index.js";
import { SessionId } from "../../domain/types.js";
import { SessionNotFoundError } from "./ProcessVoiceTurnUseCase.js";
import type { AggregateServices } from "../../domain/aggregates/InterviewSessionAggregate.js";

export class PauseInterviewUseCase implements UseCase<PauseInterviewRequest, void, ApplicationError> {
  constructor(
    private repo: InterviewSessionRepository,
    private pub: EventPublisherPort,
    private tx: TransactionPort,
    private clockPort: ClockPort,
    private uuidPort: UUIDPort
  ) {}
  async execute(request: PauseInterviewRequest, context: CommandContext): Promise<Result<void, ApplicationError>> {
    return this.tx.run(async () => {
      const session = await this.repo.findById(SessionId.create(request.sessionId));
      if (!session) return failure(new SessionNotFoundError(request.sessionId));
      const svc: AggregateServices = { clock: this.clockPort, idGenerator: this.uuidPort };
      session.pause(svc);
      await this.repo.save(session);
      await this.pub.publish(session.pullDomainEvents(), context.correlationId);
      session.clearDomainEvents();
      return success(undefined);
    });
  }
}

export class ResumeInterviewUseCase implements UseCase<ResumeInterviewRequest, void, ApplicationError> {
  constructor(
    private repo: InterviewSessionRepository,
    private pub: EventPublisherPort,
    private tx: TransactionPort,
    private clockPort: ClockPort,
    private uuidPort: UUIDPort
  ) {}
  async execute(request: ResumeInterviewRequest, context: CommandContext): Promise<Result<void, ApplicationError>> {
    return this.tx.run(async () => {
      const session = await this.repo.findById(SessionId.create(request.sessionId));
      if (!session) return failure(new SessionNotFoundError(request.sessionId));
      const svc: AggregateServices = { clock: this.clockPort, idGenerator: this.uuidPort };
      session.resume(svc);
      await this.repo.save(session);
      await this.pub.publish(session.pullDomainEvents(), context.correlationId);
      session.clearDomainEvents();
      return success(undefined);
    });
  }
}

export class StopInterviewUseCase implements UseCase<StopInterviewRequest, void, ApplicationError> {
  constructor(
    private repo: InterviewSessionRepository,
    private pub: EventPublisherPort,
    private tx: TransactionPort,
    private clockPort: ClockPort,
    private uuidPort: UUIDPort
  ) {}
  async execute(request: StopInterviewRequest, context: CommandContext): Promise<Result<void, ApplicationError>> {
    return this.tx.run(async () => {
      const session = await this.repo.findById(SessionId.create(request.sessionId));
      if (!session) return failure(new SessionNotFoundError(request.sessionId));
      const svc: AggregateServices = { clock: this.clockPort, idGenerator: this.uuidPort };
      session.complete(svc);
      await this.repo.save(session);
      await this.pub.publish(session.pullDomainEvents(), context.correlationId);
      session.clearDomainEvents();
      return success(undefined);
    });
  }
}
