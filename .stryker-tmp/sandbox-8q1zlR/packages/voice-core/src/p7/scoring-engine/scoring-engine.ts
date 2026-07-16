// @ts-nocheck
import { RuntimeTrace } from "../trace-contract.js";
import { CandidateEvaluation } from "../evaluation-contract.js";
import { Signal, SignalExtractor, P7_WEIGHTS } from "./scoring-contract.js";
import { TrustExtractor } from "./extractors/trust-extractor.js";
import { StabilityExtractor } from "./extractors/stability-extractor.js";
import { Aggregator } from "./aggregator.js";

export class ScoringEngine {
  private extractors: SignalExtractor[] = [
    new TrustExtractor(),
    new StabilityExtractor()
  ];
  private aggregator = new Aggregator();

  public evaluate(trace: RuntimeTrace): CandidateEvaluation {
    const allSignals: Signal[] = [];
    
    // 1. Extract Signals
    for (const extractor of this.extractors) {
      allSignals.push(...extractor.extract(trace));
    }

    // 2. Aggregate & Normalizer
    const { competencies, evidences } = this.aggregator.aggregate(allSignals);

    // 3. Compute Global Score
    let globalScore = 0;
    for (const comp of competencies) {
      const weight = P7_WEIGHTS[comp.name as keyof typeof P7_WEIGHTS] || 0;
      globalScore += comp.score * weight;
    }

    // Determine recommendation
    let recommendation: "strong_yes" | "yes" | "neutral" | "no" | "strong_no" = "neutral";
    if (globalScore >= 80) recommendation = "strong_yes";
    else if (globalScore >= 60) recommendation = "yes";
    else if (globalScore <= 30) recommendation = "strong_no";
    else if (globalScore < 50) recommendation = "no";

    return {
      sessionId: trace.sessionId,
      score: globalScore,
      competencies,
      evidence: evidences,
      summary: {
        strengths: ["Analyzed through deterministic rules"],
        weaknesses: [],
        hiringRecommendation: recommendation,
        finalComment: "Evaluated by P7 deterministic engine."
      },
      metadata: {
        version: "P7.1",
        generatedAt: Date.now(),
        sourceHash: "hash-placeholder", // Trace hash
        deterministic: true
      }
    };
  }
}
