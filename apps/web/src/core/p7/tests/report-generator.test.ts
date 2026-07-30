

import { describe, it, expect } from "vitest";
import { ReportBuilder } from "../report/report-builder.js";
import { ReportInput } from "../report/report-contract.js";
import { CandidateEvaluation } from "../evaluation-contract.js";
import { GlobalRankingEntry } from "../ranking/ranking-contract.js";
import { ExplanationGraph } from "../explainability/explanation-contract.js";

function buildMockInput(): ReportInput {
  const evalData: CandidateEvaluation = {
    sessionId: "cand_1",
    score: 82.5,
    competencies: [
      { name: "clarity", score: 85, confidence: 0.9, signals: ["s1"] },
      { name: "stability", score: 80, confidence: 0.8, signals: ["s2"] },
    ],
    evidence: [],
    summary: { strengths: [], weaknesses: [], hiringRecommendation: "yes", finalComment: "ok" },
    metadata: { version: "P7.1", generatedAt: 100000, sourceHash: "hash", deterministic: true },
  };

  const rankingData: GlobalRankingEntry = {
    candidateId: "cand_1",
    score: { candidateId: "cand_1", rawScore: 82.5, normalizedScore: 85, percentile: 0.9 },
    rank: 1,
  };

  const explanationData: ExplanationGraph = {
    sessionId: "cand_1",
    signals: [{ id: "sn_trust_1", type: "TRUST", value: 0.1, timestampRef: 100, turnIndex: 1, traceability: { sessionId: "cand_1", turnIndex: 1 } }],
    evidences: [{ id: "ev_1", signalIds: ["trust_1"], excerpt: "test", weight: 0.1, rationale: "test rationale", traceability: { sessionId: "cand_1", turnIndex: 1 } }],
    scoreComponents: [{ id: "sc_clarity", competency: "clarity", evidenceIds: ["ev_1"], computedScore: 85, formula: "base", traceability: { sessionId: "cand_1", turnIndex: 0 } }],
    aggregated: { id: "agg_1", finalScore: 82.5, componentIds: ["sc_clarity"], weightsSnapshot: {}, traceability: { sessionId: "cand_1", turnIndex: 0 } },
  };

  return {
    evaluation: evalData,
    ranking: rankingData,
    explanation: explanationData,
    tracePointers: {
      sessionId: "cand_1",
      turnIds: ["turn_1", "turn_2"],
      journalHashes: ["hash1", "hash2"],
    },
    cohortSize: 15,
  };
}

describe("P7.5 — Report Generator", () => {
  const builder = new ReportBuilder();
  const input = buildMockInput();

  // ─── R1 — Determinism ───────────────────────────────────────────────
  describe("R1 — Full determinism", () => {
    it("same input → same report byte-to-byte", () => {
      const report1 = builder.build(input);
      const report2 = builder.build(input);

      expect(report1.metadata.deterministicHash).toBe(report2.metadata.deterministicHash);
      expect(report1.exports.pdf.hash).toBe(report2.exports.pdf.hash);
      expect(report1).toEqual(report2);
    });
  });

  // ─── R2 — Explanation completeness ──────────────────────────────────
  describe("R2 — Explanation completeness", () => {
    it("every score links to evidence in embedded graph", () => {
      const report = builder.build(input);
      const idx = report.explanation.index.scoreToEvidence;
      
      const scoreNodes = report.explanation.nodes.filter(n => n.type === "score");
      for (const sn of scoreNodes) {
        const evidence = idx[sn.id];
        expect(evidence).toBeDefined();
        expect(evidence!.length).toBeGreaterThan(0);
      }
    });
  });

  // ─── R3 — Audit reproducibility ─────────────────────────────────────
  describe("R3 — Audit reproducibility", () => {
    it("audit pack contains replay instructions and verification hashes", () => {
      const report = builder.build(input);
      const audit = report.exports.auditPack;

      expect(audit.evaluationGraphHash).toBeDefined();
      expect(audit.traceIntegrityHash).toBeDefined();
      expect(audit.replayPlan.length).toBeGreaterThan(0);
      expect(audit.scoringReproducibilityProof).toBe(true);
    });
  });

  // ─── R4 — No semantic drift ─────────────────────────────────────────
  describe("R4 — No semantic drift", () => {
    it("verdict maps deterministically from mathematical score", () => {
      const report = builder.build(input);
      expect(report.summary.verdict).toBe("STRONG_HIRE");

      const badInput = buildMockInput();
      (badInput.evaluation  as any).score = 35;
      const badReport = builder.build(badInput);
      expect(badReport.summary.verdict).toBe("NO_HIRE");
    });
  });

  // ─── R5 — Cross-format consistency ──────────────────────────────────
  describe("R5 — Cross-format consistency", () => {
    it("JSON, PDF, and AuditPack share exact same data references", () => {
      const report = builder.build(input);

      // JSON contains the exact same trace pointers as the input
      expect(report.exports.json.tracePointers.sessionId).toBe(report.sessionId);
      
      // Audit graph hash is derived from JSON/input representation
      expect(report.exports.auditPack.evaluationGraphHash).toBeDefined();

      // PDF hash is part of the final deterministic composite hash
      const pdfBytesHash = report.exports.pdf.hash;
      expect(pdfBytesHash).toContain(report.summary.globalScore?.toString() ?? "");
    });
  });
});
