import { BaseEvidencePolicy, EvidencePolicyContext, EvidencePolicyResult } from "./EvidencePolicy";

// ===================================================================
// WEAK EVIDENCE POLICY — Identifies weak or insufficient evidence
// ===================================================================

export class WeakEvidencePolicy extends BaseEvidencePolicy {
  id = "weak-evidence";
  name = "WeakEvidencePolicy";
  description = "Identifies weak or insufficient evidence that should be flagged for review";

  evaluate(context: EvidencePolicyContext): EvidencePolicyResult {
    const { dimensions, observation } = context;
    
    const violations: string[] = [];
    
    // Check for weak evidence indicators
    const specificity = dimensions.get("specificity") || 0;
    if (specificity < 0.3) {
      violations.push("Evidence is vague or lacks specificity");
    }

    const quantification = dimensions.get("quantification") || 0;
    if (quantification < 0.2) {
      violations.push("Evidence lacks quantifiable metrics");
    }

    const ownership = dimensions.get("ownership") || 0;
    if (ownership < 0.3) {
      violations.push("Evidence lacks clear ownership attribution");
    }

    const production = dimensions.get("production") || 0;
    if (production < 0.2) {
      violations.push("Evidence is not from production environment");
    }

    // Evidence is considered weak if it has multiple violations
    const passed = violations.length <= 1;
    const weakScore = violations.length / 4; // Normalize to 0-1

    return {
      passed,
      score: 1 - weakScore, // Higher score = stronger evidence
      reason: passed 
        ? "Evidence is sufficiently strong" 
        : `Evidence is weak: ${violations.join(", ")}`,
      violations,
    };
  }
}
