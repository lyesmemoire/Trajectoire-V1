import { NodeHealth } from "./types";
import { FaultGovernor } from "../../observability/FaultGovernor";
import { IClock } from "../../ports/IInfra";

export class NodePruner {
  constructor(
    private readonly clock: IClock,
    private ttlMs: number = 30000,
    private faultGovernor: FaultGovernor
  ) {}

  /**
   * Remove stale nodes from the health array and clear their overlay state.
   */
  public prune(nodes: NodeHealth[]): NodeHealth[] {
    const now = this.clock.now();
    const activeNodes: NodeHealth[] = [];

    for (const node of nodes) {
      if (now - node.lastSeen <= this.ttlMs) {
        activeNodes.push(node);
      } else {
        console.info(`[NodePruner] Removing stale node: ${node.nodeId} (last seen ${now - node.lastSeen}ms ago)`);
        // Remove associated overlay state to prevent phantom faults
        this.faultGovernor.clear(node.nodeId);
      }
    }

    return activeNodes;
  }
}
