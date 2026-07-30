import { BaseContradictionPolicy, ContradictionPolicyContext, ContradictionPolicyResult } from "./ContradictionPolicy";

// ===================================================================
// BENEFIT OF DOUBT POLICY — Give benefit of doubt for low-severity contradictions
// ===================================================================

export class BenefitOfDoubtPolicy extends BaseContradictionPolicy {
  id = "benefit-of-doubt";
  name = "BenefitOfDoubtPolicy";
  description = "Gives benefit of doubt for low-severity contradictions that may be misunderstandings";
  ruleId = "CONTRADICTION-POLICY-003";
  ruleVersion = "1.0.0";

  evaluate(context: ContradictionPolicyContext): ContradictionPolicyResult {
    const { contradictionType, severity, observationA, observationB } = context;

    // Benefit of doubt for low severity or specific types
    const isBenefitOfDoubt = severity === "LOW" ||
      contradictionType.includes("seniority") ||
      contradictionType.includes("responsibility-denial") ||
      contradictionType.includes("role");

    if (isBenefitOfDoubt) {
      return this.buildResult(
        true, // passed - benefit of doubt granted
        0.7,
        `Benefit of doubt granted for ${contradictionType}: may be a misunderstanding or context issue`,
        [],
        "Requires clarification but does not block progress"
      );
    }

    return this.buildResult(
      false, // failed - not eligible for benefit of doubt
      0.0,
      `Contradiction ${contradictionType} does not qualify for benefit of doubt`,
      ["Contradiction severity too high for benefit of doubt"],
      undefined
    );
  }
}
