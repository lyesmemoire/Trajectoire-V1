/**
 * Knowledge Graph RH Runtime v2
 * Graph Search Service
 * Searches candidates and jobs using graph-based methods
 * Neighborhood, similarity, and community-based search
 */

import { Graph, Node, Edge, NodeType, EdgeType } from './graph-types';
import { GraphQueryEngine } from './graph-query-engine.service';
import {
  GraphAnalyticsService,
  CommunityMetrics,
} from './graph-analytics.service';
import { CacheService } from '../../cache/cache.decorator';
import { Injectable } from '@nestjs/common';

export interface SearchResult {
  id: string;
  score: number;
  graph: Graph;
  matchReason: string[];
  commonNodes: Node[];
  commonEdges: Edge[];
}

export interface NeighborhoodSearchResult extends SearchResult {
  overlap: number;
  distance: number;
}

export interface SimilaritySearchResult extends SearchResult {
  jaccardSimilarity: number;
  cosineSimilarity: number;
  skillOverlap: number;
}

export interface CommunitySearchResult extends SearchResult {
  communityId: string;
  communitySize: number;
  communityDensity: number;
}

@Injectable()
export class GraphSearchService {
  constructor(
    private readonly graphQueryEngine: GraphQueryEngine,
    private readonly graphAnalyticsService: GraphAnalyticsService,
    private readonly cacheService: CacheService,
  ) {}

  // ============================================================================
  // NEIGHBORHOOD-BASED SEARCH
  // ============================================================================

