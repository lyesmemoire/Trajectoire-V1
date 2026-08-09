/**
 * Knowledge Graph RH Runtime v2
 * Graph Statistics Service
 * Computes graph statistics and metrics
 */

import {
  Graph,
  Node,
  Edge,
  NodeType,
  EdgeType,
  GraphStatistics,
} from './graph-types';

export class GraphStatisticsService {
  constructor() {}

  /**
   * Compute comprehensive graph statistics
   */
  computeStatistics(graph: Graph): GraphStatistics {
    const totalNodes = graph.nodes.size;
    const totalEdges = graph.edges.size;

    const nodesByType = this.countNodesByType(graph);
    const edgesByType = this.countEdgesByType(graph);

    const averageDegree = this.computeAverageDegree(graph);
    const connectedComponents = this.countConnectedComponents(graph);
    const density = this.computeDensity(graph);

    return {
      totalNodes,
      totalEdges,
      nodesByType,
      edgesByType,
      averageDegree,
      connectedComponents,
      density,
      updatedAt: new Date(),
    };
  }

  /**
   * Count nodes by type
   */
  private countNodesByType(graph: Graph): Record<NodeType, number> {
    const counts: Partial<Record<NodeType, number>> = {};

    graph.nodes.forEach((node) => {
      counts[node.type] = (counts[node.type] || 0) + 1;
    });

    return counts as Record<NodeType, number>;
  }

  /**
   * Count edges by type
   */
  private countEdgesByType(graph: Graph): Record<EdgeType, number> {
    const counts: Partial<Record<EdgeType, number>> = {};

    graph.edges.forEach((edge) => {
      counts[edge.type] = (counts[edge.type] || 0) + 1;
    });

    return counts as Record<EdgeType, number>;
  }

  /**
   * Compute average degree of nodes
   */
  private computeAverageDegree(graph: Graph): number {
    if (graph.nodes.size === 0) {
      return 0;
    }

    const degreeSum = Array.from(graph.nodes.values()).reduce((sum, node) => {
      const inDegree = Array.from(graph.edges.values()).filter(
        (edge) => edge.targetNode === node.id,
      ).length;
      const outDegree = Array.from(graph.edges.values()).filter(
        (edge) => edge.sourceNode === node.id,
      ).length;
      return sum + inDegree + outDegree;
    }, 0);

    return degreeSum / graph.nodes.size;
  }

  /**
   * Count connected components
   */
  private countConnectedComponents(graph: Graph): number {
    const visited = new Set<string>();
    let componentCount = 0;

    graph.nodes.forEach((_, nodeId) => {
      if (visited.has(nodeId)) {
        return;
      }

      componentCount++;
      this.dfsVisit(graph, nodeId, visited);
    });

    return componentCount;
  }

  /**
   * DFS helper for connected components
   */
  private dfsVisit(graph: Graph, nodeId: string, visited: Set<string>): void {
    visited.add(nodeId);

    const neighbors = Array.from(graph.edges.values())
      .filter(
        (edge) => edge.sourceNode === nodeId || edge.targetNode === nodeId,
      )
      .map((edge) =>
        edge.sourceNode === nodeId ? edge.targetNode : edge.sourceNode,
      );

    neighbors.forEach((neighborId) => {
      if (!visited.has(neighborId)) {
        this.dfsVisit(graph, neighborId, visited);
      }
    });
  }

  /**
   * Compute graph density
   */
  private computeDensity(graph: Graph): number {
    const n = graph.nodes.size;
    if (n <= 1) {
      return 0;
    }

    // For directed graph: density = edges / (n * (n - 1))
    // For undirected graph: density = 2 * edges / (n * (n - 1))
    // Assuming directed graph
    const maxPossibleEdges = n * (n - 1);
    return graph.edges.size / maxPossibleEdges;
  }

  /**
   * Compute node degree (in + out)
   */
  computeNodeDegree(graph: Graph, nodeId: string): number {
    const inDegree = Array.from(graph.edges.values()).filter(
      (edge) => edge.targetNode === nodeId,
    ).length;
    const outDegree = Array.from(graph.edges.values()).filter(
      (edge) => edge.sourceNode === nodeId,
    ).length;
    return inDegree + outDegree;
  }

  /**
   * Compute node in-degree
   */
  computeNodeInDegree(graph: Graph, nodeId: string): number {
    return Array.from(graph.edges.values()).filter(
      (edge) => edge.targetNode === nodeId,
    ).length;
  }

