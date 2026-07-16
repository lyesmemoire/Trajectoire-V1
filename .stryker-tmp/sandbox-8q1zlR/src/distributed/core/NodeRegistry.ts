// @ts-nocheck
// src/distributed/core/NodeRegistry.ts

import { NodeStatus } from "./types";

/**
 * Simple in‑memory registry tracking node metadata.
 * In a real system this could be backed by a KV store or service discovery.
 */
export class NodeRegistry {
  private nodes: Map<string, NodeStatus> = new Map();

  /** Register a new node or update an existing entry */
  registerNode(status: NodeStatus) {
    this.nodes.set(status.nodeId, status);
  }

  /** Retrieve the status object for a given node id */
  getNode(nodeId: string): NodeStatus | undefined {
    return this.nodes.get(nodeId);
  }

  /** Return all registered node statuses */
  getAllNodes(): NodeStatus[] {
    return Array.from(this.nodes.values());
  }

  /** Update the load metric for a node */
  setLoad(nodeId: string, load: number) {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.load = load;
    }
  }
}
