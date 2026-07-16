import { ErrorMapper } from "../../domain/contracts/error.mapper";
import {
  InterviewError,
  ValidationError,
} from "../../domain/contracts/interview.errors";
import type { InterviewDomainEvent } from "../../domain/contracts/interview.events";
import type { InterviewInput } from "../../domain/contracts/interview.dto";
import type { InterviewContextBuilderPort } from "../../domain/ports/interview-context-builder.port";
import type { InterviewEnginePort } from "../../domain/ports/interview-engine.port";

export class InterviewConversationUseCase {
  constructor(
    private readonly contextBuilder: InterviewContextBuilderPort,
    private readonly engine: InterviewEnginePort,
  ) {}

  async *execute(
    userId: string,
    input: InterviewInput,
  ): AsyncGenerator<InterviewDomainEvent, void, void> {
    try {
      this.validate(input);
      const context = await this.contextBuilder.buildContext(userId, input);

      for await (const event of this.engine.generateResponseStream(input, userId, context)) {
        yield event;
      }
    } catch (error) {
      yield { type: "Error", error: ErrorMapper.toDomainError(error) };
    }
  }

  private validate(input: InterviewInput): void {
    if (input.sessionId.trim().length === 0) {
      throw new ValidationError("sessionId is required");
    }

    if (input.message.trim().length === 0) {
      throw new ValidationError("message is required");
    }

    if (input.history.length > 50) {
      throw new InterviewError("history exceeds the supported conversation window");
    }
  }
}

