import { describe, it, expect } from "vitest";
import { RealP7EvaluatorClient } from "../services/p7-evaluator-client";
import { RuntimeTrace } from "../../core/p7/trace-contract";

/**
 * Builds a deterministic, structurally valid RuntimeTrace
 * matching the exact contract expected by ScoringEngine / TraceMapper.
 */
function buildFixedTrace(sessionId: string): RuntimeTrace {
  return {
    sessionId,
    turns: [
      {
        index: 0,
        input: { message: "Bonjour, je suis le candidat.", timestamp: 1000 },
        output: { utterance: "Bienvenue, parlons de votre parcours.", timestamp: 1200 },
        p5: { snapshotHash: "snap0", journalPointer: "1" },
        events: [
          { type: "DECISION", timestamp: 1050, payload: { trustDelta: 0.1 } },
          { type: "VOICE_PLAN", timestamp: 1100, payload: { shouldInterrupt: false } },
        ],
        derived: { latencyMs: 200, turnDurationMs: 200 },
      },
      {
        index: 1,
        input: { message: "J'ai 5 ans d'expérience en architecture logicielle.", timestamp: 2000 },
        output: { utterance: "Intéressant, pouvez-vous détailler ?", timestamp: 2300 },
        p5: { snapshotHash: "snap1", journalPointer: "3" },
        events: [
          { type: "DECISION", timestamp: 2050, payload: { trustDelta: 0.15 } },
          { type: "VOICE_PLAN", timestamp: 2150, payload: { shouldInterrupt: false } },
        ],
        derived: { latencyMs: 300, turnDurationMs: 300 },
      },
      {
        index: 2,
        input: { message: "Euh... je ne sais pas trop...", timestamp: 3000 },
        output: { utterance: "Prenez votre temps.", timestamp: 3100 },
        p5: { snapshotHash: "snap2", journalPointer: "5" },
        events: [
          { type: "DECISION", timestamp: 3020, payload: { trustDelta: -0.05 } },
          { type: "VOICE_PLAN", timestamp: 3060, payload: { shouldInterrupt: true } },
        ],
        derived: { latencyMs: 100, turnDurationMs: 100 },
      },
    ],
  };
}

describe("SIL Phase 2-C — Real P7 Evaluator Adapter", () => {
  it("Should process a RuntimeTrace and generate a valid CandidateEvaluation", async () => {
    const client = new RealP7EvaluatorClient();
    const trace = buildFixedTrace("session-eval");

    const result = await client.evaluate({
      sessionId: trace.sessionId,
      runtimeTrace: trace,
    });

    expect(result.sessionId).toBe("session-eval");
    expect(result.evaluation).toBeDefined();
    expect(typeof result.evaluation.score).toBe("number");
    expect(result.evaluation.score).toBeGreaterThanOrEqual(0);
    expect(result.evaluation.score).toBeLessThanOrEqual(100);
    expect(result.evaluation.metadata.deterministic).toBe(true);
  });

  it("Should map the trace to a valid ExplanationGraph (DAG)", async () => {
    const client = new RealP7EvaluatorClient();
    const trace = buildFixedTrace("session-explain");

    const result = await client.evaluate({
      sessionId: trace.sessionId,
      runtimeTrace: trace,
    });

    expect(result.explanationGraph).toBeDefined();
    expect(result.explanationGraph.aggregated).toBeDefined();
    expect(result.explanationGraph.aggregated.finalScore).toBe(result.evaluation.score);
    expect(result.explanationGraph.scoreComponents.length).toBeGreaterThan(0);
  });

  it("Should generate a valid Report with deterministic hash", async () => {
    const client = new RealP7EvaluatorClient();
    const trace = buildFixedTrace("session-report");

    const result = await client.evaluate({
      sessionId: trace.sessionId,
      runtimeTrace: trace,
    });

    expect(result.reportId).toBeDefined();
    expect(result.reportId).toContain("session-report");
    expect(result.reportHash).toBeDefined();
    expect(typeof result.reportHash).toBe("string");
    expect(result.evaluationHash).toBeDefined();
    expect(typeof result.evaluationHash).toBe("string");
  });

  it("Should produce identical hashes for the same trace (Determinism)", async () => {
    const client1 = new RealP7EvaluatorClient();
    const client2 = new RealP7EvaluatorClient();
    const trace = buildFixedTrace("session-deterministic");

    const result1 = await client1.evaluate({
      sessionId: trace.sessionId,
      runtimeTrace: trace,
    });

    const result2 = await client2.evaluate({
      sessionId: trace.sessionId,
      runtimeTrace: trace,
    });

    expect(result1.reportHash).toBe(result2.reportHash);
    expect(result1.evaluationHash).toBe(result2.evaluationHash);
    expect(result1.evaluation.score).toBe(result2.evaluation.score);
  });

  it("Should propagate P7 pipeline failures as P7_EVALUATION_FAILED", async () => {
    const client = new RealP7EvaluatorClient();

    // Empty turns trace will cause extractors to produce no signals
    // but should not crash — test with null trace to trigger failure
    await expect(
      client.evaluate({
        sessionId: "session-fail",
        runtimeTrace: null as any,
      })
    ).rejects.toThrowError("P7_EVALUATION_FAILED");
  });
});
