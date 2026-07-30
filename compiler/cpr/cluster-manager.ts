/**
 * Blueprint DSL CPR Cluster Manager
 * 
 * Manages cluster nodes and membership.
 */

export interface Node {
  id: string;
  address: string;
  port: number;
  status: NodeStatus;
  lastHeartbeat: number;
  metadata: Record<string, unknown>;
}

export enum NodeStatus {
  JOINING = 'JOINING',
  ACTIVE = 'ACTIVE',
  LEAVING = 'LEAVING',
  FAILED = 'FAILED',
}

export interface ClusterState {
  nodes: Map<string, Node>;
  leader: string | null;
  term: number;
}

export interface ClusterManagerOptions {
  heartbeatInterval?: number;
  failureTimeout?: number;
  maxNodes?: number;
}

export class ClusterManager {
  private state: ClusterState;
  private options: ClusterManagerOptions;
  private currentNodeId: string;
  private heartbeatTimer: NodeJS.Timeout | null = null;

  constructor(nodeId: string, options: ClusterManagerOptions = {}) {
    this.currentNodeId = nodeId;
    this.options = {
      heartbeatInterval: options.heartbeatInterval || 5000,
      failureTimeout: options.failureTimeout || 15000,
      maxNodes: options.maxNodes || 100,
    };

    this.state = {
      nodes: new Map(),
      leader: null,
      term: 0,
    };

    // Add current node
    this.addNode({
      id: nodeId,
      address: 'localhost',
      port: 0,
      status: NodeStatus.ACTIVE,
      lastHeartbeat: Date.now(),
      metadata: {},
    });
  }

  /**
   * Add node to cluster
   */
  public addNode(node: Node): void {
    if (this.state.nodes.size >= this.options.maxNodes!) {
      throw new Error('Maximum node count exceeded');
    }

    this.state.nodes.set(node.id, node);
  }

  /**
   * Remove node from cluster
   */
  public removeNode(nodeId: string): boolean {
    return this.state.nodes.delete(nodeId);
  }

  /**
   * Get node by id
   */
  public getNode(nodeId: string): Node | null {
    const node = this.state.nodes.get(nodeId);
    return node ? { ...node } : null;
  }

  /**
   * Get all nodes
   */
  public getAllNodes(): Node[] {
    return Array.from(this.state.nodes.values()).map(n => ({ ...n }));
  }

  /**
   * Get nodes by status
   */
  public getNodesByStatus(status: NodeStatus): Node[] {
    return Array.from(this.state.nodes.values())
      .filter(n => n.status === status)
      .map(n => ({ ...n }));
  }

  /**
   * Update node status
   */
  public updateNodeStatus(nodeId: string, status: NodeStatus): void {
    const node = this.state.nodes.get(nodeId);

    if (node) {
      node.status = status;
      node.lastHeartbeat = Date.now();
    }
  }

  /**
   * Send heartbeat
   */
  public sendHeartbeat(nodeId: string): void {
    const node = this.state.nodes.get(nodeId);

    if (node) {
      node.lastHeartbeat = Date.now();
    }
  }

  /**
   * Check for failed nodes
   */
  public checkFailedNodes(): string[] {
    const now = Date.now();
    const failed: string[] = [];

    for (const [nodeId, node] of this.state.nodes) {
      if (now - node.lastHeartbeat > this.options.failureTimeout!) {
        node.status = NodeStatus.FAILED;
        failed.push(nodeId);
      }
    }

    return failed;
  }

  /**
   * Get leader
   */
  public getLeader(): Node | null {
    if (!this.state.leader) {
      return null;
    }

    return this.getNode(this.state.leader);
  }

  /**
   * Set leader
   */
  public setLeader(nodeId: string): void {
    if (this.state.nodes.has(nodeId)) {
      this.state.leader = nodeId;
    }
  }

  /**
   * Get current term
   */
  public getTerm(): number {
    return this.state.term;
  }

  /**
   * Increment term
   */
  public incrementTerm(): void {
    this.state.term++;
  }

  /**
   * Get cluster state
   */
  public getState(): ClusterState {
    return {
      nodes: new Map(this.state.nodes),
      leader: this.state.leader,
      term: this.state.term,
    };
  }

  /**
   * Get current node id
   */
  public getCurrentNodeId(): string {
    return this.currentNodeId;
  }

  /**
   * Start heartbeat timer
   */
  public startHeartbeat(): void {
    if (this.heartbeatTimer) {
      return;
    }

    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat(this.currentNodeId);
      this.checkFailedNodes();
    }, this.options.heartbeatInterval);
  }

  /**
   * Stop heartbeat timer
   */
  public stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Validate cluster state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.state.leader && !this.state.nodes.has(this.state.leader)) {
      errors.push('Leader node does not exist');
    }

    for (const [nodeId, node] of this.state.nodes) {
      if (node.id !== nodeId) {
        errors.push(`Node ID mismatch at ${nodeId}`);
      }

      if (node.lastHeartbeat < 0) {
        errors.push(`Invalid last heartbeat in node ${nodeId}`);
      }

      if (node.port < 0 || node.port > 65535) {
        errors.push(`Invalid port in node ${nodeId}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    totalNodes: number;
    activeNodes: number;
    failedNodes: number;
    joiningNodes: number;
    leavingNodes: number;
    currentTerm: number;
    leader: string | null;
  } {
    const active = this.getNodesByStatus(NodeStatus.ACTIVE).length;
    const failed = this.getNodesByStatus(NodeStatus.FAILED).length;
    const joining = this.getNodesByStatus(NodeStatus.JOINING).length;
    const leaving = this.getNodesByStatus(NodeStatus.LEAVING).length;

    return {
      totalNodes: this.state.nodes.size,
      activeNodes: active,
      failedNodes: failed,
      joiningNodes: joining,
      leavingNodes: leaving,
      currentTerm: this.state.term,
      leader: this.state.leader,
    };
  }

  /**
   * Clear cluster state
   */
  public clear(): void {
    this.state.nodes.clear();
    this.state.leader = null;
    this.state.term = 0;
    this.stopHeartbeat();
  }
}
