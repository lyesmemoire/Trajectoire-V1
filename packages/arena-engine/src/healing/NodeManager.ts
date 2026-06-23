import { ByzantineNode, ByzantineNodeResult } from "../bft/ByzantineNode";
import { ByzantineConsensusEngine, ByzantineConsensusResult } from "../bft/ByzantineConsensus";
import { TrustScoringEngine, TrustScore } from "../bft/TrustScoringEngine";
import { IClock } from "../ports/IInfra";

export interface NodeStatus {
  node: ByzantineNode;
  trust: number;
  lastSeen: number;
  healthy: boolean;
}

/**
 * NodeManager handles the lifecycle of certification nodes, applies trust scoring,
 * evicts unhealthy nodes, replaces them, and triggers re‑certification.
 */
export class NodeManager {
  private nodes: NodeStatus[] = [];
  private trustEngine: TrustScoringEngine;
  private consensusEngine: ByzantineConsensusEngine;

  constructor(private readonly clock: IClock, initialCount: number) {
    this.trustEngine = new TrustScoringEngine();
    this.consensusEngine = new ByzantineConsensusEngine();
    // initialise all nodes as honest ByzantineNode instances
    for (let i = 0; i < initialCount; i++) {
      const node = new ByzantineNode(`node-${i + 1}`, "honest");
      this.nodes.push({ node, trust: 1.0, lastSeen: this.clock.now(), healthy: true });
    }
  }

  /** Run a certification round on every node */
  runRound(): { results: ByzantineNodeResult[]; consensus: ByzantineConsensusResult } {
    const results = this.nodes.map((ns) => ns.node.run());

    // Update trust based on node behaviour (mode) using TrustScoringEngine
    const trustDetails: TrustScore[] = this.trustEngine.compute(results);
    this.nodes.forEach((ns, idx) => {
      ns.trust = trustDetails[idx]!.trust;
      ns.lastSeen = this.clock.now();
      ns.healthy = ns.trust > 0.2; // simple health threshold
    });

    const consensus = this.consensusEngine.compute(results);
    return { results, consensus };
  }

  /** Evict nodes whose trust drops below a threshold */
  evictUnhealthy(threshold = 0.2): number {
    const before = this.nodes.length;
    this.nodes = this.nodes.filter((ns) => ns.trust >= threshold);
    return before - this.nodes.length;
  }

  /** Add fresh honest nodes to replace evicted ones */
  addNewNodes(count: number) {
    const startIdx = this.nodes.length + 1;
    for (let i = 0; i < count; i++) {
      const node = new ByzantineNode(`node-${startIdx + i}`, "honest");
      this.nodes.push({ node, trust: 1.0, lastSeen: this.clock.now(), healthy: true });
    }
  }

  /** Full self‑healing cycle: evict, replace, then re‑run certification */
  healAndRecertify(): { evicted: number; round: ReturnType<NodeManager["runRound"]> } {
    const evicted = this.evictUnhealthy();
    if (evicted > 0) {
      this.addNewNodes(evicted);
    }
    const round = this.runRound();
    return { evicted, round };
  }

  /** Current node count */
  getNodeCount(): number {
    return this.nodes.length;
  }
}
