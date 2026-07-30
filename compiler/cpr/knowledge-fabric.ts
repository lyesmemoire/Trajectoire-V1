/**
 * Blueprint DSL CPR Knowledge Fabric
 * 
 * Manages distributed knowledge graph and reasoning.
 */

export interface KnowledgeNode {
  id: string;
  type: NodeType;
  data: Record<string, unknown>;
  edges: string[];
  metadata: Record<string, unknown>;
  version: number;
}

export enum NodeType {
  FACT = 'FACT',
  RULE = 'RULE',
  CONCEPT = 'CONCEPT',
  ENTITY = 'ENTITY',
  RELATION = 'RELATION',
}

export interface KnowledgeQuery {
  type: QueryType;
  pattern: Record<string, unknown>;
  constraints: Record<string, unknown>;
}

export enum QueryType {
  FIND = 'FIND',
  MATCH = 'MATCH',
  TRAVERSE = 'TRAVERSE',
  REASON = 'REASON',
}

export interface KnowledgeStatistics {
  totalNodes: number;
  totalEdges: number;
  nodesByType: Map<NodeType, number>;
  averageDegree: number;
}

export class KnowledgeFabric {
  private nodes: Map<string, KnowledgeNode> = new Map();
  private nodeCounter: number = 0;

  /**
   * Add knowledge node
   */
  public addNode(type: NodeType, data: Record<string, unknown>, edges: string[] = []): KnowledgeNode {
    const node: KnowledgeNode = {
      id: `node_${this.nodeCounter++}`,
      type,
      data,
      edges: [...edges],
      metadata: {},
      version: 1,
    };

    this.nodes.set(node.id, node);
    return node;
  }

  /**
   * Get node by id
   */
  public getNode(id: string): KnowledgeNode | null {
    const node = this.nodes.get(id);
    return node ? { ...node, edges: [...node.edges] } : null;
  }

  /**
   * Get all nodes
   */
  public getAllNodes(): KnowledgeNode[] {
    return Array.from(this.nodes.values()).map(n => ({ ...n, edges: [...n.edges] }));
  }

  /**
   * Get nodes by type
   */
  public getNodesByType(type: NodeType): KnowledgeNode[] {
    return Array.from(this.nodes.values())
      .filter(n => n.type === type)
      .map(n => ({ ...n, edges: [...n.edges] }));
  }

  /**
   * Update node data
   */
  public updateNode(id: string, data: Record<string, unknown>): void {
    const node = this.nodes.get(id);

    if (node) {
      node.data = { ...node.data, ...data };
      node.version++;
    }
  }

  /**
   * Add edge between nodes
   */
  public addEdge(fromId: string, toId: string): void {
    const fromNode = this.nodes.get(fromId);

    if (fromNode && !fromNode.edges.includes(toId)) {
      fromNode.edges.push(toId);
      fromNode.version++;
    }
  }

  /**
   * Remove edge between nodes
   */
  public removeEdge(fromId: string, toId: string): void {
    const fromNode = this.nodes.get(fromId);

    if (fromNode) {
      fromNode.edges = fromNode.edges.filter(id => id !== toId);
      fromNode.version++;
    }
  }

  /**
   * Delete node
   */
  public deleteNode(id: string): boolean {
    // Remove edges from other nodes
    for (const node of this.nodes.values()) {
      node.edges = node.edges.filter(edgeId => edgeId !== id);
    }

    return this.nodes.delete(id);
  }

  /**
   * Execute query
   */
  public query(query: KnowledgeQuery): KnowledgeNode[] {
    const results: KnowledgeNode[] = [];

    switch (query.type) {
      case QueryType.FIND:
        return this.findNodes(query.pattern, query.constraints);

      case QueryType.MATCH:
        return this.matchNodes(query.pattern, query.constraints);

      case QueryType.TRAVERSE:
        return this.traverseNodes(query.pattern, query.constraints);

      case QueryType.REASON:
        return this.reasonNodes(query.pattern, query.constraints);

      default:
        return results;
    }
  }

  /**
   * Find nodes matching pattern
   */
  private findNodes(pattern: Record<string, unknown>, constraints: Record<string, unknown>): KnowledgeNode[] {
    return Array.from(this.nodes.values())
      .filter(node => this.matchesPattern(node, pattern))
      .filter(node => this.satisfiesConstraints(node, constraints))
      .map(n => ({ ...n, edges: [...n.edges] }));
  }

