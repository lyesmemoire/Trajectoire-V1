/**
 * PromptBuilder Unit Tests
 *
 * Tests for infrastructure prompt builder.
 * NO network calls, NO external dependencies.
 * ONLY unit tests with mocks.
 */
// @ts-nocheck


import { describe, it, expect } from "vitest";
import { PromptBuilder, PromptContext } from "../ai/PromptBuilder";

describe("PromptBuilder", () => {
  let promptBuilder: PromptBuilder;

  beforeEach(() => {
    promptBuilder = new PromptBuilder();
  });

  describe("buildQuestionGenerationPrompt", () => {
    it("should build a complete prompt with all sections", () => {
      const context: PromptContext = {
        candidateProfile: "Senior developer with 5 years experience",
        jobOfferProfile: "Full stack developer position",
        matchingProfile: "Strong match in React and Node.js",
        objective: "Technical interview for senior role",
        constraints: "60 minutes, 10 questions max",
        customRequirements: ["Include system design", "Focus on scalability"],
      };

      const prompt = promptBuilder.buildQuestionGenerationPrompt(context);

      expect(prompt).toContain("You are an expert interview question generator");
      expect(prompt).toContain("## Candidate Profile");
      expect(prompt).toContain(context.candidateProfile);
      expect(prompt).toContain("## Job Offer Profile");
      expect(prompt).toContain(context.jobOfferProfile);
      expect(prompt).toContain("## Matching Analysis");
      expect(prompt).toContain(context.matchingProfile);
      expect(prompt).toContain("## Interview Objective");
      expect(prompt).toContain(context.objective);
      expect(prompt).toContain("## Interview Constraints");
      expect(prompt).toContain(context.constraints);
      expect(prompt).toContain("## Custom Requirements");
      expect(prompt).toContain("Include system design");
      expect(prompt).toContain("## Output Format");
      expect(prompt).toContain("questions");
    });

    it("should build prompt without custom requirements when not provided", () => {
      const context: PromptContext = {
        candidateProfile: "Junior developer",
        jobOfferProfile: "Frontend developer",
        matchingProfile: "Good match in JavaScript",
        objective: "Screening interview",
        constraints: "30 minutes, 5 questions max",
      };

      const prompt = promptBuilder.buildQuestionGenerationPrompt(context);

      expect(prompt).toContain("You are an expert interview question generator");
      expect(prompt).not.toContain("## Custom Requirements");
    });

    it("should include JSON output format specification", () => {
      const context: PromptContext = {
        candidateProfile: "Developer",
        jobOfferProfile: "Developer",
        matchingProfile: "Match",
        objective: "Interview",
        constraints: "60 minutes",
      };

      const prompt = promptBuilder.buildQuestionGenerationPrompt(context);

      expect(prompt).toContain('"questions"');
      expect(prompt).toContain('"id"');
      expect(prompt).toContain('"text"');
      expect(prompt).toContain('"type"');
      expect(prompt).toContain('"difficulty"');
      expect(prompt).toContain('"competency"');
    });
  });

  describe("buildEvaluationCriteriaPrompt", () => {
    it("should build evaluation criteria prompt for a question", () => {
      const questionText = "Explain the difference between REST and GraphQL";

      const prompt = promptBuilder.buildEvaluationCriteriaPrompt(questionText);

      expect(prompt).toContain("You are an expert interview question generator");
      expect(prompt).toContain("## Task");
      expect(prompt).toContain("Generate evaluation criteria");
      expect(prompt).toContain("## Question");
      expect(prompt).toContain(questionText);
      expect(prompt).toContain("## Output Format");
      expect(prompt).toContain("JSON array");
    });
  });

  describe("buildExpectedAnswerPrompt", () => {
    it("should build expected answer prompt for a question", () => {
      const questionText = "Describe your approach to debugging a complex issue";

      const prompt = promptBuilder.buildExpectedAnswerPrompt(questionText);

      expect(prompt).toContain("You are an expert interview question generator");
      expect(prompt).toContain("## Task");
      expect(prompt).toContain("Generate expected answer structure");
      expect(prompt).toContain("## Question");
      expect(prompt).toContain(questionText);
      expect(prompt).toContain("## Output Format");
      expect(prompt).toContain("JSON array");
    });
  });
});
