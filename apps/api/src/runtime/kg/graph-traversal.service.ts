/**
 * Knowledge Graph RH Runtime v2
 * Graph Traversal Service
 * Provides graph traversal algorithms (BFS, DFS, etc.)
 */

import {
  Graph,
  Node,
  Edge,
  TraversalOptions,
  TraversalDirection,
  TraversalResult,
} from './graph-types';

export class GraphTraversalService {
  constructor() {}

  /**
   * Breadth-First Search (BFS)
   */
  bfs(
    graph: Graph,
    startNodeId: string,
    options: TraversalOptions = {},
  ): TraversalResult {
    const visited = new Set<string>();
    const queue: string[] = [startNodeId];
    const path: string[] = [];
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const maxDepth = options.maxDepth ?? Infinity;
    const direction = options.direction ?? TraversalDirection.OUTGOING;
    const edgeTypes = options.edgeTypes;

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;

      if (visited.has(currentNodeId)) {
        continue;
      }

      visited.add(currentNodeId);
      path.push(currentNodeId);

      const currentNode = graph.nodes.get(currentNodeId);
      if (currentNode) {
        nodes.push(currentNode);
      }

      if (path.length - 1 >= maxDepth) {
        continue;
      }

      // Get neighbors based on direction
      let neighborEdges: Edge[] = [];
      switch (direction) {
        case TraversalDirection.OUTGOING:
          neighborEdges = Array.from(graph.edges.values()).filter(
            (edge) => edge.sourceNode === currentNodeId,
          );
          break;
        case TraversalDirection.INCOMING:
          neighborEdges = Array.from(graph.edges.values()).filter(
            (edge) => edge.targetNode === currentNodeId,
          );
          break;
        case TraversalDirection.BOTH:
          neighborEdges = Array.from(graph.edges.values()).filter(
            (edge) =>
              edge.sourceNode === currentNodeId ||
              edge.targetNode === currentNodeId,
          );
          break;
      }

      // Filter by edge types if specified
      if (edgeTypes && edgeTypes.length > 0) {
        neighborEdges = neighborEdges.filter((edge) =>
          edgeTypes.includes(edge.type),
        );
      }

      // Add edges to result
      edges.push(...neighborEdges);

      // Add neighbors to queue
      neighborEdges.forEach((edge) => {
        const neighborId =
          edge.sourceNode === currentNodeId ? edge.targetNode : edge.sourceNode;
        if (!visited.has(neighborId)) {
          queue.push(neighborId);
        }
      });
    }

