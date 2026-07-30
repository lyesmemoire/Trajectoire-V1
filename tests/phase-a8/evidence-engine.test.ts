import { describe, it, expect, beforeEach } from "vitest";
import { EvidenceEngine, EvidenceManifest } from "../../apps/web/src/lib/ai/engines/EvidenceEngine";
import { EvidenceDimensionCatalog, getDimension } from "../../apps/web/src/domain/cognitive/catalogs/EvidenceDimensionCatalog";
import { EvidenceLedger } from "../../apps/web/src/lib/ai/engines/evidence/EvidenceLedger";
import { EvidenceLinker } from "../../apps/web/src/lib/ai/engines/evidence/EvidenceLinker";
import { EvidencePolicyRegistry } from "../../apps/web/src/lib/ai/engines/evidence/policies/EvidencePolicyRegistry";
import { EngineInput } from "../../apps/web/src/lib/ai/contracts/Engine";

describe("Phase A.8 - EvidenceEngine Tests", () => {
  let engine: EvidenceEngine;
  let policyRegistry: EvidencePolicyRegistry;

  beforeEach(() => {
    policyRegistry = new EvidencePolicyRegistry();
    engine = new EvidenceEngine(policyRegistry);
  });

  it("should have correct manifest", () => {
    expect(EvidenceManifest.id).toBe("evidence");
    expect(EvidenceManifest.version).toBe("1.0.0");
    expect(EvidenceManifest.consumes).toEqual(["ObservationFacts", "EntityFacts"]);
    expect(EvidenceManifest.produces).toEqual(["EvidenceAssessments"]);
    expect(EvidenceManifest.facts).toContain("Evidence");
    expect(EvidenceManifest.events).toContain("EvidenceDetected");
    expect(EvidenceManifest.events).toContain("EvidenceStrengthCalculated");
    expect(EvidenceManifest.events).toContain("MissingEvidenceDetected");
    expect(EvidenceManifest.events).toContain("EvidenceLinked");
  });

  it("Cas 1: 'J'ai migré 180 microservices.' → Evidence forte", async () => {
    const input: EngineInput<
      { sessionId: string; traceId: string; correlationId: string },
      { observationFacts: any[]; entityFacts: any[] }
    > = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "J'ai migré 180 microservices sur Kubernetes.",
              category: "metric",
            },
          },
        ],
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);

    // Should emit EVIDENCE_DETECTED event
    const evidenceDetected = result.events.find((e: any) => e.eventType === "EVIDENCE_DETECTED");
    expect(evidenceDetected).toBeDefined();
    expect(evidenceDetected.payload.evidenceType).toBe("strong");

    // Should emit EVIDENCE_STRENGTH_CALCULATED event
    const evidenceStrength = result.events.find((e: any) => e.eventType === "EVIDENCE_STRENGTH_CALCULATED");
    expect(evidenceStrength).toBeDefined();
    expect(evidenceStrength.payload.strength).toBe("strong");
    expect(evidenceStrength.payload.score).toBeGreaterThan(0.25);

    // Should NOT emit MISSING_EVIDENCE_DETECTED event
    const missingEvidence = result.events.find((e: any) => e.eventType === "MISSING_EVIDENCE_DETECTED");
    expect(missingEvidence).toBeUndefined();
  });

  it("Cas 2: 'Je suis très bon en Kubernetes.' → Aucune preuve (claim)", async () => {
    const input: EngineInput<
      { sessionId: string; traceId: string; correlationId: string },
      { observationFacts: any[]; entityFacts: any[] }
    > = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "Je suis très bon en Kubernetes.",
              category: "claim",
            },
          },
        ],
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);

    // Should emit MISSING_EVIDENCE_DETECTED event (claim without quantification)
    const missingEvidence = result.events.find((e: any) => e.eventType === "MISSING_EVIDENCE_DETECTED");
    expect(missingEvidence).toBeDefined();
    expect(missingEvidence.payload.evidenceType).toBe("claim-only");

    // Should NOT emit EVIDENCE_DETECTED event
    const evidenceDetected = result.events.find((e: any) => e.eventType === "EVIDENCE_DETECTED");
    expect(evidenceDetected).toBeUndefined();
  });

  it("Cas 3: 'On a perdu la production pendant 6 heures.' → FailureEvidence", async () => {
    const input: EngineInput<
      { sessionId: string; traceId: string; correlationId: string },
      { observationFacts: any[]; entityFacts: any[] }
    > = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "On a perdu la production pendant 6 heures.",
              category: "failure",
            },
          },
        ],
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);

    // Should emit EVIDENCE_DETECTED event
    const evidenceDetected = result.events.find((e: any) => e.eventType === "EVIDENCE_DETECTED");
    expect(evidenceDetected).toBeDefined();
    expect(evidenceDetected.payload.evidenceType).toBe("strong");
  });

  it("Cas 4: 'Je pense être senior.' → Aucune preuve (claim)", async () => {
    const input: EngineInput<
      { sessionId: string; traceId: string; correlationId: string },
      { observationFacts: any[]; entityFacts: any[] }
    > = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "Je pense être senior.",
              category: "claim",
            },
          },
        ],
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);

    // Should emit MISSING_EVIDENCE_DETECTED event (claim without quantification)
    const missingEvidence = result.events.find((e: any) => e.eventType === "MISSING_EVIDENCE_DETECTED");
    expect(missingEvidence).toBeDefined();
    expect(missingEvidence.payload.evidenceType).toBe("claim-only");

    // Should NOT emit EVIDENCE_DETECTED event
    const evidenceDetected = result.events.find((e: any) => e.eventType === "EVIDENCE_DETECTED");
    expect(evidenceDetected).toBeUndefined();
  });

  it("Cas 5: Deux observations '180 services' + '120 services' → PotentialConflictReference", async () => {
    const input: EngineInput<
      { sessionId: string; traceId: string; correlationId: string },
      { observationFacts: any[]; entityFacts: any[] }
    > = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            content: "J'ai géré 180 services.",
            data: {
              content: "J'ai géré 180 services.",
              category: "metric",
            },
          },
          {
            id: "obs-2",
            type: "OBSERVATION",
            content: "J'ai géré 120 services.",
            data: {
              content: "J'ai géré 120 services.",
              category: "metric",
            },
          },
        ],
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);

    // Should emit EVIDENCE_LINKED event with potential conflict
    const evidenceLinked = result.events.find((e: any) => e.eventType === "EVIDENCE_LINKED");
    expect(evidenceLinked).toBeDefined();
    expect(evidenceLinked.payload.linkType).toBe("contradicts");
    expect(evidenceLinked.payload.reason).toContain("Different quantities");
  });

  it("should record evidence in ledger", async () => {
    const input: EngineInput<
      { sessionId: string; traceId: string; correlationId: string },
      { observationFacts: any[]; entityFacts: any[] }
    > = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "J'ai migré 180 microservices.",
              category: "metric",
            },
          },
        ],
        entityFacts: [],
      },
    };

    await engine.execute(input);

    const ledger = engine.getLedger();
    const entries = ledger.getBySession("test-session");
    expect(entries.length).toBe(1);
    expect(entries[0].assessment.hasEvidence).toBe(true);
  });

  it("should apply all policies", async () => {
    const input: EngineInput<
      { sessionId: string; traceId: string; correlationId: string },
      { observationFacts: any[]; entityFacts: any[] }
    > = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        observationFacts: [
          {
            id: "obs-1",
            type: "OBSERVATION",
            data: {
              content: "J'ai migré 180 microservices.",
              category: "metric",
            },
          },
        ],
        entityFacts: [],
      },
    };

    await engine.execute(input);

    const ledger = engine.getLedger();
    const entries = ledger.getBySession("test-session");
    expect(entries[0].policiesApplied).toContain("minimum-evidence");
    expect(entries[0].policiesApplied).toContain("evidence-quality");
    expect(entries[0].policiesApplied).toContain("corroboration");
    expect(entries[0].policiesApplied).toContain("weak-evidence");
  });
});

