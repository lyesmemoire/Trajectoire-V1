import { BaseContradictionPolicy, ContradictionPolicyContext, ContradictionPolicyResult } from "./ContradictionPolicy";

// ===================================================================
// FALSE POSITIVE POLICY — Identifies contradictions that are likely false positives
// ===================================================================

export class FalsePositivePolicy extends BaseContradictionPolicy {
  id = "false-positive";
  name = "FalsePositivePolicy";
  description = "Identifies contradictions that are likely false positives due to context or ambiguity";
  ruleId = "CONTRADICTION-POLICY-004";
  ruleVersion = "1.0.0";

  evaluate(context: ContradictionPolicyContext): ContradictionPolicyResult {
    const { contradictionType, severity, observationA, observationB } = context;

    // False positive indicators
    const isLikelyFalsePositive = 
      contradictionType.includes("version") ||
      contradictionType.includes("seniority-experience") ||
      (severity === "LOW" && this.hasAmbiguousContext(observationA, observationB));

    if (isLikelyFalsePositive) {
      return this.buildResult(
        true, // passed - likely false positive
        0.8,
        `Likely false positive for ${contradictionType}: context or ambiguity suggests this is not a real contradiction`,
        [],
        "Marked as potential false positive - requires verification"
      );
    }

    return this.buildResult(
      false, // failed - not a false positive
      0.0,
      `Contradiction ${contradictionType} does not appear to be a false positive`,
      ["Contradiction does not match false positive patterns"],
      undefined
    );
  }

  private hasAmbiguousContext(obsA: any, obsB: any): boolean {
    // Check for ambiguous language indicators
    const contentA = (obsA.data?.content || obsA.content || "").toLowerCase();
    const contentB = (obsB.data?.content || obsB.content || "").toLowerCase();

    const ambiguousIndicators = [
      "around", "approximately", "about", "roughly", "maybe", "possibly",
      "I think", "I believe", "probably", "likely", "seems"
    ];

    const hasAmbiguityA = ambiguousIndicators.some(ind => contentA.includes(ind));
    const hasAmbiguityB = ambiguousIndicators.some(ind => contentB.includes(ind));

    return hasAmbiguityA || hasAmbiguityB;
  }
}
