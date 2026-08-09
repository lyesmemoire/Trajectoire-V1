/**
 * Knowledge Graph RH Runtime v2
 * Graph Analytics Service
 * Provides comprehensive analytics for knowledge graphs
 */

import { Graph, Node, Edge, NodeType, EdgeType } from './graph-types';

export interface CoverageMetrics {
  totalNodes: number;
  totalEdges: number;
  nodeTypes: Record<NodeType, number>;
  edgeTypes: Record<EdgeType, number>;
  coverage: number; // edges / possible edges
}

export interface DensityMetrics {
  overallDensity: number;
  directedDensity: number;
  avgDegree: number;
  maxDegree: number;
  minDegree: number;
}

export interface DegreeMetrics {
  nodeId: string;
  inDegree: number;
  outDegree: number;
  totalDegree: number;
  weightedInDegree: number;
  weightedOutDegree: number;
}

export interface CentralityMetrics {
  nodeId: string;
  degreeCentrality: number;
  betweennessCentrality: number;
  closenessCentrality: number;
  eigenvectorCentrality: number;
  pageRank: number;
}

export interface ConnectedComponent {
  id: string;
  nodes: Node[];
  edges: Edge[];
  size: number;
  isGiant: boolean;
}

export interface CommunityMetrics {
  id: string;
  nodes: Node[];
  edges: Edge[];
  size: number;
  density: number;
  modularity: number;
  dominantNodeType: NodeType;
}

export interface DominantEntity {
  node: Node;
  frequency: number;
  influence: number;
  connections: number;
}

export interface GraphStatistics {
  nodeCount: number;
  edgeCount: number;
  avgNodeConfidence: number;
  avgEdgeConfidence: number;
  avgEdgeWeight: number;
  isolatedNodes: number;
  selfLoops: number;
  parallelEdges: number;
}

export class GraphAnalyticsService {
  constructor(private readonly graph: Graph) {}

  // ============================================================================
  // COVERAGE METRICS
  // ============================================================================

  /**
   * Calculate coverage metrics for the graph
   */
  calculateCoverage(): CoverageMetrics {
    const totalNodes = this.graph.nodes.size;
    const totalEdges = this.graph.edges.size;

    const nodeTypes: Record<NodeType, number> = {} as any;
    const edgeTypes: Record<EdgeType, number> = {} as any;

    for (const node of this.graph.nodes.values()) {
      nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
    }

    for (const edge of this.graph.edges.values()) {
      edgeTypes[edge.type] = (edgeTypes[edge.type] || 0) + 1;
    }

    // Coverage = actual edges / possible edges
    const possibleEdges = totalNodes * (totalNodes - 1);
    const coverage = possibleEdges > 0 ? totalEdges / possibleEdges : 0;

    return {
      totalNodes,
      totalEdges,
      nodeTypes,
      edgeTypes,
      coverage,
    };
  }

  // ============================================================================
  // DENSITY METRICS
  // ============================================================================

  /**
   * Calculate density metrics for the graph
   */
  calculateDensity(): DensityMetrics {
    const totalNodes = this.graph.nodes.size;
    const totalEdges = this.graph.edges.size;

    if (totalNodes < 2) {
      return {
        overallDensity: 0,
        directedDensity: 0,
        avgDegree: 0,
        maxDegree: 0,
        minDegree: 0,
      };
    }

    // Overall density (undirected)
    const maxPossibleEdges = (totalNodes * (totalNodes - 1)) / 2;
    const overallDensity = totalEdges / maxPossibleEdges;

    // Directed density
    const directedMaxPossibleEdges = totalNodes * (totalNodes - 1);
    const directedDensity = totalEdges / directedMaxPossibleEdges;

    // Degree calculations
    const degrees = this.calculateAllDegrees();
    const avgDegree =
      degrees.reduce((sum, d) => sum + d.totalDegree, 0) / degrees.length;
    const maxDegree = Math.max(...degrees.map((d) => d.totalDegree));
    const minDegree = Math.min(...degrees.map((d) => d.totalDegree));

    return {
      overallDensity,
      directedDensity,
      avgDegree,
      maxDegree,
      minDegree,
    };
  }

  // ============================================================================
  // DEGREE METRICS
  // ============================================================================

  /**
   * Calculate degree metrics for all nodes
   */
  calculateAllDegrees(): DegreeMetrics[] {
    const metrics: DegreeMetrics[] = [];

    for (const [nodeId, node] of this.graph.nodes) {
      metrics.push(this.calculateNodeDegree(nodeId));
    }

    return metrics;
  }

