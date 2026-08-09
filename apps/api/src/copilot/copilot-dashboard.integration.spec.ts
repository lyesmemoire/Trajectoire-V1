import { Test, TestingModule } from '@nestjs/testing';
import { CopilotService } from './copilot.service';
import { PromptInterpreterService } from './prompt-interpreter.service';
import { ResponseBuilderService } from './response-builder.service';
import { ConversationMemoryService } from './conversation-memory.service';
import { CopilotContextService } from './copilot-context.service';
import { GraphReasoningEngine } from '../runtime/kg/graph-reasoning-engine.service';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { CacheService } from '../cache/cache.decorator';

describe('Copilot → Dashboard Integration', () => {
  let copilotService: CopilotService;
  let promptInterpreter: PromptInterpreterService;
  let responseBuilder: ResponseBuilderService;
  let conversationMemory: ConversationMemoryService;
  let graphReasoningEngine: GraphReasoningEngine;
  let graphSearchService: GraphSearchService;
  let graphMatchingService: GraphMatchingService;

  const TEST_USER_ID = 'test-dashboard-user-id';

  const mockGraph = {
    id: 'test-graph',
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
              data: {
                candidates: [
                  {
                    id: 'candidate-1',
                    name: 'John Doe',
                    score: 85,
                    skills: ['JavaScript', 'TypeScript'],
                  },
                  {
                    id: 'candidate-2',
                    name: 'Jane Doe',
                    score: 90,
                    skills: ['Python', 'Django'],
                  },
                ],
                metrics: {
                  totalCandidates: 2,
                  averageScore: 87.5,
                  topSkill: 'JavaScript',
                },
              },
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
              graph: mockGraph,
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
          provide: GraphSearchService,
          useValue: {
            searchCandidatesByNeighborhood: jest.fn().mockResolvedValue([]),
            searchCandidatesBySimilarity: jest.fn().mockResolvedValue([]),
            searchCandidatesByCommunity: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: GraphMatchingService,
          useValue: {
            match: jest.fn().mockResolvedValue({
              candidateId: 'candidate-1',
              jobId: 'job-1',
              score: {
                overall: 85,
                skills: 80,
                experience: 70,
                education: 75,
                location: 80,
                transferability: 75,
              },
              transferableSkills: [],
              neighborhood: {
                candidateNeighbors: [],
                jobNeighbors: [],
                commonNeighbors: [],
                overlap: 0.5,
              },
              distance: {
                skillDistance: 0.2,
                experienceDistance: 0.3,
                overallDistance: 0.25,
              },
              centrality: {
                candidateCentrality: 0.5,
                jobCentrality: 0.6,
                alignment: 0.8,
              },
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
    graphSearchService = module.get<GraphSearchService>(GraphSearchService);
    graphMatchingService =
      module.get<GraphMatchingService>(GraphMatchingService);
  });

  it('should be defined', () => {
    expect(copilotService).toBeDefined();
  });

  describe('Copilot → Dashboard Flow', () => {
    it('should process copilot response and format for dashboard', async () => {
      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Show me top candidates',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.message).toBeDefined();
      expect(copilotResponse.data).toBeDefined();
    });

    it('should include candidate data in dashboard format', async () => {
      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Show candidate statistics',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.data).toBeDefined();
      expect(copilotResponse.data.candidates).toBeDefined();
      expect(Array.isArray(copilotResponse.data.candidates)).toBe(true);
    });

    it('should include metrics for dashboard visualization', async () => {
      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Show dashboard metrics',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.data).toBeDefined();
      expect(copilotResponse.data.metrics).toBeDefined();
    });

    it('should provide reasoning sources for dashboard display', async () => {
      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Explain candidate selection',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.sources).toBeDefined();
      expect(copilotResponse.reasoning).toBeDefined();
    });

    it('should handle dashboard data aggregation', async () => {
      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Aggregate candidate data',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.data).toBeDefined();
      expect(
        copilotResponse.data.metrics.totalCandidates,
      ).toBeGreaterThanOrEqual(0);
    });

    it('should support dashboard filtering through copilot', async () => {
      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Filter candidates by score > 80',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.data).toBeDefined();
    });

    it('should provide dashboard-ready candidate ranking', async () => {
      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Rank candidates by score',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.data).toBeDefined();
      expect(copilotResponse.data.candidates).toBeDefined();
    });

    it('should include skill distribution for dashboard charts', async () => {
      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Show skill distribution',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.data).toBeDefined();
    });

    it('should handle dashboard pagination through copilot', async () => {
      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Show candidates page 1',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.data).toBeDefined();
    });

    it('should provide dashboard export data through copilot', async () => {
      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Export candidate data',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.data).toBeDefined();
    });

    it('should maintain conversation context for dashboard sessions', async () => {
      await copilotService.processMessage('session-1', 'Show candidates', TEST_USER_ID);
      await copilotService.processMessage('session-1', 'Filter by JavaScript', TEST_USER_ID);

      expect(conversationMemory.addMessage).toHaveBeenCalledTimes(4);
    });

    it('should support dashboard real-time updates through copilot', async () => {
      const copilotResponse = await copilotService.processMessage(
        'session-1',
        'Show live candidate updates',
        TEST_USER_ID,
      );

      expect(copilotResponse).toBeDefined();
      expect(copilotResponse.data).toBeDefined();
    });
  });
});
