import { UseCase } from "../../../../lib/core/application/UseCase";
import { Result, ok, fail } from "../../../../lib/core/result";
import { ConversationRepositoryPort } from "../../ports/repositories/conversation-repository.port";
import { Conversation } from "../../domain/entities/conversation.entity";
import { InfrastructureError } from "../../../../lib/core/result/errors";

export interface GetConversationsCommand {
  userId: string;
}

export interface GetConversationsResult {
  conversations: Conversation[];
}

export class GetConversationsUseCase extends UseCase<GetConversationsCommand, GetConversationsResult> {
  constructor(
    private readonly conversationRepo: ConversationRepositoryPort
  ) {
    super();
  }

  protected async run(command: GetConversationsCommand): Promise<Result<GetConversationsResult>> {
    const conversations = await this.conversationRepo.findByUserId(command.userId);
    return ok({ conversations });
  }
}
