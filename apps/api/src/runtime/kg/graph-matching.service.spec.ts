import { Test, TestingModule } from '@nestjs/testing';
import { GraphMatchingService } from './graph-matching.service';
import { GraphQueryEngine } from './graph-query-engine.service';
import { GraphAnalyticsService } from './graph-analytics.service';
import { CacheService } from '../../cache/cache.decorator';
import { BulkheadService } from '../../resilience/bulkhead.service';
import { Graph, Node, Edge, NodeType, EdgeType } from './graph-types';

describe('GraphMatchingService', () => {
  let service: GraphMatchingService;
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
        GraphMatchingService,
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

    service = module.get<GraphMatchingService>(GraphMatchingService);
    graphQueryEngine = module.get<GraphQueryEngine>(GraphQueryEngine);
    graphAnalyticsService = module.get<GraphAnalyticsService>(
      GraphAnalyticsService,
    );
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('match', () => {
    it('should return cached matching result if available', async () => {
      const cachedResult = {
        candidateId: 'candidate-1',
        jobId: 'job-1',
        score: {
          overall: {
            value: 85,
            evidence: [],
            explanation: '',
            justification: '',
          },
          hardSkills: {
            value: 90,
            evidence: [],
            explanation: '',
            justification: '',
          },
          softSkills: {
            value: 80,
            evidence: [],
            explanation: '',
            justification: '',
          },
          experience: {
            value: 85,
            evidence: [],
            explanation: '',
            justification: '',
          },
          education: {
            value: 90,
            evidence: [],
            explanation: '',
            justification: '',
          },
          languages: {
            value: 85,
            evidence: [],
            explanation: '',
            justification: '',
          },
          careerPath: {
            value: 85,
            evidence: [],
            explanation: '',
            justification: '',
          },
          transferableSkills: {
            value: 85,
            evidence: [],
            explanation: '',
            justification: '',
          },
          graphSimilarity: {
            value: 85,
            evidence: [],
            explanation: '',
            justification: '',
          },
          semanticSimilarity: {
            value: 85,
            evidence: [],
            explanation: '',
            justification: '',
          },
          confidence: {
            value: 85,
            evidence: [],
            explanation: '',
            justification: '',
          },
        },
        transferableSkills: [],
        matchedSkills: [],
        missingSkills: [],
        strengths: [],
        weaknesses: [],
        recommendations: [],
      };

      (cacheService.get as jest.Mock).mockResolvedValue(cachedResult);

      const result = await service.match(mockCandidateGraph, mockJobGraph);

      expect(result).toBe(cachedResult);
      expect(cacheService.get).toHaveBeenCalled();
    });

    it('should throw error if candidate node not found', async () => {
      const graphWithoutCandidate = { ...mockCandidateGraph, nodes: new Map() };
      (cacheService.get as jest.Mock).mockResolvedValue(null);

      await expect(
        service.match(graphWithoutCandidate, mockJobGraph),
      ).rejects.toThrow('Candidate node not found in graph');
    });

    it('should throw error if job node not found', async () => {
      const graphWithoutJob = { ...mockJobGraph, nodes: new Map() };
      (cacheService.get as jest.Mock).mockResolvedValue(null);

      await expect(
        service.match(mockCandidateGraph, graphWithoutJob),
      ).rejects.toThrow('Job node not found in graph');
    });

    it('should calculate matching score and cache result', async () => {
      (cacheService.get as jest.Mock).mockResolvedValue(null);

      const result = await service.match(mockCandidateGraph, mockJobGraph);

      expect(result).toBeDefined();
      expect(result.candidateId).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.score.overall.value).toBeGreaterThanOrEqual(0);
      expect(result.score.overall.value).toBeLessThanOrEqual(100);
      expect(cacheService.set).toHaveBeenCalled();
    });
  });

  describe('calculateHardSkillsScore', () => {
    it('should calculate hard skills score based on graph relations', () => {
      const score = (service as any).calculateHardSkillsScore(
        mockCandidateGraph,
        mockJobGraph,
        mockCandidateNode,
        mockJobNode,
      );

      expect(score).toBeDefined();
      expect(score.value).toBeGreaterThanOrEqual(0);
      expect(score.value).toBeLessThanOrEqual(100);
      expect(score.evidence).toBeDefined();
      expect(score.explanation).toBeDefined();
      expect(score.justification).toBeDefined();
    });
  });

  describe('calculateSoftSkillsScore', () => {
    it('should calculate soft skills score based on graph relations', () => {
      const score = (service as any).calculateSoftSkillsScore(
        mockCandidateGraph,
        mockJobGraph,
        mockCandidateNode,
        mockJobNode,
      );

      expect(score).toBeDefined();
      expect(score.value).toBeGreaterThanOrEqual(0);
      expect(score.value).toBeLessThanOrEqual(100);
      expect(score.evidence).toBeDefined();
    });
  });

  describe('calculateExperienceScore', () => {
    it('should calculate experience score based on graph relations', () => {
      const score = (service as any).calculateExperienceScore(
        mockCandidateGraph,
        mockJobGraph,
        mockCandidateNode,
        mockJobNode,
      );

      expect(score).toBeDefined();
      expect(score.value).toBeGreaterThanOrEqual(0);
      expect(score.value).toBeLessThanOrEqual(100);
      expect(score.evidence).toBeDefined();
    });
  });

  describe('calculateEducationScore', () => {
    it('should calculate education score based on graph relations', () => {
      const score = (service as any).calculateEducationScore(
        mockCandidateGraph,
        mockJobGraph,
        mockCandidateNode,
        mockJobNode,
      );

      expect(score).toBeDefined();
      expect(score.value).toBeGreaterThanOrEqual(0);
      expect(score.value).toBeLessThanOrEqual(100);
      expect(score.evidence).toBeDefined();
    });
  });

  describe('calculateLanguagesScore', () => {
    it('should calculate languages score based on graph relations', () => {
      const score = (service as any).calculateLanguagesScore(
        mockCandidateGraph,
        mockJobGraph,
        mockCandidateNode,
        mockJobNode,
      );

      expect(score).toBeDefined();
      expect(score.value).toBeGreaterThanOrEqual(0);
      expect(score.value).toBeLessThanOrEqual(100);
      expect(score.evidence).toBeDefined();
    });
  });

  describe('calculateCareerPathScore', () => {
    it('should calculate career path score based on graph relations', () => {
      const score = (service as any).calculateCareerPathScore(
        mockCandidateGraph,
        mockJobGraph,
        mockCandidateNode,
        mockJobNode,
      );

      expect(score).toBeDefined();
      expect(score.value).toBeGreaterThanOrEqual(0);
      expect(score.value).toBeLessThanOrEqual(100);
      expect(score.evidence).toBeDefined();
    });
  });

  describe('calculateTransferableSkillsScore', () => {
    it('should calculate transferable skills score using GraphQueryEngine', () => {
      const score = (service as any).calculateTransferableSkillsScore(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(score).toBeDefined();
      expect(score.value).toBeGreaterThanOrEqual(0);
      expect(score.value).toBeLessThanOrEqual(100);
      expect(score.evidence).toBeDefined();
    });
  });

  describe('calculateGraphSimilarityScore', () => {
    it('should calculate graph similarity score using Jaccard and cosine similarity', () => {
      const score = (service as any).calculateGraphSimilarityScore(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(score).toBeDefined();
      expect(score.value).toBeGreaterThanOrEqual(0);
      expect(score.value).toBeLessThanOrEqual(100);
      expect(score.evidence).toBeDefined();
    });
  });

  describe('calculateSemanticSimilarityScore', () => {
    it('should calculate semantic similarity score based on node types', () => {
      const score = (service as any).calculateSemanticSimilarityScore(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(score).toBeDefined();
      expect(score.value).toBeGreaterThanOrEqual(0);
      expect(score.value).toBeLessThanOrEqual(100);
      expect(score.evidence).toBeDefined();
    });
  });

  describe('calculateConfidenceScore', () => {
    it('should calculate confidence score based on node and edge confidence', () => {
      const score = (service as any).calculateConfidenceScore(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(score).toBeDefined();
      expect(score.value).toBeGreaterThanOrEqual(0);
      expect(score.value).toBeLessThanOrEqual(100);
      expect(score.evidence).toBeDefined();
    });
  });

  describe('findTransferableSkills', () => {
    it('should find transferable skills between graphs', () => {
      const transferableSkills = (service as any).findTransferableSkills(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(Array.isArray(transferableSkills)).toBe(true);
      transferableSkills.forEach((ts: any) => {
        expect(ts.evidence).toBeDefined();
        expect(Array.isArray(ts.evidence)).toBe(true);
      });
    });
  });
});
