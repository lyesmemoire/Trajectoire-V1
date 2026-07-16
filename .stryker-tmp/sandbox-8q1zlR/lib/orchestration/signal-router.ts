// @ts-nocheck
import { AnswerAnalysis } from "../behavior/answer-analysis";
import { InterruptionSignals } from "../types/pressure.types";

/**
 * Maps raw analysis results to high-level behavioral signals.
 */
export function routeSignals(analysis: AnswerAnalysis): InterruptionSignals {
  return {
    verbosity: analysis.verbosity,
    specificity: analysis.specificity,
    fillerDensity: analysis.fillerDensity,
    relevanceScore: analysis.relevanceScore,
    ramblingScore: analysis.ramblingScore,
  };
}
