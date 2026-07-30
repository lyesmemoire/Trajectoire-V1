// ===================================================================
// EVIDENCE POLICY — Base Policy Interface
// ===================================================================

export interface EvidencePolicy {
  id: string;
  name: string;
  description: string;
  evaluate(context: EvidencePolicyContext): EvidencePolicyResult;
}

export interface EvidencePolicyContext {
  observation: any;
  dimensions: Map<string, number>;
  metadata: Record<string, any>;
}

export interface EvidencePolicyResult {
  passed: boolean;
  score: number;
  reason: string;
  violations: string[];
}

export abstract class BaseEvidencePolicy implements EvidencePolicy {
  abstract id: string;
  abstract name: string;
  abstract description: string;

  abstract evaluate(context: EvidencePolicyContext): EvidencePolicyResult;

  protected calculateScore(dimensions: Map<string, number>, weights: Map<string, number>): number {
    let totalScore = 0;
    let totalWeight = 0;

    for (const [dimension, value] of dimensions.entries()) {
      const weight = weights.get(dimension) || 0;
      totalScore += value * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }
}
