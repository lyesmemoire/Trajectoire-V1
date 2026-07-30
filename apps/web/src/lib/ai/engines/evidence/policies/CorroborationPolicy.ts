import { BaseEvidencePolicy, EvidencePolicyContext, EvidencePolicyResult } from "./EvidencePolicy";

// ===================================================================
// CORROBORATION POLICY — Evaluates evidence corroboration from multiple sources
// ===================================================================

export class CorroborationPolicy extends BaseEvidencePolicy {
  id = "corroboration";
  name = "CorroborationPolicy";
  description = "Evaluates whether evidence is corroborated by other observations or sources";

  evaluate(context: EvidencePolicyContext): EvidencePolicyResult {
    const { dimensions, metadata } = context;
    
    const corroboration = dimensions.get("corroboration") || 0;
    const violations: string[] = [];
    
    // Low corroboration is a warning but not a failure
    if (corroboration < 0.3) {
      violations.push("Evidence lacks corroboration from other sources");
    }

    // High corroboration is a strength
    const passed = true; // Corroboration is not a hard requirement
    
    return {
      passed,
      score: corroboration,
      reason: passed 
        ? `Corroboration score: ${corroboration.toFixed(2)}` 
        : `Evidence lacks corroboration: ${corroboration.toFixed(2)}`,
      violations,
    };
  }
}
