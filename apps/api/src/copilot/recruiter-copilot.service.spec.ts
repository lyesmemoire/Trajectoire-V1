import { Test, TestingModule } from '@nestjs/testing';
import { RecruiterCopilotService } from './recruiter-copilot.service';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { GraphReasoningEngine } from '../runtime/kg/graph-reasoning-engine.service';
import { RecruiterSearchService } from '../search/recruiter-search.service';
import { CacheService } from '../cache/cache.decorator';
import { Graph, Node, NodeType, EdgeType } from '../runtime/kg/graph-types';

describe('RecruiterCopilotService', () => {
  let service: RecruiterCopilotService;
  let graphSearchService: GraphSearchService;
  let graphMatchingService: GraphMatchingService;
  let graphReasoningEngine: GraphReasoningEngine;
  let recruiterSearchService: RecruiterSearchService;
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

  const mockCandidateGraph2: Graph = {
    id: 'graph-2',
    nodes: new Map([
      [
        'candidate-2',
        { ...mockCandidateNode, id: 'candidate-2', label: 'Jane Doe' },
      ],
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
    id: 'job-1',
    nodes: new Map([
      [
        'job-1',
        {
          ...mockCandidateNode,
          id: 'job-1',
          type: NodeType.JOB,
          label: 'Senior Developer',
        },
      ],
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
        RecruiterCopilotService,
        {
          provide: GraphSearchService,
          useValue: {
            searchCandidatesByNeighborhood: jest.fn(),
            searchCandidatesBySimilarity: jest.fn(),
            searchCandidatesByCommunity: jest.fn(),
          },
        },
        {
          provide: GraphMatchingService,
          useValue: {
            match: jest.fn(),
          },
        },
        {
          provide: GraphReasoningEngine,
          useValue: {
            answerCandidateQuestion: jest.fn(),
          },
        },
        {
          provide: RecruiterSearchService,
          useValue: {
            search: jest.fn(),
            getSuggestions: jest.fn(),
            getAutocomplete: jest.fn(),
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

    service = module.get<RecruiterCopilotService>(RecruiterCopilotService);
    graphSearchService = module.get<GraphSearchService>(GraphSearchService);
    graphMatchingService =
      module.get<GraphMatchingService>(GraphMatchingService);
    graphReasoningEngine =
      module.get<GraphReasoningEngine>(GraphReasoningEngine);
    recruiterSearchService = module.get<RecruiterSearchService>(
      RecruiterSearchService,
    );
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('compareCandidates', () => {
    it('should compare two candidates', async () => {
      const comparison = await service.compareCandidates(
        mockCandidateGraph,
        mockCandidateGraph2,
      );

      expect(comparison).toBeDefined();
      expect(comparison.candidate1).toBe(mockCandidateGraph);
      expect(comparison.candidate2).toBe(mockCandidateGraph2);
      expect(comparison.comparison).toBeDefined();
      expect(comparison.comparison.skills).toBeDefined();
      expect(comparison.comparison.experience).toBeDefined();
      expect(comparison.comparison.education).toBeDefined();
      expect(comparison.comparison.overall).toBeGreaterThanOrEqual(0);
      expect(comparison.recommendation).toBeDefined();
      expect(comparison.evidence).toBeDefined();
      expect(comparison.confidence).toBeGreaterThanOrEqual(0);
    });

    it('should use cached comparison when available', async () => {
      const cachedComparison = {
        candidate1: mockCandidateGraph,
        candidate2: mockCandidateGraph2,
        comparison: {
          skills: { match: 50, details: [] },
          experience: { match: 50, details: [] },
          education: { match: 50, details: [] },
          overall: 50,
        },
        recommendation: 'Test recommendation',
        evidence: [],
        confidence: 0.5,
      };

      (cacheService.get as jest.Mock).mockResolvedValue(cachedComparison);

      const comparison = await service.compareCandidates(
        mockCandidateGraph,
        mockCandidateGraph2,
      );

      expect(comparison).toBe(cachedComparison);
    });
  });

  describe('explainMatching', () => {
    it('should explain matching between candidate and job', async () => {
      const mockMatchingResult = {
        candidateId: 'graph-1',
        jobId: 'job-1',
        matchedSkills: [mockSkillNode],
        missingSkills: [],
        transferableSkills: [],
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
        strengths: ['Strong technical skills'],
        weaknesses: ['Limited management experience'],
        recommendations: ['Consider leadership training'],
      };

      (graphMatchingService.match as jest.Mock).mockResolvedValue(
        mockMatchingResult,
      );

      const explanation = await service.explainMatching(
        mockCandidateGraph,
        mockJobGraph,
      );

      expect(explanation).toBeDefined();
      expect(explanation.candidateId).toBe('graph-1');
      expect(explanation.jobId).toBe('job-1');
      expect(explanation.matchScore).toBe(85);
      expect(explanation.dimensionScores).toBeDefined();
      expect(explanation.strengths).toBeDefined();
      expect(explanation.weaknesses).toBeDefined();
      expect(explanation.recommendations).toBeDefined();
      expect(explanation.evidence).toBeDefined();
      expect(explanation.confidence).toBe(85);
    });
  });

  describe('findProfiles', () => {
    it('should find profiles matching criteria', async () => {
      const criteria = {
        skills: ['JavaScript'],
        experience: { min: 2, max: 5 },
      };

      const profiles = await service.findProfiles(criteria, [
        mockCandidateGraph,
      ]);

      expect(profiles).toBeDefined();
      expect(profiles.candidates).toBeDefined();
      expect(Array.isArray(profiles.candidates)).toBe(true);
      expect(profiles.evidence).toBeDefined();
      expect(profiles.confidence).toBeGreaterThanOrEqual(0);
    });
  });

  describe('createShortlist', () => {
    it('should create shortlist for job', async () => {
      const mockMatchingResult = {
        candidateId: 'graph-1',
        jobId: 'job-1',
        matchedSkills: [mockSkillNode],
        missingSkills: [],
        transferableSkills: [],
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
        strengths: ['Strong technical skills'],
        weaknesses: [],
        recommendations: [],
      };

      (graphMatchingService.match as jest.Mock).mockResolvedValue(
        mockMatchingResult,
      );

      const shortlist = await service.createShortlist(
        mockJobGraph,
        [mockCandidateGraph],
        5,
      );

      expect(shortlist).toBeDefined();
      expect(shortlist.jobId).toBe('job-1');
      expect(shortlist.jobGraph).toBe(mockJobGraph);
      expect(shortlist.candidates).toBeDefined();
      expect(Array.isArray(shortlist.candidates)).toBe(true);
      expect(shortlist.totalCandidates).toBe(1);
      expect(shortlist.averageScore).toBeGreaterThanOrEqual(0);
      expect(shortlist.evidence).toBeDefined();
      expect(shortlist.confidence).toBeGreaterThanOrEqual(0);
    });
  });

  describe('analyzeJobPosting', () => {
    it('should analyze job posting', async () => {
      const analysis = await service.analyzeJobPosting(mockJobGraph);

      expect(analysis).toBeDefined();
      expect(analysis.jobId).toBe('job-1');
      expect(analysis.jobGraph).toBe(mockJobGraph);
      expect(analysis.requirements).toBeDefined();
      expect(analysis.requirements.skills).toBeDefined();
      expect(analysis.requirements.experience).toBeGreaterThanOrEqual(0);
      expect(analysis.difficulty).toBeGreaterThanOrEqual(0);
      expect(analysis.difficulty).toBeLessThanOrEqual(100);
      expect(analysis.marketDemand).toBeGreaterThanOrEqual(0);
      expect(analysis.marketDemand).toBeLessThanOrEqual(100);
      expect(analysis.salaryRange).toBeDefined();
      expect(analysis.recommendedSkills).toBeDefined();
      expect(Array.isArray(analysis.recommendedSkills)).toBe(true);
      expect(analysis.evidence).toBeDefined();
      expect(analysis.confidence).toBeGreaterThanOrEqual(0);
    });
  });

  describe('reasonAboutQuestion', () => {
    it('should reason about a question', async () => {
      const mockReasoningResult = {
        detailedExplanation: 'The candidate has strong JavaScript skills',
        reasoningTrace: {
          query: 'Does the candidate know JavaScript?',
          steps: [{ description: 'Analyzed skills' }],
          finalConclusion: 'Candidate knows JavaScript',
          confidence: 0.85,
          citedNodes: [mockSkillNode],
          citedEdges: [],
          timestamp: new Date(),
        },
        evidence: [
          {
            claim: 'Candidate knows JavaScript',
            supportingNodes: [mockSkillNode],
            supportingEdges: [],
            confidence: 0.9,
          },
        ],
      };

      (
        graphReasoningEngine.answerCandidateQuestion as jest.Mock
      ).mockReturnValue(mockReasoningResult);

      const reasoning = await service.reasonAboutQuestion(
        'Does the candidate know JavaScript?',
        mockCandidateGraph,
      );

      expect(reasoning).toBeDefined();
      expect(reasoning.question).toBe('Does the candidate know JavaScript?');
      expect(reasoning.answer).toBeDefined();
      expect(reasoning.reasoning).toBeDefined();
      expect(Array.isArray(reasoning.reasoning)).toBe(true);
      expect(reasoning.evidence).toBeDefined();
      expect(Array.isArray(reasoning.evidence)).toBe(true);
      expect(reasoning.confidence).toBeGreaterThanOrEqual(0);
    });
  });

  describe('evidence structure', () => {
    it('should ensure all responses contain evidence with required fields', async () => {
      const comparison = await service.compareCandidates(
        mockCandidateGraph,
        mockCandidateGraph2,
      );

      comparison.evidence.forEach((e) => {
        expect(e).toHaveProperty('source');
        expect(e).toHaveProperty('citation');
        expect(e).toHaveProperty('proof');
        expect(e).toHaveProperty('node');
        expect(e).toHaveProperty('edge');
        expect(e).toHaveProperty('confidence');
        expect(e.confidence).toBeGreaterThanOrEqual(0);
        expect(e.confidence).toBeLessThanOrEqual(1);
      });
    });
  });
});
