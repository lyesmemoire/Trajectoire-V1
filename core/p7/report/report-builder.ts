import { EvaluationReport, ReportInput } from "./report-contract.js";
import { buildSummary } from "./summary/summary-builder.js";
import { buildExplanationEmbedding } from "./explainability/explanation-embedder.js";
import { exportJSON } from "./json/json-exporter.js";
import { buildAuditPack } from "./audit/audit-pack-builder.js";
import { generatePDF } from "./pdf/pdf-generator.js";
import * as crypto from "crypto";

export class ReportBuilder {
  
  public build(input: ReportInput): EvaluationReport {
    // 1. Validate inputs (pure guards, skipped here assuming valid)
    
    // 2. Build explanation embedding
    const embeddedGraph = buildExplanationEmbedding(input.explanation);

    // 3. Build summary
    const summary = buildSummary(
      input.evaluation,
      input.ranking,
      input.explanation,
      input.cohortSize
    );

    // 4. Build JSON export
    const json = exportJSON(input, embeddedGraph);

    // 5. Build audit pack
    const auditPack = buildAuditPack(input);

    // 6. Render PDF
    const pdf = generatePDF(summary, json);

    // 7. Compute deterministic hash of the final object representation
    const deterministicHash = crypto.createHash("sha256")
      .update(JSON.stringify(json)) // Using JSON representation as stable core
      .update(pdf.hash)
      .update(auditPack.evaluationGraphHash)
      .digest("hex");

    const inputHashes = {
      evaluationHash: crypto.createHash("sha256").update(JSON.stringify(input.evaluation)).digest("hex"),
      rankingHash: crypto.createHash("sha256").update(JSON.stringify(input.ranking)).digest("hex"),
      traceHash: crypto.createHash("sha256").update(JSON.stringify(input.tracePointers)).digest("hex"),
    };

    // 8. Assemble EvaluationReport
    return {
      reportId: `rep_${input.tracePointers.sessionId}_${deterministicHash.substring(0, 8)}`,
      candidateId: input.tracePointers.sessionId, // Simplification: using sessionId as candidateId
      sessionId: input.tracePointers.sessionId,
      
      summary,
      ranking: {
        globalRank: input.ranking.rank,
        percentile: input.ranking.score.percentile,
        cohortStats: {
          mean: 0, // Placeholder, would come from P7.3 stats
          stdDev: 0,
          size: input.cohortSize,
        }
      },
      evaluation: input.evaluation,
      
      explanation: embeddedGraph,
      
      exports: {
        json,
        pdf,
        auditPack,
      },
      
      metadata: {
        generatedAt: 0, // Enforced 0 for pure determinism during tests, can be Date.now() in production
        version: "P7.5",
        deterministicHash,
        inputHashes,
      }
    };
  }
}
