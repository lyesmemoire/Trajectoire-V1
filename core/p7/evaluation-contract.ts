export type { CompetencyName } from "./scoring-engine/scoring-contract";

export interface CandidateEvaluation {
  sessionId: string;
  score: number; // 0-100 global

  competencies: CompetencyScore[];
  evidence: Evidence[];
  summary: EvaluationSummary;
  metadata: EvaluationMetadata;
}

export interface CompetencyScore {
  name: string;
  score: number; // 0-100
  confidence: number; // 0-1
  signals: string[]; // references to extractors/signals
}

export interface Evidence {
  id: string;
  type: "DIALOGUE" | "BEHAVIOR" | "TIMING";
  excerpt: string; // From P6 RuntimeTrace
  timestamp: number;
  weight: number;
  linkedSignals: string[];
}

export interface EvaluationSummary {
  strengths: string[];
  weaknesses: string[];
  hiringRecommendation: "strong_yes" | "yes" | "neutral" | "no" | "strong_no";
  finalComment: string;
}

export interface EvaluationMetadata {
  version: "P7.1";
  generatedAt: number;
  sourceHash: string; // Hash of the P6 RuntimeTrace
  deterministic: true;
}