  /**
   * Search candidates by neighborhood similarity to a job graph
   */
  async searchCandidatesByNeighborhood(
    jobGraph: Graph,
    candidateGraphs: Graph[],
    options: { maxDepth?: number; limit?: number } = {},
  ): Promise<NeighborhoodSearchResult[]> {
    const maxDepth = options.maxDepth ?? 2;
    const limit = options.limit ?? 20;
    const cacheKey = this.cacheService.generateKey(
      'search_neighborhood',
      jobGraph.id,
      maxDepth,
      limit,
    );

    // Try cache first
    const cached =
      await this.cacheService.get<NeighborhoodSearchResult[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const jobNode = this.findNodeByType(jobGraph, NodeType.JOB);
    if (!jobNode) return [];

    const jobQueryEngine = new GraphQueryEngine(jobGraph);
    const jobNeighbors = jobQueryEngine.findNeighbors(jobNode.id, {
      maxDepth,
      limit: 100,
    });

    const results: NeighborhoodSearchResult[] = [];

    for (const candidateGraph of candidateGraphs) {
      const candidateNode = this.findNodeByType(
        candidateGraph,
        NodeType.CANDIDATE,
      );
      if (!candidateNode) continue;

      const candidateQueryEngine = new GraphQueryEngine(candidateGraph);
      const candidateNeighbors = candidateQueryEngine.findNeighbors(
        candidateNode.id,
        { maxDepth, limit: 100 },
      );

      // Calculate overlap
      const jobNeighborLabels = new Set(jobNeighbors.map((n) => n.node.label));
      const candidateNeighborLabels = new Set(
        candidateNeighbors.map((n) => n.node.label),
      );

      const commonLabels = [...jobNeighborLabels].filter((label) =>
        candidateNeighborLabels.has(label),
      );
      const overlap =
        jobNeighborLabels.size > 0 && candidateNeighborLabels.size > 0
          ? (commonLabels.length /
              Math.max(jobNeighborLabels.size, candidateNeighborLabels.size)) *
            100
          : 0;

      // Calculate distance
      const distance = this.calculateGraphDistance(jobGraph, candidateGraph);

      // Find common nodes and edges
      const { commonNodes, commonEdges } = this.findCommonElements(
        jobGraph,
        candidateGraph,
      );

      // Generate match reasons
      const matchReason = this.generateNeighborhoodMatchReasons(
        commonLabels,
        overlap,
        distance,
      );

      results.push({
        id: candidateGraph.id,
        score: overlap * 0.7 + (100 - distance) * 0.3,
        graph: candidateGraph,
        matchReason,
        commonNodes,
        commonEdges,
        overlap,
        distance,
      });
    }

    const sortedResults = results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Cache the result with 15 minute TTL
    await this.cacheService.set(cacheKey, sortedResults, 900);

    return sortedResults;
  }

  /**
   * Search jobs by neighborhood similarity to a candidate graph
   */
  searchJobsByNeighborhood(
    candidateGraph: Graph,
    jobGraphs: Graph[],
    options: { maxDepth?: number; limit?: number } = {},
  ): NeighborhoodSearchResult[] {
    const maxDepth = options.maxDepth ?? 2;
    const limit = options.limit ?? 20;

    const candidateNode = this.findNodeByType(
      candidateGraph,
      NodeType.CANDIDATE,
    );
    if (!candidateNode) return [];

    const candidateQueryEngine = new GraphQueryEngine(candidateGraph);
    const candidateNeighbors = candidateQueryEngine.findNeighbors(
      candidateNode.id,
      { maxDepth, limit: 100 },
    );

    const results: NeighborhoodSearchResult[] = [];

    for (const jobGraph of jobGraphs) {
      const jobNode = this.findNodeByType(jobGraph, NodeType.JOB);
      if (!jobNode) continue;

      const jobQueryEngine = new GraphQueryEngine(jobGraph);
      const jobNeighbors = jobQueryEngine.findNeighbors(jobNode.id, {
        maxDepth,
        limit: 100,
      });

      // Calculate overlap
      const candidateNeighborLabels = new Set(
        candidateNeighbors.map((n) => n.node.label),
      );
      const jobNeighborLabels = new Set(jobNeighbors.map((n) => n.node.label));

      const commonLabels = [...candidateNeighborLabels].filter((label) =>
        jobNeighborLabels.has(label),
      );
      const overlap =
        candidateNeighborLabels.size > 0 && jobNeighborLabels.size > 0
          ? (commonLabels.length /
              Math.max(candidateNeighborLabels.size, jobNeighborLabels.size)) *
            100
          : 0;

      // Calculate distance
      const distance = this.calculateGraphDistance(candidateGraph, jobGraph);

      // Find common nodes and edges
      const { commonNodes, commonEdges } = this.findCommonElements(
        candidateGraph,
        jobGraph,
      );

      // Generate match reasons
      const matchReason = this.generateNeighborhoodMatchReasons(
        commonLabels,
        overlap,
        distance,
      );

      results.push({
        id: jobGraph.id,
        score: overlap * 0.7 + (100 - distance) * 0.3,
        graph: jobGraph,
        matchReason,
        commonNodes,
        commonEdges,
        overlap,
        distance,
      });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  // ============================================================================
  // SIMILARITY-BASED SEARCH
  // ============================================================================

  /**
   * Search candidates by similarity to a job graph
   */
  searchCandidatesBySimilarity(
    jobGraph: Graph,
    candidateGraphs: Graph[],
    options: { limit?: number } = {},
  ): SimilaritySearchResult[] {
    const limit = options.limit ?? 20;

    const results: SimilaritySearchResult[] = [];

    for (const candidateGraph of candidateGraphs) {
      const similarity = this.calculateGraphSimilarity(
        jobGraph,
        candidateGraph,
      );

      // Find common nodes and edges
      const { commonNodes, commonEdges } = this.findCommonElements(
        jobGraph,
        candidateGraph,
      );

      // Generate match reasons
      const matchReason = this.generateSimilarityMatchReasons(similarity);

      results.push({
        id: candidateGraph.id,
        score:
          (similarity.jaccardSimilarity +
            similarity.cosineSimilarity +
            similarity.skillOverlap) /
          3,
        graph: candidateGraph,
        matchReason,
        commonNodes,
        commonEdges,
        jaccardSimilarity: similarity.jaccardSimilarity,
        cosineSimilarity: similarity.cosineSimilarity,
        skillOverlap: similarity.skillOverlap,
      });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Search jobs by similarity to a candidate graph
   */
  searchJobsBySimilarity(
    candidateGraph: Graph,
    jobGraphs: Graph[],
    options: { limit?: number } = {},
  ): SimilaritySearchResult[] {
    const limit = options.limit ?? 20;

    const results: SimilaritySearchResult[] = [];

    for (const jobGraph of jobGraphs) {
      const similarity = this.calculateGraphSimilarity(
        candidateGraph,
        jobGraph,
      );

      // Find common nodes and edges
      const { commonNodes, commonEdges } = this.findCommonElements(
        candidateGraph,
        jobGraph,
      );

      // Generate match reasons
      const matchReason = this.generateSimilarityMatchReasons(similarity);

      results.push({
        id: jobGraph.id,
        score:
          (similarity.jaccardSimilarity +
            similarity.cosineSimilarity +
            similarity.skillOverlap) /
          3,
        graph: jobGraph,
        matchReason,
        commonNodes,
        commonEdges,
        jaccardSimilarity: similarity.jaccardSimilarity,
        cosineSimilarity: similarity.cosineSimilarity,
        skillOverlap: similarity.skillOverlap,
      });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Find similar candidates to a given candidate graph
   */
  findSimilarCandidates(
    candidateGraph: Graph,
    candidateGraphs: Graph[],
    options: { limit?: number } = {},
  ): SimilaritySearchResult[] {
    const limit = options.limit ?? 10;

    const results: SimilaritySearchResult[] = [];

    for (const otherCandidateGraph of candidateGraphs) {
      if (otherCandidateGraph.id === candidateGraph.id) continue;

      const similarity = this.calculateGraphSimilarity(
        candidateGraph,
        otherCandidateGraph,
      );

      // Find common nodes and edges
      const { commonNodes, commonEdges } = this.findCommonElements(
        candidateGraph,
        otherCandidateGraph,
      );

      // Generate match reasons
      const matchReason = this.generateSimilarityMatchReasons(similarity);

      results.push({
        id: otherCandidateGraph.id,
        score:
          (similarity.jaccardSimilarity +
            similarity.cosineSimilarity +
            similarity.skillOverlap) /
          3,
        graph: otherCandidateGraph,
        matchReason,
        commonNodes,
        commonEdges,
        jaccardSimilarity: similarity.jaccardSimilarity,
        cosineSimilarity: similarity.cosineSimilarity,
        skillOverlap: similarity.skillOverlap,
      });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Find similar jobs to a given job graph
   */
  findSimilarJobs(
    jobGraph: Graph,
    jobGraphs: Graph[],
    options: { limit?: number } = {},
  ): SimilaritySearchResult[] {
    const limit = options.limit ?? 10;

    const results: SimilaritySearchResult[] = [];

    for (const otherJobGraph of jobGraphs) {
      if (otherJobGraph.id === jobGraph.id) continue;

      const similarity = this.calculateGraphSimilarity(jobGraph, otherJobGraph);

      // Find common nodes and edges
      const { commonNodes, commonEdges } = this.findCommonElements(
        jobGraph,
        otherJobGraph,
      );

      // Generate match reasons
      const matchReason = this.generateSimilarityMatchReasons(similarity);

      results.push({
        id: otherJobGraph.id,
        score:
          (similarity.jaccardSimilarity +
            similarity.cosineSimilarity +
            similarity.skillOverlap) /
          3,
        graph: otherJobGraph,
        matchReason,
        commonNodes,
        commonEdges,
        jaccardSimilarity: similarity.jaccardSimilarity,
        cosineSimilarity: similarity.cosineSimilarity,
        skillOverlap: similarity.skillOverlap,
      });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  // ============================================================================
  // COMMUNITY-BASED SEARCH
  // ============================================================================

  /**
   * Search candidates by community membership
   */
  searchCandidatesByCommunity(
    targetGraph: Graph,
    candidateGraphs: Graph[],
    options: { limit?: number } = {},
  ): CommunitySearchResult[] {
    const limit = options.limit ?? 20;

    // Find communities in the combined graph
    const combinedGraph = this.combineGraphs([targetGraph, ...candidateGraphs]);
    const combinedAnalytics = new GraphAnalyticsService(combinedGraph);
    const communities = combinedAnalytics.findCommunities();

    // Find which community the target graph belongs to
    const targetCommunity = this.findGraphCommunity(targetGraph, communities);
    if (!targetCommunity) return [];

    const results: CommunitySearchResult[] = [];

    for (const candidateGraph of candidateGraphs) {
      const candidateCommunity = this.findGraphCommunity(
        candidateGraph,
        communities,
      );

      if (candidateCommunity && candidateCommunity.id === targetCommunity.id) {
        // Find common nodes and edges
        const { commonNodes, commonEdges } = this.findCommonElements(
          targetGraph,
          candidateGraph,
        );

        // Generate match reasons
        const matchReason = [
          `Belongs to same community (${targetCommunity.id})`,
          `Community size: ${targetCommunity.size}`,
          `Community density: ${targetCommunity.density.toFixed(2)}`,
        ];

        results.push({
          id: candidateGraph.id,
          score: targetCommunity.density * 100,
          graph: candidateGraph,
          matchReason,
          commonNodes,
          commonEdges,
          communityId: targetCommunity.id,
          communitySize: targetCommunity.size,
          communityDensity: targetCommunity.density,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Search jobs by community membership
   */
  searchJobsByCommunity(
    targetGraph: Graph,
    jobGraphs: Graph[],
    options: { limit?: number } = {},
  ): CommunitySearchResult[] {
    const limit = options.limit ?? 20;

    // Find communities in the combined graph
    const combinedGraph = this.combineGraphs([targetGraph, ...jobGraphs]);
    const combinedAnalytics = new GraphAnalyticsService(combinedGraph);
    const communities = combinedAnalytics.findCommunities();

    // Find which community the target graph belongs to
    const targetCommunity = this.findGraphCommunity(targetGraph, communities);
    if (!targetCommunity) return [];

    const results: CommunitySearchResult[] = [];

    for (const jobGraph of jobGraphs) {
      const jobCommunity = this.findGraphCommunity(jobGraph, communities);

      if (jobCommunity && jobCommunity.id === targetCommunity.id) {
        // Find common nodes and edges
        const { commonNodes, commonEdges } = this.findCommonElements(
          targetGraph,
          jobGraph,
        );

        // Generate match reasons
        const matchReason = [
          `Belongs to same community (${targetCommunity.id})`,
          `Community size: ${targetCommunity.size}`,
          `Community density: ${targetCommunity.density.toFixed(2)}`,
        ];

        results.push({
          id: jobGraph.id,
          score: targetCommunity.density * 100,
          graph: jobGraph,
          matchReason,
          commonNodes,
          commonEdges,
          communityId: targetCommunity.id,
          communitySize: targetCommunity.size,
          communityDensity: targetCommunity.density,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private findNodeByType(graph: Graph, type: NodeType): Node | undefined {
    return Array.from(graph.nodes.values()).find((n) => n.type === type);
  }

  private calculateGraphDistance(graph1: Graph, graph2: Graph): number {
    const nodes1 = this.getNodesByType(graph1, NodeType.SKILL);
    const nodes2 = this.getNodesByType(graph2, NodeType.SKILL);

    const labels1 = new Set(nodes1.map((n) => n.normalizedLabel));
    const labels2 = new Set(nodes2.map((n) => n.normalizedLabel));

    const intersection = [...labels1].filter((l) => labels2.has(l)).length;
    const union = new Set([...labels1, ...labels2]).size;

    return union > 0 ? (1 - intersection / union) * 100 : 100;
  }

  private calculateGraphSimilarity(
    graph1: Graph,
    graph2: Graph,
  ): {
    jaccardSimilarity: number;
    cosineSimilarity: number;
    skillOverlap: number;
  } {
    const nodes1 = this.getNodesByType(graph1, NodeType.SKILL);
    const nodes2 = this.getNodesByType(graph2, NodeType.SKILL);

    const labels1 = new Set(nodes1.map((n) => n.normalizedLabel));
    const labels2 = new Set(nodes2.map((n) => n.normalizedLabel));

    // Jaccard similarity
    const intersection = [...labels1].filter((l) => labels2.has(l)).length;
    const union = new Set([...labels1, ...labels2]).size;
    const jaccardSimilarity = union > 0 ? intersection / union : 0;

    // Cosine similarity (simplified)
    const common = intersection;
    const magnitude1 = Math.sqrt(labels1.size);
    const magnitude2 = Math.sqrt(labels2.size);
    const cosineSimilarity =
      magnitude1 > 0 && magnitude2 > 0 ? common / (magnitude1 * magnitude2) : 0;

    // Skill overlap percentage
    const skillOverlap = labels2.size > 0 ? intersection / labels2.size : 0;

    return {
      jaccardSimilarity: jaccardSimilarity * 100,
      cosineSimilarity: cosineSimilarity * 100,
      skillOverlap: skillOverlap * 100,
    };
  }

  private findCommonElements(
    graph1: Graph,
    graph2: Graph,
  ): {
    commonNodes: Node[];
    commonEdges: Edge[];
  } {
    const labels1 = new Set(
      Array.from(graph1.nodes.values()).map((n) => n.normalizedLabel),
    );
    const labels2 = new Set(
      Array.from(graph2.nodes.values()).map((n) => n.normalizedLabel),
    );

    const commonLabels = [...labels1].filter((l) => labels2.has(l));
    const commonNodes = Array.from(graph1.nodes.values()).filter((n) =>
      commonLabels.includes(n.normalizedLabel),
    );

    const edgePairs1 = new Set(
      Array.from(graph1.edges.values()).map(
        (e) => `${e.type}-${e.sourceNode}-${e.targetNode}`,
      ),
    );
    const edgePairs2 = new Set(
      Array.from(graph2.edges.values()).map(
        (e) => `${e.type}-${e.sourceNode}-${e.targetNode}`,
      ),
    );

    const commonEdgePairs = [...edgePairs1].filter((e) => edgePairs2.has(e));
    const commonEdges = Array.from(graph1.edges.values()).filter((e) =>
      commonEdgePairs.includes(`${e.type}-${e.sourceNode}-${e.targetNode}`),
    );

    return { commonNodes, commonEdges };
  }

  private generateNeighborhoodMatchReasons(
    commonLabels: string[],
    overlap: number,
    distance: number,
  ): string[] {
    const reasons: string[] = [];

    if (commonLabels.length > 0) {
      reasons.push(
        `${commonLabels.length} common neighbors: ${commonLabels.slice(0, 3).join(', ')}`,
      );
    }
    if (overlap > 50) {
      reasons.push(`High neighborhood overlap (${overlap.toFixed(0)}%)`);
    }
    if (distance < 30) {
      reasons.push(`Low graph distance (${distance.toFixed(0)}%)`);
    }

    return reasons;
  }

  private generateSimilarityMatchReasons(similarity: {
    jaccardSimilarity: number;
    cosineSimilarity: number;
    skillOverlap: number;
  }): string[] {
    const reasons: string[] = [];

    if (similarity.skillOverlap > 50) {
      reasons.push(
        `High skill overlap (${similarity.skillOverlap.toFixed(0)}%)`,
      );
    }
    if (similarity.jaccardSimilarity > 50) {
      reasons.push(
        `High Jaccard similarity (${similarity.jaccardSimilarity.toFixed(0)}%)`,
      );
    }
    if (similarity.cosineSimilarity > 50) {
      reasons.push(
        `High cosine similarity (${similarity.cosineSimilarity.toFixed(0)}%)`,
      );
    }

    return reasons;
  }

  private combineGraphs(graphs: Graph[]): Graph {
    const combinedNodes = new Map<string, Node>();
    const combinedEdges = new Map<string, Edge>();

    for (const graph of graphs) {
      for (const [id, node] of graph.nodes) {
        if (!combinedNodes.has(id)) {
          combinedNodes.set(id, node);
        }
      }
      for (const [id, edge] of graph.edges) {
        if (!combinedEdges.has(id)) {
          combinedEdges.set(id, edge);
        }
      }
    }

    return {
      id: 'combined',
      nodes: combinedNodes,
      edges: combinedEdges,
      metadata: {
        version: '2.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'GRAPH_SEARCH',
        combinedFrom: graphs.map((g) => g.id),
      },
    };
  }

  private findGraphCommunity(
    graph: Graph,
    communities: CommunityMetrics[],
  ): CommunityMetrics | undefined {
    const graphNodeIds = new Set(graph.nodes.keys());

    for (const community of communities) {
      const communityNodeIds = new Set(community.nodes.map((n) => n.id));
      const intersection = [...graphNodeIds].filter((id) =>
        communityNodeIds.has(id),
      ).length;

      if (intersection > graphNodeIds.size * 0.5) {
        return community;
      }
    }

    return undefined;
  }

  private getNodesByType(graph: Graph, type: NodeType): Node[] {
    return Array.from(graph.nodes.values()).filter((n) => n.type === type);
  }
}
