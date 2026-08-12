import { CandidateEvaluation } from "../../p7/evaluation-contract";
import { ExplanationGraph, ExplanationNode, ExplanationEdge } from "../../p7/explainability/explanation-contract";
import { GlobalRankingEntry } from "../../p7/ranking/ranking-contract";



// ─── Core Models ──────────────────────────────────────────────────

export interface EvaluationReport {
  readonly reportId: string;
  readonly candidateId: string;
  readonly sessionId: string;

  readonly summary: ReportSummary;
  readonly ranking: ReportRanking;
  readonly evaluation: CandidateEvaluation;

  readonly explanation: EmbeddedExplanationGraph;

  readonly exports: ReportExports;

  readonly metadata: ReportMetadata;
}

export interface ReportInput {
  readonly evaluation: CandidateEvaluation;
  readonly ranking: GlobalRankingEntry;
  readonly explanation: ExplanationGraph;
  readonly tracePointers: TracePointers;
  readonly cohortSize: number;
}

// ─── Summary ───────────────────────────────────────────────────────

export interface ReportSummary {
  readonly globalScore: number;
  readonly rank: number;
  readonly cohortSize: number;

  readonly verdict: Verdict;

  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];

  readonly keyEvidence: readonly EvidenceRef[];
}

export type Verdict = "STRONG_HIRE" | "HIRE" | "MAYBE" | "NO_HIRE";

export interface EvidenceRef {
  readonly id: string;
  readonly excerpt: string;
  readonly rationale: string;
}

// ─── Ranking Binding ───────────────────────────────────────────────

export interface ReportRanking {
  readonly globalRank: number;
  readonly percentile: number;
  readonly cohortStats: CohortStatsSnapshot;
}

export interface CohortStatsSnapshot {
  readonly mean: number;
  readonly stdDev: number;
  readonly size: number;
}

// ─── Explanation Embedding ─────────────────────────────────────────

export interface EmbeddedExplanationGraph {
  readonly nodes: readonly ExplanationNode[];
  readonly edges: readonly ExplanationEdge[];

  readonly index: ExplanationIndex;
}

export interface ExplanationIndex {
  readonly scoreToEvidence: Record<string, readonly string[]>;
  readonly evidenceToSignals: Record<string, readonly string[]>;
  readonly turnToEvidence: Record<string, readonly string[]>;
}

// ─── Exports ───────────────────────────────────────────────────────

export interface ReportExports {
  readonly json: ReportJSON;
  readonly pdf: PdfArtifact;
  readonly auditPack: AuditPack;
}

export interface ReportJSON {
  readonly evaluation: CandidateEvaluation;
  readonly ranking: GlobalRankingEntry;
  readonly explanationGraph: EmbeddedExplanationGraph;
  readonly tracePointers: TracePointers;
}

export interface TracePointers {
  readonly sessionId: string;
  readonly turnIds: readonly string[];
  readonly journalHashes: readonly string[];
}

export interface PdfArtifact {
  readonly bytes: Uint8Array;
  readonly hash: string;
}

export interface AuditPack {
  readonly dependencySnapshot: string;
  readonly traceIntegrityHash: string;

  readonly evaluationGraphHash: string;
  readonly scoringReproducibilityProof: boolean;

  readonly replaySeed: string;
  readonly replayPlan: readonly ReplayInstruction[];
}

export interface ReplayInstruction {
  readonly step: number;
  readonly action: string;
  readonly payload: any;
}

// ─── Metadata ──────────────────────────────────────────────────────

export interface ReportMetadata {
  readonly generatedAt: number;
  readonly version: "P7.5";

  readonly deterministicHash: string;

  readonly inputHashes: {
    readonly evaluationHash: string;
    readonly rankingHash: string;
    readonly traceHash: string;
  };
}
