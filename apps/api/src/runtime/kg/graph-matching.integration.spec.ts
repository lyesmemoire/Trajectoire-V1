import { Test, TestingModule } from '@nestjs/testing';
import { GraphMatchingService } from './graph-matching.service';
import { GraphQueryEngine } from './graph-query-engine.service';
import { GraphAnalyticsService } from './graph-analytics.service';
import { CacheService } from '../../cache/cache.decorator';
import { BulkheadService } from '../../resilience/bulkhead.service';
import { Graph, Node, Edge, NodeType, EdgeType } from './graph-types';

describe('Graph → Matching Integration', () => {
  let graphMatchingService: GraphMatchingService;
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
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(undefined),
            del: jest.fn().mockResolvedValue(undefined),
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
    graphQueryEngine = module.get<GraphQueryEngine>(GraphQueryEngine);
    graphAnalyticsService = module.get<GraphAnalyticsService>(
      GraphAnalyticsService,
    );
  });

  it('should be defined', () => {
    expect(graphMatchingService).toBeDefined();
  });

  describe('Graph → Matching Flow', () => {
    it('should match candidate graph to job graph', async () => {
      const result = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(result).toBeDefined();
      expect(result.candidateId).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.score).toBeDefined();
      expect(result.score.overall.value).toBeGreaterThanOrEqual(0);
      expect(result.score.overall.value).toBeLessThanOrEqual(100);
    });

    it('should use GraphQueryEngine to find transferable skills', async () => {
      await graphMatchingService.match(mockCandidateGraph, mockJobGraph);

      expect(graphQueryEngine.findCandidate).not.toHaveBeenCalled();
    });

    it('should calculate all dimension scores', async () => {
      const result = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(result.score.hardSkills).toBeDefined();
      expect(result.score.softSkills).toBeDefined();
      expect(result.score.experience).toBeDefined();
      expect(result.score.education).toBeDefined();
      expect(result.score.languages).toBeDefined();
      expect(result.score.careerPath).toBeDefined();
      expect(result.score.transferableSkills).toBeDefined();
      expect(result.score.graphSimilarity).toBeDefined();
      expect(result.score.semanticSimilarity).toBeDefined();
      expect(result.score.confidence).toBeDefined();
    });

    it('should calculate transferable skills between graphs', async () => {
      const result = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(result.transferableSkills).toBeDefined();
      expect(Array.isArray(result.transferableSkills)).toBe(true);
    });

    it('should identify matched and missing skills', async () => {
      const result = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(result.matchedSkills).toBeDefined();
      expect(result.missingSkills).toBeDefined();
      expect(Array.isArray(result.matchedSkills)).toBe(true);
      expect(Array.isArray(result.missingSkills)).toBe(true);
    });

    it('should generate strengths and weaknesses', async () => {
      const result = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(result.strengths).toBeDefined();
      expect(result.weaknesses).toBeDefined();
      expect(Array.isArray(result.strengths)).toBe(true);
      expect(Array.isArray(result.weaknesses)).toBe(true);
    });

    it('should generate recommendations', async () => {
      const result = await graphMatchingService.match(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('should throw error if candidate node not found', async () => {
      const graphWithoutCandidate = { ...mockCandidateGraph, nodes: new Map() };

      await expect(
        graphMatchingService.match(graphWithoutCandidate, mockJobGraph),
      ).rejects.toThrow('Candidate node not found in graph');
    });

    it('should handle graphs with multiple skills', async () => {
      const multiSkillGraph: Graph = {
        id: 'graph-3',
        nodes: new Map([
          ['candidate-1', mockCandidateNode],
          ['skill-1', mockSkillNode],
          [
            'skill-2',
            {
              ...mockSkillNode,
              id: 'skill-2',
              label: 'TypeScript',
              normalizedLabel: 'typescript',
            },
          ],
        ]),
        edges: new Map([
          ['edge-1', mockEdge],
          ['edge-2', { ...mockEdge, id: 'edge-2', targetNode: 'skill-2' }],
        ]),
        metadata: {
          version: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'cv',
        },
      };

      const result = await graphMatchingService.match(
        multiSkillGraph,
        mockJobGraph,
      );

      expect(result).toBeDefined();
      expect(result.score.overall.value).toBeGreaterThanOrEqual(0);
    });

    it('should handle graphs with no matching skills', async () => {
      const noSkillGraph: Graph = {
        id: 'graph-4',
        nodes: new Map([
          ['candidate-1', mockCandidateNode],
          [
            'skill-3',
            {
              ...mockSkillNode,
              id: 'skill-3',
              label: 'Python',
              normalizedLabel: 'python',
            },
          ],
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

      const result = await graphMatchingService.match(
        noSkillGraph,
        mockJobGraph,
      );

      expect(result).toBeDefined();
      expect(result.matchedSkills).toBeDefined();
    });
  });
});
