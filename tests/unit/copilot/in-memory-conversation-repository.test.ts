import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryConversationRepository } from "../../../modules/copilot/infrastructure/repositories/in-memory-conversation.repository";
import { Conversation, Message } from "../../../modules/copilot/domain/entities/conversation.entity";
import { v4 as uuidv4 } from "uuid";

describe("InMemoryConversationRepository", () => {
  let repo: InMemoryConversationRepository;
  const userId = "user-123";

  beforeEach(() => {
    repo = new InMemoryConversationRepository();
  });

  it("should save and retrieve a conversation", async () => {
    const conversation: Conversation = {
      id: uuidv4(),
      userId,
      title: "Test Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await repo.save(conversation);
    const retrieved = await repo.findById(conversation.id);

    expect(retrieved).toEqual(conversation);
  });

  it("should return null for non-existent conversation", async () => {
    const retrieved = await repo.findById("non-existent");
    expect(retrieved).toBeNull();
  });

  it("should find conversations by user id", async () => {
    const conv1: Conversation = {
      id: uuidv4(),
      userId,
      title: "Conversation 1",
      messages: [],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-02"),
    };

    const conv2: Conversation = {
      id: uuidv4(),
      userId: "other-user",
      title: "Other Conversation",
      messages: [],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-03"),
    };

    const conv3: Conversation = {
      id: uuidv4(),
      userId,
      title: "Conversation 2",
      messages: [],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-04"),
    };

    await repo.save(conv1);
    await repo.save(conv2);
    await repo.save(conv3);

    const userConversations = await repo.findByUserId(userId);

    expect(userConversations).toHaveLength(2);
    expect(userConversations[0].id).toBe(conv3.id); // Most recent first
    expect(userConversations[1].id).toBe(conv1.id);
  });

  it("should delete a conversation", async () => {
    const conversation: Conversation = {
      id: uuidv4(),
      userId,
      title: "Test Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await repo.save(conversation);
    await repo.delete(conversation.id);

    const retrieved = await repo.findById(conversation.id);
    expect(retrieved).toBeNull();
  });

  it("should update a conversation", async () => {
    const conversation: Conversation = {
      id: uuidv4(),
      userId,
      title: "Original Title",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await repo.save(conversation);

    const updated: Conversation = {
      ...conversation,
      title: "Updated Title",
      messages: [{ id: uuidv4(), role: "user", content: "Hello", timestamp: new Date() }],
      updatedAt: new Date(),
    };

    await repo.update(updated);
    const retrieved = await repo.findById(conversation.id);

    expect(retrieved?.title).toBe("Updated Title");
    expect(retrieved?.messages).toHaveLength(1);
  });
});