describe("EvidenceDimensionCatalog Tests", () => {
  it("should have all required dimensions", () => {
    const dimensions = EvidenceDimensionCatalog;
    expect(dimensions.has("specificity")).toBe(true);
    expect(dimensions.has("ownership")).toBe(true);
    expect(dimensions.has("production")).toBe(true);
    expect(dimensions.has("quantification")).toBe(true);
    expect(dimensions.has("failure")).toBe(true);
    expect(dimensions.has("recency")).toBe(true);
    expect(dimensions.has("corroboration")).toBe(true);
    expect(dimensions.has("verifiability")).toBe(true);
  });

  it("should get dimension by id", () => {
    const specificity = getDimension("specificity");
    expect(specificity).toBeDefined();
    expect(specificity?.name).toBe("Specificity");
    expect(specificity?.weight).toBe(0.25);
  });
});

describe("EvidenceLinker Tests", () => {
  it("should determine link type deterministically", () => {
    const candidate = {
      sourceObservationId: "obs-1",
      targetObservationId: "obs-2",
      confidence: 0.9,
      reason: "Supports the claim",
    };

    const link = EvidenceLinker.determineLink(candidate);
    expect(link.linkType).toBe("supports");
    expect(link.confidence).toBe(0.9);
  });

  it("should create potential conflict reference", () => {
    const link = EvidenceLinker.createPotentialConflictReference(
      "obs-1",
      "obs-2",
      "Different quantities"
    );

    expect(link.linkType).toBe("contradicts");
    expect(link.confidence).toBe(0.5);
    expect(link.reason).toContain("Potential conflict");
  });

  it("should filter links by type", () => {
    const links = [
      EvidenceLinker.determineLink({
        sourceObservationId: "obs-1",
        targetObservationId: "obs-2",
        confidence: 0.9,
        reason: "Supports",
      }),
      EvidenceLinker.determineLink({
        sourceObservationId: "obs-1",
        targetObservationId: "obs-3",
        confidence: 0.2,
        reason: "Contradicts",
      }),
    ];

    const supports = EvidenceLinker.filterLinksByType(links, "supports");
    expect(supports.length).toBe(1);
  });
});

