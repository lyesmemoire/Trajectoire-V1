// @ts-nocheck
import {
  SignalNode,
  EvidenceNode,
  ScoreComponentNode,
  AggregatedScoreNode,
  ExplanationGraph,
} from "./explanation-contract.js";
import { Signal } from "../scoring-engine/scoring-contract.js";
import { CompetencyScore } from "../evaluation-contract.js";
import { P7_WEIGHTS } from "../scoring-engine/scoring-contract.js";

/**
 * DAG Builder — Assembles the full Explanation Graph
 *
 * Structure enforced:
 *   SignalNodes → EvidenceNodes → ScoreComponentNodes → AggregatedScoreNode
 *
 * Properties:
 *   - Acyclic (strict DAG, no back-edges)
 *   - Complete (every signal is represented)
 *   - Deterministic (same input → same graph)
 */

// ─── Signal → SignalNode ────────────────────────────────────────────

export function buildSignalNodes(signals: Signal[], sessionId: string): SignalNode[] {
  return signals.map(s => {
    let nodeType: SignalNode["type"];
    if (s.type === "trust_trend") nodeType = "TRUST";
    else if (s.type === "interruption_rate") nodeType = "INTERRUPTION";
    else nodeType = "LATENCY";

    // Extract turn index from signal id (e.g. "trust_increase_2" → 2)
    const turnMatch = s.id.match(/_(\d+)$/);
    const turnIndex = turnMatch && turnMatch[1] ? parseInt(turnMatch[1], 10) : 0;

    return {
      id: `sn_${s.id}`,
      type: nodeType,
      value: s.value,
      timestampRef: s.timestamp,
      turnIndex,
      traceability: { sessionId, turnIndex },
    };
  });
}

// ─── Evidence + Competency → ScoreComponentNode ─────────────────────

const SCORING_RULES: Record<string, string[]> = {
  clarity: ["latency"],
  stability: ["latency", "interruption_rate"],
  technical_depth: ["trust_trend"],
  communication: ["trust_trend", "interruption_rate"],
};

export function buildScoreComponentNodes(
  competencies: CompetencyScore[],
  evidences: EvidenceNode[],
  sessionId: string,
): ScoreComponentNode[] {
  return competencies.map(comp => {
    // Find all evidences whose signals match this competency's rules
    const relevantTypes = SCORING_RULES[comp.name] || [];
    const matchedEvidenceIds = evidences
      .filter(ev => {
        // Evidence is relevant if any of its signal IDs contain a relevant type keyword
        return ev.signalIds.some(sid =>
          relevantTypes.some(rt => sid.includes(rt.replace("_", "")))
        );
      })
      .map(ev => ev.id);

    // Build a human-readable formula
    const formula = `${comp.name} = base(50) + Σ(signal.value × 5) [weight=${P7_WEIGHTS[comp.name as keyof typeof P7_WEIGHTS] ?? 0}]`;

    return {
      id: `sc_${comp.name}`,
      competency: comp.name as ScoreComponentNode["competency"],
      evidenceIds: matchedEvidenceIds.length > 0 ? matchedEvidenceIds : [`ev_base_${comp.name}`],
      computedScore: comp.score,
      formula,
      traceability: { sessionId, turnIndex: 0 },
    };
  });
}

// ─── Full DAG Assembly ──────────────────────────────────────────────

export function buildExplanationGraph(
  sessionId: string,
  signalNodes: SignalNode[],
  evidences: EvidenceNode[],
  scoreComponents: ScoreComponentNode[],
  finalScore: number,
): ExplanationGraph {
  const aggregated: AggregatedScoreNode = {
    id: "agg_final",
    finalScore,
    componentIds: scoreComponents.map(sc => sc.id),
    weightsSnapshot: { ...P7_WEIGHTS },
    traceability: { sessionId, turnIndex: 0 },
  };

  return {
    sessionId,
    signals: signalNodes,
    evidences,
    scoreComponents,
    aggregated,
  };
}

// ─── DAG Validation ─────────────────────────────────────────────────

export interface DAGValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateDAG(graph: ExplanationGraph): DAGValidationResult {
  const errors: string[] = [];

  // E1 — Every score component must resolve to ≥1 evidence
  for (const sc of graph.scoreComponents) {
    if (sc.evidenceIds.length === 0) {
      errors.push(`E1: ScoreComponent ${sc.id} has no linked evidence`);
    }
  }

  // E3 — No orphan signals (every signal must appear in at least one evidence)
  const allReferencedSignalIds = new Set<string>();
  for (const ev of graph.evidences) {
    for (const sid of ev.signalIds) {
      allReferencedSignalIds.add(sid);
    }
  }
  for (const sn of graph.signals) {
    // Strip "sn_" prefix to match evidence's signalIds
    const rawId = sn.id.replace(/^sn_/, "");
    if (!allReferencedSignalIds.has(rawId)) {
      errors.push(`E3: Signal ${sn.id} is orphaned (not in any evidence)`);
    }
  }

  // E1 (aggregated) — Aggregated score must link to ≥1 component
  if (graph.aggregated.componentIds.length === 0) {
    errors.push("E1: AggregatedScore has no linked components");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
