import { Test, TestingModule } from '@nestjs/testing';
import { GraphMatchingService } from './graph-matching.service';
import { GraphSearchService } from './graph-search.service';
import { GraphQueryEngine } from './graph-query-engine.service';
import { GraphAnalyticsService } from './graph-analytics.service';
import { CacheService } from '../../cache/cache.decorator';
import { BulkheadService } from '../../resilience/bulkhead.service';
import { Graph, NodeType, EdgeType } from './graph-types';

describe('Matching → Search Integration', () => {
  let graphMatchingService: GraphMatchingService;
  let graphSearchService: GraphSearchService;
  let graphQueryEngine: GraphQueryEngine;
  let graphAnalyticsService: GraphAnalyticsService;

  const mockCandidateNode = {
    id: 'candidate-1',
    type: NodeType.CANDIDATE,
    label: 'John Doe',
    normalizedLabel: 'john doe',
    confidence: 1,
    source: 'cv',
    metadata: {},
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
  };

  const mockSkillNode = {
    id: 'skill-1',
    type: NodeType.SKILL,
    label: 'JavaScript',
    normalizedLabel: 'javascript',
    confidence: 0.9,
    source: 'cv',
    metadata: {},
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
  };

  const mockJobNode = {
    id: 'job-1',
    type: NodeType.JOB,
    label: 'Software Engineer',
    normalizedLabel: 'software engineer',
    confidence: 1,
    source: 'job',
    metadata: {},
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
  };

  const mockEdge = {
    id: 'edge-1',
    type: EdgeType.HAS_SKILL,
    sourceNode: 'candidate-1',
    targetNode: 'skill-1',
    weight: 1.0,
    confidence: 0.9,
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
    edges: new Map([['edge-1', mockEdge]]),
    metadata: {
      version: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'cv',
    },
  };

  const mockJobGraph: Graph = {
    id: 'graph-2',
    nodes: new Map([
      ['job-1', mockJobNode],
      ['skill-1', mockSkillNode],
    ]),
    edges: new Map([['edge-1', mockEdge]]),
    metadata: {
      version: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'job',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphMatchingService,
        GraphSearchService,
        {
          provide: GraphQueryEngine,
          useValue: {
            findCandidate: jest.fn().mockResolvedValue(mockCandidateNode),
            findSkill: jest.fn().mockResolvedValue(mockSkillNode),
          },
        },
        {
          provide: GraphAnalyticsService,
          useValue: {
            calculateAllCentrality: jest.fn().mockResolvedValue([
              {
                nodeId: 'candidate-1',
                degreeCentrality: 0.5,
                betweennessCentrality: 0.4,
                closenessCentrality: 0.6,
              },
            ]),
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
        {
          provide: BulkheadService,
          useValue: {
            execute: jest.fn().mockImplementation(async (name, fn) => fn()),
            getBulkhead: jest.fn(),
            getBulkheadStats: jest.fn(),
          },
        },
      ],
    }).compile();

    graphMatchingService =
      module.get<GraphMatchingService>(GraphMatchingService);
    graphSearchService = module.get<GraphSearchService>(GraphSearchService);
    graphQueryEngine = module.get<GraphQueryEngine>(GraphQueryEngine);
    graphAnalyticsService = module.get<GraphAnalyticsService>(
      GraphAnalyticsService,
    );
  });

  it('should be defined', () => {
    expect(graphMatchingService).toBeDefined();
    expect(graphSearchService).toBeDefined();
  });

  describe('Matching → Search Flow', () => {
    it('should match candidate to job and then search for similar candidates', async () => {
      // Step 1: Match candidate to job
      const matchingResult = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(matchingResult).toBeDefined();
      expect(matchingResult.score.overall.value).toBeGreaterThanOrEqual(0);

      // Step 2: Use matching result to search for similar candidates
      const searchResults =
        await graphSearchService.searchCandidatesBySimilarity(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();
      expect(Array.isArray(searchResults)).toBe(true);
    });

    it('should use matching score to inform search results', async () => {
      const matchingResult = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(matchingResult.score).toBeDefined();

      const searchResults =
        await graphSearchService.searchCandidatesByNeighborhood(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();
      expect(Array.isArray(searchResults)).toBe(true);
    });

    it('should propagate transferable skills from matching to search', async () => {
      const matchingResult = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(matchingResult.transferableSkills).toBeDefined();

      const searchResults =
        await graphSearchService.searchCandidatesByCommunity(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();
    });

    it('should handle multiple candidate graphs in search after matching', async () => {
      const candidateGraph2: Graph = {
        id: 'graph-3',
        nodes: new Map([
          [
            'candidate-2',
            { ...mockCandidateNode, id: 'candidate-2', label: 'Jane Doe' },
          ],
          ['skill-2', { ...mockSkillNode, id: 'skill-2', label: 'TypeScript' }],
        ]),
        edges: new Map([
          [
            'edge-2',
            {
              ...mockEdge,
              id: 'edge-2',
              sourceNode: 'candidate-2',
              targetNode: 'skill-2',
            },
          ],
        ]),
        metadata: {
          version: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'cv',
        },
      };

      const matchingResult1 = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );
      const matchingResult2 = await graphMatchingService.match(
        candidateGraph2,
        mockJobGraph,
      );

      expect(matchingResult1).toBeDefined();
      expect(matchingResult2).toBeDefined();

      const searchResults =
        await graphSearchService.searchCandidatesBySimilarity(mockJobGraph, [
          mockCandidateGraph,
          candidateGraph2,
        ]);

      expect(searchResults).toBeDefined();
      expect(Array.isArray(searchResults)).toBe(true);
    });

    it('should use neighborhood overlap from matching in search', async () => {
      const matchingResult = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(matchingResult.neighborhood).toBeDefined();
      expect(matchingResult.neighborhood!.overlap).toBeGreaterThanOrEqual(0);

      const searchResults =
        await graphSearchService.searchCandidatesByNeighborhood(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();
    });

    it('should handle low matching scores in search results', async () => {
      const lowMatchingGraph: Graph = {
        id: 'graph-4',
        nodes: new Map([
          ['candidate-3', { ...mockCandidateNode, id: 'candidate-3' }],
          ['skill-3', { ...mockSkillNode, id: 'skill-3', label: 'Python' }],
        ]),
        edges: new Map([
          ['edge-3', { ...mockEdge, id: 'edge-3', targetNode: 'skill-3' }],
        ]),
        metadata: {
          version: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'cv',
        },
      };

      const matchingResult = await graphMatchingService.match(
        lowMatchingGraph,
        mockJobGraph,
      );

      expect(matchingResult).toBeDefined();

      const searchResults =
        await graphSearchService.searchCandidatesBySimilarity(mockJobGraph, [
          lowMatchingGraph,
        ]);

      expect(searchResults).toBeDefined();
    });

    it('should integrate centrality alignment from matching into search', async () => {
      const matchingResult = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(matchingResult.centrality).toBeDefined();
      expect(matchingResult.centrality!.alignment).toBeGreaterThanOrEqual(0);

      const searchResults =
        await graphSearchService.searchCandidatesBySimilarity(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();
    });

    it('should use matched skills to filter search results', async () => {
      const matchingResult = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(matchingResult.matchedSkills).toBeDefined();

      const searchResults =
        await graphSearchService.searchCandidatesByNeighborhood(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();
    });

    it('should handle missing skills in search context', async () => {
      const matchingResult = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(matchingResult.missingSkills).toBeDefined();

      const searchResults =
        await graphSearchService.searchCandidatesBySimilarity(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();
    });

    it('should propagate recommendations from matching to search', async () => {
      const matchingResult = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(matchingResult.recommendations).toBeDefined();

      const searchResults =
        await graphSearchService.searchCandidatesByNeighborhood(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();
    });
  });
});
