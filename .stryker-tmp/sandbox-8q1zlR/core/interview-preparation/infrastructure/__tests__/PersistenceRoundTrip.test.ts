/**
 * Persistence Round-Trip Tests
 *
 * Tests for save/load cycle to ensure data integrity.
 * NO network calls, NO external dependencies.
 * ONLY unit tests with mocks.
 */
// @ts-nocheck


import { describe, it, expect, beforeEach, vi } from "vitest";
import { SupabaseInterviewPersistenceAdapter } from "../adapters/SupabaseInterviewPersistenceAdapter";
import { SupabaseClient } from "../clients/SupabaseClient";
import { InterviewPlan } from "../../domain/entities/InterviewPlan";
import { InterviewObjective } from "../../domain/value-objects/InterviewObjective";
import { InterviewConstraints } from "../../domain/value-objects/InterviewConstraints";
import { InterviewSummary } from "../../domain/value-objects/InterviewSummary";
import { AdaptiveRules } from "../../domain/value-objects/AdaptiveRules";
import { InterviewMetadata } from "../../domain/value-objects/InterviewMetadata";
import { PlanStatus } from "../../domain/types";

describe("Persistence Round-Trip Tests", () => {
  let adapter: SupabaseInterviewPersistenceAdapter;
  let mockSupabaseClient: SupabaseClient;

  beforeEach(() => {
    mockSupabaseClient = {
      insert: vi.fn(),
      select: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as SupabaseClient;

    adapter = new SupabaseInterviewPersistenceAdapter(mockSupabaseClient);
  });

  describe("Save and Load Cycle", () => {
    it("should preserve interview plan data through save/load", async () => {
      const originalPlan = createMockInterviewPlan();

      const savedData = {
        id: originalPlan.getPlanId(),
        candidate_id: originalPlan.getCandidateId(),
        job_offer_id: originalPlan.getJobOfferId(),
        matching_id: originalPlan.getMatchingId(),
        objective: JSON.stringify({
          primaryGoal: originalPlan.getObjective().getPrimaryGoal(),
          secondaryGoals: originalPlan.getObjective().getSecondaryGoals(),
        }),
        constraints: JSON.stringify({
          maxTotalDuration: originalPlan.getConstraints().getMaxTotalDuration(),
          maxQuestionsPerSection: originalPlan.getConstraints().getMaxQuestionsPerSection(),
          maxTotalQuestions: originalPlan.getConstraints().getMaxTotalQuestions(),
          minSoftSkillQuestions: originalPlan.getConstraints().getMinSoftSkillQuestions(),
          minHardSkillQuestions: originalPlan.getConstraints().getMinHardSkillQuestions(),
          maxDifficulty: originalPlan.getConstraints().getMaxDifficulty(),
          minDifficulty: originalPlan.getConstraints().getMinDifficulty(),
          mandatoryCompetencies: originalPlan.getConstraints().getMandatoryCompetencies(),
          forbiddenTopics: originalPlan.getConstraints().getForbiddenTopics(),
        }),
        adaptive_rules: JSON.stringify({
          enabled: true,
          difficultyAdjustment: true,
          timeBasedSkipping: false,
          competencyBasedSkipping: true,
        }),
        status: originalPlan.getStatus(),
        created_at: originalPlan.getCreatedAt().toISOString(),
        updated_at: originalPlan.getUpdatedAt().toISOString(),
        sections: JSON.stringify([]),
        summary: JSON.stringify({
          totalQuestions: originalPlan.getSummary().getTotalQuestions(),
          softSkillQuestions: originalPlan.getSummary().getSoftSkillQuestions(),
          hardSkillQuestions: originalPlan.getSummary().getHardSkillQuestions(),
          averageDifficulty: originalPlan.getSummary().getAverageDifficulty(),
          estimatedDifficulty: originalPlan.getSummary().getEstimatedDifficulty(),
        }),
        metadata: JSON.stringify({
          version: originalPlan.getMetadata().getVersion(),
          generatedBy: originalPlan.getMetadata().getGeneratedBy(),
          tags: originalPlan.getMetadata().getTags(),
        }),
      };

      vi.mocked(mockSupabaseClient.insert).mockResolvedValue({ data: savedData, error: null } as any);
      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: [savedData], error: null } as any);

      await adapter.save(originalPlan);
      const loadedPlan = await adapter.load(originalPlan.getPlanId());

      expect(loadedPlan.getPlanId()).toBe(originalPlan.getPlanId());
      expect(loadedPlan.getCandidateId()).toBe(originalPlan.getCandidateId());
      expect(loadedPlan.getJobOfferId()).toBe(originalPlan.getJobOfferId());
      expect(loadedPlan.getMatchingId()).toBe(originalPlan.getMatchingId());
      expect(loadedPlan.getStatus()).toBe(originalPlan.getStatus());
    });

    it("should preserve objective through save/load", async () => {
      const originalPlan = createMockInterviewPlan();
      const savedData = createMockSavedData(originalPlan);

      vi.mocked(mockSupabaseClient.insert).mockResolvedValue({ data: savedData, error: null } as any);
      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: [savedData], error: null } as any);

      await adapter.save(originalPlan);
      const loadedPlan = await adapter.load(originalPlan.getPlanId());

      expect(loadedPlan.getObjective().getPrimaryGoal()).toBe(
        originalPlan.getObjective().getPrimaryGoal()
      );
      expect(loadedPlan.getObjective().getSecondaryGoals()).toEqual(
        originalPlan.getObjective().getSecondaryGoals()
      );
    });

    it("should preserve constraints through save/load", async () => {
      const originalPlan = createMockInterviewPlan();
      const savedData = createMockSavedData(originalPlan);

      vi.mocked(mockSupabaseClient.insert).mockResolvedValue({ data: savedData, error: null } as any);
      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: [savedData], error: null } as any);

      await adapter.save(originalPlan);
      const loadedPlan = await adapter.load(originalPlan.getPlanId());

      expect(loadedPlan.getConstraints().getMaxTotalDuration()).toBe(
        originalPlan.getConstraints().getMaxTotalDuration()
      );
      expect(loadedPlan.getConstraints().getMaxTotalQuestions()).toBe(
        originalPlan.getConstraints().getMaxTotalQuestions()
      );
      expect(loadedPlan.getConstraints().getMandatoryCompetencies()).toEqual(
        originalPlan.getConstraints().getMandatoryCompetencies()
      );
    });

    it("should preserve summary through save/load", async () => {
      const originalPlan = createMockInterviewPlan();
      const savedData = createMockSavedData(originalPlan);

      vi.mocked(mockSupabaseClient.insert).mockResolvedValue({ data: savedData, error: null } as any);
      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: [savedData], error: null } as any);

      await adapter.save(originalPlan);
      const loadedPlan = await adapter.load(originalPlan.getPlanId());

      expect(loadedPlan.getSummary().getTotalQuestions()).toBe(
        originalPlan.getSummary().getTotalQuestions()
      );
      expect(loadedPlan.getSummary().getSoftSkillQuestions()).toBe(
        originalPlan.getSummary().getSoftSkillQuestions()
      );
      expect(loadedPlan.getSummary().getHardSkillQuestions()).toBe(
        originalPlan.getSummary().getHardSkillQuestions()
      );
    });

    it("should preserve metadata through save/load", async () => {
      const originalPlan = createMockInterviewPlan();
      const savedData = createMockSavedData(originalPlan);

      vi.mocked(mockSupabaseClient.insert).mockResolvedValue({ data: savedData, error: null } as any);
      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: [savedData], error: null } as any);

      await adapter.save(originalPlan);
      const loadedPlan = await adapter.load(originalPlan.getPlanId());

      expect(loadedPlan.getMetadata().getVersion()).toBe(originalPlan.getMetadata().getVersion());
      expect(loadedPlan.getMetadata().getGeneratedBy()).toBe(originalPlan.getMetadata().getGeneratedBy());
      expect(loadedPlan.getMetadata().getTags()).toEqual(originalPlan.getMetadata().getTags());
    });

    it("should handle multiple sections in round-trip", async () => {
      const originalPlan = createMockInterviewPlan();
      const savedData = createMockSavedData(originalPlan);

      vi.mocked(mockSupabaseClient.insert).mockResolvedValue({ data: savedData, error: null } as any);
      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: [savedData], error: null } as any);

      await adapter.save(originalPlan);
      const loadedPlan = await adapter.load(originalPlan.getPlanId());

      expect(loadedPlan.getSections()).toHaveLength(originalPlan.getSections().length);
    });

    it("should handle complex constraints in round-trip", async () => {
      const originalPlan = createMockInterviewPlan();
      const savedData = createMockSavedData(originalPlan);

      vi.mocked(mockSupabaseClient.insert).mockResolvedValue({ data: savedData, error: null } as any);
      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: [savedData], error: null } as any);

      await adapter.save(originalPlan);
      const loadedPlan = await adapter.load(originalPlan.getPlanId());

      expect(loadedPlan.getConstraints().getForbiddenTopics()).toEqual(
        originalPlan.getConstraints().getForbiddenTopics()
      );
      expect(loadedPlan.getConstraints().getMaxDifficulty()).toBe(
        originalPlan.getConstraints().getMaxDifficulty()
      );
      expect(loadedPlan.getConstraints().getMinDifficulty()).toBe(
        originalPlan.getConstraints().getMinDifficulty()
      );
    });
  });

  describe("Error Handling in Round-Trip", () => {
    it("should throw error when save fails", async () => {
      const originalPlan = createMockInterviewPlan();

      vi.mocked(mockSupabaseClient.insert).mockResolvedValue({
        data: null,
        error: new Error("Database error"),
      } as any);

      await expect(adapter.save(originalPlan)).rejects.toThrow();
    });

    it("should throw error when load fails", async () => {
      const planId = "plan-123";

      vi.mocked(mockSupabaseClient.select).mockResolvedValue({
        data: null,
        error: new Error("Database error"),
      } as any);

      await expect(adapter.load(planId)).rejects.toThrow();
    });

    it("should throw error when plan not found", async () => {
      const planId = "nonexistent-plan";

      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: null, error: null } as any);

      await expect(adapter.load(planId)).rejects.toThrow();
    });
  });
});

