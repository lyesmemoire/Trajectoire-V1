import { DomainModule } from "../../lib/core/application/DomainModule";
import { Container } from "../../lib/core/runtime/container/Container";
import { SupabaseConversationRepository } from "./infrastructure/repositories/supabase-conversation.repository";
import { ConversationRepositoryPort } from "./ports/repositories/conversation-repository.port";
import { SendMessageUseCase } from "./application/use-cases/send-message.use-case";
import { GetConversationsUseCase } from "./application/use-cases/get-conversations.use-case";
import { GetConversationUseCase } from "./application/use-cases/get-conversation.use-case";
import { DeleteConversationUseCase } from "./application/use-cases/delete-conversation.use-case";
import { ExecutionPipeline } from "../../lib/intelligence-runtime/application/ExecutionPipeline";

export class CopilotModule extends DomainModule {
  protected registerRepositories(container: Container): void {
    container.registerSingleton(
      "ConversationRepository",
      () => new SupabaseConversationRepository()
    );
  }

  protected registerGateways(container: Container): void {
    // No gateways needed for now
  }

  protected registerUseCases(container: Container): void {
    container.registerSingleton(
      "SendMessageUseCase",
      () => new SendMessageUseCase(
        container.resolve<ConversationRepositoryPort>("ConversationRepository"),
        new ExecutionPipeline()
      )
    );

    container.registerSingleton(
      "GetConversationsUseCase",
      () => new GetConversationsUseCase(
        container.resolve<ConversationRepositoryPort>("ConversationRepository")
      )
    );

    container.registerSingleton(
      "GetConversationUseCase",
      () => new GetConversationUseCase(
        container.resolve<ConversationRepositoryPort>("ConversationRepository")
      )
    );

    container.registerSingleton(
      "DeleteConversationUseCase",
      () => new DeleteConversationUseCase(
        container.resolve<ConversationRepositoryPort>("ConversationRepository")
      )
    );
  }

  protected registerQueries(container: Container): void {
    // No queries needed for now
  }

  protected registerPresenters(container: Container): void {
    // No presenters needed for now
  }
}
