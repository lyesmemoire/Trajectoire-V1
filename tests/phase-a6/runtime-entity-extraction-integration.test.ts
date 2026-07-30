import { describe, it, expect, beforeEach } from "vitest";
import { DefaultCognitiveRuntime } from "../../apps/web/src/lib/ai/runtime/CognitiveRuntime";
import { EntityExtractionEngine, EntityExtractionManifest } from "../../apps/web/src/lib/ai/engines/EntityExtractionEngine";
import { InvestigationContext } from "../../apps/web/src/domain/cognitive/InvestigationContext";
import { EngineInput } from "../../apps/web/src/lib/ai/contracts/Engine";

describe("Phase A.6 - Runtime + EntityExtractionEngine Integration", () => {
  let runtime: DefaultCognitiveRuntime;
  let entityEngine: EntityExtractionEngine;
  let sessionId: string;
  let investigationContext: InvestigationContext;

  beforeEach(() => {
    runtime = new DefaultCognitiveRuntime();
    entityEngine = new EntityExtractionEngine();
    runtime.getRegistry().register(entityEngine);

    sessionId = crypto.randomUUID();
    investigationContext = {
      sessionId,
      candidateId: "test-candidate",
      interviewId: "test-interview",
      startTime: new Date(),
      metadata: {
        snapshotVersion: 0,
        snapshotId: crypto.randomUUID(),
        parentSnapshotId: null,
        lastSnapshotAt: new Date(),
        traceId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
      },
      constraints: {
        maxTurns: 10,
        maxDuration: 60,
        maxTokens: 10000,
        allowedTopics: [],
        forbiddenTopics: [],
      },
      goals: [],
    };
  });

  it("should execute EntityExtractionEngine via Runtime", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        normalizedText: "J'ai utilisé k8s et js dans mon projet",
      },
    };

    const report = await runtime.execute(["EntityExtractionEngine"], input);

    expect(report.enginesExecuted.length).toBe(1);
    expect(report.enginesExecuted[0].engineName).toBe("EntityExtractionEngine");
    expect(report.enginesExecuted[0].success).toBe(true);
    expect(report.eventsPublished).toBe(1);
  });

  it("should receive ENTITY_EXTRACTED event from Runtime", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        normalizedText: "J'ai travaillé chez Airbus avec k8s",
      },
    };

    await runtime.execute(["EntityExtractionEngine"], input);

    const events = runtime.getEventBus().getHistory(sessionId);
    expect(events.length).toBe(1);
    expect(events[0].eventType).toBe("ENTITY_EXTRACTED");
    expect(events[0].payload).toHaveProperty("entities");
  });

  it("should extract entities with canonical names through Runtime", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        normalizedText: "J'ai migré 180 microservices sur k8s chez Airbus entre 2020 et 2022.",
      },
    };

    await runtime.execute(["EntityExtractionEngine"], input);

    const events = runtime.getEventBus().getHistory(sessionId);
    const entities = events[0].payload.entities;
    
    const k8sEntity = entities.find((e: any) => e.data.canonicalName === "Kubernetes");
    expect(k8sEntity).toBeDefined();
    expect(k8sEntity.data.canonicalName).toBe("Kubernetes");
    expect(k8sEntity.data.sourceText).toBe("k8s");
    
    const airbusEntity = entities.find((e: any) => e.data.canonicalName === "Airbus");
    expect(airbusEntity).toBeDefined();
    expect(airbusEntity.data.canonicalName).toBe("Airbus");
  });

  it("should track execution metrics in ExecutionReport", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        normalizedText: "test text with k8s",
      },
    };

    const report = await runtime.execute(["EntityExtractionEngine"], input);

    expect(report.sessionId).toBe(sessionId);
    expect(report.enginesExecuted[0].durationMs).toBeGreaterThanOrEqual(0);
    expect(report.enginesExecuted[0].eventsProduced).toBe(1);
    expect(report.totalDurationMs).toBeGreaterThanOrEqual(0);
  });

  it("should use EntityExtractionManifest for engine metadata", () => {
    expect(EntityExtractionManifest.id).toBe("entity-extraction");
    expect(EntityExtractionManifest.version).toBe("1.0.0");
    expect(EntityExtractionManifest.consumes).toContain("NormalizedText");
    expect(EntityExtractionManifest.produces).toContain("EntityFacts");
    expect(EntityExtractionManifest.facts).toContain("Technology");
    expect(EntityExtractionManifest.facts).toContain("Company");
  });

  it("should handle multiple executions through Runtime", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input1: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        normalizedText: "J'ai utilisé k8s",
      },
    };

    const input2: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        normalizedText: "J'ai travaillé chez Airbus",
      },
    };

    await runtime.execute(["EntityExtractionEngine"], input1);
    await runtime.execute(["EntityExtractionEngine"], input2);

    const events = runtime.getEventBus().getHistory(sessionId);
    expect(events.length).toBe(2);
  });

  it("should NOT infer skills or claims through Runtime", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: EngineInput<{ sessionId: string }, { normalizedText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        normalizedText: "Je maîtrise k8s et docker",
      },
    };

    await runtime.execute(["EntityExtractionEngine"], input);

    const events = runtime.getEventBus().getHistory(sessionId);
    const entities = events[0].payload.entities;
    
    const claimEntities = entities.filter((e: any) => e.type === "CLAIM");
    expect(claimEntities.length).toBe(0);
    
    const techEntities = entities.filter((e: any) => e.data.entityType === "TECHNOLOGY");
    expect(techEntities.length).toBeGreaterThan(0);
  });
});
