import { BaseEvidencePolicy, EvidencePolicyContext, EvidencePolicyResult } from "./EvidencePolicy";

// ===================================================================
// EVIDENCE QUALITY POLICY — Evaluates overall quality of evidence
// ===================================================================

export class EvidenceQualityPolicy extends BaseEvidencePolicy {
  id = "evidence-quality";
  name = "EvidenceQualityPolicy";
  description = "Evaluates the overall quality of evidence based on multiple dimensions";

  evaluate(context: EvidencePolicyContext): EvidencePolicyResult {
    const { dimensions, observation } = context;
    
    // Check for critical quality indicators
    const violations: string[] = [];
    
    // Very low specificity is a quality issue
    const specificity = dimensions.get("specificity") || 0;
    if (specificity < 0.2) {
      violations.push("Evidence lacks specificity");
    }

    // No quantification is a quality issue
    const quantification = dimensions.get("quantification") || 0;
    if (quantification < 0.3) {
      violations.push("Evidence lacks quantification");
    }

    // Very low verifiability is a quality issue
    const verifiability = dimensions.get("verifiability") || 0;
    if (verifiability < 0.2) {
      violations.push("Evidence lacks verifiability");
    }

    // Calculate quality score
    const qualityScore = this.calculateQualityScore(dimensions);
    const passed = qualityScore >= 0.4 && violations.length === 0;

    return {
      passed,
      score: qualityScore,
      reason: passed 
        ? "Evidence meets quality standards" 
        : `Evidence quality insufficient: ${violations.join(", ")}`,
      violations,
    };
  }

  private calculateQualityScore(dimensions: Map<string, number>): number {
    const weights: Record<string, number> = {
      specificity: 0.30,
      quantification: 0.25,
      verifiability: 0.25,
      production: 0.10,
      ownership: 0.10,
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [dimension, value] of dimensions.entries()) {
      const weight = weights[dimension] || 0;
      totalScore += value * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }
}
