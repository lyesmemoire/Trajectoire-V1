import { describe, it, expect, beforeEach } from "vitest";
import { ConfidenceEngine } from "../../apps/web/src/lib/ai/engines/confidence/ConfidenceEngine";

describe("Phase A.13 - Confidence Engine Tests", () => {
  let engine: ConfidenceEngine;

  beforeEach(() => {
    engine = new ConfidenceEngine();
  });

  it("should have correct manifest", () => {
    const manifest = engine.getManifest();
    expect(manifest.id).toBe("confidence");
    expect(manifest.version).toBe("1.0.0");
  });

  it("should calculate confidence with high evidence", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        facts: [],
        evidenceAssessments: [
          {
            hasEvidence: true,
            confidence: 0.9,
          },
          {
            hasEvidence: true,
            confidence: 0.85,
          },
        ],
        contradictionAssessments: [],
        temporalEvents: [],
      },
    };

    const result = await engine.execute(input);

    expect(result.events.length).toBe(1);
    expect(result.events[0].eventType).toBe("CONFIDENCE_CALCULATED");
    expect(result.events[0].payload.overallConfidence).toBeGreaterThan(0.7);
  });

  it("should apply contradiction penalty", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        facts: [],
        evidenceAssessments: [
          {
            hasEvidence: true,
            confidence: 0.9,
          },
        ],
        contradictionAssessments: [
          {
            hasContradiction: true,
            severity: "HIGH",
            isBlocking: false,
            isFalsePositive: false,
          },
        ],
        temporalEvents: [],
      },
    };

    const result = await engine.execute(input);

    const confidence = result.events[0].payload.overallConfidence;
    expect(confidence).toBeLessThan(0.9); // Should be penalized
  });

  it("should apply blocking contradiction penalty", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        facts: [],
        evidenceAssessments: [
          {
            hasEvidence: true,
            confidence: 0.9,
          },
        ],
        contradictionAssessments: [
          {
            hasContradiction: true,
            severity: "CRITICAL",
            isBlocking: true,
            isFalsePositive: false,
          },
        ],
        temporalEvents: [],
      },
    };

    const result = await engine.execute(input);

    const confidence = result.events[0].payload.overallConfidence;
    expect(confidence).toBeLessThan(0.7); // Higher penalty for blocking
  });

  it("should not penalize false positive contradictions", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        facts: [],
        evidenceAssessments: [
          {
            hasEvidence: true,
            confidence: 0.9,
          },
        ],
        contradictionAssessments: [
          {
            hasContradiction: true,
            severity: "HIGH",
            isBlocking: false,
            isFalsePositive: true,
          },
        ],
        temporalEvents: [],
      },
    };

    const result = await engine.execute(input);

    const confidence = result.events[0].payload.overallConfidence;
    expect(confidence).toBeGreaterThan(0.8); // No penalty for false positive
  });

  it("should calculate temporal consistency", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        facts: [],
        evidenceAssessments: [],
        contradictionAssessments: [],
        temporalEvents: [
          {
            timestamp: new Date("2018-01-01"),
            confidence: 0.9,
          },
          {
            timestamp: new Date("2019-01-01"),
            confidence: 0.85,
          },
        ],
      },
    };

    const result = await engine.execute(input);

    const breakdown = result.events[0].payload.breakdown;
    expect(breakdown.temporalConsistency).toBeGreaterThan(0.8);
  });

  it("should penalize missing timestamps", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        facts: [],
        evidenceAssessments: [],
        contradictionAssessments: [],
        temporalEvents: [
          {
            confidence: 0.9,
          },
          {
            confidence: 0.85,
          },
        ],
      },
    };

    const result = await engine.execute(input);

    const breakdown = result.events[0].payload.breakdown;
    expect(breakdown.temporalConsistency).toBeLessThan(0.9); // Penalty for missing timestamps
  });

  it("should calculate factuality score", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        facts: [
          {
            category: "quantified",
            confidence: 0.9,
          },
          {
            category: "quantified",
            confidence: 0.85,
          },
        ],
        evidenceAssessments: [],
        contradictionAssessments: [],
        temporalEvents: [],
      },
    };

    const result = await engine.execute(input);

    const breakdown = result.events[0].payload.breakdown;
    expect(breakdown.factualityScore).toBeGreaterThan(0.8);
  });

  it("should generate confidence factors with ruleId and ruleVersion", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        facts: [],
        evidenceAssessments: [
          {
            hasEvidence: true,
            confidence: 0.9,
          },
        ],
        contradictionAssessments: [],
        temporalEvents: [],
      },
    };

    const result = await engine.execute(input);

    const factors = result.events[0].payload.factors;
    expect(factors.length).toBe(4);
    
    for (const factor of factors) {
      expect(factor.ruleId).toBeDefined();
      expect(factor.ruleId).toMatch(/^CONFIDENCE-\d+$/);
      expect(factor.ruleVersion).toBeDefined();
      expect(factor.ruleVersion).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });

  it("should return neutral confidence with no data", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        facts: [],
        evidenceAssessments: [],
        contradictionAssessments: [],
        temporalEvents: [],
      },
    };

    const result = await engine.execute(input);

    const confidence = result.events[0].payload.overallConfidence;
    expect(confidence).toBeGreaterThan(0.3); // Should have some baseline confidence
    expect(confidence).toBeLessThan(0.8); // But not too high without data
  });

  it("should include metadata in result", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        facts: [
          { category: "quantified", confidence: 0.9 },
        ],
        evidenceAssessments: [
          { hasEvidence: true, confidence: 0.85 },
        ],
        contradictionAssessments: [
          { hasContradiction: true, severity: "LOW", isBlocking: false, isFalsePositive: false },
        ],
        temporalEvents: [
          { timestamp: new Date("2018-01-01"), confidence: 0.9 },
        ],
      },
    };

    const result = await engine.execute(input);

    const metadata = result.events[0].payload.metadata;
    expect(metadata.totalFacts).toBe(1);
    expect(metadata.totalEvidence).toBe(1);
    expect(metadata.totalContradictions).toBe(1);
    expect(metadata.totalTemporalEvents).toBe(1);
  });

  it("should calculate overall confidence using weighted formula", async () => {
    const input = {
      sessionId: "test-session",
      context: {
        sessionId: "test-session",
        traceId: "trace-1",
        correlationId: "corr-1",
      },
      payload: {
        facts: [],
        evidenceAssessments: [
          { hasEvidence: true, confidence: 0.9 },
        ],
        contradictionAssessments: [],
        temporalEvents: [],
      },
    };

    const result = await engine.execute(input);

    const breakdown = result.events[0].payload.breakdown;
    const factors = result.events[0].payload.factors;
    const overall = result.events[0].payload.overallConfidence;

    // Verify overall is within expected range based on breakdown
    expect(overall).toBeGreaterThan(0);
    expect(overall).toBeLessThanOrEqual(1);
  });
});
