import { describe, it, expect } from "vitest";
import { EvidenceSchema } from "../../apps/web/src/domain/cognitive/Evidence";
import { DecisionSchema } from "../../apps/web/src/domain/cognitive/Decision";
import { StrategySchema } from "../../apps/web/src/domain/cognitive/Strategy";
import { InterviewGoalSchema } from "../../apps/web/src/domain/cognitive/InterviewGoal";
import { KnowledgeNodeSchema } from "../../apps/web/src/domain/cognitive/Node";
import { KnowledgeEdgeSchema } from "../../apps/web/src/domain/cognitive/Edge";
import { HypothesisSchema } from "../../apps/web/src/domain/cognitive/Hypothesis";
import { WeakSignalSchema } from "../../apps/web/src/domain/cognitive/WeakSignal";
import { UnknownSchema } from "../../apps/web/src/domain/cognitive/Unknown";
import { RiskSchema } from "../../apps/web/src/domain/cognitive/Risk";

/**
 * These tests validate that every Zod schema enforces its constraints.
 * If a schema accepts invalid data, the cognitive model is compromised.
 */
describe("Zod Schema Validation", () => {
  const now = new Date();
  const uuid = () => crypto.randomUUID();

  describe("KnowledgeNodeSchema", () => {
    it("accepts valid data", () => {
      const result = KnowledgeNodeSchema.safeParse({
        id: uuid(), type: "COMPETENCY", label: "Test",
        attributes: {}, confidence: 0.5, sources: [],
        status: "ACTIVE", createdAt: now, updatedAt: now,
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid type", () => {
      const result = KnowledgeNodeSchema.safeParse({
        id: uuid(), type: "INVALID_TYPE", label: "Test",
        attributes: {}, confidence: 0.5, sources: [],
        status: "ACTIVE", createdAt: now, updatedAt: now,
      });
      expect(result.success).toBe(false);
    });

    it("rejects confidence > 1", () => {
      const result = KnowledgeNodeSchema.safeParse({
        id: uuid(), type: "COMPETENCY", label: "Test",
        attributes: {}, confidence: 1.5, sources: [],
        status: "ACTIVE", createdAt: now, updatedAt: now,
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty label", () => {
      const result = KnowledgeNodeSchema.safeParse({
        id: uuid(), type: "COMPETENCY", label: "",
        attributes: {}, confidence: 0.5, sources: [],
        status: "ACTIVE", createdAt: now, updatedAt: now,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("KnowledgeEdgeSchema", () => {
    it("rejects invalid relation", () => {
      const result = KnowledgeEdgeSchema.safeParse({
        id: uuid(), source: uuid(), target: uuid(),
        relation: "INVALID", weight: 0.5, confidence: 0.5,
        metadata: {}, createdAt: now,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("EvidenceSchema", () => {
    it("rejects evidence with no linked competencies", () => {
      const result = EvidenceSchema.safeParse({
        id: uuid(), sessionId: uuid(), sourceMessageIndex: 0,
        quotedText: "I built it", fact: "Built system",
        strength: "STRONG", specificity: 0.8, credibility: 0.9,
        technicalDepth: 0.7, behavioralDepth: 0.5,
        confidence: 0.8, linkedCompetencies: [],
        linkedNodeIds: [], timestamp: now,
      });
      expect(result.success).toBe(false);
    });

    it("accepts valid evidence", () => {
      const result = EvidenceSchema.safeParse({
        id: uuid(), sessionId: uuid(), sourceMessageIndex: 3,
        quotedText: "I migrated 180 services", fact: "Migration at scale",
        strength: "DECISIVE", specificity: 0.95, credibility: 0.9,
        technicalDepth: 0.85, behavioralDepth: 0.6,
        confidence: 0.9, linkedCompetencies: ["system_design"],
        linkedNodeIds: [], timestamp: now,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("HypothesisSchema", () => {
    it("rejects empty statement", () => {
      const result = HypothesisSchema.safeParse({
        id: uuid(), statement: "", confidence: 0.5,
        status: "PENDING", supportingEvidence: [],
        contradictingEvidence: [], requiredEvidence: [],
        verificationPlan: [], creationReason: "Initial",
        linkedCompetencies: [], createdAt: now, updatedAt: now,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("WeakSignalSchema", () => {
    it("rejects invalid type", () => {
      const result = WeakSignalSchema.safeParse({
        id: uuid(), sessionId: uuid(), type: "NOT_A_TYPE",
        severity: "HIGH", reason: "test",
        sourceMessageIndex: 0, linkedCompetencies: [],
        suggestedInvestigation: "investigate",
        resolved: false, timestamp: now,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("UnknownSchema", () => {
    it("rejects invalid priority", () => {
      const result = UnknownSchema.safeParse({
        id: uuid(), competency: "test", priority: "INVALID",
        impact: 0.5, remainingQuestions: 3, difficulty: 0.5,
        reason: "test", createdAt: now, resolvedAt: null,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("RiskSchema", () => {
    it("rejects invalid risk type", () => {
      const result = RiskSchema.safeParse({
        id: uuid(), sessionId: uuid(), type: "INVALID",
        level: "HIGH", description: "test",
        linkedCompetencies: [], mitigationStrategy: null,
        mitigated: false, createdAt: now,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("DecisionSchema", () => {
    it("accepts a valid decision", () => {
      const result = DecisionSchema.safeParse({
        id: uuid(), sessionId: uuid(), sequence: 0,
        type: "CHALLENGE", reason: "Low confidence",
        targetCompetency: "leadership",
        expectedEvidence: ["ownership example"],
        expectedOutcome: "Confidence increase",
        confidenceBefore: 0.3, confidenceAfter: null,
        outcome: "PENDING", createdAt: now, resolvedAt: null,
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid decision type", () => {
      const result = DecisionSchema.safeParse({
        id: uuid(), sessionId: uuid(), sequence: 0,
        type: "INVALID_TYPE", reason: "test",
        expectedOutcome: "test", confidenceBefore: 0.5,
        createdAt: now,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("StrategySchema", () => {
    it("accepts a valid strategy", () => {
      const result = StrategySchema.safeParse({
        primaryGoal: "Validate ownership",
        secondaryGoal: "Check consistency",
        currentInvestigation: "Production incident",
        priorityCompetency: "ownership",
        questionDepth: "DEEP",
        challengeLevel: "HIGH",
        interviewTempo: "NORMAL",
        expectedEvidence: ["decision making"],
        successCriteria: "Confidence > 0.8",
        failureCriteria: "Contradiction found",
        confidenceDeltaExpected: 0.14,
        riskAssessment: "Candidate may be overconfident",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("InterviewGoalSchema", () => {
    it("accepts a valid goal", () => {
      const result = InterviewGoalSchema.safeParse({
        id: uuid(), horizon: "IMMEDIATE",
        description: "Validate React expertise",
        targetCompetency: "frontend",
        expectedEvidence: ["hooks", "state management"],
        successCriteria: "Confidence >= 0.7",
        failureCriteria: "No concrete example",
        priority: 0.9, active: true,
        createdAt: now, completedAt: null,
      });
      expect(result.success).toBe(true);
    });
  });
});
