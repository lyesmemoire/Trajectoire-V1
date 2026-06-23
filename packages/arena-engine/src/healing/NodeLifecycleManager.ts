type NodeState = "active" | "quarantined" | "retired";

export class NodeLifecycleManager {
  private nodes: Map<string, NodeState> = new Map();

  spawn(nodeId: string) {
    this.nodes.set(nodeId, "active");
  }

  quarantine(nodeId: string) {
    this.nodes.set(nodeId, "quarantined");
  }

  retire(nodeId: string) {
    this.nodes.set(nodeId, "retired");
  }

  getActiveNodes(): string[] {
    return [...this.nodes.entries()]
      .filter(([, state]) => state === "active")
      .map(([id]) => id);
  }
}
