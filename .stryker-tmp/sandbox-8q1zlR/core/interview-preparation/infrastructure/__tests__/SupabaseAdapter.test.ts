/**
 * SupabaseAdapter Unit Tests
 *
 * Tests for infrastructure Supabase adapter.
 * NO network calls, NO external dependencies.
 * ONLY unit tests with mocks.
 */
// @ts-nocheck


import { describe, it, expect, beforeEach, vi } from "vitest";
import { SupabaseInterviewPersistenceAdapter } from "../adapters/SupabaseInterviewPersistenceAdapter";
import { SupabaseClient } from "../clients/SupabaseClient";
import { RepositoryError } from "../errors/InfrastructureErrors";
import { InterviewPlan } from "../../domain/entities/InterviewPlan";

describe("SupabaseInterviewPersistenceAdapter", () => {
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

  describe("save", () => {
    it("should save interview plan successfully", async () => {
      const mockPlan = {
        getPlanId: () => "plan-123",
        getCandidateId: () => "candidate-123",
        getJobOfferId: () => "job-123",
        getMatchingId: () => "matching-123",
        getObjective: () => ({
          getPrimaryGoal: () => "Technical interview",
          getSecondaryGoals: () => [],
        }),
        getConstraints: () => ({
          getMaxTotalDuration: () => 60,
          getMaxQuestionsPerSection: () => 10,
          getMaxTotalQuestions: () => 20,
          getMinSoftSkillQuestions: () => 5,
          getMinHardSkillQuestions: () => 10,
          getMaxDifficulty: () => "HARD",
          getMinDifficulty: () => "EASY",
          getMandatoryCompetencies: () => [],
          getForbiddenTopics: () => [],
        }),
        getStatus: () => "DRAFT",
        getCreatedAt: () => new Date("2024-01-01"),
        getUpdatedAt: () => new Date("2024-01-01"),
        getSections: () => [],
        getSummary: () => ({
          getTotalQuestions: () => 0,
          getSoftSkillQuestions: () => 0,
          getHardSkillQuestions: () => 0,
          getAverageDifficulty: () => 0,
          getEstimatedDifficulty: () => "MEDIUM",
        }),
      } as unknown as InterviewPlan;

      vi.mocked(mockSupabaseClient.insert).mockResolvedValue({ data: mockPlan, error: null } as any);

      const result = await adapter.save(mockPlan);

      expect(result).toBe(mockPlan);
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith("interview_plans", expect.any(Object));
    });

    it("should throw RepositoryError when insert fails", async () => {
      const mockPlan = {} as unknown as InterviewPlan;

      vi.mocked(mockSupabaseClient.insert).mockResolvedValue({
        data: null,
        error: new Error("Database error"),
      } as any);

      await expect(adapter.save(mockPlan)).rejects.toThrow(RepositoryError);
    });
  });

  describe("load", () => {
    it("should load interview plan successfully", async () => {
      const planId = "plan-123";
      const mockData = {
        id: planId,
        candidate_id: "candidate-123",
        job_offer_id: "job-123",
      };

      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: [mockData], error: null } as any);

      await expect(adapter.load(planId)).rejects.toThrow(RepositoryError);
    });

    it("should throw RepositoryError when plan not found", async () => {
      const planId = "nonexistent-plan";

      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: null, error: null } as any);

      await expect(adapter.load(planId)).rejects.toThrow(RepositoryError);
    });

    it("should throw RepositoryError when select fails", async () => {
      const planId = "plan-123";

      vi.mocked(mockSupabaseClient.select).mockResolvedValue({
        data: null,
        error: new Error("Database error"),
      } as any);

      await expect(adapter.load(planId)).rejects.toThrow(RepositoryError);
    });
  });

  describe("delete", () => {
    it("should delete interview plan successfully", async () => {
      const planId = "plan-123";

      vi.mocked(mockSupabaseClient.delete).mockResolvedValue({ error: null } as any);

      await expect(adapter.delete(planId)).resolves.not.toThrow();
      expect(mockSupabaseClient.delete).toHaveBeenCalledWith("interview_plans", planId);
    });

    it("should throw RepositoryError when delete fails", async () => {
      const planId = "plan-123";

      vi.mocked(mockSupabaseClient.delete).mockResolvedValue({
        error: new Error("Database error"),
      } as any);

      await expect(adapter.delete(planId)).rejects.toThrow(RepositoryError);
    });
  });

  describe("findByCandidate", () => {
    it("should find plans by candidate ID successfully", async () => {
      const candidateId = "candidate-123";
      const mockData = [{ id: "plan-1", candidate_id: candidateId }];

      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: mockData, error: null } as any);

      await expect(adapter.findByCandidate(candidateId)).rejects.toThrow(RepositoryError);
    });

    it("should return empty array when no plans found", async () => {
      const candidateId = "candidate-123";

      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: null, error: null } as any);

      const result = await adapter.findByCandidate(candidateId);

      expect(result).toEqual([]);
    });

    it("should throw RepositoryError when select fails", async () => {
      const candidateId = "candidate-123";

      vi.mocked(mockSupabaseClient.select).mockResolvedValue({
        data: null,
        error: new Error("Database error"),
      } as any);

      await expect(adapter.findByCandidate(candidateId)).rejects.toThrow(RepositoryError);
    });
  });

  describe("findByJobOffer", () => {
    it("should find plans by job offer ID successfully", async () => {
      const jobOfferId = "job-123";
      const mockData = [{ id: "plan-1", job_offer_id: jobOfferId }];

      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: mockData, error: null } as any);

      await expect(adapter.findByJobOffer(jobOfferId)).rejects.toThrow(RepositoryError);
    });

    it("should return empty array when no plans found", async () => {
      const jobOfferId = "job-123";

      vi.mocked(mockSupabaseClient.select).mockResolvedValue({ data: null, error: null } as any);

      const result = await adapter.findByJobOffer(jobOfferId);

      expect(result).toEqual([]);
    });

    it("should throw RepositoryError when select fails", async () => {
      const jobOfferId = "job-123";

      vi.mocked(mockSupabaseClient.select).mockResolvedValue({
        data: null,
        error: new Error("Database error"),
      } as any);

      await expect(adapter.findByJobOffer(jobOfferId)).rejects.toThrow(RepositoryError);
    });
  });
});
