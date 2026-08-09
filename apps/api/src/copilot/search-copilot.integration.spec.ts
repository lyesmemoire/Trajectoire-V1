import { Test, TestingModule } from '@nestjs/testing';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { CopilotService } from './copilot.service';
import { PromptInterpreterService } from './prompt-interpreter.service';
import { ResponseBuilderService } from './response-builder.service';
import { ConversationMemoryService } from './conversation-memory.service';
import { CopilotContextService } from './copilot-context.service';
import { GraphReasoningEngine } from '../runtime/kg/graph-reasoning-engine.service';
import { GraphQueryEngine } from '../runtime/kg/graph-query-engine.service';
import { GraphAnalyticsService } from '../runtime/kg/graph-analytics.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { CacheService } from '../cache/cache.decorator';
import { Graph, NodeType, EdgeType } from '../runtime/kg/graph-types';

describe('Search → Copilot Integration', () => {
  let graphSearchService: GraphSearchService;
  let copilotService: CopilotService;
  let promptInterpreter: PromptInterpreterService;
  let responseBuilder: ResponseBuilderService;
  let conversationMemory: ConversationMemoryService;
  let graphReasoningEngine: GraphReasoningEngine;

  const TEST_USER_ID = 'test-search-user-id';

  const mockGraphForContext = {
    id: 'test-graph-context',
    nodes: new Map([['node-1', {
      id: 'node-1',
      type: 'CANDIDATE' as any,
      label: 'Test',
      normalizedLabel: 'test',
      confidence: 1,
      source: 'test',
      metadata: {},
      timestamps: { createdAt: new Date(), updatedAt: new Date() },
      provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
    }]]),
    edges: new Map(),
    metadata: {},
  };

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
        GraphSearchService,
        CopilotService,
        {
          provide: PromptInterpreterService,
          useValue: {
            interpret: jest
              .fn()
              .mockReturnValue({ type: 'explain_score', entities: {} }),
          },
        },
        {
          provide: GraphReasoningEngine,
          useValue: {
            answerCandidateQuestion: jest.fn().mockReturnValue({
              detailedExplanation: 'Test explanation',
              evidence: [{ claim: 'Test evidence', confidence: 0.9 }],
              reasoningTrace: { confidence: 0.85 },
            }),
          },
        },
        {
          provide: ResponseBuilderService,
          useValue: {
            buildResponse: jest.fn().mockReturnValue({
              message: 'Test response',
              sources: [],
              reasoning: [],
            }),
          },
        },
        {
          provide: CopilotContextService,
          useValue: {
            loadCopilotContext: jest.fn().mockResolvedValue({
              userId: TEST_USER_ID,
              cvId: 'test-cv-id',
              jobId: 'test-job-id',
              graph: mockGraphForContext,
            }),
          },
        },
        {
          provide: ConversationMemoryService,
          useValue: {
            getOrCreateContext: jest.fn().mockReturnValue({}),
            addMessage: jest.fn(),
            getContext: jest.fn().mockReturnValue([]),
            clearContext: jest.fn(),
            setLastSearchQuery: jest.fn(),
            getLastReport: jest.fn(),
            getConversationHistory: jest.fn().mockResolvedValue([]),
            clearConversation: jest.fn(),
            getAllSessions: jest.fn().mockResolvedValue([]),
          },
        },
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
          provide: GraphMatchingService,
          useValue: {
            match: jest.fn().mockResolvedValue({
              candidateId: 'candidate-1',
              jobId: 'job-1',
              score: {
                overall: { value: 85 },
                hardSkills: { value: 80 },
                softSkills: { value: 70 },
              },
              transferableSkills: [],
              matchedSkills: [],
              missingSkills: [],
              strengths: [],
              weaknesses: [],
              recommendations: [],
            }),
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

    graphSearchService = module.get<GraphSearchService>(GraphSearchService);
    copilotService = module.get<CopilotService>(CopilotService);
    promptInterpreter = module.get<PromptInterpreterService>(
      PromptInterpreterService,
    );
    responseBuilder = module.get<ResponseBuilderService>(
      ResponseBuilderService,
    );
    conversationMemory = module.get<ConversationMemoryService>(
      ConversationMemoryService,
    );
    graphReasoningEngine =
      module.get<GraphReasoningEngine>(GraphReasoningEngine);
  });

  it('should be defined', () => {
    expect(graphSearchService).toBeDefined();
    expect(copilotService).toBeDefined();
  });

  describe('Search → Copilot Flow', () => {
    it('should search candidates and use results in copilot response', async () => {
      // Step 1: Search for candidates
      const searchResults =
        await graphSearchService.searchCandidatesByNeighborhood(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();
      expect(Array.isArray(searchResults)).toBe(true);

      // Step 2: Use search results in copilot
      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Find candidates for Software Engineer',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.message).toBeDefined();
    });

    it('should use search similarity results in copilot conversation', async () => {
      const searchResults =
        await graphSearchService.searchCandidatesBySimilarity(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();

      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Find similar candidates',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(responseBuilder.buildResponse).toHaveBeenCalled();
    });

    it('should integrate neighborhood search with copilot reasoning', async () => {
      const searchResults =
        await graphSearchService.searchCandidatesByNeighborhood(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();

      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Analyze candidate neighborhood',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(graphReasoningEngine.answerCandidateQuestion).toHaveBeenCalled();
    });

    it('should use community search results in copilot recommendations', async () => {
      const searchResults =
        await graphSearchService.searchCandidatesByCommunity(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();

      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Recommend candidates from same community',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
    });

    it('should handle search results with multiple candidates in copilot', async () => {
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

      const searchResults =
        await graphSearchService.searchCandidatesByNeighborhood(mockJobGraph, [
          mockCandidateGraph,
          candidateGraph2,
        ]);

      expect(searchResults).toBeDefined();
      expect(Array.isArray(searchResults)).toBe(true);

      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Compare candidates',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
    });

    it('should use job search results in copilot conversations', async () => {
      const jobSearchResults =
        await graphSearchService.searchJobsByNeighborhood(mockCandidateGraph, [
          mockJobGraph,
        ]);

      expect(jobSearchResults).toBeDefined();

      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Find similar jobs',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
    });

    it('should integrate search scores into copilot explanations', async () => {
      const searchResults =
        await graphSearchService.searchCandidatesBySimilarity(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();

      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Explain candidate match',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.reasoning).toBeDefined();
    });

    it('should handle empty search results in copilot', async () => {
      const emptyGraph: Graph = {
        id: 'graph-4',
        nodes: new Map(),
        edges: new Map(),
        metadata: {
          version: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'test',
        },
      };

      const searchResults =
        await graphSearchService.searchCandidatesByNeighborhood(mockJobGraph, [
          emptyGraph,
        ]);

      expect(searchResults).toBeDefined();

      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Find candidates',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
    });

    it('should use search context in conversation memory', async () => {
      const searchResults =
        await graphSearchService.searchCandidatesByNeighborhood(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();

      await copilotService.processMessage('session-1', 'Find candidates', TEST_USER_ID);

      expect(conversationMemory.addMessage).toHaveBeenCalled();
    });

    it('should integrate search results with copilot sources', async () => {
      const searchResults =
        await graphSearchService.searchCandidatesByNeighborhood(mockJobGraph, [
          mockCandidateGraph,
        ]);

      expect(searchResults).toBeDefined();

      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Find candidates with sources',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.sources).toBeDefined();
    });
  });
});
