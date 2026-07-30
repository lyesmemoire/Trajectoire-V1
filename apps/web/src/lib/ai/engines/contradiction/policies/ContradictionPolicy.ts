// ===================================================================
// CONTRADICTION POLICY — Base Interface for Contradiction Evaluation Policies
// ===================================================================

export interface ContradictionPolicyContext {
  observationA: any;
  observationB: any;
  contradictionType: string;
  severity: string;
  metadata: Record<string, any>;
}

export interface ContradictionPolicyResult {
  passed: boolean;
  score: number;
  reason: string;
  violations: string[];
  resolution?: string;
  ruleId: string;
  ruleVersion: string;
}

export abstract class BaseContradictionPolicy {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  abstract ruleId: string;
  abstract ruleVersion: string;

  abstract evaluate(context: ContradictionPolicyContext): ContradictionPolicyResult;

  protected buildResult(
    passed: boolean,
    score: number,
    reason: string,
    violations: string[],
    resolution?: string
  ): ContradictionPolicyResult {
    return {
      passed,
      score,
      reason,
      violations,
      resolution,
      ruleId: this.ruleId,
      ruleVersion: this.ruleVersion,
    };
  }
}
