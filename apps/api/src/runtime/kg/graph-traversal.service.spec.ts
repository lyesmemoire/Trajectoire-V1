import { Test, TestingModule } from '@nestjs/testing';
import { GraphTraversalService } from './graph-traversal.service';
import {
  Graph,
  Node,
  Edge,
  NodeType,
  EdgeType,
  TraversalDirection,
} from './graph-types';

describe('GraphTraversalService', () => {
  let service: GraphTraversalService;

  const mockNode1: Node = {
    id: 'node-1',
    type: NodeType.SKILL,
    label: 'JavaScript',
    normalizedLabel: 'javascript',
    confidence: 0.9,
    source: 'test',
    metadata: {},
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
  };

  const mockNode2: Node = {
    id: 'node-2',
    type: NodeType.SKILL,
    label: 'TypeScript',
    normalizedLabel: 'typescript',
    confidence: 0.9,
    source: 'test',
    metadata: {},
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
  };

  const mockNode3: Node = {
    id: 'node-3',
    type: NodeType.SKILL,
    label: 'React',
    normalizedLabel: 'react',
    confidence: 0.9,
    source: 'test',
    metadata: {},
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
  };

  const mockEdge1: Edge = {
    id: 'edge-1',
    type: EdgeType.RELATED_TO,
    sourceNode: 'node-1',
    targetNode: 'node-2',
    weight: 0.8,
    confidence: 0.9,
    reason: 'related',
    metadata: {},
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
  };

  const mockEdge2: Edge = {
    id: 'edge-2',
    type: EdgeType.RELATED_TO,
    sourceNode: 'node-2',
    targetNode: 'node-3',
    weight: 0.8,
    confidence: 0.9,
    reason: 'related',
    metadata: {},
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
  };

  const mockGraph: Graph = {
    id: 'graph-1',
    nodes: new Map([
      ['node-1', mockNode1],
      ['node-2', mockNode2],
      ['node-3', mockNode3],
    ]),
    edges: new Map([
      ['edge-1', mockEdge1],
      ['edge-2', mockEdge2],
    ]),
    metadata: {
      version: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'test',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphTraversalService],
    }).compile();

    service = module.get<GraphTraversalService>(GraphTraversalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('bfs', () => {
    it('should perform BFS traversal', () => {
      const result = service.bfs(mockGraph, 'node-1');

      expect(result).toBeDefined();
      expect(result.path).toContain('node-1');
      expect(result.nodes.length).toBeGreaterThan(0);
    });

    it('should respect maxDepth option', () => {
      const result = service.bfs(mockGraph, 'node-1', { maxDepth: 1 });

      expect(result.path.length).toBeLessThanOrEqual(2);
    });

    it('should traverse in outgoing direction by default', () => {
      const result = service.bfs(mockGraph, 'node-1', {
        direction: TraversalDirection.OUTGOING,
      });

      expect(result).toBeDefined();
    });

    it('should traverse in incoming direction', () => {
      const result = service.bfs(mockGraph, 'node-2', {
        direction: TraversalDirection.INCOMING,
      });

      expect(result).toBeDefined();
    });

    it('should traverse in both directions', () => {
      const result = service.bfs(mockGraph, 'node-2', {
        direction: TraversalDirection.BOTH,
      });

      expect(result).toBeDefined();
    });

    it('should filter by edge types', () => {
      const result = service.bfs(mockGraph, 'node-1', {
        edgeTypes: [EdgeType.RELATED_TO],
      });

      expect(result).toBeDefined();
    });

    it('should handle disconnected nodes', () => {
      const disconnectedGraph: Graph = {
        id: 'graph-2',
        nodes: new Map([['node-1', mockNode1]]),
        edges: new Map(),
        metadata: {
          version: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'test',
        },
      };

      const result = service.bfs(disconnectedGraph, 'node-1');

      expect(result.path).toEqual(['node-1']);
    });

    it('should handle non-existent start node', () => {
      const result = service.bfs(mockGraph, 'non-existent');

      expect(result.path).toContain('non-existent');
      expect(result.nodes).toEqual([]);
    });
  });

  describe('dfs', () => {
    it('should perform DFS traversal', () => {
      const result = service.dfs(mockGraph, 'node-1');

      expect(result).toBeDefined();
      expect(result.path).toContain('node-1');
      expect(result.nodes.length).toBeGreaterThan(0);
    });

    it('should respect maxDepth option', () => {
      const result = service.dfs(mockGraph, 'node-1', { maxDepth: 1 });

      expect(result.path.length).toBeLessThanOrEqual(2);
    });

    it('should traverse in outgoing direction by default', () => {
      const result = service.dfs(mockGraph, 'node-1', {
        direction: TraversalDirection.OUTGOING,
      });

      expect(result).toBeDefined();
    });

    it('should filter by edge types', () => {
      const result = service.dfs(mockGraph, 'node-1', {
        edgeTypes: [EdgeType.RELATED_TO],
      });

      expect(result).toBeDefined();
    });
  });

  describe('findShortestPath', () => {
    it('should find shortest path between nodes', () => {
      const result = service.findShortestPath(mockGraph, 'node-1', 'node-3');

      expect(result).toBeDefined();
      if (result) {
        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toBe('node-1');
        expect(result[result.length - 1]).toBe('node-3');
      }
    });

    it('should return empty path if no path exists', () => {
      const disconnectedGraph: Graph = {
        id: 'graph-2',
        nodes: new Map([
          ['node-1', mockNode1],
          ['node-2', mockNode2],
        ]),
        edges: new Map(),
        metadata: {
          version: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'test',
        },
      };

      const result = service.findShortestPath(
        disconnectedGraph,
        'node-1',
        'node-2',
      );

      expect(result).toBeNull();
    });

    it('should handle same start and end node', () => {
      const result = service.findShortestPath(mockGraph, 'node-1', 'node-1');

      if (result) {
        expect(result).toEqual(['node-1']);
      }
    });
  });

  describe('findAllPaths', () => {
    it('should find all paths between nodes', () => {
      const result = service.findAllPaths(mockGraph, 'node-1', 'node-3', 10);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should respect maxDepth parameter', () => {
      const result = service.findAllPaths(mockGraph, 'node-1', 'node-3', 2);

      expect(result).toBeDefined();
    });
  });
});
