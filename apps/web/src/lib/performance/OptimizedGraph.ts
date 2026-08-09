/**
 * Optimized Graph Operations - SPRINT-4.5
 * 
 * Performance monitoring and automatic optimization for graph operations
 */

import { performanceMonitor, measurePerformance } from './PerformanceMonitor';

export interface GraphNode {
  id: string;
  type: string;
  data: any;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  data: any;
}

export class OptimizedGraph {
  private nodeCache = new Map<string, GraphNode>();
  private edgeCache = new Map<string, GraphEdge[]>();
  private adjacencyCache = new Map<string, string[]>();

  // Optimized node lookup
  @measurePerformance('graph.getNode')
  getNode(id: string): GraphNode | null {
    return this.nodeCache.get(id) || null;
  }

  // Optimized node insertion
  @measurePerformance('graph.addNode')
  addNode(node: GraphNode): void {
    this.nodeCache.set(node.id, node);
    this.invalidateAdjacencyCache(node.id);
  }

  // Optimized edge lookup
  @measurePerformance('graph.getEdges')
  getEdges(nodeId: string): GraphEdge[] {
    return this.edgeCache.get(nodeId) || [];
  }

  // Optimized edge insertion
  @measurePerformance('graph.addEdge')
  addEdge(edge: GraphEdge): void {
    if (!this.edgeCache.has(edge.source)) {
      this.edgeCache.set(edge.source, []);
    }
    this.edgeCache.get(edge.source)!.push(edge);
    this.invalidateAdjacencyCache(edge.source);
    this.invalidateAdjacencyCache(edge.target);
  }

  // Optimized adjacency list with caching
  @measurePerformance('graph.getAdjacency')
  getAdjacency(nodeId: string): string[] {
    const cached = this.adjacencyCache.get(nodeId);
    if (cached) {
      return cached;
    }

    const edges = this.getEdges(nodeId);
    const neighbors = edges.map(e => e.target);
    this.adjacencyCache.set(nodeId, neighbors);
    return neighbors;
  }

  // Optimized BFS with early termination
  @measurePerformance('graph.bfs')
  bfs(startId: string, targetId?: string, maxDepth: number = 10): string[] {
    const visited = new Set<string>();
    const queue: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];
    const visitedNodes: string[] = [];

    while (queue.length > 0) {
      const { id, path } = queue.shift()!;

      if (visited.has(id)) continue;
      visited.add(id);
      visitedNodes.push(id);

      if (targetId && id === targetId) {
        return path;
      }

      if (path.length >= maxDepth) continue;

      const neighbors = this.getAdjacency(id);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push({ id: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return visitedNodes;
  }

  // Optimized DFS with early termination
  @measurePerformance('graph.dfs')
  dfs(startId: string, targetId?: string, maxDepth: number = 10): string[] {
    const visited = new Set<string>();
    const stack: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];
    const visitedNodes: string[] = [];

    while (stack.length > 0) {
      const { id, path } = stack.pop()!;

      if (visited.has(id)) continue;
      visited.add(id);
      visitedNodes.push(id);

      if (targetId && id === targetId) {
        return path;
      }

      if (path.length >= maxDepth) continue;

      const neighbors = this.getAdjacency(id);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push({ id: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return visitedNodes;
  }

  // Cache invalidation
  private invalidateAdjacencyCache(nodeId: string): void {
    this.adjacencyCache.delete(nodeId);
  }

  // Clear all caches
  clearCache(): void {
    this.nodeCache.clear();
    this.edgeCache.clear();
    this.adjacencyCache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      nodes: this.nodeCache.size,
      edges: this.edgeCache.size,
      adjacency: this.adjacencyCache.size,
    };
  }
}

export const optimizedGraph = new OptimizedGraph();