  /**
   * Compute node out-degree
   */
  computeNodeOutDegree(graph: Graph, nodeId: string): number {
    return Array.from(graph.edges.values()).filter(
      (edge) => edge.sourceNode === nodeId,
    ).length;
  }

  /**
   * Find nodes with highest degree
   */
  findHighestDegreeNodes(
    graph: Graph,
    limit: number = 10,
  ): Array<{ nodeId: string; degree: number }> {
    const degrees: Array<{ nodeId: string; degree: number }> = [];

    graph.nodes.forEach((_, nodeId) => {
      degrees.push({
        nodeId,
        degree: this.computeNodeDegree(graph, nodeId),
      });
    });

    degrees.sort((a, b) => b.degree - a.degree);

    return degrees.slice(0, limit);
  }

  /**
   * Find isolated nodes (degree = 0)
   */
  findIsolatedNodes(graph: Graph): Node[] {
    const isolated: Node[] = [];

    graph.nodes.forEach((node, nodeId) => {
      if (this.computeNodeDegree(graph, nodeId) === 0) {
        isolated.push(node);
      }
    });

    return isolated;
  }

  /**
   * Find hub nodes (high degree)
   */
  findHubNodes(graph: Graph, threshold: number = 5): Node[] {
    const hubs: Node[] = [];

    graph.nodes.forEach((node, nodeId) => {
      if (this.computeNodeDegree(graph, nodeId) >= threshold) {
        hubs.push(node);
      }
    });

    return hubs;
  }

