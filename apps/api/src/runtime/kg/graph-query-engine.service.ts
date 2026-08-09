/**
 * Knowledge Graph RH Runtime v2
 * Graph Query Engine
 * Provides high-level query methods for the knowledge graph
 */

import {
  Graph,
  Node,
  Edge,
  NodeType,
  EdgeType,
  NodeIndex,
  EdgeIndex,
  TraversalDirection,
} from './graph-types';

export interface QueryOptions {
  maxDepth?: number;
  minConfidence?: number;
  minWeight?: number;
  limit?: number;
}

export interface PathResult {
  path: Node[];
  edges: Edge[];
  totalWeight: number;
  totalConfidence: number;
}

export interface NeighborResult {
  node: Node;
  edge: Edge;
  distance: number;
}

export interface ClusterResult {
  id: string;
  nodes: Node[];
  centroid: Node;
  size: number;
}

export interface CommunityResult {
  id: string;
  nodes: Node[];
  edges: Edge[];
  density: number;
  modularity: number;
}

export class GraphQueryEngine {
  constructor(private readonly graph: Graph = { id: '', nodes: new Map(), edges: new Map(), metadata: { version: '1.0', createdAt: new Date(), updatedAt: new Date(), source: 'default' } }) {
    this.nodeIndex = new NodeIndex();
    this.edgeIndex = new EdgeIndex();
    this.indexGraph();
  }

  private readonly nodeIndex: NodeIndex;
  private readonly edgeIndex: EdgeIndex;

  private indexGraph(): void {
    this.graph.nodes.forEach((node) => this.nodeIndex.add(node));
    this.graph.edges.forEach((edge) => this.edgeIndex.add(edge));
  }

  /**
   * Find a skill by name or normalized label
   */
  findSkill(skillName: string, options: QueryOptions = {}): Node[] {
    const normalizedSkill = skillName.toLowerCase().trim();
    const minConfidence = options.minConfidence ?? 0;

    const skills = this.nodeIndex.getByType(NodeType.SKILL);
    return skills
      .filter((skill) => {
        if (skill.confidence < minConfidence) return false;
        return (
          skill.label.toLowerCase().includes(normalizedSkill) ||
          skill.normalizedLabel.toLowerCase().includes(normalizedSkill)
        );
      })
      .slice(0, options.limit ?? 50);
  }

  /**
   * Find a company by name or normalized label
   */
  findCompany(companyName: string, options: QueryOptions = {}): Node[] {
    const normalizedCompany = companyName.toLowerCase().trim();
    const minConfidence = options.minConfidence ?? 0;

    const companies = this.nodeIndex.getByType(NodeType.COMPANY);
    return companies
      .filter((company) => {
        if (company.confidence < minConfidence) return false;
        return (
          company.label.toLowerCase().includes(normalizedCompany) ||
          company.normalizedLabel.toLowerCase().includes(normalizedCompany)
        );
      })
      .slice(0, options.limit ?? 50);
  }

  /**
   * Find a candidate by name or email
   */
  findCandidate(identifier: string, options: QueryOptions = {}): Node[] {
    const normalizedIdentifier = identifier.toLowerCase().trim();
    const minConfidence = options.minConfidence ?? 0;

    const candidates = this.nodeIndex.getByType(NodeType.CANDIDATE);
    return candidates
      .filter((candidate) => {
        if (candidate.confidence < minConfidence) return false;
        const nameMatch = candidate.label
          .toLowerCase()
          .includes(normalizedIdentifier);
        const email = candidate.metadata.email as string | undefined;
        const emailMatch = email?.toLowerCase().includes(normalizedIdentifier);
        return nameMatch || emailMatch;
      })
      .slice(0, options.limit ?? 50);
  }

