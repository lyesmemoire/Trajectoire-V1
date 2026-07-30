import { describe, it, expect, beforeEach } from "vitest";
import { ContradictionCatalog, getContradictionType, getAllContradictionTypes, getContradictionTypesByCategory, getContradictionTypesBySeverity, getContradictionTypesByPolicy } from "../../apps/web/src/domain/cognitive/catalogs/ContradictionCatalog";
import { BlockingContradictionPolicy, RecoverableContradictionPolicy, BenefitOfDoubtPolicy, FalsePositivePolicy } from "../../apps/web/src/lib/ai/engines/contradiction";
import { ContradictionLedger } from "../../apps/web/src/lib/ai/engines/contradiction/ContradictionLedger";
import { ContradictionEventFactory } from "../../apps/web/src/lib/ai/engines/contradiction/ContradictionEventFactory";

describe("Phase A.10 - ContradictionCatalog, Policies, Ledger, EventFactory Tests", () => {
  describe("ContradictionCatalog", () => {
    it("should have all required contradiction types", () => {
      const allTypes = getAllContradictionTypes();
      expect(allTypes.length).toBeGreaterThan(0);
      
      // Check for required categories
      const categories = new Set(allTypes.map(t => t.category));
      expect(categories.has("FACTUAL")).toBe(true);
      expect(categories.has("TEMPORAL")).toBe(true);
      expect(categories.has("TECHNICAL")).toBe(true);
      expect(categories.has("RESPONSIBILITY")).toBe(true);
      expect(categories.has("SENIORITY")).toBe(true);
      expect(categories.has("VERSION")).toBe(true);
      expect(categories.has("SCALE")).toBe(true);
      expect(categories.has("ROLE")).toBe(true);
      expect(categories.has("TIMELINE")).toBe(true);
    });

    it("should get contradiction type by id", () => {
      const type = getContradictionType("factual-number-mismatch");
      expect(type).toBeDefined();
      expect(type?.id).toBe("factual-number-mismatch");
      expect(type?.category).toBe("FACTUAL");
      expect(type?.severity).toBe("HIGH");
    });

    it("should get contradiction types by category", () => {
      const factualTypes = getContradictionTypesByCategory("FACTUAL");
      expect(factualTypes.length).toBeGreaterThan(0);
      factualTypes.forEach(t => {
        expect(t.category).toBe("FACTUAL");
      });
    });

    it("should get contradiction types by severity", () => {
      const criticalTypes = getContradictionTypesBySeverity("CRITICAL");
      expect(criticalTypes.length).toBeGreaterThan(0);
      criticalTypes.forEach(t => {
        expect(t.severity).toBe("CRITICAL");
      });
    });

    it("should get contradiction types by policy", () => {
      const blockingTypes = getContradictionTypesByPolicy("BlockingContradictionPolicy");
      expect(blockingTypes.length).toBeGreaterThan(0);
      blockingTypes.forEach(t => {
        expect(t.policy).toBe("BlockingContradictionPolicy");
      });
    });

    it("should have ruleId and ruleVersion for each type", () => {
      const allTypes = getAllContradictionTypes();
      allTypes.forEach(t => {
        expect(t.ruleId).toBeDefined();
        expect(t.ruleId).toMatch(/^CONTRADICTION-\d+$/);
        expect(t.ruleVersion).toBeDefined();
        expect(t.ruleVersion).toMatch(/^\d+\.\d+\.\d+$/);
      });
    });
  });

  describe("BlockingContradictionPolicy", () => {
    it("should block critical and high severity contradictions", () => {
      const policy = new BlockingContradictionPolicy();
      
      const criticalResult = policy.evaluate({
        observationA: { id: "obs-1" },
        observationB: { id: "obs-2" },
        contradictionType: "factual-entity-mismatch",
        severity: "CRITICAL",
        metadata: {}
      });
      
      expect(criticalResult.passed).toBe(false);
      expect(criticalResult.score).toBe(0.0);
      expect(criticalResult.resolution).toBeDefined();
    });

    it("should not block medium or low severity contradictions", () => {
      const policy = new BlockingContradictionPolicy();
      
      const mediumResult = policy.evaluate({
        observationA: { id: "obs-1" },
        observationB: { id: "obs-2" },
        contradictionType: "temporal-overlap",
        severity: "MEDIUM",
        metadata: {}
      });
      
      expect(mediumResult.passed).toBe(true);
      expect(mediumResult.score).toBe(1.0);
    });

    it("should have ruleId and ruleVersion", () => {
      const policy = new BlockingContradictionPolicy();
      expect(policy.ruleId).toBe("CONTRADICTION-POLICY-001");
      expect(policy.ruleVersion).toBe("1.0.0");
    });
  });

  describe("RecoverableContradictionPolicy", () => {
    it("should identify recoverable contradictions", () => {
      const policy = new RecoverableContradictionPolicy();
      
      const result = policy.evaluate({
        observationA: { id: "obs-1" },
        observationB: { id: "obs-2" },
        contradictionType: "temporal-overlap",
        severity: "MEDIUM",
        metadata: {}
      });
      
      expect(result.passed).toBe(true);
      expect(result.score).toBe(0.5);
      expect(result.resolution).toBeDefined();
    });

    it("should have ruleId and ruleVersion", () => {
      const policy = new RecoverableContradictionPolicy();
      expect(policy.ruleId).toBe("CONTRADICTION-POLICY-002");
      expect(policy.ruleVersion).toBe("1.0.0");
    });
  });

  describe("BenefitOfDoubtPolicy", () => {
    it("should grant benefit of doubt for low severity", () => {
      const policy = new BenefitOfDoubtPolicy();
      
      const result = policy.evaluate({
        observationA: { id: "obs-1" },
        observationB: { id: "obs-2" },
        contradictionType: "seniority-scope-mismatch",
        severity: "LOW",
        metadata: {}
      });
      
      expect(result.passed).toBe(true);
      expect(result.score).toBe(0.7);
    });

    it("should have ruleId and ruleVersion", () => {
      const policy = new BenefitOfDoubtPolicy();
      expect(policy.ruleId).toBe("CONTRADICTION-POLICY-003");
      expect(policy.ruleVersion).toBe("1.0.0");
    });
  });

  describe("FalsePositivePolicy", () => {
    it("should identify likely false positives", () => {
      const policy = new FalsePositivePolicy();
      
      const result = policy.evaluate({
        observationA: { id: "obs-1", data: { content: "I think I used Java 17" } },
        observationB: { id: "obs-2", data: { content: "Maybe I used Java 11" } },
        contradictionType: "version-mismatch",
        severity: "LOW",
        metadata: {}
      });
      
      expect(result.passed).toBe(true);
      expect(result.score).toBe(0.8);
    });

    it("should have ruleId and ruleVersion", () => {
      const policy = new FalsePositivePolicy();
      expect(policy.ruleId).toBe("CONTRADICTION-POLICY-004");
      expect(policy.ruleVersion).toBe("1.0.0");
    });
  });

  describe("ContradictionLedger", () => {
    let ledger: ContradictionLedger;

    beforeEach(() => {
      ledger = new ContradictionLedger();
    });

    it("should record and retrieve entries", () => {
      const entry = {
        id: "contradiction-1",
        observationAId: "obs-1",
        observationBId: "obs-2",
        assessment: {
          hasContradiction: true,
          contradictionType: "factual-number-mismatch",
          severity: "HIGH",
          confidence: 0.9,
          reason: "Numbers differ significantly",
          isBlocking: true,
          isRecoverable: false,
          isFalsePositive: false,
        },
        ruleId: "CONTRADICTION-001",
        ruleVersion: "1.0.0",
        policy: "BlockingContradictionPolicy",
        timestamp: new Date(),
        engineVersion: "1.0.0",
        traceId: "trace-1",
        correlationId: "corr-1",
        sessionId: "session-1",
      };

      ledger.record(entry);
      
      const retrieved = ledger.get("contradiction-1");
      expect(retrieved).toBeDefined();
      expect(retrieved?.observationAId).toBe("obs-1");
      expect(retrieved?.observationBId).toBe("obs-2");
    });

    it("should get contradictions by observation id", () => {
      const entry = {
        id: "contradiction-1",
        observationAId: "obs-1",
        observationBId: "obs-2",
        assessment: {
          hasContradiction: true,
          contradictionType: "factual-number-mismatch",
          severity: "HIGH",
          confidence: 0.9,
          reason: "Numbers differ",
          isBlocking: true,
          isRecoverable: false,
          isFalsePositive: false,
        },
        ruleId: "CONTRADICTION-001",
        ruleVersion: "1.0.0",
        policy: "BlockingContradictionPolicy",
        timestamp: new Date(),
        engineVersion: "1.0.0",
        traceId: "trace-1",
        correlationId: "corr-1",
        sessionId: "session-1",
      };

      ledger.record(entry);
      
      const contradictions = ledger.getByObservationId("obs-1");
      expect(contradictions.length).toBe(1);
      expect(contradictions[0].id).toBe("contradiction-1");
    });

    it("should get statistics", () => {
      const stats = ledger.getStatistics();
      expect(stats).toBeDefined();
      expect(stats.totalEntries).toBe(0);
      expect(stats.blocking).toBe(0);
      expect(stats.recoverable).toBe(0);
      expect(stats.falsePositives).toBe(0);
    });

    it("should mark contradiction as resolved", () => {
      const entry = {
        id: "contradiction-1",
        observationAId: "obs-1",
        observationBId: "obs-2",
        assessment: {
          hasContradiction: true,
          contradictionType: "factual-number-mismatch",
          severity: "HIGH",
          confidence: 0.9,
          reason: "Numbers differ",
          isBlocking: true,
          isRecoverable: false,
          isFalsePositive: false,
        },
        ruleId: "CONTRADICTION-001",
        ruleVersion: "1.0.0",
        policy: "BlockingContradictionPolicy",
        timestamp: new Date(),
        engineVersion: "1.0.0",
        traceId: "trace-1",
        correlationId: "corr-1",
        sessionId: "session-1",
      };

      ledger.record(entry);
      ledger.markAsResolved("contradiction-1", "clarification");
      
      const retrieved = ledger.get("contradiction-1");
      expect(retrieved?.resolvedAt).toBeDefined();
      expect(retrieved?.resolutionMethod).toBe("clarification");
    });
  });

  describe("ContradictionEventFactory", () => {
    it("should create ContradictionDetected event", () => {
      const assessment = {
        hasContradiction: true,
        contradictionType: "factual-number-mismatch",
        severity: "HIGH",
        confidence: 0.9,
        reason: "Numbers differ",
        isBlocking: true,
        isRecoverable: false,
        isFalsePositive: false,
      };

      const event = ContradictionEventFactory.createContradictionDetected(
        "session-1",
        "obs-1",
        "obs-2",
        assessment,
        "CONTRADICTION-001",
        "1.0.0",
        "1.0.0"
      );

      expect(event).toBeDefined();
      expect(event.eventType).toBe("CONTRADICTION_DETECTED");
      expect(event.payload.observationAId).toBe("obs-1");
      expect(event.payload.observationBId).toBe("obs-2");
      expect(event.payload.ruleId).toBe("CONTRADICTION-001");
      expect(event.payload.ruleVersion).toBe("1.0.0");
    });

    it("should create BlockingContradictionDetected event", () => {
      const assessment = {
        hasContradiction: true,
        contradictionType: "factual-entity-mismatch",
        severity: "CRITICAL",
        confidence: 0.95,
        reason: "Different entities",
        resolution: "Requires clarification",
        isBlocking: true,
        isRecoverable: false,
        isFalsePositive: false,
      };

      const event = ContradictionEventFactory.createBlockingContradictionDetected(
        "session-1",
        "obs-1",
        "obs-2",
        assessment,
        "CONTRADICTION-002",
        "1.0.0",
        "1.0.0"
      );

      expect(event).toBeDefined();
      expect(event.eventType).toBe("BLOCKING_CONTRADICTION_DETECTED");
      expect(event.payload.resolution).toBe("Requires clarification");
    });

    it("should create all events from assessment", () => {
      const assessment = {
        hasContradiction: true,
        contradictionType: "factual-number-mismatch",
        severity: "HIGH",
        confidence: 0.9,
        reason: "Numbers differ",
        isBlocking: true,
        isRecoverable: false,
        isFalsePositive: false,
      };

      const events = ContradictionEventFactory.createEventsFromAssessment(
        "session-1",
        "obs-1",
        "obs-2",
        assessment,
        "CONTRADICTION-001",
        "1.0.0",
        "1.0.0"
      );

      expect(events.length).toBe(2); // Base event + blocking event
      expect(events[0].eventType).toBe("CONTRADICTION_DETECTED");
      expect(events[1].eventType).toBe("BLOCKING_CONTRADICTION_DETECTED");
    });

    it("should create ContradictionResolved event", () => {
      const event = ContradictionEventFactory.createContradictionResolved(
        "session-1",
        "contradiction-1",
        "clarification",
        "1.0.0"
      );

      expect(event).toBeDefined();
      expect(event.eventType).toBe("CONTRADICTION_RESOLVED");
      expect(event.payload.resolutionMethod).toBe("clarification");
    });
  });
});
