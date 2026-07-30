import { describe, it, expect } from "vitest";
import { EntityExtractionEngine, EntityExtractionManifest } from "../../apps/web/src/lib/ai/engines/EntityExtractionEngine";
import { CanonicalEntityResolver } from "../../apps/web/src/lib/ai/engines/CanonicalEntityResolver";
import { EngineInput } from "../../apps/web/src/lib/ai/contracts/Engine";

describe("Phase A.6 - EntityExtractionEngine Tests", () => {
  it("should have correct manifest", () => {
    expect(EntityExtractionManifest.id).toBe("entity-extraction");
    expect(EntityExtractionManifest.version).toBe("1.0.0");
    expect(EntityExtractionManifest.consumes).toEqual(["NormalizedText"]);
    expect(EntityExtractionManifest.produces).toEqual(["EntityFacts"]);
    expect(EntityExtractionManifest.facts).toContain("Technology");
    expect(EntityExtractionManifest.facts).toContain("Company");
    expect(EntityExtractionManifest.facts).toContain("Date");
    expect(EntityExtractionManifest.facts).toContain("Metric");
    expect(EntityExtractionManifest.timeout).toBe(5000);
    expect(EntityExtractionManifest.retries).toBe(2);
  });

  it("should extract technology entities with canonical names", async () => {
    const engine = new EntityExtractionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "J'ai utilisé k8s et js dans mon projet",
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    const entities = result.events[0].payload.entities;
    
    const k8sEntity = entities.find((e: any) => e.data.canonicalName === "Kubernetes");
    expect(k8sEntity).toBeDefined();
    expect(k8sEntity.data.sourceText).toBe("k8s");
    
    const jsEntity = entities.find((e: any) => e.data.canonicalName === "JavaScript");
    expect(jsEntity).toBeDefined();
    expect(jsEntity.data.sourceText).toBe("js");
  });

  it("should extract company entities with canonical names", async () => {
    const engine = new EntityExtractionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "J'ai travaillé chez Airbus et Google",
      },
    };

    const result = await engine.execute(input);
    const entities = result.events[0].payload.entities;
    
    const airbusEntity = entities.find((e: any) => e.data.canonicalName === "Airbus");
    expect(airbusEntity).toBeDefined();
    expect(airbusEntity.data.entityType).toBe("COMPANY");
    
    const googleEntity = entities.find((e: any) => e.data.canonicalName === "Google");
    expect(googleEntity).toBeDefined();
  });

  it("should extract date entities", async () => {
    const engine = new EntityExtractionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "J'ai travaillé de 2020 à 2022",
      },
    };

    const result = await engine.execute(input);
    const entities = result.events[0].payload.entities;
    
    const dateEntities = entities.filter((e: any) => e.data.entityType === "DATE");
    expect(dateEntities.length).toBeGreaterThanOrEqual(2);
  });

  it("should extract metric entities", async () => {
    const engine = new EntityExtractionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "J'ai géré 180 microservices",
      },
    };

    const result = await engine.execute(input);
    const entities = result.events[0].payload.entities;
    
    const metricEntity = entities.find((e: any) => e.type === "METRIC");
    expect(metricEntity).toBeDefined();
    expect(metricEntity.data.value).toBe(180);
    expect(metricEntity.data.unit).toBe("microservices");
  });

  it("should handle complex extraction case", async () => {
    const engine = new EntityExtractionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "J'ai migré 180 microservices sur k8s chez Airbus entre 2020 et 2022.",
      },
    };

    const result = await engine.execute(input);
    const entities = result.events[0].payload.entities;
    
    // Technology: Kubernetes
    const k8sEntity = entities.find((e: any) => e.data.canonicalName === "Kubernetes");
    expect(k8sEntity).toBeDefined();
    expect(k8sEntity.data.entityType).toBe("TECHNOLOGY");
    
    // Company: Airbus
    const airbusEntity = entities.find((e: any) => e.data.canonicalName === "Airbus");
    expect(airbusEntity).toBeDefined();
    expect(airbusEntity.data.entityType).toBe("COMPANY");
    
    // Metric: 180 microservices
    const metricEntity = entities.find((e: any) => e.type === "METRIC");
    expect(metricEntity).toBeDefined();
    expect(metricEntity.data.value).toBe(180);
    
    // Dates: 2020 and 2022
    const dateEntities = entities.filter((e: any) => e.data.entityType === "DATE");
    expect(dateEntities.length).toBeGreaterThanOrEqual(2);
  });

  it("should NOT infer skills or claims", async () => {
    const engine = new EntityExtractionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "Je maîtrise k8s et docker",
      },
    };

    const result = await engine.execute(input);
    const entities = result.events[0].payload.entities;
    
    // Should only extract entities, not claims about mastery
    const claimEntities = entities.filter((e: any) => e.type === "CLAIM");
    expect(claimEntities.length).toBe(0);
    
    // Should extract the technologies
    const techEntities = entities.filter((e: any) => e.data.entityType === "TECHNOLOGY");
    expect(techEntities.length).toBeGreaterThan(0);
  });

  it("should emit ENTITY_EXTRACTED event", async () => {
    const engine = new EntityExtractionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "test text with k8s",
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    expect(result.events[0].eventType).toBe("ENTITY_EXTRACTED");
    expect(result.events[0].payload).toHaveProperty("entities");
  });

  it("should handle empty text", async () => {
    const engine = new EntityExtractionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "",
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    expect(result.events[0].payload.entities).toEqual([]);
  });

  it("should handle text with no entities", async () => {
    const engine = new EntityExtractionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "C'est une phrase sans entités connues",
      },
    };

    const result = await engine.execute(input);
    const entities = result.events[0].payload.entities;
    expect(entities.length).toBe(0);
  });
});

describe("CanonicalEntityResolver Tests", () => {
  it("should resolve k8s to Kubernetes", () => {
    const resolved = CanonicalEntityResolver.resolveTechnology("k8s");
    expect(resolved).toBeDefined();
    expect(resolved?.canonicalName).toBe("Kubernetes");
    expect(resolved?.sourceText).toBe("k8s");
  });

  it("should resolve js to JavaScript", () => {
    const resolved = CanonicalEntityResolver.resolveTechnology("js");
    expect(resolved).toBeDefined();
    expect(resolved?.canonicalName).toBe("JavaScript");
  });

  it("should resolve node to Node.js", () => {
    const resolved = CanonicalEntityResolver.resolveTechnology("node");
    expect(resolved).toBeDefined();
    expect(resolved?.canonicalName).toBe("Node.js");
  });

  it("should resolve aws ecs to Amazon ECS", () => {
    const resolved = CanonicalEntityResolver.resolveTechnology("ecs");
    expect(resolved).toBeDefined();
    expect(resolved?.canonicalName).toBe("Amazon ECS");
  });

  it("should return null for unknown technology", () => {
    const resolved = CanonicalEntityResolver.resolveTechnology("unknown-tech");
    expect(resolved).toBeNull();
  });

  it("should resolve company aliases", () => {
    const resolved = CanonicalEntityResolver.resolveCompany("airbus");
    expect(resolved).toBeDefined();
    expect(resolved?.canonicalName).toBe("Airbus");
  });

  it("should return null for unknown company", () => {
    const resolved = CanonicalEntityResolver.resolveCompany("unknown-company");
    expect(resolved).toBeNull();
  });
});
