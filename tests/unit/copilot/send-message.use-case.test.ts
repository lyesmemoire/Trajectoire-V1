import { describe, it, expect, beforeEach } from "vitest";
import { SendMessageUseCase } from "../../../modules/copilot/application/use-cases/send-message.use-case";
import { InMemoryConversationRepository } from "../../../modules/copilot/infrastructure/repositories/in-memory-conversation.repository";
import { ExecutionPipeline } from "../../../lib/intelligence-runtime/application/ExecutionPipeline";
import { v4 as uuidv4 } from "uuid";

describe("SendMessageUseCase", () => {
  let useCase: SendMessageUseCase;
  let repo: InMemoryConversationRepository;
  let pipeline: ExecutionPipeline;
  const userId = "user-123";

  beforeEach(() => {
    repo = new InMemoryConversationRepository();
    pipeline = new ExecutionPipeline();
    useCase = new SendMessageUseCase(repo, pipeline);
  });

  it("should create a new conversation when no conversationId is provided", async () => {
    const command = {
      userId,
      content: "Hello, I need help with my career",
    };

    const result = await useCase.execute(command);

    expect(result.isSuccess()).toBe(true);
    const data = result.unwrap();
    expect(data.conversationId).toBeDefined();
    expect(data.message.role).toBe("assistant");
  });

  it("should add message to existing conversation", async () => {
    // Create a conversation first
    const conversation = {
      id: uuidv4(),
      userId,
      title: "Test",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repo.save(conversation);

    const command = {
      userId,
      conversationId: conversation.id,
      content: "Follow up message",
    };

    const result = await useCase.execute(command);

    expect(result.isSuccess()).toBe(true);
    const updated = await repo.findById(conversation.id);
    expect(updated?.messages).toHaveLength(2); // user + assistant
  });

  it("should fail when conversation does not exist", async () => {
    const command = {
      userId,
      conversationId: "non-existent",
      content: "Test",
    };

    const result = await useCase.execute(command);

    expect(result.isFailure()).toBe(true);
  });

  it("should fail when conversation belongs to different user", async () => {
    const conversation = {
      id: uuidv4(),
      userId: "other-user",
      title: "Test",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repo.save(conversation);

    const command = {
      userId,
      conversationId: conversation.id,
      content: "Test",
    };

    const result = await useCase.execute(command);

    expect(result.isFailure()).toBe(true);
  });

  it("should generate title from first message", async () => {
    const command = {
      userId,
      content: "This is a long message that should be truncated for the title",
    };

    const result = await useCase.execute(command);
    const conversation = await repo.findById(result.unwrap().conversationId);

    expect(conversation?.title).toBe("This is a long...");
  });
});
