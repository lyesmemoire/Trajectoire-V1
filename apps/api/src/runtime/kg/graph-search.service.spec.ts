import { Test, TestingModule } from '@nestjs/testing';
import { GraphSearchService } from './graph-search.service';
import { GraphQueryEngine } from './graph-query-engine.service';
import { GraphAnalyticsService } from './graph-analytics.service';
import { CacheService } from '../../cache/cache.decorator';
import { Graph, Node, Edge, NodeType, EdgeType } from './graph-types';

describe('GraphSearchService', () => {
  let service: GraphSearchService;
  let graphQueryEngine: GraphQueryEngine;
  let graphAnalyticsService: GraphAnalyticsService;
  let cacheService: CacheService;

  const mockCandidateNode: Node = {
    id: 'candidate-1',
    type: NodeType.CANDIDATE,
    label: 'John Doe',
    normalizedLabel: 'john doe',
    confidence: 1.0,
    source: 'test',
    metadata: {},
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
  };

  const mockJobNode: Node = {
    id: 'job-1',
    type: NodeType.JOB,
    label: 'Software Engineer',
    normalizedLabel: 'software engineer',
    confidence: 1.0,
    source: 'test',
    metadata: {},
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
  };

  const mockSkillNode: Node = {
    id: 'skill-1',
    type: NodeType.SKILL,
    label: 'JavaScript',
    normalizedLabel: 'javascript',
    confidence: 0.9,
    source: 'test',
    metadata: {},
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
  };

  const mockCandidateGraph: Graph = {
    id: 'graph-1',
    nodes: new Map([
      ['candidate-1', mockCandidateNode],
      ['skill-1', mockSkillNode],
    ]),
    edges: new Map(),
    metadata: {
      version: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'test',
    },
  };

  const mockJobGraph: Graph = {
    id: 'graph-2',
    nodes: new Map([
      ['job-1', mockJobNode],
      ['skill-1', mockSkillNode],
    ]),
    edges: new Map(),
    metadata: {
      version: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'test',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphSearchService,
        {
          provide: GraphQueryEngine,
          useValue: {
            findSkill: jest.fn(),
            findCompany: jest.fn(),
            findCandidate: jest.fn(),
            findNeighbors: jest.fn(),
            findShortestPath: jest.fn(),
            findPaths: jest.fn(),
          },
        },
        {
          provide: GraphAnalyticsService,
          useValue: {
            calculateAllCentrality: jest.fn(),
            calculateDegree: jest.fn(),
            calculateBetweenness: jest.fn(),
            calculateCloseness: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            generateKey: jest.fn().mockReturnValue('test-key'),
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GraphSearchService>(GraphSearchService);
    graphQueryEngine = module.get<GraphQueryEngine>(GraphQueryEngine);
    graphAnalyticsService = module.get<GraphAnalyticsService>(
      GraphAnalyticsService,
    );
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchCandidatesByNeighborhood', () => {
    it('should return cached results if available', async () => {
      const cachedResults = [
        {
          id: 'candidate-1',
          score: 85,
          graph: mockCandidateGraph,
          matchReason: ['Skill overlap'],
          commonNodes: [mockSkillNode],
          commonEdges: [],
          overlap: 0.5,
          distance: 0.2,
        },
      ];

      (cacheService.get as jest.Mock).mockResolvedValue(cachedResults);

      const result = await service.searchCandidatesByNeighborhood(
        mockJobGraph,
        [mockCandidateGraph],
      );

      expect(result).toBe(cachedResults);
      expect(cacheService.get).toHaveBeenCalled();
    });

    it('should return empty array if job node not found', async () => {
      const graphWithoutJob = { ...mockJobGraph, nodes: new Map() };
      (cacheService.get as jest.Mock).mockResolvedValue(null);

      const result = await service.searchCandidatesByNeighborhood(
        graphWithoutJob,
        [mockCandidateGraph],
      );

      expect(result).toEqual([]);
    });

    it('should calculate neighborhood overlap and cache results', async () => {
      (cacheService.get as jest.Mock).mockResolvedValue(null);

      const result = await service.searchCandidatesByNeighborhood(
        mockJobGraph,
        [mockCandidateGraph],
      );

      expect(Array.isArray(result)).toBe(true);
      expect(cacheService.set).toHaveBeenCalled();
    });
  });

  describe('searchCandidatesBySimilarity', () => {
    it('should calculate similarity metrics', async () => {
      (cacheService.get as jest.Mock).mockResolvedValue(null);

      const result = await service.searchCandidatesBySimilarity(mockJobGraph, [
        mockCandidateGraph,
      ]);

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('searchCandidatesByCommunity', () => {
    it('should calculate community metrics', async () => {
      (cacheService.get as jest.Mock).mockResolvedValue(null);

      const result = await service.searchCandidatesByCommunity(mockJobGraph, [
        mockCandidateGraph,
      ]);

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('searchJobsByNeighborhood', () => {
    it('should calculate job neighborhood overlap', async () => {
      (cacheService.get as jest.Mock).mockResolvedValue(null);

      const result = await service.searchJobsByNeighborhood(
        mockCandidateGraph,
        [mockJobGraph],
      );

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findCommonElements', () => {
    it('should find common nodes and edges', () => {
      const { commonNodes, commonEdges } = (service as any).findCommonElements(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(Array.isArray(commonNodes)).toBe(true);
      expect(Array.isArray(commonEdges)).toBe(true);
    });
  });
});
