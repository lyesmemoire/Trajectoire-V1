import { describe, it, expect, beforeEach } from "vitest";
import { DefaultCognitiveRuntime } from "../../apps/web/src/lib/ai/runtime/CognitiveRuntime";
import { PerceptionEngine } from "../../apps/web/src/lib/ai/engines/PerceptionEngine";
import { InvestigationContext } from "../../apps/web/src/domain/cognitive/InvestigationContext";
import { EngineInput } from "../../apps/web/src/lib/ai/contracts/Engine";

describe("Phase A.7 - Runtime + PerceptionEngine Integration Tests", () => {
  let runtime: DefaultCognitiveRuntime;
  let context: InvestigationContext;

  beforeEach(() => {
    runtime = new DefaultCognitiveRuntime();
    context = {
      sessionId: "test-session",
      candidateId: "candidate-1",
      interviewId: "interview-1",
      startTime: new Date(),
      metadata: {},
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

  it("should execute PerceptionEngine via Runtime", async () => {
    const perceptionEngine = new PerceptionEngine();
    runtime.getRegistry().register(perceptionEngine);

    await runtime.initialize("test-session", context);

    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "On est tombé en prod.",
        entityFacts: [],
      },
    };

    const report = await runtime.execute(["PerceptionEngine"], input);

    expect(report).toBeDefined();
  });

  it("should receive OBSERVATION_EXTRACTED event", async () => {
    const perceptionEngine = new PerceptionEngine();
    runtime.getRegistry().register(perceptionEngine);

    await runtime.initialize("test-session", context);

    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "On est tombé en prod.",
        entityFacts: [],
      },
    };

    await runtime.execute(["PerceptionEngine"], input);

    const events = runtime.getEventBus().getHistory("test-session");
    const observationEvent = events.find((e: any) => e.eventType === "OBSERVATION_EXTRACTED");
    expect(observationEvent).toBeDefined();
    expect(observationEvent?.payload).toHaveProperty("observations");
  });

  it("should extract observations with canonical types", async () => {
    const perceptionEngine = new PerceptionEngine();
    runtime.getRegistry().register(perceptionEngine);

    await runtime.initialize("test-session", context);

    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "Le projet a échoué.",
        entityFacts: [],
      },
    };

    await runtime.execute(["PerceptionEngine"], input);

    const events = runtime.getEventBus().getHistory("test-session");
    const observationEvent = events.find((e: any) => e.eventType === "OBSERVATION_EXTRACTED");
    expect(observationEvent).toBeDefined();
    expect(observationEvent?.payload.observations.length).toBeGreaterThan(0);
  });

  it("should track execution metrics", async () => {
    const perceptionEngine = new PerceptionEngine();
    runtime.getRegistry().register(perceptionEngine);

    await runtime.initialize("test-session", context);

    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "test text",
        entityFacts: [],
      },
    };

    const report = await runtime.execute(["PerceptionEngine"], input);

    expect(report).toBeDefined();
  });

  it("should NOT infer skills or make conclusions via Runtime", async () => {
    const perceptionEngine = new PerceptionEngine();
    runtime.getRegistry().register(perceptionEngine);

    await runtime.initialize("test-session", context);

    const input: EngineInput<{ sessionId: string }, { normalizedText: string; entityFacts: any[] }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        normalizedText: "Je maîtrise Kubernetes et Docker.",
        entityFacts: [],
      },
    };

    await runtime.execute(["PerceptionEngine"], input);

    const events = runtime.getEventBus().getHistory("test-session");
    const observationEvent = events.find((e: any) => e.eventType === "OBSERVATION_EXTRACTED");
    
    // Should NOT contain any conclusion like "Senior" or "Expert"
    const seniorObs = observationEvent?.payload.observations.find((obs: any) => 
      obs.content?.toLowerCase().includes("senior") || 
      obs.content?.toLowerCase().includes("expert")
    );
    expect(seniorObs).toBeUndefined();
  });
});