  /**
   * Compute clustering coefficient (local)
   */
  computeLocalClusteringCoefficient(graph: Graph, nodeId: string): number {
    const neighbors = Array.from(graph.edges.values())
      .filter(
        (edge) => edge.sourceNode === nodeId || edge.targetNode === nodeId,
      )
      .map((edge) =>
        edge.sourceNode === nodeId ? edge.targetNode : edge.sourceNode,
      );

    if (neighbors.length < 2) {
      return 0;
    }

    let edgesBetweenNeighbors = 0;

    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        const edgeExists = Array.from(graph.edges.values()).some(
          (edge) =>
            (edge.sourceNode === neighbors[i] &&
              edge.targetNode === neighbors[j]) ||
            (edge.sourceNode === neighbors[j] &&
              edge.targetNode === neighbors[i]),
        );
        if (edgeExists) {
          edgesBetweenNeighbors++;
        }
      }
    }

    const possibleEdges = (neighbors.length * (neighbors.length - 1)) / 2;
    return edgesBetweenNeighbors / possibleEdges;
  }

  /**
   * Compute average clustering coefficient (global)
   */
  computeAverageClusteringCoefficient(graph: Graph): number {
    let totalCoefficient = 0;
    let nodeCount = 0;

    graph.nodes.forEach((_, nodeId) => {
      const coefficient = this.computeLocalClusteringCoefficient(graph, nodeId);
      totalCoefficient += coefficient;
      nodeCount++;
    });

    return nodeCount > 0 ? totalCoefficient / nodeCount : 0;
  }

  /**
   * Compute shortest path length distribution
   */
  computeShortestPathDistribution(graph: Graph): Map<number, number> {
    const distribution = new Map<number, number>();

    graph.nodes.forEach((_, startNodeId) => {
      graph.nodes.forEach((_, endNodeId) => {
        if (startNodeId === endNodeId) {
          return;
        }

        const pathLength = this.bfsShortestPath(graph, startNodeId, endNodeId);
        if (pathLength !== null) {
          distribution.set(pathLength, (distribution.get(pathLength) || 0) + 1);
        }
      });
    });

    return distribution;
  }

  /**
   * BFS shortest path
   */
  private bfsShortestPath(
    graph: Graph,
    startNodeId: string,
    endNodeId: string,
  ): number | null {
    if (startNodeId === endNodeId) {
      return 0;
    }

    const visited = new Set<string>();
    const queue: Array<{ nodeId: string; distance: number }> = [
      { nodeId: startNodeId, distance: 0 },
    ];

    while (queue.length > 0) {
      const { nodeId, distance } = queue.shift()!;

      if (nodeId === endNodeId) {
        return distance;
      }

      if (visited.has(nodeId)) {
        continue;
      }

      visited.add(nodeId);

      const neighbors = Array.from(graph.edges.values())
        .filter((edge) => edge.sourceNode === nodeId)
        .map((edge) => edge.targetNode);

      neighbors.forEach((neighborId) => {
        if (!visited.has(neighborId)) {
          queue.push({ nodeId: neighborId, distance: distance + 1 });
        }
      });
    }

    return null;
  }

  /**
   * Compute graph diameter (longest shortest path)
   */
  computeDiameter(graph: Graph): number {
    let maxDistance = 0;

    graph.nodes.forEach((_, startNodeId) => {
      graph.nodes.forEach((_, endNodeId) => {
        if (startNodeId === endNodeId) {
          return;
        }

        const pathLength = this.bfsShortestPath(graph, startNodeId, endNodeId);
        if (pathLength !== null && pathLength > maxDistance) {
          maxDistance = pathLength;
        }
      });
    });

    return maxDistance;
  }

  /**
   * Compute average path length
   */
  computeAveragePathLength(graph: Graph): number {
    let totalDistance = 0;
    let pathCount = 0;

    graph.nodes.forEach((_, startNodeId) => {
      graph.nodes.forEach((_, endNodeId) => {
        if (startNodeId === endNodeId) {
          return;
        }

        const pathLength = this.bfsShortestPath(graph, startNodeId, endNodeId);
        if (pathLength !== null) {
          totalDistance += pathLength;
          pathCount++;
        }
      });
    });

    return pathCount > 0 ? totalDistance / pathCount : 0;
  }

  /**
   * Compute graph centrality measures
   */
  computeCentrality(
    graph: Graph,
    nodeId: string,
  ): {
    degree: number;
    betweenness: number;
    closeness: number;
  } {
    const degree = this.computeNodeDegree(graph, nodeId);
    const betweenness = this.computeBetweennessCentrality(graph, nodeId);
    const closeness = this.computeClosenessCentrality(graph, nodeId);

    return {
      degree,
      betweenness,
      closeness,
    };
  }

  /**
   * Compute betweenness centrality
   */
  private computeBetweennessCentrality(graph: Graph, nodeId: string): number {
    let betweenness = 0;
    const nodes = Array.from(graph.nodes.keys());

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const sourceId = nodes[i];
        const targetId = nodes[j];

        if (
          !sourceId ||
          !targetId ||
          sourceId === nodeId ||
          targetId === nodeId
        ) {
          continue;
        }

        const paths = this.findAllShortestPaths(graph, sourceId, targetId);
        if (paths.length === 0) {
          continue;
        }

        const pathsThroughNode = paths.filter((path) => path.includes(nodeId));
        betweenness += pathsThroughNode.length / paths.length;
      }
    }

    return betweenness;
  }

  /**
   * Find all shortest paths between two nodes
   */
  private findAllShortestPaths(
    graph: Graph,
    sourceId: string,
    targetId: string,
  ): string[][] {
    const shortestLength = this.bfsShortestPath(graph, sourceId, targetId);
    if (shortestLength === null) {
      return [];
    }

    const allPaths: string[][] = [];
    const visited = new Set<string>();

    const dfs = (currentId: string, path: string[], depth: number) => {
      if (depth > shortestLength) {
        return;
      }

      if (currentId === targetId) {
        if (path.length === shortestLength + 1) {
          allPaths.push([...path]);
        }
        return;
      }

      visited.add(currentId);

      const neighbors = Array.from(graph.edges.values())
        .filter((edge) => edge.sourceNode === currentId)
        .map((edge) => edge.targetNode);

      neighbors.forEach((neighborId) => {
        if (neighborId && !visited.has(neighborId)) {
          dfs(neighborId, [...path, neighborId], depth + 1);
        }
      });

      visited.delete(currentId);
    };

    dfs(sourceId, [sourceId], 0);

    return allPaths;
  }

  /**
   * Compute closeness centrality
   */
  private computeClosenessCentrality(graph: Graph, nodeId: string): number {
    let totalDistance = 0;
    let reachableCount = 0;

    graph.nodes.forEach((_, targetNodeId) => {
      if (nodeId === targetNodeId) {
        return;
      }

      const distance = this.bfsShortestPath(graph, nodeId, targetNodeId);
      if (distance !== null) {
        totalDistance += distance;
        reachableCount++;
      }
    });

    if (reachableCount === 0) {
      return 0;
    }

    return (reachableCount - 1) / totalDistance;
  }
}