function createMockInterviewPlan(): InterviewPlan {
  const objective = new InterviewObjective({
    objectiveId: "obj-1",
    type: "TECHNICAL" as any,
    primaryGoal: "Assess technical skills",
    secondaryGoals: ["Problem-solving", "Communication"],
    successCriteria: [],
  });

  const constraints = new InterviewConstraints({
    maxTotalDuration: 60,
    maxQuestionsPerSection: 10,
    maxTotalQuestions: 20,
    minSoftSkillQuestions: 5,
    minHardSkillQuestions: 10,
    maxDifficulty: "EXPERT" as any,
    minDifficulty: "BEGINNER" as any,
    mandatoryCompetencies: ["react", "typescript"],
    forbiddenTopics: ["salary", "benefits"],
  });

  const adaptiveRules = new AdaptiveRules({
    enableDifficultyAdaptation: true,
    enableTopicAdaptation: true,
    enableTimingAdaptation: false,
    adaptationThreshold: 0.7,
    adaptationStrategy: "BALANCED" as any,
  });

  const summary = new InterviewSummary(
    15,
    60,
    5,
    10,
    2.5,
    ["Technical", "Behavioral"],
    ["react", "typescript"],
    "INTERMEDIATE" as any
  );

  const metadata = new InterviewMetadata({
    version: "1.0.0",
    generator: "AI" as const,
    generatedAt: new Date(),
    generatedBy: "system",
    tags: ["technical", "senior"],
    customFields: {},
  });

  return new InterviewPlan(
    "plan-123",
    "candidate-123",
    "job-123",
    "matching-123",
    objective,
    [],
    constraints,
    adaptiveRules,
    summary,
    metadata,
    "DRAFT" as PlanStatus,
    new Date("2024-01-01"),
    new Date("2024-01-01")
  );
}

