import { MinimumEvidencePolicy } from "./MinimumEvidencePolicy";
import { EvidenceQualityPolicy } from "./EvidenceQualityPolicy";
import { CorroborationPolicy } from "./CorroborationPolicy";
import { WeakEvidencePolicy } from "./WeakEvidencePolicy";
import { MemoryPolicyRegistry, BasePolicy } from "../../../policies/PolicyRegistry";

// ===================================================================
// EVIDENCE POLICY REGISTRY — Specific Registry for Evidence Policies
// ===================================================================

export class EvidencePolicyRegistry extends MemoryPolicyRegistry {
  constructor() {
    super();
    this.registerDefaultPolicies();
  }

  private registerDefaultPolicies(): void {
    this.register(new MinimumEvidencePolicy());
    this.register(new EvidenceQualityPolicy());
    this.register(new CorroborationPolicy());
    this.register(new WeakEvidencePolicy());
  }

  /**
   * Get minimum evidence policy result
   */
  getMinimumEvidenceResult(context: any): any {
    const policy = this.get("minimum-evidence") as unknown as any;
    if (!policy) {
      return undefined;
    }
    return policy.evaluate(context);
  }

  /**
   * Get evidence quality policy result
   */
  getEvidenceQualityResult(context: any): any {
    const policy = this.get("evidence-quality") as unknown as any;
    if (!policy) {
      return undefined;
    }
    return policy.evaluate(context);
  }

  /**
   * Get corroboration policy result
   */
  getCorroborationResult(context: any): any {
    const policy = this.get("corroboration") as unknown as any;
    if (!policy) {
      return undefined;
    }
    return policy.evaluate(context);
  }

  /**
   * Get weak evidence policy result
   */
  getWeakEvidenceResult(context: any): any {
    const policy = this.get("weak-evidence") as unknown as any;
    if (!policy) {
      return undefined;
    }
    return policy.evaluate(context);
  }
}
