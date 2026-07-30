
/**
 * P7.4 — Explainability Layer Contracts
 *
 * This module defines the Explanation Graph (EG): a deterministic, acyclic,
 * directed graph that provides full causal traceability from raw signals
 * all the way to the final aggregated score.
 *
 * DAG structure:
 *   SignalNode → EvidenceNode → ScoreComponentNode → AggregatedScoreNode
 *
 * Invariants:
 *   E1 — Every final score resolves to ≥1 evidence
 *   E2 — Same trace → same graph → same explanation
 *   E3 — No orphan nodes (every signal is in the graph)
 *   E4 — Reconstruction completeness (graph rebuild = identical output)
 *   E5 — Evidence depends only on signals, never on LLM / heuristics
 */

// ─── Traceability Link ──────────────────────────────────────────────

// Canonical Reference: BEA-INV-008 (blueprint.invariant.traceability)
// Owner: Enterprise Chief Architect
export interface Traceability {
  sessionId: string;
  turnIndex: number;
  journalPointer?: string;
}

// ─── Node Types ─────────────────────────────────────────────────────

export interface SignalNode {
  id: string;
  type: "TRUST" | "INTERRUPTION" | "LATENCY";
  value: number;
  timestampRef: number;
  turnIndex: number;
  traceability: Traceability;
}

export interface EvidenceNode {
  id: string;
  signalIds: string[];
  excerpt: string;
  weight: number;
  rationale: string;
  traceability: Traceability;
}

export interface ScoreComponentNode {
  id: string;
  competency: "clarity" | "stability" | "technical_depth" | "communication";
  evidenceIds: string[];
  computedScore: number;
  formula: string;
  traceability: Traceability;
}

export interface AggregatedScoreNode {
  id: string;
  finalScore: number;
  componentIds: string[];
  weightsSnapshot: Record<string, number>;
  traceability: Traceability;
}

// ─── Graph ──────────────────────────────────────────────────────────

export interface ExplanationGraph {
  sessionId: string;
  signals: SignalNode[];
  evidences: EvidenceNode[];
  scoreComponents: ScoreComponentNode[];
  aggregated: AggregatedScoreNode;
}

// ─── Explained Score (output P7.4) ──────────────────────────────────

export interface ExplainedScore {
  value: number;
  breakdown: ScoreComponentNode[];
  evidence: EvidenceNode[];
  explanationText: string;
}

// ─── Generic Graph Nodes/Edges (used by Report Embedding) ──────────

export interface ExplanationNode {
  id: string;
  type: "signal" | "evidence" | "score" | "aggregate";
  payload: any;
}

export interface ExplanationEdge {
  from: string;
  to: string;
  type: "causal" | "aggregation";
}

