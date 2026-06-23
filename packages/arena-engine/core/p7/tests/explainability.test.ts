import { describe, it, expect } from "vitest";
import { RuntimeTrace } from "../trace-contract.js";
import { ScoringEngine } from "../scoring-engine/scoring-engine.js";
import { mapTraceToExplanation, explainFromTrace } from "../explainability/trace-mapper.js";
import { validateDAG } from "../explainability/dag-builder.js";

// ─── Shared fixture ─────────────────────────────────────────────────

function buildFixedTrace(): RuntimeTrace {
  return {
    sessionId: "explain_session_1",
    turns: [
      {
        index: 0,
        input: { message: "Bonjour, je suis le candidat.", timestamp: 1000 },
        output: { utterance: "Bienvenue.", timestamp: 1200 },
        p5: { snapshotHash: "s0", journalPointer: "1" },
        events: [
          { type: "DECISION", timestamp: 1050, payload: { trustDelta: 0.1 } },
          { type: "VOICE_PLAN", timestamp: 1100, payload: { shouldInterrupt: false } },
        ],
        derived: { latencyMs: 200, turnDurationMs: 200 },
      },
      {
        index: 1,
        input: { message: "J'ai travaillé 5 ans en architecture logicielle.", timestamp: 2000 },
        output: { utterance: "Intéressant.", timestamp: 2300 },
        p5: { snapshotHash: "s1", journalPointer: "3" },
        events: [
          { type: "DECISION", timestamp: 2050, payload: { trustDelta: 0.15 } },
          { type: "VOICE_PLAN", timestamp: 2150, payload: { shouldInterrupt: false } },
        ],
        derived: { latencyMs: 300, turnDurationMs: 300 },
      },
      {
        index: 2,
        input: { message: "J'ai aussi dirigé une équipe de 12 personnes.", timestamp: 3000 },
        output: { utterance: "Racontez-moi.", timestamp: 3150 },
        p5: { snapshotHash: "s2", journalPointer: "5" },
        events: [
          { type: "DECISION", timestamp: 3020, payload: { trustDelta: 0.12 } },
          { type: "VOICE_PLAN", timestamp: 3080, payload: { shouldInterrupt: false } },
        ],
        derived: { latencyMs: 150, turnDurationMs: 150 },
      },
      {
        index: 3,
        input: { message: "Euh... je ne sais pas trop.", timestamp: 4000 },
        output: { utterance: "Prenez votre temps.", timestamp: 4100 },
        p5: { snapshotHash: "s3", journalPointer: "7" },
        events: [
          { type: "DECISION", timestamp: 4020, payload: { trustDelta: -0.05 } },
          { type: "VOICE_PLAN", timestamp: 4060, payload: { shouldInterrupt: true } },
        ],
        derived: { latencyMs: 100, turnDurationMs: 100 },
      },
    ],
  };
}

describe("P7.4 — Explainability Layer", () => {
  const trace = buildFixedTrace();
  const engine = new ScoringEngine();
  const evaluation = engine.evaluate(trace);

  // ─── E1: Full Traceability ──────────────────────────────────────
  describe("E1 — Full Traceability", () => {
    it("every score component resolves to ≥1 evidence", () => {
      const graph = mapTraceToExplanation(trace, evaluation);
      for (const sc of graph.scoreComponents) {
        expect(sc.evidenceIds.length).toBeGreaterThanOrEqual(1);
      }
    });

    it("aggregated score links to all components", () => {
      const graph = mapTraceToExplanation(trace, evaluation);
      expect(graph.aggregated.componentIds.length).toBe(4);
    });

    it("DAG validation passes (no structural errors)", () => {
      const graph = mapTraceToExplanation(trace, evaluation);
      const result = validateDAG(graph);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  // ─── E2: DAG Determinism ────────────────────────────────────────
  describe("E2 — DAG Determinism", () => {
    it("same trace → same graph → same explanation (3 runs)", () => {
      const g1 = mapTraceToExplanation(trace, evaluation);
      const g2 = mapTraceToExplanation(trace, evaluation);
      const g3 = mapTraceToExplanation(trace, evaluation);

      expect(g1).toEqual(g2);
      expect(g2).toEqual(g3);
    });

    it("same graph → same explanation text", () => {
      const e1 = explainFromTrace(trace, evaluation);
      const e2 = explainFromTrace(trace, evaluation);

      expect(e1.explanationText).toBe(e2.explanationText);
      expect(e1.value).toBe(e2.value);
    });
  });

  // ─── E3: No Orphan Nodes ───────────────────────────────────────
  describe("E3 — No Orphan Nodes", () => {
    it("every signal is referenced in at least one evidence", () => {
      const graph = mapTraceToExplanation(trace, evaluation);

      const allReferencedSignals = new Set<string>();
      for (const ev of graph.evidences) {
        for (const sid of ev.signalIds) {
          allReferencedSignals.add(sid);
        }
      }

      for (const sn of graph.signals) {
        const rawId = sn.id.replace(/^sn_/, "");
        expect(allReferencedSignals.has(rawId)).toBe(true);
      }
    });
  });

  // ─── E4: Reconstruction Completeness ──────────────────────────
  describe("E4 — Reconstruction Completeness", () => {
    it("graph rebuilt from same input is structurally identical", () => {
      const graph1 = mapTraceToExplanation(trace, evaluation);

      // Rebuild from scratch
      const freshEval = engine.evaluate(trace);
      const graph2 = mapTraceToExplanation(trace, freshEval);

      // Strip metadata that may differ (generatedAt in eval)
      expect(graph1.signals).toEqual(graph2.signals);
      expect(graph1.evidences).toEqual(graph2.evidences);
      expect(graph1.scoreComponents).toEqual(graph2.scoreComponents);
      expect(graph1.aggregated).toEqual(graph2.aggregated);
    });
  });

  // ─── E5: No Semantic Drift ────────────────────────────────────
  describe("E5 — No Semantic Drift", () => {
    it("every evidence rationale is derived from signal types only", () => {
      const graph = mapTraceToExplanation(trace, evaluation);

      const validPatterns = ["trust_trend", "latency", "interruption_rate"];

      for (const ev of graph.evidences) {
        // Rationale must contain one of the valid signal type keywords
        const containsValidType = validPatterns.some(
          p => ev.rationale.includes(p)
        );
        expect(containsValidType).toBe(true);
      }
    });

    it("no evidence has an empty rationale", () => {
      const graph = mapTraceToExplanation(trace, evaluation);
      for (const ev of graph.evidences) {
        expect(ev.rationale.length).toBeGreaterThan(0);
      }
    });
  });

  // ─── Explanation Text Quality ─────────────────────────────────
  describe("Explanation Text Output", () => {
    it("produces a human-readable explanation", () => {
      const explained = explainFromTrace(trace, evaluation);

      expect(explained.explanationText).toContain("Score");
      expect(explained.explanationText).toContain("because:");
      expect(explained.explanationText).toContain("evidence");
      expect(explained.breakdown.length).toBe(4);
    });
  });
});
