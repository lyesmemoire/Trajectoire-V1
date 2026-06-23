import { describe, it, expect } from "vitest";
import { buildFeatures } from "@/lib/ml/interview.feature-engine";
import { AnalyticsEngine } from "@/lib/analytics/interview.engine";
import { INTERVIEW_MODEL_V1, INTERVIEW_MODEL_V2 } from "@/lib/ml/model.registry";
import { updateUserBehaviorProfile } from "@/lib/ml/user.behavioral-memory";
import { detectDrift } from "@/lib/ml/drift.detector";
import type { StandardInterviewSession, InterviewAnalyticsProjection } from "@/domain/interview.contract";

const STANDARD_SESSION: StandardInterviewSession = {
  id: "deterministic-session-001",
  userId: "user-42",
  questions: ["Tell me about yourself", "Why this role?"],
  answers: ["I have 5 years experience in...", "Because I believe in..."],
  status: "completed",
  score: 75,
};

describe("Phase D — ML Evolution Layer", () => {

  // ─── TEST 1: Feature Engine Determinism ───
  describe("1. Feature Engine Determinism", () => {
    it("produces identical features for the same input (no randomness)", () => {
      const featuresA = buildFeatures(STANDARD_SESSION);
      const featuresB = buildFeatures(STANDARD_SESSION);

      expect(featuresA).toEqual(featuresB);
    });

    it("produces different features for different inputs", () => {
      const altered = { ...STANDARD_SESSION, id: "different-session-999" };
      const featuresA = buildFeatures(STANDARD_SESSION);
      const featuresB = buildFeatures(altered);

      expect(featuresA).not.toEqual(featuresB);
    });
  });

  // ─── TEST 2: Model Version Consistency ───
  describe("2. Model Version Consistency", () => {
    it("produces different scores with different model versions", () => {
      const features = buildFeatures(STANDARD_SESSION);
      const scoreV1 = AnalyticsEngine.computeScoreWithModel(features, "user-42", INTERVIEW_MODEL_V1);
      const scoreV2 = AnalyticsEngine.computeScoreWithModel(features, "user-42", INTERVIEW_MODEL_V2);

      // Same features, different weights → different behavioral scores
      expect(scoreV1.behavioralScores).not.toEqual(scoreV2.behavioralScores);
      expect(scoreV1.modelVersion).toBe(1);
      expect(scoreV2.modelVersion).toBe(2);
    });

    it("preserves model version in output projection", () => {
      const features = buildFeatures(STANDARD_SESSION);
      const projection = AnalyticsEngine.computeScoreWithModel(features, "user-42", INTERVIEW_MODEL_V1);

      expect(projection.modelVersion).toBe(INTERVIEW_MODEL_V1.version);
    });
  });

  // ─── TEST 3: Drift Detection ───
  describe("3. Drift Detection", () => {
    it("flags anomaly when confidence drifts > 0.5", () => {
      const current: InterviewAnalyticsProjection = {
        sessionId: "s-new",
        userId: "u-1",
        behavioralScores: { clarity: 0.9, confidence: 0.95, ownership: 0.8, specificity: 0.7, authenticity: 0.8 },
        archetype: "leader",
        pressureCurve: [10, 20],
        progressionIndex: 1.2,
        modelVersion: 1,
      };

      const history: InterviewAnalyticsProjection[] = [
        {
          sessionId: "s-old-1",
          userId: "u-1",
          behavioralScores: { clarity: 0.3, confidence: 0.2, ownership: 0.3, specificity: 0.3, authenticity: 0.4 },
          archetype: "builder",
          pressureCurve: [5, 10],
          progressionIndex: 0.5,
          modelVersion: 1,
        },
      ];

      const result = detectDrift(current, history);
      expect(result.anomaly).toBe(true);
      expect(result.driftScore).toBeGreaterThan(0.5);
    });

    it("does not flag anomaly for stable sessions", () => {
      const current: InterviewAnalyticsProjection = {
        sessionId: "s-3",
        userId: "u-1",
        behavioralScores: { clarity: 0.7, confidence: 0.72, ownership: 0.7, specificity: 0.7, authenticity: 0.7 },
        archetype: "builder",
        pressureCurve: [10],
        progressionIndex: 1.0,
        modelVersion: 1,
      };

      const history: InterviewAnalyticsProjection[] = [
        {
          sessionId: "s-2",
          userId: "u-1",
          behavioralScores: { clarity: 0.7, confidence: 0.7, ownership: 0.7, specificity: 0.7, authenticity: 0.7 },
          archetype: "builder",
          pressureCurve: [10],
          progressionIndex: 1.0,
          modelVersion: 1,
        },
      ];

      const result = detectDrift(current, history);
      expect(result.anomaly).toBe(false);
    });

    it("returns no anomaly when there is no history", () => {
      const current: InterviewAnalyticsProjection = {
        sessionId: "s-first",
        userId: "u-1",
        behavioralScores: { clarity: 0.7, confidence: 0.7, ownership: 0.7, specificity: 0.7, authenticity: 0.7 },
        archetype: "builder",
        pressureCurve: [10],
        progressionIndex: 1.0,
        modelVersion: 1,
      };

      const result = detectDrift(current, []);
      expect(result.anomaly).toBe(false);
      expect(result.driftScore).toBe(0);
    });
  });

  // ─── TEST 4: User Behavioral Memory ───
  describe("4. User Behavioral Memory", () => {
    it("creates a new profile from scratch when no previous exists", () => {
      const projection: InterviewAnalyticsProjection = {
        sessionId: "s-1",
        userId: "u-1",
        behavioralScores: { clarity: 0.8, confidence: 0.7, ownership: 0.6, specificity: 0.5, authenticity: 0.9 },
        archetype: "builder",
        pressureCurve: [10, 20],
        progressionIndex: 1.0,
        modelVersion: 1,
      };

      const profile = updateUserBehaviorProfile(null, projection);

      expect(profile.userId).toBe("u-1");
      expect(profile.trends.confidenceTrend).toEqual([0.7]);
      expect(profile.trends.clarityTrend).toEqual([0.8]);
      expect(profile.archetypeEvolution).toEqual(["builder"]);
      expect(profile.stabilityScore).toBe(1.0);
    });

    it("appends trends and recalculates stability on update", () => {
      const previous = {
        userId: "u-1",
        trends: {
          confidenceTrend: [0.5, 0.6],
          clarityTrend: [0.4, 0.5],
          improvementRate: 0,
        },
        archetypeEvolution: ["builder"],
        stabilityScore: 0.9,
      };

      const projection: InterviewAnalyticsProjection = {
        sessionId: "s-2",
        userId: "u-1",
        behavioralScores: { clarity: 0.7, confidence: 0.7, ownership: 0.6, specificity: 0.5, authenticity: 0.9 },
        archetype: "specialist",
        pressureCurve: [10, 20],
        progressionIndex: 1.0,
        modelVersion: 1,
      };

      const updated = updateUserBehaviorProfile(previous, projection);

      expect(updated.trends.confidenceTrend).toEqual([0.5, 0.6, 0.7]);
      expect(updated.trends.clarityTrend).toEqual([0.4, 0.5, 0.7]);
      expect(updated.archetypeEvolution).toEqual(["builder", "specialist"]);
      expect(updated.stabilityScore).toBeGreaterThan(0);
      expect(updated.stabilityScore).toBeLessThanOrEqual(1);
    });

    it("caps trend arrays at 10 elements", () => {
      const longTrend = Array.from({ length: 10 }, (_, i) => 0.5 + i * 0.01);
      const previous = {
        userId: "u-1",
        trends: {
          confidenceTrend: longTrend,
          clarityTrend: longTrend,
          improvementRate: 0,
        },
        archetypeEvolution: ["a", "b", "c", "d", "e"],
        stabilityScore: 0.9,
      };

      const projection: InterviewAnalyticsProjection = {
        sessionId: "s-11",
        userId: "u-1",
        behavioralScores: { clarity: 0.99, confidence: 0.99, ownership: 0.8, specificity: 0.8, authenticity: 0.8 },
        archetype: "leader",
        pressureCurve: [],
        progressionIndex: 1.5,
        modelVersion: 1,
      };

      const updated = updateUserBehaviorProfile(previous, projection);

      expect(updated.trends.confidenceTrend.length).toBeLessThanOrEqual(10);
      expect(updated.trends.clarityTrend.length).toBeLessThanOrEqual(10);
      expect(updated.archetypeEvolution.length).toBeLessThanOrEqual(5);
    });
  });
});
