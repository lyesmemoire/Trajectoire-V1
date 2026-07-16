import { UseCase } from "../../../../lib/core/application/UseCase";
import { Result, ok, fail } from "../../../../lib/core/result";
import { ConversationRepositoryPort } from "../../ports/repositories/conversation-repository.port";
import { InfrastructureError } from "../../../../lib/core/result/errors";

export interface DeleteConversationCommand {
  id: string;
  userId: string;
}

export class DeleteConversationUseCase extends UseCase<DeleteConversationCommand, void> {
  constructor(
    private readonly conversationRepo: ConversationRepositoryPort
  ) {
    super();
  }

  protected async run(command: DeleteConversationCommand): Promise<Result<void>> {
    const conversation = await this.conversationRepo.findById(command.id);
    
    if (!conversation) {
      return fail(new InfrastructureError("Conversation not found"));
    }

    if (conversation.userId !== command.userId) {
      return fail(new InfrastructureError("Access denied"));
    }

    await this.conversationRepo.delete(command.id);
    return ok(undefined);
  }
}
