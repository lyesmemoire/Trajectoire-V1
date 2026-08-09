import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterSearchService } from './recruiter-search.service';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { CacheService } from '../cache/cache.decorator';
import { Graph, Node, NodeType, EdgeType } from '../runtime/kg/graph-types';

describe('RecruiterSearchService', () => {
  let service: RecruiterSearchService;
  let graphSearchService: GraphSearchService;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecruiterSearchService,
        {
          provide: GraphSearchService,
          useValue: {
            searchCandidatesByNeighborhood: jest.fn(),
            searchCandidatesBySimilarity: jest.fn(),
            findSimilarCandidates: jest.fn(),
            findSimilarJobs: jest.fn(),
          },
        },
        {
          provide: GraphMatchingService,
          useValue: {
            match: jest.fn().mockResolvedValue({
              score: { overall: 85 },
              transferableSkills: [],
              neighborhood: { overlap: 0.5 },
            }),
          },
        },
        {
          provide: CacheService,
          useValue: {
            generateKey: jest.fn().mockReturnValue('test-key'),
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(undefined),
            del: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<RecruiterSearchService>(RecruiterSearchService);
    graphSearchService = module.get<GraphSearchService>(GraphSearchService);
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should execute hybrid search with all strategies', async () => {
      (
        graphSearchService.searchCandidatesByNeighborhood as jest.Mock
      ).mockResolvedValue([
        {
          id: 'candidate-1',
          score: 85,
          graph: mockCandidateGraph,
          matchReason: ['High skill overlap'],
          commonNodes: [mockSkillNode],
          commonEdges: [],
          overlap: 0.85,
          distance: 0.15,
        },
      ]);

      (
        graphSearchService.searchCandidatesBySimilarity as jest.Mock
      ).mockReturnValue([
        {
          id: 'candidate-1',
          score: 80,
          graph: mockCandidateGraph,
          matchReason: ['Similar skills'],
          commonNodes: [mockSkillNode],
          commonEdges: [],
          jaccardSimilarity: 0.8,
          cosineSimilarity: 0.75,
          skillOverlap: 0.85,
        },
      ]);

      const query = {
        query: 'JavaScript developer',
        pagination: { page: 1, limit: 20 },
      };

      const result = await service.search(
        query,
        [mockCandidateGraph],
        'user-1',
      );

      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(result.facets).toBeDefined();
      expect(result.pagination).toBeDefined();
      expect(result.suggestions).toBeDefined();
      expect(result.queryTime).toBeGreaterThanOrEqual(0);
    });

    it('should use cached results when available', async () => {
      const cachedResult = {
        results: [],
        facets: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
        suggestions: [],
        queryTime: 100,
      };

      (cacheService.get as jest.Mock).mockResolvedValue(cachedResult);

      const query = { query: 'test' };
      const result = await service.search(query, [mockCandidateGraph]);

      expect(result).toBe(cachedResult);
      expect(cacheService.get).toHaveBeenCalled();
    });

    it('should record search history when userId is provided', async () => {
      (
        graphSearchService.searchCandidatesByNeighborhood as jest.Mock
      ).mockResolvedValue([]);
      (
        graphSearchService.searchCandidatesBySimilarity as jest.Mock
      ).mockReturnValue([]);

      await service.search({ query: 'test' }, [mockCandidateGraph], 'user-1');

      const history = await service.getSearchHistory('user-1');
      expect(history).toBeDefined();
      expect(history.length).toBeGreaterThan(0);
    });
  });

  describe('getSuggestions', () => {
    it('should return suggestions based on query', async () => {
      const suggestions = await service.getSuggestions('java', [
        mockCandidateGraph,
      ]);

      expect(Array.isArray(suggestions)).toBe(true);
      suggestions.forEach((s) => {
        expect(s).toHaveProperty('text');
        expect(s).toHaveProperty('type');
        expect(s).toHaveProperty('score');
      });
    });
  });

  describe('getAutocomplete', () => {
    it('should return autocomplete suggestions', async () => {
      const suggestions = await service.getAutocomplete('java', [
        mockCandidateGraph,
      ]);

      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getSearchHistory', () => {
    it('should return search history for user', async () => {
      (
        graphSearchService.searchCandidatesByNeighborhood as jest.Mock
      ).mockResolvedValue([]);
      (
        graphSearchService.searchCandidatesBySimilarity as jest.Mock
      ).mockReturnValue([]);

      await service.search({ query: 'test' }, [mockCandidateGraph], 'user-1');
      await service.search(
        { query: 'javascript' },
        [mockCandidateGraph],
        'user-1',
      );

      const history = await service.getSearchHistory('user-1');

      expect(history).toBeDefined();
      expect(history.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('clearSearchHistory', () => {
    it('should clear search history for user', async () => {
      (
        graphSearchService.searchCandidatesByNeighborhood as jest.Mock
      ).mockResolvedValue([]);
      (
        graphSearchService.searchCandidatesBySimilarity as jest.Mock
      ).mockReturnValue([]);

      await service.search({ query: 'test' }, [mockCandidateGraph], 'user-1');
      await service.clearSearchHistory('user-1');

      const history = await service.getSearchHistory('user-1');
      expect(history).toEqual([]);
    });
  });

  describe('getRecentSearches', () => {
    it('should return recent searches', async () => {
      (
        graphSearchService.searchCandidatesByNeighborhood as jest.Mock
      ).mockResolvedValue([]);
      (
        graphSearchService.searchCandidatesBySimilarity as jest.Mock
      ).mockReturnValue([]);

      await service.search({ query: 'test' }, [mockCandidateGraph], 'user-1');
      await service.search(
        { query: 'javascript' },
        [mockCandidateGraph],
        'user-1',
      );

      const recent = await service.getRecentSearches('user-1', 5);

      expect(Array.isArray(recent)).toBe(true);
      expect(recent.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getPopularSearches', () => {
    it('should return popular searches', async () => {
      (
        graphSearchService.searchCandidatesByNeighborhood as jest.Mock
      ).mockResolvedValue([]);
      (
        graphSearchService.searchCandidatesBySimilarity as jest.Mock
      ).mockReturnValue([]);

      await service.search(
        { query: 'javascript' },
        [mockCandidateGraph],
        'user-1',
      );
      await service.search(
        { query: 'javascript' },
        [mockCandidateGraph],
        'user-2',
      );
      await service.search({ query: 'python' }, [mockCandidateGraph], 'user-1');

      const popular = await service.getPopularSearches(10);

      expect(Array.isArray(popular)).toBe(true);
      expect(popular.length).toBeLessThanOrEqual(10);
      popular.forEach((p) => {
        expect(p).toHaveProperty('query');
        expect(p).toHaveProperty('count');
        expect(p).toHaveProperty('lastUsed');
      });
    });
  });

  describe('filters', () => {
    it('should apply skill filters', async () => {
      const query = {
        query: 'developer',
        filters: { skills: ['JavaScript'] },
      };

      (
        graphSearchService.searchCandidatesByNeighborhood as jest.Mock
      ).mockResolvedValue([]);
      (
        graphSearchService.searchCandidatesBySimilarity as jest.Mock
      ).mockReturnValue([]);

      const result = await service.search(query, [mockCandidateGraph]);

      expect(result).toBeDefined();
    });

    it('should apply experience filters', async () => {
      const query = {
        query: 'developer',
        filters: { experience: { min: 2, max: 5 } },
      };

      (
        graphSearchService.searchCandidatesByNeighborhood as jest.Mock
      ).mockResolvedValue([]);
      (
        graphSearchService.searchCandidatesBySimilarity as jest.Mock
      ).mockReturnValue([]);

      const result = await service.search(query, [mockCandidateGraph]);

      expect(result).toBeDefined();
    });

    it('should apply location filters', async () => {
      const query = {
        query: 'developer',
        filters: { location: ['Paris'] },
      };

      (
        graphSearchService.searchCandidatesByNeighborhood as jest.Mock
      ).mockResolvedValue([]);
      (
        graphSearchService.searchCandidatesBySimilarity as jest.Mock
      ).mockReturnValue([]);

      const result = await service.search(query, [mockCandidateGraph]);

      expect(result).toBeDefined();
    });
  });

  describe('pagination', () => {
    it('should apply pagination', async () => {
      const query = {
        query: 'developer',
        pagination: {
          page: 2,
          limit: 10,
          sortBy: 'relevance' as const,
          sortOrder: 'desc' as const,
        },
      };

      (
        graphSearchService.searchCandidatesByNeighborhood as jest.Mock
      ).mockResolvedValue([]);
      (
        graphSearchService.searchCandidatesBySimilarity as jest.Mock
      ).mockReturnValue([]);

      const result = await service.search(query, [mockCandidateGraph]);

      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(10);
    });
  });

  describe('ranking', () => {
    it('should apply custom ranking weights', async () => {
      const query = {
        query: 'developer',
        ranking: {
          weights: { graph: 0.5, semantic: 0.3, vector: 0.1, bm25: 0.1 },
        },
      };

      (
        graphSearchService.searchCandidatesByNeighborhood as jest.Mock
      ).mockResolvedValue([]);
      (
        graphSearchService.searchCandidatesBySimilarity as jest.Mock
      ).mockReturnValue([]);

      const result = await service.search(query, [mockCandidateGraph]);

      expect(result).toBeDefined();
    });
  });

  describe('facets', () => {
    it('should generate facets', async () => {
      const query = {
        query: 'developer',
        facets: { skills: true, experience: true, location: true },
      };

      (
        graphSearchService.searchCandidatesByNeighborhood as jest.Mock
      ).mockResolvedValue([]);
      (
        graphSearchService.searchCandidatesBySimilarity as jest.Mock
      ).mockReturnValue([]);

      const result = await service.search(query, [mockCandidateGraph]);

      expect(result.facets).toBeDefined();
      expect(Array.isArray(result.facets)).toBe(true);
    });
  });
});
