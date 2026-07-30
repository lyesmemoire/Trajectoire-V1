import { describe, it, expect, beforeEach } from "vitest";
import { DefaultCognitiveRuntime } from "../../apps/web/src/lib/ai/runtime/CognitiveRuntime";
import { EvidenceEngine, EvidenceManifest } from "../../apps/web/src/lib/ai/engines/EvidenceEngine";
import { EvidencePolicyRegistry } from "../../apps/web/src/lib/ai/engines/evidence/policies/EvidencePolicyRegistry";
import { InvestigationContext } from "../../apps/web/src/domain/cognitive/InvestigationContext";
import { EngineInput } from "../../apps/web/src/lib/ai/contracts/Engine";

describe("Phase A.8 - Runtime + EvidenceEngine Integration Tests", () => {
  let runtime: DefaultCognitiveRuntime;
  let context: InvestigationContext;
  let policyRegistry: EvidencePolicyRegistry;

  beforeEach(() => {
    runtime = new DefaultCognitiveRuntime();
    policyRegistry = new EvidencePolicyRegistry();
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

  it("should execute EvidenceEngine via Runtime", async () => {
    const evidenceEngine = new EvidenceEngine(policyRegistry);
    runtime.getRegistry().register(evidenceEngine);

    await runtime.initialize("test-session", context);

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

    const report = await runtime.execute(["EvidenceEngine"], input);

    expect(report).toBeDefined();
  });

  it("should receive EVIDENCE_DETECTED event", async () => {
    const evidenceEngine = new EvidenceEngine(policyRegistry);
    runtime.getRegistry().register(evidenceEngine);

    await runtime.initialize("test-session", context);

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

    await runtime.execute(["EvidenceEngine"], input);

    const events = runtime.getEventBus().getHistory("test-session");
    const evidenceDetected = events.find((e: any) => e.eventType === "EVIDENCE_DETECTED");
    expect(evidenceDetected).toBeDefined();
    expect(evidenceDetected?.payload).toHaveProperty("observationId");
  });

  it("should receive EVIDENCE_STRENGTH_CALCULATED event", async () => {
    const evidenceEngine = new EvidenceEngine(policyRegistry);
    runtime.getRegistry().register(evidenceEngine);

    await runtime.initialize("test-session", context);

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

    await runtime.execute(["EvidenceEngine"], input);

    const events = runtime.getEventBus().getHistory("test-session");
    const evidenceStrength = events.find((e: any) => e.eventType === "EVIDENCE_STRENGTH_CALCULATED");
    expect(evidenceStrength).toBeDefined();
    expect(evidenceStrength?.payload).toHaveProperty("strength");
  });

  it("should record evidence in ledger via Runtime", async () => {
    const evidenceEngine = new EvidenceEngine(policyRegistry);
    runtime.getRegistry().register(evidenceEngine);

    await runtime.initialize("test-session", context);

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

    await runtime.execute(["EvidenceEngine"], input);

    const ledger = evidenceEngine.getLedger();
    const entries = ledger.getBySession("test-session");
    expect(entries.length).toBe(1);
  });
});