  /**
   * Calculate degree metrics for a specific node
   */
  calculateNodeDegree(nodeId: string): DegreeMetrics {
    const inDegree = this.getInDegree(nodeId);
    const outDegree = this.getOutDegree(nodeId);
    const weightedInDegree = this.getWeightedInDegree(nodeId);
    const weightedOutDegree = this.getWeightedOutDegree(nodeId);

    return {
      nodeId,
      inDegree,
      outDegree,
      totalDegree: inDegree + outDegree,
      weightedInDegree,
      weightedOutDegree,
    };
  }

  private getInDegree(nodeId: string): number {
    let count = 0;
    for (const edge of this.graph.edges.values()) {
      if (edge.targetNode === nodeId) count++;
    }
    return count;
  }

  private getOutDegree(nodeId: string): number {
    let count = 0;
    for (const edge of this.graph.edges.values()) {
      if (edge.sourceNode === nodeId) count++;
    }
    return count;
  }

  private getWeightedInDegree(nodeId: string): number {
    let total = 0;
    for (const edge of this.graph.edges.values()) {
      if (edge.targetNode === nodeId) total += edge.weight;
    }
    return total;
  }

  private getWeightedOutDegree(nodeId: string): number {
    let total = 0;
    for (const edge of this.graph.edges.values()) {
      if (edge.sourceNode === nodeId) total += edge.weight;
    }
    return total;
  }

  // ============================================================================
  // CENTRALITY METRICS
  // ============================================================================

  /**
   * Calculate centrality metrics for all nodes
   */
  calculateAllCentrality(): CentralityMetrics[] {
    const metrics: CentralityMetrics[] = [];
    const nodeIds = Array.from(this.graph.nodes.keys());

    for (const nodeId of nodeIds) {
      metrics.push(this.calculateNodeCentrality(nodeId));
    }

    return metrics;
  }

  /**
   * Calculate centrality metrics for a specific node
   */
  calculateNodeCentrality(nodeId: string): CentralityMetrics {
    const degree = this.calculateNodeDegree(nodeId);
    const totalNodes = this.graph.nodes.size;

    // Degree centrality
    const degreeCentrality =
      totalNodes > 1 ? degree.totalDegree / (totalNodes - 1) : 0;

    // Betweenness centrality (simplified)
    const betweennessCentrality = this.calculateBetweennessCentrality(nodeId);

    // Closeness centrality
    const closenessCentrality = this.calculateClosenessCentrality(nodeId);

    // Eigenvector centrality (simplified using power iteration)
    const eigenvectorCentrality = this.calculateEigenvectorCentrality(nodeId);

    // PageRank (simplified)
    const pageRank = this.calculatePageRank(nodeId);

    return {
      nodeId,
      degreeCentrality,
      betweennessCentrality,
      closenessCentrality,
      eigenvectorCentrality,
      pageRank,
    };
  }

  private calculateBetweennessCentrality(nodeId: string): number {
    // Simplified betweenness centrality
    // Count shortest paths that pass through this node
    let count = 0;
    const nodeIds = Array.from(this.graph.nodes.keys());

    for (const sourceId of nodeIds) {
      if (sourceId === nodeId) continue;
      for (const targetId of nodeIds) {
        if (targetId === nodeId || targetId === sourceId) continue;
        if (this.shortestPathPassesThrough(sourceId, targetId, nodeId)) {
          count++;
        }
      }
    }

    const totalPairs =
      (nodeIds.length * (nodeIds.length - 1) * (nodeIds.length - 2)) / 6;
    return totalPairs > 0 ? count / totalPairs : 0;
  }

  private shortestPathPassesThrough(
    sourceId: string,
    targetId: string,
    nodeId: string,
  ): boolean {
    // BFS to find shortest path
    const queue: string[] = [sourceId];
    const visited = new Set<string>([sourceId]);
    const parent = new Map<string, string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === targetId) break;