    return {
      path,
      nodes,
      edges,
    };
  }

  /**
   * Depth-First Search (DFS)
   */
  dfs(
    graph: Graph,
    startNodeId: string,
    options: TraversalOptions = {},
  ): TraversalResult {
    const visited = new Set<string>();
    const path: string[] = [];
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const maxDepth = options.maxDepth ?? Infinity;
    const direction = options.direction ?? TraversalDirection.OUTGOING;
    const edgeTypes = options.edgeTypes;

    const dfsRecursive = (currentNodeId: string, depth: number) => {
      if (visited.has(currentNodeId) || depth > maxDepth) {
        return;
      }

      visited.add(currentNodeId);
      path.push(currentNodeId);

      const currentNode = graph.nodes.get(currentNodeId);
      if (currentNode) {
        nodes.push(currentNode);
      }

      // Get neighbors based on direction
      let neighborEdges: Edge[] = [];
      switch (direction) {
        case TraversalDirection.OUTGOING:
          neighborEdges = Array.from(graph.edges.values()).filter(
            (edge) => edge.sourceNode === currentNodeId,
          );
          break;
        case TraversalDirection.INCOMING:
          neighborEdges = Array.from(graph.edges.values()).filter(
            (edge) => edge.targetNode === currentNodeId,
          );
          break;
        case TraversalDirection.BOTH:
          neighborEdges = Array.from(graph.edges.values()).filter(
            (edge) =>
              edge.sourceNode === currentNodeId ||
              edge.targetNode === currentNodeId,
          );
          break;
      }

      // Filter by edge types if specified
      if (edgeTypes && edgeTypes.length > 0) {
        neighborEdges = neighborEdges.filter((edge) =>
          edgeTypes.includes(edge.type),
        );
      }

      // Add edges to result
      edges.push(...neighborEdges);

      // Recursively visit neighbors
      neighborEdges.forEach((edge) => {
        const neighborId =
          edge.sourceNode === currentNodeId ? edge.targetNode : edge.sourceNode;
        dfsRecursive(neighborId, depth + 1);
      });
    };

    dfsRecursive(startNodeId, 0);

    return {
      path,
      nodes,
      edges,
    };
  }

  /**
   * Find all paths between two nodes
   */
  findAllPaths(
    graph: Graph,
    startNodeId: string,
    endNodeId: string,
    maxDepth: number = 10,
    options: TraversalOptions = {},
  ): string[][] {
    const paths: string[][] = [];
    const visited = new Set<string>();

    const dfs = (currentNodeId: string, path: string[], depth: number) => {
      if (depth > maxDepth) {
        return;
      }

      if (currentNodeId === endNodeId) {
        paths.push([...path]);
        return;
      }

      visited.add(currentNodeId);

      const direction = options.direction ?? TraversalDirection.OUTGOING;
      const edgeTypes = options.edgeTypes;

      let neighborEdges: Edge[] = [];
      switch (direction) {
        case TraversalDirection.OUTGOING:
          neighborEdges = Array.from(graph.edges.values()).filter(
            (edge) => edge.sourceNode === currentNodeId,
          );
          break;
        case TraversalDirection.INCOMING:
          neighborEdges = Array.from(graph.edges.values()).filter(
            (edge) => edge.targetNode === currentNodeId,
          );
          break;
        case TraversalDirection.BOTH:
          neighborEdges = Array.from(graph.edges.values()).filter(
            (edge) =>
              edge.sourceNode === currentNodeId ||
              edge.targetNode === currentNodeId,
          );
          break;
      }

      if (edgeTypes && edgeTypes.length > 0) {
        neighborEdges = neighborEdges.filter((edge) =>
          edgeTypes.includes(edge.type),
        );
      }

      neighborEdges.forEach((edge) => {
        const neighborId =
          edge.sourceNode === currentNodeId ? edge.targetNode : edge.sourceNode;
        if (!visited.has(neighborId)) {
          dfs(neighborId, [...path, neighborId], depth + 1);
        }
      });

      visited.delete(currentNodeId);
    };

    dfs(startNodeId, [startNodeId], 0);

    return paths;
  }

  /**
   * Find shortest path (BFS-based)
   */
  findShortestPath(
    graph: Graph,
    startNodeId: string,
    endNodeId: string,
    options: TraversalOptions = {},
  ): string[] | null {
    if (startNodeId === endNodeId) {
      return [startNodeId];
    }

    const visited = new Set<string>();
    const queue: Array<{ nodeId: string; path: string[] }> = [
      { nodeId: startNodeId, path: [startNodeId] },
    ];

    const maxDepth = options.maxDepth ?? Infinity;
    const direction = options.direction ?? TraversalDirection.OUTGOING;
    const edgeTypes = options.edgeTypes;

    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;

      if (nodeId === endNodeId) {
        return path;
      }

      if (visited.has(nodeId) || path.length - 1 >= maxDepth) {
        continue;
      }

      visited.add(nodeId);

      let neighborEdges: Edge[] = [];
      switch (direction) {
        case TraversalDirection.OUTGOING:
          neighborEdges = Array.from(graph.edges.values()).filter(
            (edge) => edge.sourceNode === nodeId,
          );
          break;
        case TraversalDirection.INCOMING:
          neighborEdges = Array.from(graph.edges.values()).filter(
            (edge) => edge.targetNode === nodeId,
          );
          break;
        case TraversalDirection.BOTH:
          neighborEdges = Array.from(graph.edges.values()).filter(
            (edge) => edge.sourceNode === nodeId || edge.targetNode === nodeId,
          );
          break;
      }

      if (edgeTypes && edgeTypes.length > 0) {
        neighborEdges = neighborEdges.filter((edge) =>
          edgeTypes.includes(edge.type),
        );
      }

      neighborEdges.forEach((edge) => {
        const neighborId =
          edge.sourceNode === nodeId ? edge.targetNode : edge.sourceNode;
        if (!visited.has(neighborId)) {
          queue.push({ nodeId: neighborId, path: [...path, neighborId] });
        }
      });
    }

    return null;
  }

  /**
   * Find connected components
   */
  findConnectedComponents(graph: Graph): string[][] {
    const visited = new Set<string>();
    const components: string[][] = [];

    graph.nodes.forEach((_, nodeId) => {
      if (visited.has(nodeId)) {
        return;
      }

      const component: string[] = [];
      const queue = [nodeId];

      while (queue.length > 0) {
        const currentId = queue.shift()!;

        if (visited.has(currentId)) {
          continue;
        }

        visited.add(currentId);
        component.push(currentId);

        const neighbors = Array.from(graph.edges.values())
          .filter(
            (edge) =>
              edge.sourceNode === currentId || edge.targetNode === currentId,
          )
          .map((edge) =>
            edge.sourceNode === currentId ? edge.targetNode : edge.sourceNode,
          );

        neighbors.forEach((neighborId) => {
          if (!visited.has(neighborId)) {
            queue.push(neighborId);
          }
        });
      }

      components.push(component);
    });

    return components;
  }

  /**
   * Find strongly connected components (Kosaraju's algorithm)
   */
  findStronglyConnectedComponents(graph: Graph): string[][] {
    const visited = new Set<string>();
    const order: string[] = [];

    // First pass: DFS to get finishing times
    const dfs1 = (nodeId: string) => {
      visited.add(nodeId);

      const outgoingEdges = Array.from(graph.edges.values()).filter(
        (edge) => edge.sourceNode === nodeId,
      );

      outgoingEdges.forEach((edge) => {
        if (!visited.has(edge.targetNode)) {
          dfs1(edge.targetNode);
        }
      });

      order.push(nodeId);
    };

    graph.nodes.forEach((_, nodeId) => {
      if (!visited.has(nodeId)) {
        dfs1(nodeId);
      }
    });

    // Second pass: DFS on reversed graph
    const reversedGraph = this.reverseGraph(graph);
    visited.clear();

    const sccs: string[][] = [];

    for (let i = order.length - 1; i >= 0; i--) {
      const nodeId = order[i];
      if (!nodeId) continue;

      if (visited.has(nodeId)) {
        continue;
      }

      const component: string[] = [];
      const stack = [nodeId];

      while (stack.length > 0) {
        const currentId = stack.pop()!;

        if (visited.has(currentId)) {
          continue;
        }

        visited.add(currentId);
        component.push(currentId);

        const outgoingEdges = Array.from(reversedGraph.edges.values()).filter(
          (edge) => edge.sourceNode === currentId,
        );

        outgoingEdges.forEach((edge) => {
          if (!visited.has(edge.targetNode)) {
            stack.push(edge.targetNode);
          }
        });
      }

      sccs.push(component);
    }

    return sccs;
  }

  /**
   * Reverse graph (for SCC algorithm)
   */
  private reverseGraph(graph: Graph): Graph {
    const reversedEdges = new Map<string, Edge>();

    graph.edges.forEach((edge, id) => {
      reversedEdges.set(id, {
        ...edge,
        sourceNode: edge.targetNode,
        targetNode: edge.sourceNode,
      });
    });

    return {
      ...graph,
      edges: reversedEdges,
    };
  }

  /**
   * Topological sort (Kahn's algorithm)
   */
  topologicalSort(graph: Graph): string[] | null {
    const inDegree = new Map<string, number>();
    const adjacencyList = new Map<string, string[]>();

    // Initialize
    graph.nodes.forEach((_, nodeId) => {
      inDegree.set(nodeId, 0);
      adjacencyList.set(nodeId, []);
    });

    // Build adjacency list and in-degree count
    graph.edges.forEach((edge) => {
      adjacencyList.get(edge.sourceNode)!.push(edge.targetNode);
      inDegree.set(edge.targetNode, (inDegree.get(edge.targetNode) || 0) + 1);
    });

    // Find nodes with in-degree 0
    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    const result: string[] = [];
    let visitedCount = 0;

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      result.push(nodeId);
      visitedCount++;

      const neighbors = adjacencyList.get(nodeId) || [];
      neighbors.forEach((neighborId) => {
        const newDegree = (inDegree.get(neighborId) || 0) - 1;
        inDegree.set(neighborId, newDegree);

        if (newDegree === 0) {
          queue.push(neighborId);
        }
      });
    }

    // Check for cycle
    if (visitedCount !== graph.nodes.size) {
      return null; // Graph has a cycle
    }

    return result;
  }

  /**
   * Detect cycles in graph
   */
  detectCycle(graph: Graph): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = Array.from(graph.edges.values()).filter(
        (edge) => edge.sourceNode === nodeId,
      );

      for (const edge of outgoingEdges) {
        const neighborId = edge.targetNode;

        if (!visited.has(neighborId)) {
          if (hasCycle(neighborId)) {
            return true;
          }
        } else if (recursionStack.has(neighborId)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const nodeId of graph.nodes.keys()) {
      if (!visited.has(nodeId)) {
        if (hasCycle(nodeId)) {
          return true;
        }
      }
    }

    return false;
  }
}
