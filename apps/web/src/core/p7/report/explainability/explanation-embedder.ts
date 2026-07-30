
import { ExplanationNode, ExplanationEdge } from "../../explainability/explanation-contract.js";
import { EmbeddedExplanationGraph } from "../report-contract.js";
import { ExplanationGraph } from "../../explainability/explanation-contract.js";


export function buildExplanationEmbedding(graph: ExplanationGraph): EmbeddedExplanationGraph {
  const nodes: ExplanationNode[] = [];
  const edges: ExplanationEdge[] = [];
  const scoreToEvidence: Record<string, string[]> = {};
  const evidenceToSignals: Record<string, string[]> = {};
  const turnToEvidence: Record<string, string[]> = {};

  // 1. Root: AggregatedScore
  nodes.push({
    id: graph.aggregated.id,
    type: "aggregate",
    payload: graph.aggregated,
  });

  // 2. ScoreComponents
  for (const comp of graph.scoreComponents) {
    nodes.push({
      id: comp.id,
      type: "score",
      payload: comp,
    });
    edges.push({
      from: comp.id,
      to: graph.aggregated.id,
      type: "aggregation",
    });

    scoreToEvidence[comp.id] = [...comp.evidenceIds];

    for (const evId of comp.evidenceIds) {
      edges.push({
        from: evId,
        to: comp.id,
        type: "causal",
      });
    }
  }

  // 3. Evidences
  for (const ev of graph.evidences) {
    nodes.push({
      id: ev.id,
      type: "evidence",
      payload: ev,
    });

    evidenceToSignals[ev.id] = [...ev.signalIds];

    const turnKey = `turn_${ev.traceability.turnIndex}`;
    if (!turnToEvidence[turnKey]) {
      turnToEvidence[turnKey] = [];
    }
    turnToEvidence[turnKey].push(ev.id);

    for (const sigId of ev.signalIds) {
      edges.push({
        from: `sn_${sigId}`,
        to: ev.id,
        type: "causal",
      });
    }
  }

  // 4. Signals
  for (const sig of graph.signals) {
    nodes.push({
      id: sig.id,
      type: "signal",
      payload: sig,
    });
  }

  return {
    nodes,
    edges,
    index: {
      scoreToEvidence,
      evidenceToSignals,
      turnToEvidence,
    },
  };
}
