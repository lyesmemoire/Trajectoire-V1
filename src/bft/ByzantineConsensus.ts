import { ByzantineNodeResult } from "./ByzantineNode";
import { TrustScoringEngine, TrustScore } from "./TrustScoringEngine";

export interface ByzantineConsensusResult {
  consensusHash: string;
  quorum: boolean;
  agreementScore: number; // weighted agreement proportion (0-1)
  totalTrust: number; // sum of trust scores of all nodes
  nodes: ByzantineNodeResult[];
  trustDetails: TrustScore[];
}

export class ByzantineConsensusEngine {
  private trustEngine = new TrustScoringEngine();

  compute(nodes: ByzantineNodeResult[]): ByzantineConsensusResult {
    // Compute trust scores based on declared mode (honest/faulty/malicious)
    const trustDetails = this.trustEngine.compute(nodes);

    // Map rootHash -> cumulative trust weight
    const weightMap = new Map<string, number>();
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]!;
      const trust = trustDetails[i]!.trust;
      const current = weightMap.get(node.rootHash) ?? 0;
      weightMap.set(node.rootHash, current + trust);
    }

    // Find hash with highest trust weight
    let consensusHash = "";
    let maxWeight = 0;
    for (const [hash, weight] of weightMap.entries()) {
      if (weight > maxWeight) {
        maxWeight = weight;
        consensusHash = hash;
      }
    }

    const totalTrust = trustDetails.reduce((sum, t) => sum + t.trust, 0);
    const agreementScore = totalTrust === 0 ? 0 : maxWeight / totalTrust;

    // Byzantine quorum: need > 2/3 of total trust supporting a hash
    const quorum = agreementScore >= (2 / 3);

    return {
      consensusHash,
      quorum,
      agreementScore,
      totalTrust,
      nodes,
      trustDetails,
    };
  }
}
