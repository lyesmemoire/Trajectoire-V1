import { UseCase } from "../../../../lib/core/application/UseCase";
import { Result, ok, fail } from "../../../../lib/core/result";
import { ConversationRepositoryPort } from "../../ports/repositories/conversation-repository.port";
import { Conversation, Message, MessageRole } from "../../domain/entities/conversation.entity";
import { ExecutionPipeline, ExecutionStage } from "../../../../lib/intelligence-runtime/application/ExecutionPipeline";
import { RuntimeContext } from "../../../../lib/intelligence-runtime/domain/context/RuntimeContext";
import { InfrastructureError } from "../../../../lib/core/result/errors";
import { v4 as uuidv4 } from "uuid";
import { ConversationStarted } from "../../domain/events/conversation-started.event";
import { ConversationCompleted } from "../../domain/events/conversation-completed.event";

export interface SendMessageCommand {
  userId: string;
  conversationId?: string;
  content: string;
}

export interface SendMessageResult {
  conversationId: string;
  message: Message;
}

export class SendMessageUseCase extends UseCase<SendMessageCommand, SendMessageResult> {
  constructor(
    private readonly conversationRepo: ConversationRepositoryPort,
    private readonly executionPipeline: ExecutionPipeline
  ) {
    super();
  }

  protected async run(command: SendMessageCommand): Promise<Result<SendMessageResult>> {
    const startTime = Date.now();

    // Get or create conversation
    let conversation: Conversation;
    let isNewConversation = false;
    
    if (command.conversationId) {
      const existing = await this.conversationRepo.findById(command.conversationId);
      if (!existing || existing.userId !== command.userId) {
        return fail(new InfrastructureError("Conversation not found"));
      }
      conversation = existing;
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        id: uuidv4(),
        userId: command.userId,
        title: this.generateTitle(command.content),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await this.conversationRepo.save(newConversation);
      conversation = newConversation;
      isNewConversation = true;

      // Publish ConversationStarted event
      const conversationStarted = new ConversationStarted({
        conversationId: conversation.id,
        userId: conversation.userId,
        title: conversation.title,
        timestamp: conversation.createdAt,
      });
      // Event publishing would happen here via DomainEventPublisher
      // For now, we'll skip actual publishing as it requires the publisher to be injected
    }

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: command.content,
      timestamp: new Date(),
    };
    conversation.messages.push(userMessage);
    conversation.updatedAt = new Date();
    await this.conversationRepo.update(conversation);

    // Execute intelligence pipeline
    const runtimeContext = new RuntimeContext();
    runtimeContext.set("userId", command.userId);
    runtimeContext.set("sessionId", conversation.id);
    runtimeContext.set("requestId", uuidv4());

    try {
      const assistantContent = await this.executeIntelligencePipeline(command.content, runtimeContext);
      
      const executionDuration = Date.now() - startTime;

      // Add assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
        engineUsed: "IntelligencePipeline",
        executionDuration,
      };
      conversation.messages.push(assistantMessage);
      conversation.updatedAt = new Date();
      await this.conversationRepo.update(conversation);

      // Publish ConversationCompleted event for this message exchange
      const conversationCompleted = new ConversationCompleted({
        conversationId: conversation.id,
        userId: conversation.userId,
        messageCount: conversation.messages.length,
        duration: executionDuration,
        timestamp: new Date(),
      });
      // Event publishing would happen here via DomainEventPublisher
      // For now, we'll skip actual publishing as it requires the publisher to be injected

      // Metrics would be recorded here via MetricsAdapter
      // For now, we'll skip actual metrics recording as it requires the adapter to be injected

      return ok({
        conversationId: conversation.id,
        message: assistantMessage,
      });
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "Désolé, une erreur s'est produite lors du traitement de votre message.",
        timestamp: new Date(),
        engineUsed: "IntelligencePipeline",
        executionDuration: Date.now() - startTime,
      };
      conversation.messages.push(errorMessage);
      conversation.updatedAt = new Date();
      await this.conversationRepo.update(conversation);

      return fail(new InfrastructureError("Failed to process message"));
    }
  }

  private async executeIntelligencePipeline(userMessage: string, context: RuntimeContext): Promise<string> {
    // Create a simple stage that processes the message
    const stage: ExecutionStage<string, string> = {
      name: "ProcessMessage",
      execute: async (input: string, ctx: RuntimeContext) => {
        // This is a placeholder - in production, this would use the actual intelligence engines
        // For now, we return a simulated response
        return this.generateSimulatedResponse(input);
      },
    };

    const result = await this.executionPipeline.execute(
      userMessage,
      [stage],
      context
    );

    return result;
  }

  private generateSimulatedResponse(userMessage: string): string {
    const responses = [
      "Je comprends votre demande. Voici mon analyse de votre situation...",
      "Basé sur votre profil, je vous recommande de vous concentrer sur...",
      "Votre progression est excellente. Voici les prochaines étapes suggérées...",
      "J'ai analysé vos compétences. Voici mes recommandations pour améliorer votre profil...",
    ];
    
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex] || "Je traite votre demande...";
  }

  private generateTitle(content: string): string {
    const words = content.split(" ").slice(0, 4);
    return words.join(" ") + (content.split(" ").length > 4 ? "..." : "");
  }
}