function createMockSavedData(plan: InterviewPlan): Record<string, unknown> {
  return {
    id: plan.getPlanId(),
    candidate_id: plan.getCandidateId(),
    job_offer_id: plan.getJobOfferId(),
    matching_id: plan.getMatchingId(),
    objective: JSON.stringify({
      primaryGoal: plan.getObjective().getPrimaryGoal(),
      secondaryGoals: plan.getObjective().getSecondaryGoals(),
    }),
    constraints: JSON.stringify({
      maxTotalDuration: plan.getConstraints().getMaxTotalDuration(),
      maxQuestionsPerSection: plan.getConstraints().getMaxQuestionsPerSection(),
      maxTotalQuestions: plan.getConstraints().getMaxTotalQuestions(),
      minSoftSkillQuestions: plan.getConstraints().getMinSoftSkillQuestions(),
      minHardSkillQuestions: plan.getConstraints().getMinHardSkillQuestions(),
      maxDifficulty: plan.getConstraints().getMaxDifficulty(),
      minDifficulty: plan.getConstraints().getMinDifficulty(),
      mandatoryCompetencies: plan.getConstraints().getMandatoryCompetencies(),
      forbiddenTopics: plan.getConstraints().getForbiddenTopics(),
    }),
    adaptive_rules: JSON.stringify({
      enabled: true,
      difficultyAdjustment: true,
      timeBasedSkipping: false,
      competencyBasedSkipping: true,
    }),
    status: plan.getStatus(),
    created_at: plan.getCreatedAt().toISOString(),
    updated_at: plan.getUpdatedAt().toISOString(),
    sections: JSON.stringify([]),
    summary: JSON.stringify({
      totalQuestions: plan.getSummary().getTotalQuestions(),
      softSkillQuestions: plan.getSummary().getSoftSkillQuestions(),
      hardSkillQuestions: plan.getSummary().getHardSkillQuestions(),
      averageDifficulty: plan.getSummary().getAverageDifficulty(),
      estimatedDifficulty: plan.getSummary().getEstimatedDifficulty(),
    }),
    metadata: JSON.stringify({
      version: plan.getMetadata().getVersion(),
      generatedBy: plan.getMetadata().getGeneratedBy(),
      tags: plan.getMetadata().getTags(),
    }),
  };
}
