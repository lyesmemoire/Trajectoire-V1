import { Test, TestingModule } from '@nestjs/testing';
import { GraphAnalyticsService } from './graph-analytics.service';
import { Graph, Node, Edge, NodeType, EdgeType } from './graph-types';

describe('GraphAnalyticsService', () => {
  let service: GraphAnalyticsService;

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
    type: NodeType.CANDIDATE,
    label: 'John Doe',
    normalizedLabel: 'john doe',
    confidence: 1.0,
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
    type: EdgeType.HAS_SKILL,
    sourceNode: 'node-3',
    targetNode: 'node-1',
    weight: 1.0,
    confidence: 0.9,
    reason: 'has skill',
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
    service = new GraphAnalyticsService(mockGraph);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateCoverage', () => {
    it('should calculate coverage metrics', () => {
      const result = service.calculateCoverage();

      expect(result).toBeDefined();
      expect(result.totalNodes).toBe(3);
      expect(result.totalEdges).toBe(2);
      expect(result.nodeTypes).toBeDefined();
      expect(result.edgeTypes).toBeDefined();
      expect(result.coverage).toBeGreaterThanOrEqual(0);
      expect(result.coverage).toBeLessThanOrEqual(1);
    });

    it('should count node types correctly', () => {
      const result = service.calculateCoverage();

      expect(result.nodeTypes[NodeType.SKILL]).toBe(2);
      expect(result.nodeTypes[NodeType.CANDIDATE]).toBe(1);
    });

    it('should count edge types correctly', () => {
      const result = service.calculateCoverage();

      expect(result.edgeTypes[EdgeType.RELATED_TO]).toBe(1);
      expect(result.edgeTypes[EdgeType.HAS_SKILL]).toBe(1);
    });
  });

  describe('calculateDensity', () => {
    it('should calculate density metrics', () => {
      const result = service.calculateDensity();

      expect(result).toBeDefined();
      expect(result.overallDensity).toBeGreaterThanOrEqual(0);
      expect(result.overallDensity).toBeLessThanOrEqual(1);
      expect(result.avgDegree).toBeGreaterThanOrEqual(0);
      expect(result.maxDegree).toBeGreaterThanOrEqual(result.minDegree);
    });
  });

  describe('calculateNodeDegree', () => {
    it('should calculate degree metrics for a node', () => {
      const result = service.calculateNodeDegree('node-1');

      expect(result).toBeDefined();
      expect(result.nodeId).toBe('node-1');
      expect(result.inDegree).toBeGreaterThanOrEqual(0);
      expect(result.outDegree).toBeGreaterThanOrEqual(0);
      expect(result.totalDegree).toBe(result.inDegree + result.outDegree);
    });

    it('should handle non-existent node', () => {
      const result = service.calculateNodeDegree('non-existent');

      expect(result).toBeDefined();
      expect(result.nodeId).toBe('non-existent');
      expect(result.inDegree).toBe(0);
      expect(result.outDegree).toBe(0);
    });
  });

  describe('calculateAllCentrality', () => {
    it('should calculate all centrality metrics', () => {
      const result = service.calculateAllCentrality();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0 && result[0]) {
        expect(result[0].degreeCentrality).toBeGreaterThanOrEqual(0);
        expect(result[0].betweennessCentrality).toBeGreaterThanOrEqual(0);
        expect(result[0].closenessCentrality).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('calculateNodeCentrality', () => {
    it('should calculate centrality for a node', () => {
      const result = service.calculateNodeCentrality('node-1');

      expect(result).toBeDefined();
      expect(result.nodeId).toBe('node-1');
      expect(result.degreeCentrality).toBeGreaterThanOrEqual(0);
    });
  });

  describe('findConnectedComponents', () => {
    it('should find connected components', () => {
      const result = service.findConnectedComponents();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should identify giant component', () => {
      const result = service.findConnectedComponents();

      const giantComponent = result.find((c) => c.isGiant);
      expect(giantComponent).toBeDefined();
    });
  });

  describe('calculateStatistics', () => {
    it('should calculate graph statistics', () => {
      const result = service.calculateStatistics();

      expect(result).toBeDefined();
      expect(result.nodeCount).toBe(3);
      expect(result.edgeCount).toBe(2);
      expect(result.avgNodeConfidence).toBeGreaterThanOrEqual(0);
      expect(result.avgNodeConfidence).toBeLessThanOrEqual(1);
      expect(result.avgEdgeConfidence).toBeGreaterThanOrEqual(0);
      expect(result.avgEdgeConfidence).toBeLessThanOrEqual(1);
    });

    it('should count isolated nodes', () => {
      const graphWithIsolated: Graph = {
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

      const isolatedService = new GraphAnalyticsService(graphWithIsolated);
      const result = isolatedService.calculateStatistics();

      expect(result.isolatedNodes).toBe(2);
    });

    it('should count self loops', () => {
      const selfLoopEdge: Edge = {
        id: 'edge-3',
        type: EdgeType.RELATED_TO,
        sourceNode: 'node-1',
        targetNode: 'node-1',
        weight: 1.0,
        confidence: 1.0,
        metadata: {},
        timestamps: { createdAt: new Date(), updatedAt: new Date() },
        provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
      };

      const graphWithSelfLoop: Graph = {
        id: 'graph-2',
        nodes: new Map([['node-1', mockNode1]]),
        edges: new Map([['edge-3', selfLoopEdge]]),
        metadata: {
          version: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'test',
        },
      };

      const selfLoopService = new GraphAnalyticsService(graphWithSelfLoop);
      const result = selfLoopService.calculateStatistics();

      expect(result.selfLoops).toBe(1);
    });
  });
});