      for (const edge of this.graph.edges.values()) {
        if (edge.sourceNode === current && !visited.has(edge.targetNode)) {
          visited.add(edge.targetNode);
          parent.set(edge.targetNode, current);
          queue.push(edge.targetNode);
        }
      }
    }

    // Reconstruct path
    const path: string[] = [];
    let current = targetId;
    while (current !== sourceId) {
      path.unshift(current);
      current = parent.get(current)!;
      if (!current) return false;
    }
    path.unshift(sourceId);

    return path.includes(nodeId);
  }

  private calculateClosenessCentrality(nodeId: string): number {
    const distances = this.calculateShortestPathDistances(nodeId);
    const totalDistance = Object.values(distances).reduce(
      (sum, d) => sum + d,
      0,
    );
    const reachableNodes = Object.keys(distances).length;

    if (reachableNodes <= 1 || totalDistance === 0) return 0;
    return (reachableNodes - 1) / totalDistance;
  }

  private calculateShortestPathDistances(
    nodeId: string,
  ): Record<string, number> {
    const distances: Record<string, number> = {};
    const queue: Array<{ nodeId: string; distance: number }> = [
      { nodeId, distance: 0 },
    ];
    const visited = new Set<string>([nodeId]);

    while (queue.length > 0) {
      const { nodeId: current, distance } = queue.shift()!;
      distances[current] = distance;

      for (const edge of this.graph.edges.values()) {
        if (edge.sourceNode === current && !visited.has(edge.targetNode)) {
          visited.add(edge.targetNode);
          queue.push({ nodeId: edge.targetNode, distance: distance + 1 });
        }
      }
    }

    return distances;
  }

  private calculateEigenvectorCentrality(nodeId: string): number {
    // Simplified eigenvector centrality using power iteration
    const maxIterations = 100;
    const tolerance = 1e-6;

    let centrality = new Map<string, number>();
    for (const id of this.graph.nodes.keys()) {
      centrality.set(id, 1);
    }

    for (let i = 0; i < maxIterations; i++) {
      const newCentrality = new Map<string, number>();

      for (const [id, node] of this.graph.nodes) {
        let sum = 0;
        for (const edge of this.graph.edges.values()) {
          if (edge.targetNode === id) {
            sum += (centrality.get(edge.sourceNode) || 0) * edge.weight;
          }
        }
        newCentrality.set(id, sum);
      }

      // Normalize
      const norm = Math.sqrt(
        [...newCentrality.values()].reduce((sum, v) => sum + v * v, 0),
      );
      if (norm > 0) {
        for (const id of newCentrality.keys()) {
          newCentrality.set(id, newCentrality.get(id)! / norm);
        }
      }

      // Check convergence
      let maxDiff = 0;
      for (const id of centrality.keys()) {
        const diff = Math.abs(
          (newCentrality.get(id) || 0) - (centrality.get(id) || 0),
        );
        if (diff > maxDiff) maxDiff = diff;
      }

      centrality = newCentrality;
      if (maxDiff < tolerance) break;
    }

    return centrality.get(nodeId) || 0;
  }

  private calculatePageRank(nodeId: string): number {
    // Simplified PageRank
    const dampingFactor = 0.85;
    const maxIterations = 100;
    const tolerance = 1e-6;

    const n = this.graph.nodes.size;
    let pageRank = new Map<string, number>();
    for (const id of this.graph.nodes.keys()) {
      pageRank.set(id, 1 / n);
    }

    for (let i = 0; i < maxIterations; i++) {
      const newPageRank = new Map<string, number>();

      for (const [id, node] of this.graph.nodes) {
        let sum = 0;
        for (const edge of this.graph.edges.values()) {
          if (edge.targetNode === id) {
            const sourceOutDegree = this.getOutDegree(edge.sourceNode);
            if (sourceOutDegree > 0) {
              sum += (pageRank.get(edge.sourceNode) || 0) / sourceOutDegree;
            }
          }
        }
        newPageRank.set(id, (1 - dampingFactor) / n + dampingFactor * sum);
      }

      // Check convergence
      let maxDiff = 0;
      for (const id of pageRank.keys()) {
        const diff = Math.abs(
          (newPageRank.get(id) || 0) - (pageRank.get(id) || 0),
        );
        if (diff > maxDiff) maxDiff = diff;
      }

      pageRank = newPageRank;
      if (maxDiff < tolerance) break;
    }

    return pageRank.get(nodeId) || 0;
  }

  // ============================================================================
  // CONNECTED COMPONENTS
  // ============================================================================

  /**
   * Find all connected components in the graph
   */
  findConnectedComponents(): ConnectedComponent[] {
    const visited = new Set<string>();
    const components: ConnectedComponent[] = [];

    for (const [nodeId, node] of this.graph.nodes) {
      if (visited.has(nodeId)) continue;

      const component = this.bfsComponent(nodeId, visited);
      components.push(component);
    }

    // Identify giant component (largest)
    const maxSize = Math.max(...components.map((c) => c.size));
    components.forEach((c) => {
      c.isGiant = c.size === maxSize;
    });

    return components.sort((a, b) => b.size - a.size);
  }

  private bfsComponent(
    startNodeId: string,
    visited: Set<string>,
  ): ConnectedComponent {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeIds = new Set<string>();
    const queue: string[] = [startNodeId];

    visited.add(startNodeId);
    nodeIds.add(startNodeId);

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const node = this.graph.nodes.get(nodeId);
      if (node) nodes.push(node);

      for (const edge of this.graph.edges.values()) {
        if (edge.sourceNode === nodeId && !visited.has(edge.targetNode)) {
          visited.add(edge.targetNode);
          nodeIds.add(edge.targetNode);
          queue.push(edge.targetNode);
        }
        if (edge.targetNode === nodeId && !visited.has(edge.sourceNode)) {
          visited.add(edge.sourceNode);
          nodeIds.add(edge.sourceNode);
          queue.push(edge.sourceNode);
        }
        if (nodeIds.has(edge.sourceNode) && nodeIds.has(edge.targetNode)) {
          edges.push(edge);
        }
      }
    }

    return {
      id: `component-${nodes[0]?.id || 'unknown'}`,
      nodes,
      edges,
      size: nodes.length,
      isGiant: false,
    };
  }

  // ============================================================================
  // COMMUNITIES
  // ============================================================================

  /**
   * Find communities using label propagation
   */
  findCommunities(): CommunityMetrics[] {
    const communities = new Map<string, string>();
    const nodeIds = Array.from(this.graph.nodes.keys());

    // Initialize each node with its own community
    for (const nodeId of nodeIds) {
      communities.set(nodeId, nodeId);
    }

    // Label propagation
    let changed = true;
    let iterations = 0;
    const maxIterations = 10;

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      // Shuffle nodes for random order
      const shuffled = [...nodeIds].sort(() => Math.random() - 0.5);

      for (const nodeId of shuffled) {
        const neighborCommunities = this.getNeighborCommunities(
          nodeId,
          communities,
        );
        if (neighborCommunities.length === 0) continue;

        // Find most common community
        const counts = new Map<string, number>();
        for (const comm of neighborCommunities) {
          counts.set(comm, (counts.get(comm) || 0) + 1);
        }

        const maxCount = Math.max(...counts.values());
        const bestCommunities = [...counts.entries()]
          .filter(([_, count]) => count === maxCount)
          .map(([comm, _]) => comm);

        if (bestCommunities.length === 0) continue;

        const newCommunity =
          bestCommunities[Math.floor(Math.random() * bestCommunities.length)]!;
        const currentCommunity = communities.get(nodeId);

        if (
          currentCommunity !== undefined &&
          newCommunity !== currentCommunity
        ) {
          communities.set(nodeId, newCommunity);
          changed = true;
        }
      }
    }

    // Group nodes by community
    const communityGroups = new Map<string, Node[]>();
    for (const [nodeId, communityId] of communities) {
      const node = this.graph.nodes.get(nodeId);
      if (node !== undefined) {
        if (!communityGroups.has(communityId)) {
          communityGroups.set(communityId, []);
        }
        communityGroups.get(communityId)!.push(node);
      }
    }

    // Calculate metrics for each community
    const results: CommunityMetrics[] = [];
    for (const [communityId, nodes] of communityGroups) {
      if (nodes.length < 2) continue;

      const communityEdges = this.getCommunityEdges(nodes);
      const density = this.calculateCommunityDensity(nodes, communityEdges);
      const modularity = this.calculateCommunityModularity(
        nodes,
        communityEdges,
      );
      const dominantNodeType = this.findDominantNodeType(nodes);

      results.push({
        id: communityId,
        nodes,
        edges: communityEdges,
        size: nodes.length,
        density,
        modularity,
        dominantNodeType,
      });
    }

    return results.sort((a, b) => b.size - a.size);
  }

  private getNeighborCommunities(
    nodeId: string,
    communities: Map<string, string>,
  ): string[] {
    const neighborCommunities: string[] = [];

    for (const edge of this.graph.edges.values()) {
      if (edge.sourceNode === nodeId) {
        const comm = communities.get(edge.targetNode);
        if (comm) neighborCommunities.push(comm);
      }
      if (edge.targetNode === nodeId) {
        const comm = communities.get(edge.sourceNode);
        if (comm) neighborCommunities.push(comm);
      }
    }

    return neighborCommunities;
  }

  private getCommunityEdges(nodes: Node[]): Edge[] {
    const nodeIds = new Set(nodes.map((n) => n.id));
    const communityEdges: Edge[] = [];

    for (const edge of this.graph.edges.values()) {
      if (nodeIds.has(edge.sourceNode) && nodeIds.has(edge.targetNode)) {
        communityEdges.push(edge);
      }
    }

    return communityEdges;
  }

  private calculateCommunityDensity(nodes: Node[], edges: Edge[]): number {
    const n = nodes.length;
    if (n < 2) return 0;
    const maxEdges = (n * (n - 1)) / 2;
    return edges.length / maxEdges;
  }

  private calculateCommunityModularity(nodes: Node[], edges: Edge[]): number {
    const totalEdges = this.graph.edges.size;
    if (totalEdges === 0) return 0;

    const nodeIds = new Set(nodes.map((n) => n.id));
    let internalEdges = 0;

    for (const edge of edges) {
      if (nodeIds.has(edge.sourceNode) && nodeIds.has(edge.targetNode)) {
        internalEdges += edge.weight;
      }
    }

    return internalEdges / totalEdges;
  }

  private findDominantNodeType(nodes: Node[]): NodeType {
    const counts = new Map<NodeType, number>();
    for (const node of nodes) {
      counts.set(node.type, (counts.get(node.type) || 0) + 1);
    }

    let maxCount = 0;
    let dominantType = NodeType.CANDIDATE;

    for (const [type, count] of counts) {
      if (count > maxCount) {
        maxCount = count;
        dominantType = type;
      }
    }

    return dominantType;
  }

  // ============================================================================
  // DOMINANT SKILLS
  // ============================================================================

  /**
   * Find dominant skills in the graph
   */
  findDominantSkills(limit = 10): DominantEntity[] {
    const skillNodes = Array.from(this.graph.nodes.values()).filter(
      (n) => n.type === NodeType.SKILL,
    );
    const results: DominantEntity[] = [];

    for (const skill of skillNodes) {
      const degree = this.calculateNodeDegree(skill.id);
      const centrality = this.calculateNodeCentrality(skill.id);

      results.push({
        node: skill,
        frequency: degree.totalDegree,
        influence: centrality.pageRank,
        connections: degree.totalDegree,
      });
    }

    return results.sort((a, b) => b.influence - a.influence).slice(0, limit);
  }

  // ============================================================================
  // DOMINANT COMPANIES
  // ============================================================================

  /**
   * Find dominant companies in the graph
   */
  findDominantCompanies(limit = 10): DominantEntity[] {
    const companyNodes = Array.from(this.graph.nodes.values()).filter(
      (n) => n.type === NodeType.COMPANY,
    );
    const results: DominantEntity[] = [];

    for (const company of companyNodes) {
      const degree = this.calculateNodeDegree(company.id);
      const centrality = this.calculateNodeCentrality(company.id);

      results.push({
        node: company,
        frequency: degree.totalDegree,
        influence: centrality.pageRank,
        connections: degree.totalDegree,
      });
    }

    return results.sort((a, b) => b.influence - a.influence).slice(0, limit);
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  /**
   * Calculate overall graph statistics
   */
  calculateStatistics(): GraphStatistics {
    const nodeCount = this.graph.nodes.size;
    const edgeCount = this.graph.edges.size;

    let totalNodeConfidence = 0;
    let totalEdgeConfidence = 0;
    let totalEdgeWeight = 0;
    let isolatedNodes = 0;
    let selfLoops = 0;
    const edgePairs = new Set<string>();

    for (const node of this.graph.nodes.values()) {
      totalNodeConfidence += node.confidence;
      const degree = this.calculateNodeDegree(node.id);
      if (degree.totalDegree === 0) isolatedNodes++;
    }

    for (const edge of this.graph.edges.values()) {
      totalEdgeConfidence += edge.confidence;
      totalEdgeWeight += edge.weight;

      if (edge.sourceNode === edge.targetNode) selfLoops++;

      const pairKey = `${edge.sourceNode}-${edge.targetNode}`;
      if (edgePairs.has(pairKey)) {
        // Count parallel edges (simplified)
      }
      edgePairs.add(pairKey);
    }

    const avgNodeConfidence =
      nodeCount > 0 ? totalNodeConfidence / nodeCount : 0;
    const avgEdgeConfidence =
      edgeCount > 0 ? totalEdgeConfidence / edgeCount : 0;
    const avgEdgeWeight = edgeCount > 0 ? totalEdgeWeight / edgeCount : 0;

    return {
      nodeCount,
      edgeCount,
      avgNodeConfidence,
      avgEdgeConfidence,
      avgEdgeWeight,
      isolatedNodes,
      selfLoops,
      parallelEdges: edgePairs.size - edgeCount,
    };
  }
}