describe("EvidenceLedger Tests", () => {
  it("should record and retrieve entries", () => {
    const ledger = new EvidenceLedger();
    const entry = {
      id: "entry-1",
      originObservationId: "obs-1",
      assessment: {
        hasEvidence: true,
        evidenceType: "strong",
        overallScore: 0.8,
        confidence: 0.9,
        reason: "Strong evidence",
        missingDimensions: [],
      },
      dimensions: new Map([["specificity", 0.8]]),
      policiesApplied: ["minimum-evidence"],
      timestamp: new Date(),
      engineVersion: "1.0.0",
      traceId: "trace-1",
      correlationId: "corr-1",
      sessionId: "session-1",
    };

    ledger.record(entry);
    const retrieved = ledger.get("entry-1");
    expect(retrieved).toBeDefined();
    expect(retrieved?.assessment.hasEvidence).toBe(true);
  });

  it("should get statistics", () => {
    const ledger = new EvidenceLedger();
    
    ledger.record({
      id: "entry-1",
      originObservationId: "obs-1",
      assessment: {
        hasEvidence: true,
        evidenceType: "strong",
        overallScore: 0.8,
        confidence: 0.9,
        reason: "Strong evidence",
        missingDimensions: [],
      },
      dimensions: new Map([["specificity", 0.8]]),
      policiesApplied: ["minimum-evidence"],
      timestamp: new Date(),
      engineVersion: "1.0.0",
      traceId: "trace-1",
      correlationId: "corr-1",
      sessionId: "session-1",
    });

    const stats = ledger.getStatistics();
    expect(stats.totalEntries).toBe(1);
    expect(stats.withEvidence).toBe(1);
    expect(stats.strongEvidence).toBe(1);
  });
});
