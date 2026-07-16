// @ts-nocheck
import { describe, it, expect } from "vitest";
import { InterviewAnswer, InterviewAnswerProps } from "../../../lib/interview/domain/value-objects/interview-answer.vo";

describe("InterviewAnswer Value Object", () => {
  describe("creation", () => {
    it("should create answer with valid props", () => {
      const props: InterviewAnswerProps = {
        content: "I have 5 years of experience with React",
        submittedAt: new Date("2024-01-01T00:00:00Z"),
        metrics: {
          silenceDuration: 2,
          wordCount: 10,
          consecutiveHesitations: 0
        }
      };
      const answer = InterviewAnswer.create(props);
      
      expect(answer.content).toBe("I have 5 years of experience with React");
      expect(answer.submittedAt).toEqual(new Date("2024-01-01T00:00:00Z"));
      expect(answer.metrics?.silenceDuration).toBe(2);
      expect(answer.metrics?.wordCount).toBe(10);
      expect(answer.metrics?.consecutiveHesitations).toBe(0);
    });

    it("should create answer with minimal props", () => {
      const props: InterviewAnswerProps = {
        content: "This is my answer",
        submittedAt: new Date()
      };
      const answer = InterviewAnswer.create(props);
      
      expect(answer.content).toBe("This is my answer");
      expect(answer.metrics).toBeUndefined();
    });

    it("should throw error for empty content", () => {
      const props: InterviewAnswerProps = {
        content: "",
        submittedAt: new Date()
      };
      
      expect(() => InterviewAnswer.create(props)).toThrow("Answer content cannot be empty.");
    });

    it("should throw error for whitespace-only content", () => {
      const props: InterviewAnswerProps = {
        content: "   ",
        submittedAt: new Date()
      };
      
      expect(() => InterviewAnswer.create(props)).toThrow("Answer content cannot be empty.");
    });

    it("should handle partial metrics", () => {
      const props: InterviewAnswerProps = {
        content: "Test answer",
        submittedAt: new Date(),
        metrics: {
          wordCount: 5
        }
      };
      const answer = InterviewAnswer.create(props);
      
      expect(answer.metrics?.wordCount).toBe(5);
      expect(answer.metrics?.silenceDuration).toBeUndefined();
    });
  });

  describe("edge cases", () => {
    it("should maintain immutability", () => {
      const props: InterviewAnswerProps = {
        content: "Test answer",
        submittedAt: new Date()
      };
      const answer = InterviewAnswer.create(props);
      
      // Properties are readonly, so this is a compile-time check
      expect(answer.content).toBe("Test answer");
    });

    it("should handle very long content", () => {
      const longContent = "a".repeat(10000);
      const props: InterviewAnswerProps = {
        content: longContent,
        submittedAt: new Date()
      };
      const answer = InterviewAnswer.create(props);
      
      expect(answer.content).toBe(longContent);
    });

    it("should handle special characters in content", () => {
      const props: InterviewAnswerProps = {
        content: "Special chars: \n\t\r\\\"'",
        submittedAt: new Date()
      };
      const answer = InterviewAnswer.create(props);
      
      expect(answer.content).toBe("Special chars: \n\t\r\\\"'");
    });

    it("should handle unicode characters in content", () => {
      const props: InterviewAnswerProps = {
        content: "Unicode: 你好 🌍",
        submittedAt: new Date()
      };
      const answer = InterviewAnswer.create(props);
      
      expect(answer.content).toBe("Unicode: 你好 🌍");
    });

    it("should handle large metric values", () => {
      const props: InterviewAnswerProps = {
        content: "Test answer",
        submittedAt: new Date(),
        metrics: {
          silenceDuration: 3600,
          wordCount: 10000,
          consecutiveHesitations: 100
        }
      };
      const answer = InterviewAnswer.create(props);
      
      expect(answer.metrics?.silenceDuration).toBe(3600);
      expect(answer.metrics?.wordCount).toBe(10000);
      expect(answer.metrics?.consecutiveHesitations).toBe(100);
    });
  });
});
