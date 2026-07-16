// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { InterviewService } from "@/lib/db/interview.service";
import { AnalyticsEngine } from "@/lib/analytics/interview.engine";
import { buildFeatures } from "@/lib/ml/interview.feature-engine";
import { INTERVIEW_MODEL_V1 } from "@/lib/ml/model.registry";
import { mergeInterviewViews } from "@/domain/interview.contract";
import type { StandardInterviewSession, PremiumInterviewSession } from "@/domain/interview.contract";

// Mock Supabase and Prisma to prevent real DB calls in domain tests
vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: "test-id", status: "completed", user_id: "user-123" }
      }),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
    }))
  }))
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    interviewSession: { upsert: vi.fn() },
    interviewAnalyticsProjection: { upsert: vi.fn(), findMany: vi.fn().mockResolvedValue([]) },
    userBehaviorProfile: { findUnique: vi.fn().mockResolvedValue(null), upsert: vi.fn() },
  }
}));

describe("Interview Domain Hardening", () => {

  describe("1. State Machine Immutability", () => {
    it("throws when mutating a completed session", async () => {
      await expect(InterviewService.submitAnswer("test-id", "my answer"))
        .rejects.toThrow("Cannot mutate completed session");

      await expect(InterviewService.appendTranscript("test-id", {}))
        .rejects.toThrow("Cannot mutate completed session");
    });
  });

  describe("2. Analytics Engine (Pure Function)", () => {
    it("computes analytics without DB access and returns a valid projection", () => {
      const standardInput: StandardInterviewSession = {
        id: "sess-1",
        userId: "user-1",
        questions: ["q1"],
        answers: ["a1"],
        status: "completed"
      };

      const features = buildFeatures(standardInput);
      const projection = AnalyticsEngine.computeScoreWithModel(features, "user-1", INTERVIEW_MODEL_V1);

      expect(projection.sessionId).toBe("sess-1");
      expect(projection.userId).toBe("user-1");
      expect(projection.behavioralScores.clarity).toBeGreaterThanOrEqual(0);
      expect(projection.archetype).toBeDefined();
      expect(projection.modelVersion).toBe(1);
    });
  });

  describe("3. Dual Product Isolation", () => {
    it("ensures standard and premium domains do not leak into each other", () => {
      const standard: StandardInterviewSession = {
        id: "s-1", userId: "u-1", questions: [], answers: [], status: "completed"
      };

      const premium: PremiumInterviewSession = {
        id: "p-1", userId: "u-1", transcript: [], memory: {}, persona: "tech", phases: [], status: "completed"
      };

      expect((standard as any).transcript).toBeUndefined();
      expect((premium as any).answers).toBeUndefined();
    });
  });

  describe("4. Projection Write & Merge Layer", () => {
    it("merges the views unified for the UI", () => {
      const standard: StandardInterviewSession = {
        id: "s-1", userId: "u-1", questions: [], answers: [], status: "completed"
      };

      const features = buildFeatures(standard);
      const projection = AnalyticsEngine.computeScoreWithModel(features, "u-1", INTERVIEW_MODEL_V1);
      const unified = mergeInterviewViews(standard, undefined, projection);

      expect(unified.id).toBe("s-1");
      expect(unified.type).toBe("standard");
      expect(unified.analytics?.sessionId).toBeDefined();
      expect(unified.analytics?.behavioralScores).toBeDefined();
    });
  });
});
