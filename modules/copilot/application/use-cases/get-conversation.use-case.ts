import { UseCase } from "../../../../lib/core/application/UseCase";
import { Result, ok, fail } from "../../../../lib/core/result";
import { ConversationRepositoryPort } from "../../ports/repositories/conversation-repository.port";
import { Conversation } from "../../domain/entities/conversation.entity";
import { InfrastructureError } from "../../../../lib/core/result/errors";

export interface GetConversationCommand {
  id: string;
  userId: string;
}

export interface GetConversationResult {
  conversation: Conversation;
}

export class GetConversationUseCase extends UseCase<GetConversationCommand, GetConversationResult> {
  constructor(
    private readonly conversationRepo: ConversationRepositoryPort
  ) {
    super();
  }

  protected async run(command: GetConversationCommand): Promise<Result<GetConversationResult>> {
    const conversation = await this.conversationRepo.findById(command.id);
    
    if (!conversation) {
      return fail(new InfrastructureError("Conversation not found"));
    }

    if (conversation.userId !== command.userId) {
      return fail(new InfrastructureError("Access denied"));
    }

    return ok({ conversation });
  }
}
