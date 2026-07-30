import { BaseContradictionPolicy, ContradictionPolicyContext, ContradictionPolicyResult } from "./ContradictionPolicy";
import { BlockingContradictionPolicy } from "./BlockingContradictionPolicy";
import { RecoverableContradictionPolicy } from "./RecoverableContradictionPolicy";
import { BenefitOfDoubtPolicy } from "./BenefitOfDoubtPolicy";
import { FalsePositivePolicy } from "./FalsePositivePolicy";
import { MemoryPolicyRegistry, BasePolicy } from "../../../policies/PolicyRegistry";

// ===================================================================
// CONTRADICTION POLICY REGISTRY — Specific Registry for Contradiction Policies
// ===================================================================

export class ContradictionPolicyRegistry extends MemoryPolicyRegistry {
  constructor() {
    super();
    this.registerDefaultPolicies();
  }

  private registerDefaultPolicies(): void {
    this.register(new BlockingContradictionPolicy());
    this.register(new RecoverableContradictionPolicy());
    this.register(new BenefitOfDoubtPolicy());
    this.register(new FalsePositivePolicy());
  }

  /**
   * Evaluate all policies for a contradiction context
   */
  evaluateAll(context: ContradictionPolicyContext): Map<string, ContradictionPolicyResult> {
    const results = new Map<string, ContradictionPolicyResult>();

    for (const policy of this.getAll()) {
      const contradictionPolicy = policy as unknown as BaseContradictionPolicy;
      const result = contradictionPolicy.evaluate(context);
      results.set(policy.id, result);
    }

    return results;
  }

  /**
   * Evaluate a specific policy by ID
   */
  evaluateById(policyId: string, context: ContradictionPolicyContext): ContradictionPolicyResult | undefined {
    const policy = this.get(policyId) as unknown as BaseContradictionPolicy | undefined;
    if (!policy) {
      return undefined;
    }
    return policy.evaluate(context);
  }

  /**
   * Get blocking policy result
   */
  getBlockingResult(context: ContradictionPolicyContext): ContradictionPolicyResult | undefined {
    return this.evaluateById("blocking-contradiction", context);
  }

  /**
   * Get recoverable policy result
   */
  getRecoverableResult(context: ContradictionPolicyContext): ContradictionPolicyResult | undefined {
    return this.evaluateById("recoverable-contradiction", context);
  }

  /**
   * Get benefit of doubt policy result
   */
  getBenefitOfDoubtResult(context: ContradictionPolicyContext): ContradictionPolicyResult | undefined {
    return this.evaluateById("benefit-of-doubt", context);
  }

  /**
   * Get false positive policy result
   */
  getFalsePositiveResult(context: ContradictionPolicyContext): ContradictionPolicyResult | undefined {
    return this.evaluateById("false-positive", context);
  }
}