  /**
   * Match nodes with pattern
   */
  private matchNodes(pattern: Record<string, unknown>, constraints: Record<string, unknown>): KnowledgeNode[] {
    const results: KnowledgeNode[] = [];

    for (const node of this.nodes.values()) {
      if (this.matchesPattern(node, pattern) && this.satisfiesConstraints(node, constraints)) {
        results.push({ ...node, edges: [...node.edges] });

        // Also include connected nodes
        for (const edgeId of node.edges) {
          const edgeNode = this.nodes.get(edgeId);
          if (edgeNode) {
            results.push({ ...edgeNode, edges: [...edgeNode.edges] });
          }
        }
      }
    }

    return results;
  }

  /**
   * Traverse graph from pattern
   */
  private traverseNodes(pattern: Record<string, unknown>, constraints: Record<string, unknown>): KnowledgeNode[] {
    const startNodes = this.findNodes(pattern, constraints);
    const visited = new Set<string>();
    const results: KnowledgeNode[] = [];

    for (const startNode of startNodes) {
      this.traverseFromNode(startNode.id, visited, results);
    }

    return results;
  }

  /**
   * Traverse from node
   */
  private traverseFromNode(nodeId: string, visited: Set<string>, results: KnowledgeNode[]): void {
    if (visited.has(nodeId)) {
      return;
    }

    visited.add(nodeId);

    const node = this.nodes.get(nodeId);
    if (node) {
      results.push({ ...node, edges: [...node.edges] });

      for (const edgeId of node.edges) {
        this.traverseFromNode(edgeId, visited, results);
      }
    }
  }

  /**
   * Reason about nodes
   */
  private reasonNodes(pattern: Record<string, unknown>, constraints: Record<string, unknown>): KnowledgeNode[] {
    // Simple reasoning: find nodes and apply rules
    const nodes = this.findNodes(pattern, constraints);
    const rules = this.getNodesByType(NodeType.RULE);
    const results: KnowledgeNode[] = [];

    for (const node of nodes) {
      for (const rule of rules) {
        if (this.applyRule(rule, node)) {
          results.push({ ...node, edges: [...node.edges] });
        }
      }
    }

    return results;
  }

  /**
   * Check if node matches pattern
   */
  private matchesPattern(node: KnowledgeNode, pattern: Record<string, unknown>): boolean {
    for (const [key, value] of Object.entries(pattern)) {
      if (node.data[key] !== value) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if node satisfies constraints
   */
  private satisfiesConstraints(node: KnowledgeNode, constraints: Record<string, unknown>): boolean {
    for (const [key, constraint] of Object.entries(constraints)) {
      const nodeValue = node.data[key];

      if (typeof constraint === 'function') {
        if (!constraint(nodeValue)) {
          return false;
        }
      } else if (nodeValue !== constraint) {
        return false;
      }
    }
    return true;
  }

  /**
   * Apply rule to node
   */
  private applyRule(rule: KnowledgeNode, node: KnowledgeNode): boolean {
    // Simple rule application
    if (rule.data.condition && !this.matchesPattern(node, rule.data.condition)) {
      return false;
    }

    if (rule.data.action) {
      // Apply action (in real implementation, this would modify the node)
      return true;
    }

    return false;
  }

  /**
   * Clear all nodes
   */
  public clear(): void {
    this.nodes.clear();
    this.nodeCounter = 0;
  }

  /**
   * Get knowledge statistics
   */
  public getStatistics(): KnowledgeStatistics {
    const totalEdges = Array.from(this.nodes.values()).reduce((sum, n) => sum + n.edges.length, 0);
    const nodesByType = new Map<NodeType, number>();

    for (const node of this.nodes.values()) {
      const count = nodesByType.get(node.type) || 0;
      nodesByType.set(node.type, count + 1);
    }

    const averageDegree = this.nodes.size > 0 ? totalEdges / this.nodes.size : 0;

    return {
      totalNodes: this.nodes.size,
      totalEdges,
      nodesByType,
      averageDegree,
    };
  }

  /**
   * Validate knowledge fabric state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, node] of this.nodes) {
      if (node.id !== id) {
        errors.push(`Node ID mismatch at ${id}`);
      }

      for (const edgeId of node.edges) {
        if (!this.nodes.has(edgeId)) {
          errors.push(`Node ${id} references non-existent edge ${edgeId}`);
        }
      }

      if (node.version < 0) {
        errors.push(`Invalid version in node ${id}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Export knowledge graph to JSON
   */
  public export(): string {
    const data = Array.from(this.nodes.values());
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import knowledge graph from JSON
   */
  public import(json: string): void {
    const data = JSON.parse(json) as KnowledgeNode[];

    for (const node of data) {
      this.nodes.set(node.id, node);
      this.nodeCounter = Math.max(this.nodeCounter, parseInt(node.id.split('_')[1]) + 1);
    }
  }
}
