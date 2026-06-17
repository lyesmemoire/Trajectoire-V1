import { describe, it, expect } from "vitest";
import { ScoringEngine } from "../scoring-engine/scoring-engine";
import { RuntimeTrace, TurnTrace } from "../trace-contract";

function buildFixedTrace(): RuntimeTrace {
  return {
    sessionId: "eval_session_1",
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

describe("P7 — Scoring Engine", () => {
  it("should produce a valid CandidateEvaluation from a RuntimeTrace", () => {
    const engine = new ScoringEngine();
    const trace = buildFixedTrace();
    const evaluation = engine.evaluate(trace);

    expect(evaluation.sessionId).toBe("eval_session_1");
    expect(evaluation.score).toBeGreaterThanOrEqual(0);
    expect(evaluation.score).toBeLessThanOrEqual(100);
    expect(evaluation.competencies.length).toBe(4);
    expect(evaluation.metadata.version).toBe("P7.1");
    expect(evaluation.metadata.deterministic).toBe(true);

    // Every competency must have a score 0-100 and a confidence 0-1
    for (const comp of evaluation.competencies) {
      expect(comp.score).toBeGreaterThanOrEqual(0);
      expect(comp.score).toBeLessThanOrEqual(100);
      expect(comp.confidence).toBeGreaterThanOrEqual(0);
      expect(comp.confidence).toBeLessThanOrEqual(1);
    }
  });

  it("should be deterministic: same trace → same evaluation (excluding generatedAt)", () => {
    const engine = new ScoringEngine();
    const trace = buildFixedTrace();

    const eval1 = engine.evaluate(trace);
    const eval2 = engine.evaluate(trace);
    const eval3 = engine.evaluate(trace);

    // Strip generatedAt since it uses Date.now()
    const strip = (e: typeof eval1) => ({ ...e, metadata: { ...e.metadata, generatedAt: 0 } });

    expect(strip(eval1)).toEqual(strip(eval2));
    expect(strip(eval2)).toEqual(strip(eval3));
  });

  it("every evidence must link to at least one signal", () => {
    const engine = new ScoringEngine();
    const trace = buildFixedTrace();
    const evaluation = engine.evaluate(trace);

    for (const ev of evaluation.evidence) {
      expect(ev.linkedSignals.length).toBeGreaterThan(0);
      expect(ev.id).toBeDefined();
      expect(ev.type).toMatch(/^(DIALOGUE|BEHAVIOR|TIMING)$/);
    }
  });

  it("should detect positive trust trend and negative interruption", () => {
    const engine = new ScoringEngine();
    const trace = buildFixedTrace();
    const evaluation = engine.evaluate(trace);

    // We have 2 positive trust signals, 1 negative, 3 fast_response, 1 interruption
    expect(evaluation.evidence.length).toBeGreaterThan(0);

    // technical_depth is driven by trust_trend — should benefit from 2 positives vs 1 negative
    const techDepth = evaluation.competencies.find(c => c.name === "technical_depth");
    expect(techDepth).toBeDefined();
    expect(techDepth!.score).toBeGreaterThanOrEqual(50); // Net positive trust
  });
});
