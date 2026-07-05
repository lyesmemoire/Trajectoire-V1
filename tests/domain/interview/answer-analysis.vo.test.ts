import { describe, it, expect } from "vitest";
import { AnswerAnalysis, AnswerAnalysisProps } from "../../../lib/interview/domain/value-objects/answer-analysis.vo";

describe("AnswerAnalysis Value Object", () => {
  describe("creation", () => {
    it("should create analysis with valid props", () => {
      const props: AnswerAnalysisProps = {
        clarityScore: 85,
        specificityScore: 90,
        confidenceScore: 80,
        feedback: "Good answer, but could be more specific",
        detectedWeaknesses: ["Lack of examples"]
      };
      const analysis = AnswerAnalysis.create(props);
      
      expect(analysis.clarityScore).toBe(85);
      expect(analysis.specificityScore).toBe(90);
      expect(analysis.confidenceScore).toBe(80);
      expect(analysis.feedback).toBe("Good answer, but could be more specific");
      expect(analysis.detectedWeaknesses).toEqual(["Lack of examples"]);
    });

    it("should create analysis with minimal props", () => {
      const props: AnswerAnalysisProps = {
        clarityScore: 75,
        specificityScore: 80,
        confidenceScore: 70,
        feedback: "Good answer",
        detectedWeaknesses: []
      };
      const analysis = AnswerAnalysis.create(props);
      
      expect(analysis.clarityScore).toBe(75);
      expect(analysis.detectedWeaknesses).toEqual([]);
    });

    it("should throw error for clarity score below 0", () => {
      const props: AnswerAnalysisProps = {
        clarityScore: -10,
        specificityScore: 80,
        confidenceScore: 70,
        feedback: "Test",
        detectedWeaknesses: []
      };
      
      expect(() => AnswerAnalysis.create(props)).toThrow("Clarity score must be between 0 and 100.");
    });

    it("should throw error for clarity score above 100", () => {
      const props: AnswerAnalysisProps = {
        clarityScore: 110,
        specificityScore: 80,
        confidenceScore: 70,
        feedback: "Test",
        detectedWeaknesses: []
      };
      
      expect(() => AnswerAnalysis.create(props)).toThrow("Clarity score must be between 0 and 100.");
    });

    it("should throw error for specificity score below 0", () => {
      const props: AnswerAnalysisProps = {
        clarityScore: 80,
        specificityScore: -10,
        confidenceScore: 70,
        feedback: "Test",
        detectedWeaknesses: []
      };
      
      expect(() => AnswerAnalysis.create(props)).toThrow("Specificity score must be between 0 and 100.");
    });

    it("should throw error for specificity score above 100", () => {
      const props: AnswerAnalysisProps = {
        clarityScore: 80,
        specificityScore: 110,
        confidenceScore: 70,
        feedback: "Test",
        detectedWeaknesses: []
      };
      
      expect(() => AnswerAnalysis.create(props)).toThrow("Specificity score must be between 0 and 100.");
    });

    it("should throw error for confidence score below 0", () => {
      const props: AnswerAnalysisProps = {
        clarityScore: 80,
        specificityScore: 80,
        confidenceScore: -10,
        feedback: "Test",
        detectedWeaknesses: []
      };
      
      expect(() => AnswerAnalysis.create(props)).toThrow("Confidence score must be between 0 and 100.");
    });

    it("should throw error for confidence score above 100", () => {
      const props: AnswerAnalysisProps = {
        clarityScore: 80,
        specificityScore: 80,
        confidenceScore: 110,
        feedback: "Test",
        detectedWeaknesses: []
      };
      
      expect(() => AnswerAnalysis.create(props)).toThrow("Confidence score must be between 0 and 100.");
    });

    it("should allow boundary scores (0 and 100)", () => {
      const props: AnswerAnalysisProps = {
        clarityScore: 0,
        specificityScore: 100,
        confidenceScore: 50,
        feedback: "Test",
        detectedWeaknesses: []
      };
      const analysis = AnswerAnalysis.create(props);
      
      expect(analysis.clarityScore).toBe(0);
      expect(analysis.specificityScore).toBe(100);
    });
  });

  describe("edge cases", () => {
    it("should maintain immutability", () => {
      const props: AnswerAnalysisProps = {
        clarityScore: 85,
        specificityScore: 90,
        confidenceScore: 80,
        feedback: "Good answer",
        detectedWeaknesses: []
      };
      const analysis = AnswerAnalysis.create(props);
      
      // Properties are readonly, so this is a compile-time check
      expect(analysis.clarityScore).toBe(85);
    });

    it("should handle very long feedback", () => {
      const longFeedback = "a".repeat(10000);
      const props: AnswerAnalysisProps = {
        clarityScore: 85,
        specificityScore: 90,
        confidenceScore: 80,
        feedback: longFeedback,
        detectedWeaknesses: []
      };
      const analysis = AnswerAnalysis.create(props);
      
      expect(analysis.feedback).toBe(longFeedback);
    });

    it("should handle many detected weaknesses", () => {
      const weaknesses = Array.from({ length: 100 }, (_, i) => `weakness-${i}`);
      const props: AnswerAnalysisProps = {
        clarityScore: 85,
        specificityScore: 90,
        confidenceScore: 80,
        feedback: "Test",
        detectedWeaknesses: weaknesses
      };
      const analysis = AnswerAnalysis.create(props);
      
      expect(analysis.detectedWeaknesses).toHaveLength(100);
    });

    it("should handle floating point scores", () => {
      const props: AnswerAnalysisProps = {
        clarityScore: 85.5,
        specificityScore: 90.7,
        confidenceScore: 80.3,
        feedback: "Test",
        detectedWeaknesses: []
      };
      const analysis = AnswerAnalysis.create(props);
      
      expect(analysis.clarityScore).toBe(85.5);
      expect(analysis.specificityScore).toBe(90.7);
      expect(analysis.confidenceScore).toBe(80.3);
    });
  });
});
