/**
 * Stub: Answer analysis types for signal-router.
 * The real implementation lives in lib/interview/behavior/answer-analysis.ts
 */
export interface AnswerAnalysis {
  verbosity: number;
  specificity: number;
  fillerDensity: number;
  relevanceScore: number;
  ramblingScore: number;
  clarity: number;
  confidence: number;
}
