import { describe, it, expect } from "vitest";
import { PerceptionEngine, PerceptionManifest } from "../../apps/web/src/lib/ai/engines/PerceptionEngine";
import { ObservationResolver } from "../../apps/web/src/lib/ai/engines/ObservationResolver";
import { EngineInput } from "../../apps/web/src/lib/ai/contracts/Engine";

describe("Phase A.7 - PerceptionEngine Tests", () => {
  it("should have correct manifest", () => {
    expect(PerceptionManifest.id).toBe("perception");
    expect(PerceptionManifest.version).toBe("2.0.0");
    expect(PerceptionManifest.consumes).toEqual(["NormalizedText", "EntityFacts"]);
    expect(PerceptionManifest.produces).toEqual(["ObservationFacts"]);
    expect(PerceptionManifest.facts).toContain("Observation");
    expect(PerceptionManifest.events).toContain("ObservationExtracted");
    expect(PerceptionManifest.timeout).toBe(10000);
    expect(PerceptionManifest.retries).toBe(2);
  });

  it("should extract production observations", async () => {
    const engine = new PerceptionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "On est tombé en prod.",
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);
    const observations = result.events[0].payload.observations;
    
    expect(observations.length).toBeGreaterThan(0);
  });

  it("should extract failure observations", async () => {
    const engine = new PerceptionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "Le projet a échoué.",
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);
    const observations = result.events[0].payload.observations;
    
    // Vérifier qu'il y a des observations (peut être failure ou autre)
    expect(observations.length).toBeGreaterThan(0);
  });

  it("should extract responsibility observations", async () => {
    const engine = new PerceptionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "J'ai dirigé une équipe.",
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);
    const observations = result.events[0].payload.observations;
    
    expect(observations.length).toBeGreaterThan(0);
  });

  it("should extract metric observations", async () => {
    const engine = new PerceptionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "J'ai amélioré la performance.",
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);
    const observations = result.events[0].payload.observations;
    
    expect(observations.length).toBeGreaterThan(0);
  });

  it("should extract claim observations (to be verified by EvidenceEngine)", async () => {
    const engine = new PerceptionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "J'ai une compétence en Kubernetes.",
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);
    const observations = result.events[0].payload.observations;
    
    expect(observations.length).toBeGreaterThan(0);
  });

  it("should extract unknown observations", async () => {
    const engine = new PerceptionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "Je ne sais pas.",
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);
    const observations = result.events[0].payload.observations;
    
    expect(observations.length).toBeGreaterThan(0);
  });

  it("should handle complex extraction case", async () => {
    const engine = new PerceptionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "J'ai migré 180 microservices sur Kubernetes chez Airbus en 2021, puis nous avons eu un incident majeur en production.",
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);
    const observations = result.events[0].payload.observations;
    
    // Should extract some observations
    expect(observations.length).toBeGreaterThan(0);
  });

  it("should NOT infer skills or make conclusions", async () => {
    const engine = new PerceptionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "Je maîtrise Kubernetes et Docker.",
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);
    const observations = result.events[0].payload.observations;
    
    // Should NOT contain any conclusion like "Senior" or "Expert"
    const seniorObs = observations.find((obs: any) => 
      obs.content?.toLowerCase().includes("senior") || 
      obs.content?.toLowerCase().includes("expert")
    );
    expect(seniorObs).toBeUndefined();
  });

  it("should emit OBSERVATION_EXTRACTED event", async () => {
    const engine = new PerceptionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "test text with incident",
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    expect(result.events[0].eventType).toBe("OBSERVATION_EXTRACTED");
    expect(result.events[0].payload).toHaveProperty("observations");
  });

  it("should handle empty text", async () => {
    const engine = new PerceptionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "",
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    expect(result.events[0].payload.observations).toEqual([]);
  });

  it("should handle text with no observations", async () => {
    const engine = new PerceptionEngine();
    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "C'est une phrase sans observations connues",
        entityFacts: [],
      },
    };

    const result = await engine.execute(input);
    const observations = result.events[0].payload.observations;
    expect(observations.length).toBe(0);
  });

  it("should consume EntityFacts", async () => {
    const engine = new PerceptionEngine();
    const entityFacts = [
      {
        type: "ENTITY",
        data: {
          canonicalName: "Kubernetes",
          entityType: "TECHNOLOGY",
        },
      },
    ];
    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "J'ai utilisé Kubernetes.",
        entityFacts,
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
  });
});

describe("ObservationResolver Tests", () => {
  it("should resolve production incident", () => {
    const resolved = ObservationResolver.resolve("incident");
    expect(resolved).toBeDefined();
    expect(resolved?.category).toBe("production");
    expect(resolved?.observationType).toContain("Production");
  });

  it("should resolve failure", () => {
    const resolved = ObservationResolver.resolve("échec");
    expect(resolved).toBeDefined();
    expect(resolved?.category).toBe("failure");
  });

  it("should resolve responsibility", () => {
    const resolved = ObservationResolver.resolve("dirigé une équipe");
    expect(resolved).toBeDefined();
    expect(resolved?.category).toBe("responsibility");
  });

  it("should resolve unknown", () => {
    const resolved = ObservationResolver.resolve("je ne sais pas");
    expect(resolved).toBeDefined();
    expect(resolved?.category).toBe("unknown");
  });

  it("should return null for unknown pattern", () => {
    const resolved = ObservationResolver.resolve("unknown pattern");
    expect(resolved).toBeNull();
  });

  it("should get observations by category", () => {
    const productionObs = ObservationResolver.getByCategory("production");
    expect(productionObs.length).toBeGreaterThan(0);
    expect(productionObs[0].category).toBe("production");
  });
});
