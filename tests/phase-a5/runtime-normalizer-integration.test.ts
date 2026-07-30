import { describe, it, expect, beforeEach } from "vitest";
import { DefaultCognitiveRuntime } from "../../apps/web/src/lib/ai/runtime/CognitiveRuntime";
import { NormalizerEngine, NormalizerManifest } from "../../apps/web/src/lib/ai/engines/NormalizerEngine";
import { InvestigationContext } from "../../apps/web/src/domain/cognitive/InvestigationContext";
import { EngineInput } from "../../apps/web/src/lib/ai/contracts/Engine";

describe("Phase A.5 - Runtime + NormalizerEngine Integration", () => {
  let runtime: DefaultCognitiveRuntime;
  let normalizerEngine: NormalizerEngine;
  let sessionId: string;
  let investigationContext: InvestigationContext;

  beforeEach(() => {
    runtime = new DefaultCognitiveRuntime();
    normalizerEngine = new NormalizerEngine();
    runtime.getRegistry().register(normalizerEngine);

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

  it("should execute NormalizerEngine via Runtime", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        rawText: "euh j'ai 5 ans d'expérience en développement",
      },
    };

    const report = await runtime.execute(["NormalizerEngine"], input);

    expect(report.enginesExecuted.length).toBe(1);
    expect(report.enginesExecuted[0].engineName).toBe("NormalizerEngine");
    expect(report.enginesExecuted[0].success).toBe(true);
    expect(report.eventsPublished).toBe(1);
  });

  it("should receive TextNormalizedEvent from Runtime", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        rawText: "euh c'est une bonne idée",
      },
    };

    await runtime.execute(["NormalizerEngine"], input);

    const events = runtime.getEventBus().getHistory(sessionId);
    expect(events.length).toBe(1);
    expect(events[0].eventType).toBe("TEXT_NORMALIZED");
    expect(events[0].payload).toHaveProperty("normalizedText");
  });

  it("should normalize text through Runtime pipeline", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        rawText: "euh hum ben c'est une bonne idée",
      },
    };

    await runtime.execute(["NormalizerEngine"], input);

    const events = runtime.getEventBus().getHistory(sessionId);
    const normalizedText = events[0].payload.normalizedText;
    
    expect(normalizedText).not.toContain("euh");
    expect(normalizedText).not.toContain("hum");
    expect(normalizedText).not.toContain("ben");
  });

  it("should track execution metrics in ExecutionReport", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        rawText: "test text",
      },
    };

    const report = await runtime.execute(["NormalizerEngine"], input);

    expect(report.sessionId).toBe(sessionId);
    expect(report.enginesExecuted[0].durationMs).toBeGreaterThanOrEqual(0);
    expect(report.enginesExecuted[0].eventsProduced).toBe(1);
    expect(report.totalDurationMs).toBeGreaterThanOrEqual(0);
  });

  it("should use NormalizerManifest for engine metadata", () => {
    expect(NormalizerManifest.id).toBe("normalizer");
    expect(NormalizerManifest.version).toBe("1.0.0");
    expect(NormalizerManifest.consumes).toContain("RawTranscript");
    expect(NormalizerManifest.produces).toContain("NormalizedText");
    expect(NormalizerManifest.events).toContain("TextNormalized");
  });

  it("should handle multiple executions through Runtime", async () => {
    await runtime.initialize(sessionId, investigationContext);

    const input1: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        rawText: "euh première phrase",
      },
    };

    const input2: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId,
      context: { sessionId },
      payload: {
        rawText: "hum deuxième phrase",
      },
    };

    await runtime.execute(["NormalizerEngine"], input1);
    await runtime.execute(["NormalizerEngine"], input2);

    const events = runtime.getEventBus().getHistory(sessionId);
    expect(events.length).toBe(2);
  });
});
