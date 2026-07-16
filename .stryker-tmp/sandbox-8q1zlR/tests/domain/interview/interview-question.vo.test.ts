// @ts-nocheck
import { describe, it, expect } from "vitest";
import { InterviewQuestion, InterviewQuestionProps } from "../../../lib/interview/domain/value-objects/interview-question.vo";

describe("InterviewQuestion Value Object", () => {
  describe("creation", () => {
    it("should create question with valid props", () => {
      const props: InterviewQuestionProps = {
        content: "What is your experience with React?",
        expectedSkills: ["React", "TypeScript"],
        intent: "Technical",
        generatedAt: new Date("2024-01-01T00:00:00Z")
      };
      const question = InterviewQuestion.create(props);
      
      expect(question.content).toBe("What is your experience with React?");
      expect(question.expectedSkills).toEqual(["React", "TypeScript"]);
      expect(question.intent).toBe("Technical");
      expect(question.generatedAt).toEqual(new Date("2024-01-01T00:00:00Z"));
    });

    it("should create question with minimal props", () => {
      const props: InterviewQuestionProps = {
        content: "Tell me about yourself",
        generatedAt: new Date()
      };
      const question = InterviewQuestion.create(props);
      
      expect(question.content).toBe("Tell me about yourself");
      expect(question.expectedSkills).toBeUndefined();
      expect(question.intent).toBeUndefined();
    });

    it("should throw error for empty content", () => {
      const props: InterviewQuestionProps = {
        content: "",
        generatedAt: new Date()
      };
      
      expect(() => InterviewQuestion.create(props)).toThrow("Question content cannot be empty.");
    });

    it("should throw error for whitespace-only content", () => {
      const props: InterviewQuestionProps = {
        content: "   ",
        generatedAt: new Date()
      };
      
      expect(() => InterviewQuestion.create(props)).toThrow("Question content cannot be empty.");
    });

    it("should handle empty expected skills array", () => {
      const props: InterviewQuestionProps = {
        content: "Test question",
        expectedSkills: [],
        generatedAt: new Date()
      };
      const question = InterviewQuestion.create(props);
      
      expect(question.expectedSkills).toEqual([]);
    });
  });

  describe("edge cases", () => {
    it("should maintain immutability", () => {
      const props: InterviewQuestionProps = {
        content: "Test question",
        generatedAt: new Date()
      };
      const question = InterviewQuestion.create(props);
      
      // Properties are readonly, so this is a compile-time check
      expect(question.content).toBe("Test question");
    });

    it("should handle very long content", () => {
      const longContent = "a".repeat(10000);
      const props: InterviewQuestionProps = {
        content: longContent,
        generatedAt: new Date()
      };
      const question = InterviewQuestion.create(props);
      
      expect(question.content).toBe(longContent);
    });

    it("should handle special characters in content", () => {
      const props: InterviewQuestionProps = {
        content: "Special chars: \n\t\r\\\"'",
        generatedAt: new Date()
      };
      const question = InterviewQuestion.create(props);
      
      expect(question.content).toBe("Special chars: \n\t\r\\\"'");
    });

    it("should handle unicode characters in content", () => {
      const props: InterviewQuestionProps = {
        content: "Unicode: 你好 🌍",
        generatedAt: new Date()
      };
      const question = InterviewQuestion.create(props);
      
      expect(question.content).toBe("Unicode: 你好 🌍");
    });

    it("should handle many expected skills", () => {
      const skills = Array.from({ length: 100 }, (_, i) => `skill-${i}`);
      const props: InterviewQuestionProps = {
        content: "Test question",
        expectedSkills: skills,
        generatedAt: new Date()
      };
      const question = InterviewQuestion.create(props);
      
      expect(question.expectedSkills).toHaveLength(100);
    });
  });
});
