/**
 * Knowledge Graph RH Runtime v2
 * Graph Query Service
 * Provides query capabilities for the graph
 */

import {
  Graph,
  Node,
  Edge,
  NodeType,
  EdgeType,
  TraversalOptions,
  TraversalDirection,
} from './graph-types';
import { NodeIndex, EdgeIndex } from './graph-types';

export class GraphQueryService {
  constructor() {}

  /**
   * Find a node by ID
   */
  findNode(graph: Graph, nodeId: string): Node | undefined {
    return graph.nodes.get(nodeId);
  }

  /**
   * Find nodes by type
   */
  findNodesByType(graph: Graph, type: NodeType): Node[] {
    return Array.from(graph.nodes.values()).filter(
      (node) => node.type === type,
    );
  }

  /**
   * Find nodes by label
   */
  findNodesByLabel(graph: Graph, label: string): Node[] {
    return Array.from(graph.nodes.values()).filter(
      (node) => node.label === label,
    );
  }

  /**
   * Find nodes by normalized label
   */
  findNodesByNormalizedLabel(graph: Graph, normalizedLabel: string): Node[] {
    return Array.from(graph.nodes.values()).filter(
      (node) => node.normalizedLabel === normalizedLabel,
    );
  }

  /**
   * Find nodes by source
   */
  findNodesBySource(graph: Graph, source: string): Node[] {
    return Array.from(graph.nodes.values()).filter(
      (node) => node.source === source,
    );
  }

  /**
   * Find nodes with confidence above threshold
   */
  findNodesByConfidence(graph: Graph, minConfidence: number): Node[] {
    return Array.from(graph.nodes.values()).filter(
      (node) => node.confidence >= minConfidence,
    );
  }

  /**
   * Find an edge by ID
   */
  findEdge(graph: Graph, edgeId: string): Edge | undefined {
    return graph.edges.get(edgeId);
  }

  /**
   * Find edges by type
   */
  findEdgesByType(graph: Graph, type: EdgeType): Edge[] {
    return Array.from(graph.edges.values()).filter(
      (edge) => edge.type === type,
    );
  }

  /**
   * Find edges by source node
   */
  findEdgesBySource(graph: Graph, sourceNodeId: string): Edge[] {
    return Array.from(graph.edges.values()).filter(
      (edge) => edge.sourceNode === sourceNodeId,
    );
  }

  /**
   * Find edges by target node
   */
  findEdgesByTarget(graph: Graph, targetNodeId: string): Edge[] {
    return Array.from(graph.edges.values()).filter(
      (edge) => edge.targetNode === targetNodeId,
    );
  }

  /**
   * Find edges between two nodes
   */
  findEdgesBetween(
    graph: Graph,
    sourceNodeId: string,
    targetNodeId: string,
  ): Edge[] {
    return Array.from(graph.edges.values()).filter(
      (edge) =>
        edge.sourceNode === sourceNodeId && edge.targetNode === targetNodeId,
    );
  }

  /**
   * Find edges by weight above threshold
   */
  findEdgesByWeight(graph: Graph, minWeight: number): Edge[] {
    return Array.from(graph.edges.values()).filter(
      (edge) => edge.weight >= minWeight,
    );
  }

  /**
   * Find edges by confidence above threshold
   */
  findEdgesByConfidence(graph: Graph, minConfidence: number): Edge[] {
    return Array.from(graph.edges.values()).filter(
      (edge) => edge.confidence >= minConfidence,
    );
  }

  /**
   * Find neighbors of a node (outgoing edges)
   */
  findNeighbors(
    graph: Graph,
    nodeId: string,
    options: TraversalOptions = {},
  ): Node[] {
    const direction = options.direction ?? TraversalDirection.OUTGOING;
    const edgeTypes = options.edgeTypes;

    let edges: Edge[] = [];

    switch (direction) {
      case TraversalDirection.OUTGOING:
        edges = this.findEdgesBySource(graph, nodeId);
        break;
      case TraversalDirection.INCOMING:
        edges = this.findEdgesByTarget(graph, nodeId);
        break;
      case TraversalDirection.BOTH:
        edges = [
          ...this.findEdgesBySource(graph, nodeId),
          ...this.findEdgesByTarget(graph, nodeId),
        ];
        break;
    }

    if (edgeTypes && edgeTypes.length > 0) {
      edges = edges.filter((edge) => edgeTypes.includes(edge.type));
    }

    const neighborIds = new Set<string>();
    edges.forEach((edge) => {
      if (edge.sourceNode === nodeId) {
        neighborIds.add(edge.targetNode);
      } else {
        neighborIds.add(edge.sourceNode);
      }
    });

    return Array.from(neighborIds)
      .map((id) => this.findNode(graph, id))
      .filter((node): node is Node => node !== undefined);
  }

  /**
   * Find neighbors with specific edge type
   */
  findNeighborsByEdgeType(
    graph: Graph,
    nodeId: string,
    edgeType: EdgeType,
    direction: TraversalDirection = TraversalDirection.OUTGOING,
  ): Node[] {
    return this.findNeighbors(graph, nodeId, {
      edgeTypes: [edgeType],
      direction,
    });
  }

