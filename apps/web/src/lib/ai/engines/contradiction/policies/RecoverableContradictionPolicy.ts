import { BaseContradictionPolicy, ContradictionPolicyContext, ContradictionPolicyResult } from "./ContradictionPolicy";

// ===================================================================
// RECOVERABLE CONTRADICTION POLICY — Contradictions that can be resolved
// ===================================================================

export class RecoverableContradictionPolicy extends BaseContradictionPolicy {
  id = "recoverable-contradiction";
  name = "RecoverableContradictionPolicy";
  description = "Contradictions that can be resolved with additional information or clarification";
  ruleId = "CONTRADICTION-POLICY-002";
  ruleVersion = "1.0.0";

  evaluate(context: ContradictionPolicyContext): ContradictionPolicyResult {
    const { contradictionType, severity } = context;

    // Recoverable contradictions are medium severity or specific types
    const isRecoverable = severity === "MEDIUM" || 
      contradictionType.includes("temporal") ||
      contradictionType.includes("scale");

    if (isRecoverable) {
      return this.buildResult(
        true, // passed - contradiction is recoverable
        0.5,
        `Recoverable contradiction detected: ${contradictionType} can be resolved with clarification`,
        [],
        "Requires clarification or additional context"
      );
    }

    return this.buildResult(
      false, // failed - not recoverable by this policy
      0.0,
      `Contradiction ${contradictionType} is not recoverable by this policy`,
      ["Contradiction type not recoverable"],
      undefined
    );
  }
}
