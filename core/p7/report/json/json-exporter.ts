import { ReportJSON, EmbeddedExplanationGraph } from "../report-contract.js";

export function exportJSON(input: _ReportInput, embeddedGraph: EmbeddedExplanationGraph): ReportJSON {
  return {
    evaluation: input.evaluation,
    ranking: input.ranking,
    explanationGraph: embeddedGraph,
    tracePointers: input.tracePointers,
  };
}
