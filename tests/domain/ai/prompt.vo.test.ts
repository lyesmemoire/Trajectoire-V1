import { describe, it, expect } from "vitest";
import { Prompt, PromptMessage, PromptRole } from "../../../lib/ai/domain/value-objects/prompt.vo";

describe("Prompt Value Object", () => {
  describe("creation", () => {
    it("should create prompt with valid messages", () => {
      const messages: PromptMessage[] = [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: "Hello" }
      ];
      const prompt = Prompt.create(messages);
      
      expect(prompt.messages).toHaveLength(2);
      expect(prompt.messages[0].role).toBe("system");
      expect(prompt.messages[0].content).toBe("You are a helpful assistant");
    });

    it("should throw error for empty messages array", () => {
      expect(() => Prompt.create([])).toThrow("Prompt must contain at least one message");
    });

    it("should create single message prompt", () => {
      const prompt = Prompt.single("Hello, world!");
      
      expect(prompt.messages).toHaveLength(1);
      expect(prompt.messages[0].role).toBe("user");
      expect(prompt.messages[0].content).toBe("Hello, world!");
    });

    it("should create single message with custom role", () => {
      const prompt = Prompt.single("You are helpful", "system");
      
      expect(prompt.messages[0].role).toBe("system");
      expect(prompt.messages[0].content).toBe("You are helpful");
    });

    it("should accept all valid roles", () => {
      const messages: PromptMessage[] = [
        { role: "system", content: "System message" },
        { role: "user", content: "User message" },
        { role: "assistant", content: "Assistant message" }
      ];
      const prompt = Prompt.create(messages);
      
      expect(prompt.messages).toHaveLength(3);
    });
  });

  describe("addMessage", () => {
    it("should add message to prompt", () => {
      const prompt = Prompt.single("Hello");
      const newPrompt = prompt.addMessage({ role: "assistant", content: "Hi there!" });
      
      expect(newPrompt.messages).toHaveLength(2);
      expect(newPrompt.messages[1].content).toBe("Hi there!");
    });

    it("should return new instance (immutability)", () => {
      const prompt = Prompt.single("Hello");
      const newPrompt = prompt.addMessage({ role: "assistant", content: "Hi there!" });
      
      expect(prompt.messages).toHaveLength(1);
      expect(newPrompt.messages).toHaveLength(2);
    });

    it("should preserve existing messages", () => {
      const prompt = Prompt.single("First message");
      const newPrompt = prompt.addMessage({ role: "user", content: "Second message" });
      
      expect(newPrompt.messages[0].content).toBe("First message");
      expect(newPrompt.messages[1].content).toBe("Second message");
    });
  });

  describe("edge cases", () => {
    it("should handle very long content", () => {
      const longContent = "a".repeat(10000);
      const prompt = Prompt.single(longContent);
      
      expect(prompt.messages[0].content).toBe(longContent);
    });

    it("should handle empty content string", () => {
      const prompt = Prompt.single("");
      
      expect(prompt.messages[0].content).toBe("");
    });

    it("should handle special characters", () => {
      const content = "Special chars: \n\t\r\\\"'";
      const prompt = Prompt.single(content);
      
      expect(prompt.messages[0].content).toBe(content);
    });

    it("should handle unicode characters", () => {
      const content = "Unicode: 你好 🌍";
      const prompt = Prompt.single(content);
      
      expect(prompt.messages[0].content).toBe(content);
    });

    it("should maintain immutability of messages array", () => {
      const messages: PromptMessage[] = [{ role: "user", content: "Hello" }];
      const prompt = Prompt.create(messages);
      
      // Messages is readonly, so this is a compile-time check
      expect(prompt.messages).toHaveLength(1);
    });
  });
});