  /**
   * Get subgraph around a node
   */
  getSubGraph(
    graph: Graph,
    nodeId: string,
    maxDepth: number = 1,
    options: TraversalOptions = {},
  ): Graph {
    const subGraphNodes = new Map<string, Node>();
    const subGraphEdges = new Map<string, Edge>();

    const visited = new Set<string>();
    const queue: Array<{ nodeId: string; depth: number }> = [
      { nodeId, depth: 0 },
    ];

    while (queue.length > 0) {
      const { nodeId: currentId, depth } = queue.shift()!;

      if (visited.has(currentId) || depth > maxDepth) {
        continue;
      }

      visited.add(currentId);

      const currentNode = this.findNode(graph, currentId);
      if (currentNode) {
        subGraphNodes.set(currentId, currentNode);
      }

      const neighbors = this.findNeighbors(graph, currentId, options);
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor.id)) {
          queue.push({ nodeId: neighbor.id, depth: depth + 1 });
        }

        // Add edges between current node and neighbors
        const edges = this.findEdgesBetween(graph, currentId, neighbor.id);
        edges.forEach((edge) => {
          subGraphEdges.set(edge.id, edge);
        });
      });
    }

    return {
      id: `subgraph_${nodeId}`,
      nodes: subGraphNodes,
      edges: subGraphEdges,
      metadata: {
        version: graph.metadata.version,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'SUBGRAPH',
        rootNodeId: nodeId,
        maxDepth,
      },
    };
  }

  /**
   * Get subgraph by node types
   */
  getSubGraphByTypes(
    graph: Graph,
    nodeTypes: NodeType[],
    includeEdges: boolean = true,
  ): Graph {
    const subGraphNodes = new Map<string, Node>();
    const subGraphEdges = new Map<string, Edge>();

    graph.nodes.forEach((node, id) => {
      if (nodeTypes.includes(node.type)) {
        subGraphNodes.set(id, node);
      }
    });

    if (includeEdges) {
      graph.edges.forEach((edge, id) => {
        if (
          subGraphNodes.has(edge.sourceNode) &&
          subGraphNodes.has(edge.targetNode)
        ) {
          subGraphEdges.set(id, edge);
        }
      });
    }

    return {
      id: `subgraph_types_${nodeTypes.join('_')}`,
      nodes: subGraphNodes,
      edges: subGraphEdges,
      metadata: {
        version: graph.metadata.version,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'SUBGRAPH',
        nodeTypes,
      },
    };
  }

  /**
   * Get subgraph by edge types
   */
  getSubGraphByEdgeTypes(graph: Graph, edgeTypes: EdgeType[]): Graph {
    const subGraphNodes = new Map<string, Node>();
    const subGraphEdges = new Map<string, Edge>();

    graph.edges.forEach((edge, id) => {
      if (edgeTypes.includes(edge.type)) {
        subGraphEdges.set(id, edge);
        subGraphNodes.set(edge.sourceNode, graph.nodes.get(edge.sourceNode)!);
        subGraphNodes.set(edge.targetNode, graph.nodes.get(edge.targetNode)!);
      }
    });

    return {
      id: `subgraph_edge_types_${edgeTypes.join('_')}`,
      nodes: subGraphNodes,
      edges: subGraphEdges,
      metadata: {
        version: graph.metadata.version,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'SUBGRAPH',
        edgeTypes,
      },
    };
  }

  /**
   * Find shortest path between two nodes (BFS)
   */
  findShortestPath(
    graph: Graph,
    sourceNodeId: string,
    targetNodeId: string,
    options: TraversalOptions = {},
  ): string[] | null {
    if (sourceNodeId === targetNodeId) {
      return [sourceNodeId];
    }

    const visited = new Set<string>();
    const queue: Array<{ nodeId: string; path: string[] }> = [
      { nodeId: sourceNodeId, path: [sourceNodeId] },
    ];

    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;

      if (nodeId === targetNodeId) {
        return path;
      }

      if (visited.has(nodeId)) {
        continue;
      }

      visited.add(nodeId);

      const neighbors = this.findNeighbors(graph, nodeId, options);
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor.id)) {
          queue.push({ nodeId: neighbor.id, path: [...path, neighbor.id] });
        }
      });
    }

    return null;
  }

  /**
   * Find all paths between two nodes (DFS)
   */
  findAllPaths(
    graph: Graph,
    sourceNodeId: string,
    targetNodeId: string,
    maxDepth: number = 10,
    options: TraversalOptions = {},
  ): string[][] {
    const paths: string[][] = [];
    const visited = new Set<string>();

    const dfs = (currentNodeId: string, path: string[], depth: number) => {
      if (depth > maxDepth) {
        return;
      }

      if (currentNodeId === targetNodeId) {
        paths.push([...path]);
        return;
      }

      visited.add(currentNodeId);

      const neighbors = this.findNeighbors(graph, currentNodeId, options);
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor.id)) {
          dfs(neighbor.id, [...path, neighbor.id], depth + 1);
        }
      });

      visited.delete(currentNodeId);
    };

    dfs(sourceNodeId, [sourceNodeId], 0);

    return paths;
  }

  /**
   * Find connected components
   */
  findConnectedComponents(graph: Graph): string[][] {
    const visited = new Set<string>();
    const components: string[][] = [];

    graph.nodes.forEach((node, nodeId) => {
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

        const neighbors = this.findNeighbors(graph, currentId);
        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor.id)) {
            queue.push(neighbor.id);
          }
        });
      }

      components.push(component);
    });

    return components;
  }

  /**
   * Check if two nodes are connected
   */
  areConnected(
    graph: Graph,
    sourceNodeId: string,
    targetNodeId: string,
    options: TraversalOptions = {},
  ): boolean {
    const path = this.findShortestPath(
      graph,
      sourceNodeId,
      targetNodeId,
      options,
    );
    return path !== null;
  }
}
