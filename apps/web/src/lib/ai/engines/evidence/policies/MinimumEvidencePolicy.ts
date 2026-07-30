import { BaseEvidencePolicy, EvidencePolicyContext, EvidencePolicyResult } from "./EvidencePolicy";

// ===================================================================
// MINIMUM EVIDENCE POLICY — Ensures minimum evidence threshold is met
// ===================================================================

export class MinimumEvidencePolicy extends BaseEvidencePolicy {
  id = "minimum-evidence";
  name = "MinimumEvidencePolicy";
  description = "Ensures that observations meet minimum evidence threshold before being considered valid";

  private readonly minimumThreshold = 0.25; // 25% of maximum possible score

  evaluate(context: EvidencePolicyContext): EvidencePolicyResult {
    const { dimensions } = context;
    
    // Calculate overall evidence score
    let totalScore = 0;
    let totalWeight = 0;

    for (const [dimension, value] of dimensions.entries()) {
      // Use default weights if not provided
      const weight = this.getWeightForDimension(dimension);
      totalScore += value * weight;
      totalWeight += weight;
    }

    const overallScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    const passed = overallScore >= this.minimumThreshold;

    return {
      passed,
      score: overallScore,
      reason: passed 
        ? "Evidence meets minimum threshold" 
        : `Evidence score ${overallScore.toFixed(2)} below minimum threshold ${this.minimumThreshold}`,
      violations: passed ? [] : ["Below minimum evidence threshold"],
    };
  }

  private getWeightForDimension(dimension: string): number {
    const weights: Record<string, number> = {
      specificity: 0.25,
      ownership: 0.20,
      production: 0.30,
      quantification: 0.20,
      failure: 0.25,
      recency: 0.15,
      corroboration: 0.20,
      verifiability: 0.15,
    };
    return weights[dimension] || 0.1;
  }
}
