// apps/realtime-gateway/src/interview/models/ExplainableScore.ts

export interface ScoreReason {
  label: string; // e.g., "Strong React knowledge"
  impact: number; // weight of this reason (0‑100)
  explanation: string; // human‑readable description
}

export interface ExplainableScore {
  score: number; // overall score 0‑100
  confidence: number; // confidence in the score 0‑100
  reasons: ScoreReason[];
}

export interface ExplainableScores {
  technical: ExplainableScore;
  communication: ExplainableScore;
  confidence: ExplainableScore;
  consistency: ExplainableScore;
}
