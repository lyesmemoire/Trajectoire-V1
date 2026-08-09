import { Test, TestingModule } from '@nestjs/testing';
import { GraphSerializerService } from './graph-serializer.service';
import { Graph, Node, Edge, NodeType, EdgeType } from './graph-types';

describe('GraphSerializerService', () => {
  let service: GraphSerializerService;

  const mockNode: Node = {
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

  const mockEdge: Edge = {
    id: 'edge-1',
    type: EdgeType.HAS_SKILL,
    sourceNode: 'node-1',
    targetNode: 'node-2',
    weight: 1.0,
    confidence: 0.9,
    reason: 'test',
    metadata: {},
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
  };

  const mockGraph: Graph = {
    id: 'graph-1',
    nodes: new Map([['node-1', mockNode]]),
    edges: new Map([['edge-1', mockEdge]]),
    metadata: {
      version: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'test',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphSerializerService],
    }).compile();

    service = module.get<GraphSerializerService>(GraphSerializerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('serialize', () => {
    it('should serialize graph to JSON format', () => {
      const result = service.serialize(mockGraph, 'JSON');

      expect(result).toBeDefined();
      expect(result.format).toBe('JSON');
      expect(result.data).toBeDefined();
      if (
        result.data &&
        typeof result.data === 'object' &&
        'id' in result.data
      ) {
        expect(result.data.id).toBe('graph-1');
      }
    });

    it('should serialize graph to GraphML format', () => {
      const result = service.serialize(mockGraph, 'GRAPHML');

      expect(result).toBeDefined();
      expect(result.format).toBe('GRAPHML');
    });

    it('should serialize graph to Neo4j format', () => {
      const result = service.serialize(mockGraph, 'NEO4J');

      expect(result).toBeDefined();
      expect(result.format).toBe('NEO4J');
    });

    it('should throw error for unsupported format', () => {
      expect(() => service.serialize(mockGraph, 'UNKNOWN' as any)).toThrow(
        'Unsupported serialization format',
      );
    });

    it('should default to JSON format', () => {
      const result = service.serialize(mockGraph);

      expect(result.format).toBe('JSON');
    });
  });

  describe('deserialize', () => {
    it('should deserialize graph from JSON format', () => {
      const result = service.deserialize(mockGraph, 'JSON');

      expect(result).toBeDefined();
    });

    it('should deserialize graph from GraphML format', () => {
      const result = service.deserialize('<graphml></graphml>', 'GRAPHML');

      expect(result).toBeDefined();
    });

    it('should deserialize graph from Neo4j format', () => {
      const result = service.deserialize(
        { metadata: { graphId: 'test' }, nodes: [], edges: [] },
        'NEO4J',
      );

      expect(result).toBeDefined();
    });

    it('should throw error for unsupported format', () => {
      expect(() => service.deserialize({}, 'UNKNOWN' as any)).toThrow(
        'Unsupported deserialization format',
      );
    });

    it('should default to JSON format', () => {
      const result = service.deserialize({
        id: 'test',
        nodes: [],
        edges: [],
        metadata: {},
      });

      expect(result).toBeDefined();
    });
  });

  describe('serializeToJSON', () => {
    it('should convert nodes and edges to arrays', () => {
      const result = (service as any).serializeToJSON(mockGraph);

      expect(Array.isArray(result.data.nodes)).toBe(true);
      expect(Array.isArray(result.data.edges)).toBe(true);
    });

    it('should include timestamps in ISO format', () => {
      const result = (service as any).serializeToJSON(mockGraph);

      expect(typeof result.data.nodes[0].timestamps.createdAt).toBe('string');
      expect(typeof result.data.metadata.createdAt).toBe('string');
    });
  });

  describe('deserializeFromJSON', () => {
    it('should convert arrays back to Maps', () => {
      const data = {
        id: 'graph-1',
        nodes: [mockNode],
        edges: [mockEdge],
        metadata: {
          version: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'test',
        },
      };

      const result = (service as any).deserializeFromJSON(data);

      expect(result.nodes).toBeInstanceOf(Map);
      expect(result.edges).toBeInstanceOf(Map);
    });

    it('should parse ISO string timestamps back to Date objects', () => {
      const data = {
        id: 'graph-1',
        nodes: [
          {
            ...mockNode,
            timestamps: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        ],
        edges: [],
        metadata: {
          version: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'test',
        },
      };

      const result = (service as any).deserializeFromJSON(data);

      expect(result.nodes.get('node-1')?.timestamps.createdAt).toBeInstanceOf(
        Date,
      );
    });
  });
});
