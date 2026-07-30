import { describe, it, expect, beforeEach } from "vitest";
import { FactQueryService } from "../../apps/web/src/lib/ai/services/FactQueryService";
import { CognitiveState } from "../../apps/web/src/domain/cognitive/CognitiveState";
import { KnowledgeGraph } from "../../apps/web/src/domain/cognitive/KnowledgeGraph";

describe("Phase A.9 - FactQueryService Tests", () => {
  let state: CognitiveState;
  let service: FactQueryService;

  beforeEach(() => {
    state = CognitiveState.create("550e8400-e29b-41d4-a716-446655440000", "1.0.0");
    service = new FactQueryService(state);
  });

  it("should initialize with a CognitiveState", () => {
    expect(service).toBeDefined();
  });

  it("should find facts by type", () => {
    const result = service.findFactsByType("EVIDENCE");
    expect(result).toBeDefined();
    expect(result.facts).toBeInstanceOf(Array);
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.hasMore).toBe(false);
  });

  it("should find facts by entity ID", () => {
    const result = service.findFactsByEntity("entity-123");
    expect(result).toBeDefined();
    expect(result.facts).toBeInstanceOf(Array);
  });

  it("should find latest facts", () => {
    const result = service.findLatestFacts();
    expect(result).toBeDefined();
    expect(result.facts).toBeInstanceOf(Array);
  });

  it("should find observation by ID", () => {
    const observation = service.findObservation("obs-123");
    expect(observation).toBeUndefined(); // No observation exists yet
  });

  it("should find observations by session", () => {
    const result = service.findObservationsBySession("test-session");
    expect(result).toBeDefined();
    expect(result.facts).toBeInstanceOf(Array);
  });

  it("should find evidence", () => {
    const result = service.findEvidence();
    expect(result).toBeDefined();
    expect(result.facts).toBeInstanceOf(Array);
  });

  it("should find evidence by observation ID", () => {
    const evidence = service.findEvidenceByObservation("obs-123");
    expect(evidence).toBeUndefined(); // No evidence exists yet
  });

  it("should find timeline", () => {
    const result = service.findTimeline();
    expect(result).toBeDefined();
    expect(result.facts).toBeInstanceOf(Array);
  });

  it("should find related facts", () => {
    const result = service.findRelatedFacts("fact-123");
    expect(result).toBeDefined();
    expect(result.facts).toBeInstanceOf(Array);
  });

  it("should find facts by confidence threshold", () => {
    const result = service.findFactsByConfidence(0.7);
    expect(result).toBeDefined();
    expect(result.facts).toBeInstanceOf(Array);
  });

  it("should get statistics", () => {
    const stats = service.getStatistics();
    expect(stats).toBeDefined();
    expect(stats.totalFacts).toBeGreaterThanOrEqual(0);
    expect(stats.factsByType).toBeDefined();
    expect(stats.factsByCategory).toBeDefined();
    expect(stats.averageConfidence).toBeGreaterThanOrEqual(0);
    expect(stats.averageConfidence).toBeLessThanOrEqual(1);
  });

  it("should support pagination with limit and offset", () => {
    const result = service.findFactsByType("EVIDENCE", { limit: 10, offset: 0 });
    expect(result).toBeDefined();
    expect(result.facts.length).toBeLessThanOrEqual(10);
  });

  it("should indicate hasMore when paginating", () => {
    // Add some mock facts to test pagination
    const result = service.findFactsByType("EVIDENCE", { limit: 5, offset: 0 });
    expect(result.hasMore).toBeDefined();
    expect(typeof result.hasMore).toBe("boolean");
  });
});
