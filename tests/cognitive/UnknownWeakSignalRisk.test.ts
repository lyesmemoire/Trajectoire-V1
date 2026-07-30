import { describe, it, expect } from "vitest";
import {
  isUnknownResolved,
  computeInvestigationPriority,
  UnknownSchema,
} from "../../apps/web/src/domain/cognitive/Unknown";
import { computeWeakSignalPenalty, WeakSignalSchema } from "../../apps/web/src/domain/cognitive/WeakSignal";
import { computeGlobalRiskLevel, RiskSchema } from "../../apps/web/src/domain/cognitive/Risk";

describe("Unknown", () => {
  const now = new Date();
  const makeUnknown = (overrides: Partial<Record<string, unknown>> = {}) =>
    UnknownSchema.parse({
      id: crypto.randomUUID(),
      competency: "leadership",
      priority: "HIGH",
      impact: 0.8,
      remainingQuestions: 3,
      difficulty: 0.5,
      reason: "Not yet explored",
      createdAt: now,
      resolvedAt: null,
      ...overrides,
    });

  it("is not resolved when confidence is low", () => {
    const u = makeUnknown();
    expect(isUnknownResolved(u, 0.3)).toBe(false);
  });

  it("is resolved when confidence is >= 0.6", () => {
    const u = makeUnknown();
    expect(isUnknownResolved(u, 0.6)).toBe(true);
  });

  it("is resolved when resolvedAt is set", () => {
    const u = makeUnknown({ resolvedAt: now });
    expect(isUnknownResolved(u, 0.1)).toBe(true);
  });

  it("computes investigation priority (CRITICAL > HIGH > MEDIUM > LOW)", () => {
    const critical = makeUnknown({ priority: "CRITICAL", impact: 0.9, difficulty: 0.3 });
    const high = makeUnknown({ priority: "HIGH", impact: 0.9, difficulty: 0.3 });
    const medium = makeUnknown({ priority: "MEDIUM", impact: 0.9, difficulty: 0.3 });
    const low = makeUnknown({ priority: "LOW", impact: 0.9, difficulty: 0.3 });

    expect(computeInvestigationPriority(critical)).toBeGreaterThan(
      computeInvestigationPriority(high)
    );
    expect(computeInvestigationPriority(high)).toBeGreaterThan(
      computeInvestigationPriority(medium)
    );
    expect(computeInvestigationPriority(medium)).toBeGreaterThan(
      computeInvestigationPriority(low)
    );
  });
});

describe("WeakSignal", () => {
  it("computes penalty based on severity", () => {
    const now = new Date();
    const base = {
      id: crypto.randomUUID(),
      sessionId: crypto.randomUUID(),
      type: "VAGUE_RESPONSE" as const,
      reason: "No specifics",
      sourceMessageIndex: 3,
      linkedCompetencies: [],
      suggestedInvestigation: "Ask for example",
      resolved: false,
      timestamp: now,
    };

    expect(computeWeakSignalPenalty(WeakSignalSchema.parse({ ...base, severity: "LOW" }))).toBe(0.02);
    expect(computeWeakSignalPenalty(WeakSignalSchema.parse({ ...base, severity: "MEDIUM" }))).toBe(0.05);
    expect(computeWeakSignalPenalty(WeakSignalSchema.parse({ ...base, severity: "HIGH" }))).toBe(0.10);
    expect(computeWeakSignalPenalty(WeakSignalSchema.parse({ ...base, severity: "CRITICAL" }))).toBe(0.20);
  });
});

describe("Risk", () => {
  const now = new Date();
  const makeRisk = (level: string, mitigated = false) =>
    RiskSchema.parse({
      id: crypto.randomUUID(),
      sessionId: crypto.randomUUID(),
      type: "OVERESTIMATION",
      level,
      description: "Test risk",
      linkedCompetencies: [],
      mitigationStrategy: null,
      mitigated,
      createdAt: now,
    });

  it("returns LOW when no active risks", () => {
    expect(computeGlobalRiskLevel([])).toBe("LOW");
  });

  it("returns LOW when all risks are mitigated", () => {
    expect(computeGlobalRiskLevel([makeRisk("HIGH", true)])).toBe("LOW");
  });

  it("returns CRITICAL when any single risk is CRITICAL", () => {
    expect(computeGlobalRiskLevel([makeRisk("CRITICAL")])).toBe("CRITICAL");
  });

  it("returns CRITICAL when two HIGH risks exist", () => {
    expect(computeGlobalRiskLevel([makeRisk("HIGH"), makeRisk("HIGH")])).toBe("CRITICAL");
  });

  it("returns HIGH when one HIGH risk exists", () => {
    expect(computeGlobalRiskLevel([makeRisk("HIGH")])).toBe("HIGH");
  });

  it("returns MEDIUM when only MEDIUM risks exist", () => {
    expect(computeGlobalRiskLevel([makeRisk("MEDIUM")])).toBe("MEDIUM");
  });
});
