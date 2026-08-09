import { ReportJSON, EmbeddedExplanationGraph, ReportInput } from "../report-contract.js";


export function exportJSON(input: ReportInput, embeddedGraph: EmbeddedExplanationGraph): ReportJSON {
  return {
    evaluation: input.evaluation,
    ranking: input.ranking,
    explanationGraph: embeddedGraph,
    tracePointers: input.tracePointers,
  };
}
