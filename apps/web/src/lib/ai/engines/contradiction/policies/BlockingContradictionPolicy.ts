import { BaseContradictionPolicy, ContradictionPolicyContext, ContradictionPolicyResult } from "./ContradictionPolicy";

// ===================================================================
// BLOCKING CONTRADICTION POLICY — Critical contradictions that block progress
// ===================================================================

export class BlockingContradictionPolicy extends BaseContradictionPolicy {
  id = "blocking-contradiction";
  name = "BlockingContradictionPolicy";
  description = "Critical contradictions that must be resolved before proceeding";
  ruleId = "CONTRADICTION-POLICY-001";
  ruleVersion = "1.0.0";

  evaluate(context: ContradictionPolicyContext): ContradictionPolicyResult {
    const { contradictionType, severity } = context;

    // Blocking contradictions are always critical or high severity
    const isBlocking = severity === "CRITICAL" || severity === "HIGH";
    
    if (isBlocking) {
      return this.buildResult(
        false, // failed - contradiction blocks progress
        0.0,
        `Blocking contradiction detected: ${contradictionType} with ${severity} severity must be resolved`,
        [`Contradiction type ${contradictionType} is blocking`],
        "Requires explicit resolution before proceeding"
      );
    }

    return this.buildResult(
      true, // passed - not blocking
      1.0,
      `Contradiction ${contradictionType} is not blocking`,
      [],
      undefined
    );
  }
}
