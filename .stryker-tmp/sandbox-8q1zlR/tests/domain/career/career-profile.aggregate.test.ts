// @ts-nocheck
import { describe, it, expect } from "vitest";
import { CareerProfileAggregate } from "../../../lib/career/domain/aggregates/career-profile.aggregate";
import { CareerScore } from "../../../lib/career/domain/value-objects/career-score.vo";
import { EmployabilityScore } from "../../../lib/career/domain/value-objects/employability-score.vo";
import {
  CareerProfileUpdated,
  CareerArchetypeUnlocked,
  PredictionSnapshotCreated,
  CareerInsightsGenerated
} from "../../../lib/career/domain/events/career-events";

describe("CareerProfileAggregate", () => {
  describe("creation", () => {
    it("should create a new profile with zero scores", () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      
      expect(profile.id).toBe("profile-1");
      expect(profile.userId).toBe("user-1");
      expect(profile.employabilityScore.value).toBe(0);
      expect(profile.communicationScore.value).toBe(0);
      expect(profile.confidenceScore.value).toBe(0);
      expect(profile.technicalScore.value).toBe(0);
      expect(profile.leadershipScore.value).toBe(0);
      expect(profile.unlockedPersonas).toHaveLength(0);
    });

    it("should load an existing profile", () => {
      const props = {
        userId: "user-1",
        employabilityScore: EmployabilityScore.create(85),
        communicationScore: CareerScore.create(75),
        confidenceScore: CareerScore.create(80),
        technicalScore: CareerScore.create(70),
        leadershipScore: CareerScore.create(65),
        unlockedPersonas: ["archetype-1"],
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      };
      
      const profile = CareerProfileAggregate.load("profile-1", props);
      
      expect(profile.id).toBe("profile-1");
      expect(profile.employabilityScore.value).toBe(85);
      expect(profile.unlockedPersonas).toHaveLength(1);
    });
  });

  describe("updateScores", () => {
    it("should update all scores and emit CareerProfileUpdated event", () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      
      profile.updateScores({
        employability: EmployabilityScore.create(85),
        communication: CareerScore.create(75),
        confidence: CareerScore.create(80),
        technical: CareerScore.create(70),
        leadership: CareerScore.create(65),
      });
      
      expect(profile.employabilityScore.value).toBe(85);
      expect(profile.communicationScore.value).toBe(75);
      expect(profile.confidenceScore.value).toBe(80);
      expect(profile.technicalScore.value).toBe(70);
      expect(profile.leadershipScore.value).toBe(65);
      
      const events = (profile as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CareerProfileUpdated);
      
      const eventPayload = (events[0] as CareerProfileUpdated).payload;
      expect(eventPayload.employabilityScore).toBe(85);
      expect(eventPayload.communicationScore).toBe(75);
    });

    it("should update updatedAt timestamp", () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      const originalUpdatedAt = profile.props.updatedAt;
      
      // Small delay to ensure timestamp changes
      const delay = new Promise(resolve => setTimeout(resolve, 10));
      
      return delay.then(() => {
        profile.updateScores({
          employability: EmployabilityScore.create(85),
          communication: CareerScore.create(75),
          confidence: CareerScore.create(80),
          technical: CareerScore.create(70),
          leadership: CareerScore.create(65),
        });
        
        expect(profile.props.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });
  });

  describe("unlockArchetype", () => {
    it("should unlock archetype and emit CareerArchetypeUnlocked event", () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      
      profile.unlockArchetype("archetype-1");
      
      expect(profile.unlockedPersonas).toHaveLength(1);
      expect(profile.unlockedPersonas[0]).toBe("archetype-1");
      
      const events = (profile as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CareerArchetypeUnlocked);
      
      const eventPayload = (events[0] as CareerArchetypeUnlocked).payload;
      expect(eventPayload.archetypeId).toBe("archetype-1");
    });

    it("should not unlock same archetype twice", () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      
      profile.unlockArchetype("archetype-1");
      
      profile.unlockArchetype("archetype-1");
      
      expect(profile.unlockedPersonas).toHaveLength(1);
      // Only one event should be emitted
      const events = (profile as any).pullEvents();
      expect(events.length).toBe(1);
    });

    it("should unlock multiple different archetypes", () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      
      profile.unlockArchetype("archetype-1");
      profile.unlockArchetype("archetype-2");
      profile.unlockArchetype("archetype-3");
      
      expect(profile.unlockedPersonas).toHaveLength(3);
      expect(profile.unlockedPersonas).toContain("archetype-1");
      expect(profile.unlockedPersonas).toContain("archetype-2");
      expect(profile.unlockedPersonas).toContain("archetype-3");
      
      // Three events should be emitted
      const events = (profile as any).pullEvents();
      expect(events.length).toBe(3);
    });
  });

  describe("attachPrediction", () => {
    it("should emit PredictionSnapshotCreated event", () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      
      profile.attachPrediction("session-123", "prediction-456");
      
      const events = (profile as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PredictionSnapshotCreated);
      
      const eventPayload = (events[0] as PredictionSnapshotCreated).payload;
      expect(eventPayload.sessionId).toBe("session-123");
      expect(eventPayload.predictionId).toBe("prediction-456");
    });

    it("should not modify profile state", () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      const originalUpdatedAt = profile.props.updatedAt;
      
      profile.attachPrediction("session-123", "prediction-456");
      
      expect(profile.props.updatedAt).toEqual(originalUpdatedAt);
      expect(profile.employabilityScore.value).toBe(0);
    });
  });

  describe("generateInsights", () => {
    it("should emit CareerInsightsGenerated event", () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      
      profile.generateInsights();
      
      const events = (profile as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CareerInsightsGenerated);
      
      const eventPayload = (events[0] as CareerInsightsGenerated).payload;
      expect(eventPayload.userId).toBe("user-1");
    });

    it("should update updatedAt timestamp", () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      const originalUpdatedAt = profile.props.updatedAt;
      
      const delay = new Promise(resolve => setTimeout(resolve, 10));
      
      return delay.then(() => {
        profile.generateInsights();
        
        expect(profile.props.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });
  });


  describe("event ordering", () => {
    it("should emit events in correct order", () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      
      profile.updateScores({
        employability: EmployabilityScore.create(85),
        communication: CareerScore.create(75),
        confidence: CareerScore.create(80),
        technical: CareerScore.create(70),
        leadership: CareerScore.create(65),
      });
      
      profile.unlockArchetype("archetype-1");
      
      profile.attachPrediction("session-123", "prediction-456");
      
      const events = (profile as any).pullEvents();
      expect(events).toHaveLength(3);
      expect(events[0]).toBeInstanceOf(CareerProfileUpdated);
      expect(events[1]).toBeInstanceOf(CareerArchetypeUnlocked);
      expect(events[2]).toBeInstanceOf(PredictionSnapshotCreated);
    });
  });
});
