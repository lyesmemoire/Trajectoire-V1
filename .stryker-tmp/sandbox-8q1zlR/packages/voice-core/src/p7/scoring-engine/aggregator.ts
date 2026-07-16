// @ts-nocheck
import { CompetencyScore, Evidence } from "../evaluation-contract.js";
import { Signal, P7_WEIGHTS, CompetencyName } from "./scoring-contract.js";

export class Aggregator {
  
  public aggregate(signals: Signal[]): { competencies: CompetencyScore[], evidences: Evidence[] } {
    const competencies: CompetencyScore[] = [];
    const evidences: Evidence[] = [];
    
    // Group signals by type
    const signalsByType: Record<string, Signal[]> = {};
    for (const signal of signals) {
      const type = signal.type;
      if (!signalsByType[type]) {
        signalsByType[type] = [];
      }
      signalsByType[type]!.push(signal);
      
      // Generate Evidence directly mapped to signal
      evidences.push({
        id: `ev_${signal.id}`,
        type: "BEHAVIOR", // Simplified for now
        excerpt: signal.excerpt || "",
        timestamp: signal.timestamp,
        weight: Math.abs(signal.value),
        linkedSignals: [signal.id]
      });
    }

    // Heuristics mapping (simplified deterministic rules mapping signal types to competencies)
    const scoringRules: Record<CompetencyName, string[]> = {
      clarity: ["latency"],
      stability: ["latency", "interruption_rate"],
      technical_depth: ["trust_trend"],
      communication: ["trust_trend", "interruption_rate"]
    };

    for (const [competency, weight] of Object.entries(P7_WEIGHTS)) {
      const compName = competency as CompetencyName;
      const associatedTypes = scoringRules[compName] || [];
      
      let rawScore = 50; // Base score
      const linkedSignalIds: string[] = [];
      let totalAppliedWeight = 0;

      for (const type of associatedTypes) {
        const relevantSignals = signalsByType[type] || [];
        for (const s of relevantSignals) {
          rawScore += s.value * 5; // e.g. +5 for each positive signal, -5 for negative
          linkedSignalIds.push(s.id);
          totalAppliedWeight++;
        }
      }

      // Clamp score
      const finalScore = Math.max(0, Math.min(100, rawScore));
      
      competencies.push({
        name: compName,
        score: finalScore,
        confidence: totalAppliedWeight > 0 ? Math.min(1, totalAppliedWeight * 0.1) : 0,
        signals: linkedSignalIds
      });
    }

    return { competencies, evidences };
  }
}