  /**
   * Find shortest path between two nodes using BFS
   */
  findShortestPath(
    sourceNodeId: string,
    targetNodeId: string,
    options: QueryOptions = {},
  ): PathResult | null {
    const sourceNode = this.nodeIndex.getById(sourceNodeId);
    const targetNode = this.nodeIndex.getById(targetNodeId);

    if (!sourceNode || !targetNode) {
      return null;
    }

    const minWeight = options.minWeight ?? 0;
    const maxDepth = options.maxDepth ?? 10;

    // BFS to find shortest path
    const queue: Array<{
      nodeId: string;
      path: Node[];
      edges: Edge[];
      totalWeight: number;
      totalConfidence: number;
    }> = [
      {
        nodeId: sourceNodeId,
        path: [sourceNode],
        edges: [],
        totalWeight: 0,
        totalConfidence: 0,
      },
    ];
    const visited = new Set<string>([sourceNodeId]);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.nodeId === targetNodeId) {
        return {
          path: current.path,
          edges: current.edges,
          totalWeight: current.totalWeight / (current.edges.length || 1),
          totalConfidence:
            current.totalConfidence / (current.edges.length || 1),
        };
      }

      if (current.path.length >= maxDepth) {
        continue;
      }

      const outgoingEdges = this.edgeIndex.getBySource(current.nodeId);
      for (const edge of outgoingEdges) {
        if (edge.weight < minWeight) continue;
        if (visited.has(edge.targetNode)) continue;

        const nextNode = this.nodeIndex.getById(edge.targetNode);
        if (!nextNode) continue;

        visited.add(edge.targetNode);
        queue.push({
          nodeId: edge.targetNode,
          path: [...current.path, nextNode],
          edges: [...current.edges, edge],
          totalWeight: current.totalWeight + edge.weight,
          totalConfidence: current.totalConfidence + edge.confidence,
        });
      }
    }

    return null;
  }

  /**
   * Find neighbors of a node within a certain depth
   */
  findNeighbors(nodeId: string, options: QueryOptions = {}): NeighborResult[] {
    const node = this.nodeIndex.getById(nodeId);
    if (!node) return [];

    const maxDepth = options.maxDepth ?? 1;
    const minWeight = options.minWeight ?? 0;
    const minConfidence = options.minConfidence ?? 0;

    const neighbors: NeighborResult[] = [];
    const visited = new Set<string>([nodeId]);
    const queue: Array<{ nodeId: string; distance: number }> = [
      { nodeId, distance: 0 },
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.distance >= maxDepth) continue;

      const outgoingEdges = this.edgeIndex.getBySource(current.nodeId);
      for (const edge of outgoingEdges) {
        if (edge.weight < minWeight || edge.confidence < minConfidence)
          continue;
        if (visited.has(edge.targetNode)) continue;

        const neighborNode = this.nodeIndex.getById(edge.targetNode);
        if (!neighborNode) continue;

        visited.add(edge.targetNode);
        neighbors.push({
          node: neighborNode,
          edge,
          distance: current.distance + 1,
        });

        queue.push({
          nodeId: edge.targetNode,
          distance: current.distance + 1,
        });
      }
    }

    return neighbors.slice(0, options.limit ?? 100);
  }

  /**
   * Find clusters of similar nodes using connected components
   */
  findClusters(options: QueryOptions = {}): ClusterResult[] {
    const minConfidence = options.minConfidence ?? 0;
    const minWeight = options.minWeight ?? 0;

    const visited = new Set<string>();
    const clusters: ClusterResult[] = [];

    for (const [nodeId, node] of this.graph.nodes) {
      if (visited.has(nodeId) || node.confidence < minConfidence) continue;

      const clusterNodes = this.bfsCluster(nodeId, minWeight, visited);
      if (clusterNodes.length > 1) {
        const centroid = this.findCentroid(clusterNodes);
        clusters.push({
          id: `cluster-${clusters.length}`,
          nodes: clusterNodes,
          centroid,
          size: clusterNodes.length,
        });
      }
    }

    return clusters
      .sort((a, b) => b.size - a.size)
      .slice(0, options.limit ?? 50);
  }

  /**
   * Find communities using label propagation algorithm
   */
  findCommunities(options: QueryOptions = {}): CommunityResult[] {
    const minWeight = options.minWeight ?? 0;
    const minConfidence = options.minConfidence ?? 0;

    // Initialize each node with its own community
    const communities = new Map<string, string>();
    for (const [nodeId, node] of this.graph.nodes) {
      if (node.confidence >= minConfidence) {
        communities.set(nodeId, nodeId);
      }
    }

    // Label propagation iterations
    let changed = true;
    let iterations = 0;
    const maxIterations = 10;

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      for (const [nodeId, node] of this.graph.nodes) {
        if (node.confidence < minConfidence) continue;

        const neighbors = this.getNeighborCommunities(
          nodeId,
          communities,
          minWeight,
        );
        if (neighbors.length === 0) continue;

        // Find most common community among neighbors
        const communityCounts = new Map<string, number>();
        for (const community of neighbors) {
          communityCounts.set(
            community,
            (communityCounts.get(community) || 0) + 1,
          );
        }

        const maxCount = Math.max(...communityCounts.values());
        const bestCommunities = [...communityCounts.entries()]
          .filter(([_, count]) => count === maxCount)
          .map(([comm, _]) => comm);

        // Randomly select one of the best communities
        const newCommunity =
          bestCommunities[Math.floor(Math.random() * bestCommunities.length)];

        const currentCommunity = communities.get(nodeId);
        if (
          currentCommunity !== undefined &&
          newCommunity !== currentCommunity
        ) {
          communities.set(nodeId, newCommunity!);
          changed = true;
        }
      }
    }

    // Group nodes by community
    const communityGroups = new Map<string, Node[]>();
    for (const [nodeId, communityId] of communities) {
      const node = this.nodeIndex.getById(nodeId);
      if (node !== undefined) {
        if (!communityGroups.has(communityId)) {
          communityGroups.set(communityId, []);
        }
        communityGroups.get(communityId)!.push(node);
      }
    }

    // Calculate community metrics
    const results: CommunityResult[] = [];
    for (const [communityId, nodes] of communityGroups) {
      if (nodes.length < 2) continue;

      const communityEdges = this.getCommunityEdges(nodes);
      const density = this.calculateDensity(nodes, communityEdges);
      const modularity = this.calculateModularity(nodes, communityEdges);

      results.push({
        id: communityId,
        nodes,
        edges: communityEdges,
        density,
        modularity,
      });
    }

    return results
      .sort((a, b) => b.nodes.length - a.nodes.length)
      .slice(0, options.limit ?? 50);
  }

  /**
   * Find transferable skills based on skill similarity and co-occurrence
   */
  findTransferableSkills(
    skillName: string,
    options: QueryOptions = {},
  ): Array<{ skill: Node; transferability: number; paths: PathResult[] }> {
    const skills = this.findSkill(skillName, options);
    if (skills.length === 0) return [];

    const transferableSkills = new Map<
      string,
      { skill: Node; transferability: number; paths: PathResult[] }
    >();
    const minConfidence = options.minConfidence ?? 0;
    const maxDepth = options.maxDepth ?? 3;

    for (const sourceSkill of skills) {
      // Find candidates that have this skill
      const candidates = this.findNodesWithSkill(sourceSkill.id, minConfidence);

      for (const candidate of candidates) {
        // Find other skills these candidates have
        const candidateSkills = this.getSkillsForCandidate(
          candidate.id,
          minConfidence,
        );

        for (const otherSkill of candidateSkills) {
          if (otherSkill.id === sourceSkill.id) continue;

          // Calculate transferability based on co-occurrence
          const existing = transferableSkills.get(otherSkill.id);
          const transferability = (existing?.transferability || 0) + 1;

          // Find path between skills
          const path = this.findShortestPath(sourceSkill.id, otherSkill.id, {
            maxDepth,
            minConfidence,
          });

          transferableSkills.set(otherSkill.id, {
            skill: otherSkill,
            transferability,
            paths: existing
              ? [...existing.paths, ...(path ? [path] : [])]
              : path
                ? [path]
                : [],
          });
        }
      }
    }

    // Normalize transferability scores
    const maxTransferability = Math.max(
      ...[...transferableSkills.values()].map((s) => s.transferability),
    );
    const results = [...transferableSkills.values()].map((result) => ({
      ...result,
      transferability: result.transferability / maxTransferability,
    }));

    return results
      .sort((a, b) => b.transferability - a.transferability)
      .slice(0, options.limit ?? 20);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private bfsCluster(
    startNodeId: string,
    minWeight: number,
    visited: Set<string>,
  ): Node[] {
    const cluster: Node[] = [];
    const queue = [startNodeId];
    visited.add(startNodeId);

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const node = this.nodeIndex.getById(nodeId);
      if (node) cluster.push(node);

      const outgoingEdges = this.edgeIndex.getBySource(nodeId);
      for (const edge of outgoingEdges) {
        if (edge.weight < minWeight) continue;
        if (visited.has(edge.targetNode)) continue;

        visited.add(edge.targetNode);
        queue.push(edge.targetNode);
      }
    }

    return cluster;
  }

  private findCentroid(nodes: Node[]): Node {
    if (nodes.length === 0)
      throw new Error('Cannot find centroid of empty cluster');
    if (nodes.length === 1) return nodes[0]!;

    // Find node with highest average edge weight to other nodes in cluster
    let bestNode = nodes[0]!;
    let bestScore = -Infinity;

    for (const node of nodes) {
      let totalWeight = 0;
      let count = 0;

      const outgoingEdges = this.edgeIndex.getBySource(node.id);
      for (const edge of outgoingEdges) {
        if (nodes.some((n) => n.id === edge.targetNode)) {
          totalWeight += edge.weight;
          count++;
        }
      }

      const score = count > 0 ? totalWeight / count : 0;
      if (score > bestScore) {
        bestScore = score;
        bestNode = node;
      }
    }

    return bestNode;
  }

  private getNeighborCommunities(
    nodeId: string,
    communities: Map<string, string>,
    minWeight: number,
  ): string[] {
    const neighborCommunities: string[] = [];
    const outgoingEdges = this.edgeIndex.getBySource(nodeId);

    for (const edge of outgoingEdges) {
      if (edge.weight < minWeight) continue;
      const community = communities.get(edge.targetNode);
      if (community) {
        neighborCommunities.push(community);
      }
    }

    return neighborCommunities;
  }

  private getCommunityEdges(nodes: Node[]): Edge[] {
    const nodeIds = new Set(nodes.map((n) => n.id));
    const communityEdges: Edge[] = [];

    for (const node of nodes) {
      const outgoingEdges = this.edgeIndex.getBySource(node.id);
      for (const edge of outgoingEdges) {
        if (nodeIds.has(edge.targetNode)) {
          communityEdges.push(edge);
        }
      }
    }

    return communityEdges;
  }

  private calculateDensity(nodes: Node[], edges: Edge[]): number {
    const n = nodes.length;
    if (n < 2) return 0;
    const maxEdges = (n * (n - 1)) / 2;
    return edges.length / maxEdges;
  }

  private calculateModularity(nodes: Node[], edges: Edge[]): number {
    // Simplified modularity calculation
    const totalEdges = this.graph.edges.size;
    if (totalEdges === 0) return 0;

    let modularity = 0;
    const nodeIds = new Set(nodes.map((n) => n.id));

    for (const edge of edges) {
      if (nodeIds.has(edge.sourceNode) && nodeIds.has(edge.targetNode)) {
        modularity += edge.weight;
      }
    }

    return modularity / totalEdges;
  }

  private findNodesWithSkill(skillId: string, minConfidence: number): Node[] {
    const candidates: Node[] = [];
    const skillEdges = this.edgeIndex.getBySource(skillId);

    for (const edge of skillEdges) {
      if (
        edge.type === EdgeType.HAS_SKILL &&
        edge.confidence >= minConfidence
      ) {
        const node = this.nodeIndex.getById(edge.sourceNode);
        if (node !== undefined) candidates.push(node);
      }
    }

    return candidates;
  }

  private getSkillsForCandidate(
    candidateId: string,
    minConfidence: number,
  ): Node[] {
    const skills: Node[] = [];
    const candidateEdges = this.edgeIndex.getBySource(candidateId);

    for (const edge of candidateEdges) {
      if (
        edge.type === EdgeType.HAS_SKILL &&
        edge.confidence >= minConfidence
      ) {
        const node = this.nodeIndex.getById(edge.targetNode);
        if (node !== undefined) skills.push(node);
      }
    }

    return skills;
  }
}
