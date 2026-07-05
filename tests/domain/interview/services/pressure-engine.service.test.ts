import { describe, it, expect } from "vitest";
import { PressureEngine, PressureDecision } from "../../../../lib/interview/domain/services/pressure-engine.service";
import { PressureLevel } from "../../../../lib/interview/domain/value-objects/pressure-level.vo";
import { AnswerAnalysis } from "../../../../lib/interview/domain/value-objects/answer-analysis.vo";
import { InterviewAnswer } from "../../../../lib/interview/domain/value-objects/interview-answer.vo";

describe("PressureEngine", () => {
  let engine: PressureEngine;

  beforeEach(() => {
    engine = new PressureEngine();
  });

  describe("compute", () => {
    it("should trigger recovery when confidence is low", () => {
      const analysis = AnswerAnalysis.create({
        clarityScore: 70,
        specificityScore: 70,
        confidenceScore: 30,
        feedback: "Low confidence",
        detectedWeaknesses: []
      });
      const answer = InterviewAnswer.create({
        content: "I don't know",
        submittedAt: new Date()
      });
      const currentPressure = PressureLevel.create(50);

      const decision = engine.compute("QUESTIONING", currentPressure, analysis, answer);

      expect(decision.triggerRecovery).toBe(true);
      expect(decision.newPressure.value).toBe(30); // 50 - 20
      expect(decision.suggestedStrategy).toBe("supportive");
    });

    it("should trigger recovery when hesitations are high", () => {
      const analysis = AnswerAnalysis.create({
        clarityScore: 70,
        specificityScore: 70,
        confidenceScore: 80,
        feedback: "Good",
        detectedWeaknesses: []
      });
      const answer = InterviewAnswer.create({
        content: "Um... uh...",
        submittedAt: new Date(),
        metrics: { consecutiveHesitations: 3 }
      });
      const currentPressure = PressureLevel.create(50);

      const decision = engine.compute("QUESTIONING", currentPressure, analysis, answer);

      expect(decision.triggerRecovery).toBe(true);
      expect(decision.newPressure.value).toBe(30);
      expect(decision.suggestedStrategy).toBe("supportive");
    });

    it("should increase pressure when confidence is high", () => {
      const analysis = AnswerAnalysis.create({
        clarityScore: 80,
        specificityScore: 80,
        confidenceScore: 80,
        feedback: "Good",
        detectedWeaknesses: []
      });
      const answer = InterviewAnswer.create({
        content: "I have 5 years experience",
        submittedAt: new Date()
      });
      const currentPressure = PressureLevel.create(50);

      const decision = engine.compute("QUESTIONING", currentPressure, analysis, answer);

      expect(decision.triggerRecovery).toBe(false);
      expect(decision.newPressure.value).toBe(60); // 50 + 10
      expect(decision.suggestedStrategy).toBe("challenging");
    });

    it("should maintain pressure with clarification strategy when conditions are neutral", () => {
      const analysis = AnswerAnalysis.create({
        clarityScore: 70,
        specificityScore: 70,
        confidenceScore: 55,
        feedback: "Average",
        detectedWeaknesses: []
      });
      const answer = InterviewAnswer.create({
        content: "Maybe I can explain",
        submittedAt: new Date()
      });
      const currentPressure = PressureLevel.create(50);

      const decision = engine.compute("QUESTIONING", currentPressure, analysis, answer);

      expect(decision.triggerRecovery).toBe(false);
      expect(decision.newPressure.value).toBe(50);
      expect(decision.suggestedStrategy).toBe("clarification");
    });

    it("should not trigger recovery in RECOVERY state", () => {
      const analysis = AnswerAnalysis.create({
        clarityScore: 70,
        specificityScore: 70,
        confidenceScore: 30,
        feedback: "Low",
        detectedWeaknesses: []
      });
      const answer = InterviewAnswer.create({
        content: "I don't know",
        submittedAt: new Date()
      });
      const currentPressure = PressureLevel.create(30);

      const decision = engine.compute("RECOVERY", currentPressure, analysis, answer);

      expect(decision.triggerRecovery).toBe(false);
      expect(decision.suggestedStrategy).toBe("clarification");
    });

    it("should not trigger recovery in INTRODUCTION state", () => {
      const analysis = AnswerAnalysis.create({
        clarityScore: 70,
        specificityScore: 70,
        confidenceScore: 30,
        feedback: "Low",
        detectedWeaknesses: []
      });
      const answer = InterviewAnswer.create({
        content: "Hello",
        submittedAt: new Date()
      });
      const currentPressure = PressureLevel.create(20);

      const decision = engine.compute("INTRODUCTION", currentPressure, analysis, answer);

      expect(decision.triggerRecovery).toBe(false);
      expect(decision.suggestedStrategy).toBe("clarification");
    });

    it("should not increase pressure in COMPLETED state", () => {
      const analysis = AnswerAnalysis.create({
        clarityScore: 80,
        specificityScore: 80,
        confidenceScore: 80,
        feedback: "Good",
        detectedWeaknesses: []
      });
      const answer = InterviewAnswer.create({
        content: "Thank you",
        submittedAt: new Date()
      });
      const currentPressure = PressureLevel.create(50);

      const decision = engine.compute("COMPLETED", currentPressure, analysis, answer);

      expect(decision.triggerRecovery).toBe(false);
      expect(decision.newPressure.value).toBe(50);
      expect(decision.suggestedStrategy).toBe("clarification");
    });

    it("should cap pressure at 100 when increasing", () => {
      const analysis = AnswerAnalysis.create({
        clarityScore: 80,
        specificityScore: 80,
        confidenceScore: 80,
        feedback: "Good",
        detectedWeaknesses: []
      });
      const answer = InterviewAnswer.create({
        content: "I'm confident",
        submittedAt: new Date()
      });
      const currentPressure = PressureLevel.create(95);

      const decision = engine.compute("QUESTIONING", currentPressure, analysis, answer);

      expect(decision.newPressure.value).toBe(100);
      expect(decision.suggestedStrategy).toBe("challenging");
    });

    it("should floor pressure at 0 when decreasing", () => {
      const analysis = AnswerAnalysis.create({
        clarityScore: 70,
        specificityScore: 70,
        confidenceScore: 30,
        feedback: "Low",
        detectedWeaknesses: []
      });
      const answer = InterviewAnswer.create({
        content: "I don't know",
        submittedAt: new Date()
      });
      const currentPressure = PressureLevel.create(15);

      const decision = engine.compute("QUESTIONING", currentPressure, analysis, answer);

      expect(decision.newPressure.value).toBe(0);
      expect(decision.suggestedStrategy).toBe("supportive");
    });

    it("should handle missing metrics gracefully", () => {
      const analysis = AnswerAnalysis.create({
        clarityScore: 80,
        specificityScore: 80,
        confidenceScore: 80,
        feedback: "Good",
        detectedWeaknesses: []
      });
      const answer = InterviewAnswer.create({
        content: "I'm confident",
        submittedAt: new Date()
        // No metrics
      });
      const currentPressure = PressureLevel.create(50);

      const decision = engine.compute("QUESTIONING", currentPressure, analysis, answer);

      expect(decision.triggerRecovery).toBe(false);
      expect(decision.newPressure.value).toBe(60);
    });
  });
});
