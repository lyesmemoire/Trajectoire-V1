import { Test, TestingModule } from '@nestjs/testing';
import { CopilotService } from './copilot.service';
import { CopilotContextService } from './copilot-context.service';
import { PrismaService } from '../runtime/kg/prisma.service';
import { PromptInterpreterService } from './prompt-interpreter.service';
import { ResponseBuilderService } from './response-builder.service';
import { ConversationMemoryService } from './conversation-memory.service';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { GraphReasoningEngine } from '../runtime/kg/graph-reasoning-engine.service';
import { CacheService } from '../cache/cache.decorator';

describe('Copilot Must Not Use Empty Graph', () => {
  let service: CopilotService;
  let copilotContextService: CopilotContextService;

  const mockPrismaService = {
    cVAnalysis: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockGraphRepository = {
    findGraphBySourceDocument: jest.fn(),
  };

  const mockGraphPersistence = {
    persistGraph: jest.fn(),
  };

  const mockPromptInterpreter = {
    interpret: jest.fn(),
  };

  const mockGraphReasoningEngine = {
    answerCandidateQuestion: jest.fn(),
  };

  const mockResponseBuilder = {
    buildResponse: jest.fn(),
  };

  const mockConversationMemory = {
    getOrCreateContext: jest.fn(),
    addMessage: jest.fn(),
    setLastSearchQuery: jest.fn(),
  };

  const mockGraphSearch = {
    searchCandidatesByNeighborhood: jest.fn(),
    searchJobsByNeighborhood: jest.fn(),
    searchCandidatesByCommunity: jest.fn(),
  };

  const mockGraphMatching = {
    match: jest.fn(),
  };

  const mockCacheService = {
    generateKey: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CopilotService,
        {
          provide: CopilotContextService,
          useValue: {
            loadCopilotContext: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PromptInterpreterService,
          useValue: mockPromptInterpreter,
        },
        {
          provide: GraphReasoningEngine,
          useValue: mockGraphReasoningEngine,
        },
        {
          provide: ResponseBuilderService,
          useValue: mockResponseBuilder,
        },
        {
          provide: ConversationMemoryService,
          useValue: mockConversationMemory,
        },
        {
          provide: GraphSearchService,
          useValue: mockGraphSearch,
        },
        {
          provide: GraphMatchingService,
          useValue: mockGraphMatching,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<CopilotService>(CopilotService);
    copilotContextService = module.get<CopilotContextService>(CopilotContextService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty Graph Detection', () => {
    it('should FAIL if createEmptyGraph is called when userId is provided', async () => {
      const userId = 'user123';
      const sessionId = 'session123';
      const message = 'Test message';

      // Mock context with real data
      const mockContext = {
        userId,
        cvId: 'cv123',
        graph: {
          id: 'graph123',
          nodes: new Map([['node1', { id: 'node1', type: 'SKILL', label: 'TypeScript' }]]),
          edges: new Map(),
          metadata: { version: '1.0.0', createdAt: new Date(), updatedAt: new Date(), source: 'CV_PARSER' },
        },
      };

      (copilotContextService.loadCopilotContext as jest.Mock).mockResolvedValue(mockContext);
      mockPromptInterpreter.interpret.mockReturnValue({ type: 'default', entities: {} });
      mockGraphReasoningEngine.answerCandidateQuestion.mockReturnValue({
        detailedExplanation: 'Test response',
        evidence: [],
        reasoningTrace: { confidence: 0.8, steps: [] },
      });
      mockResponseBuilder.buildResponse.mockReturnValue({
        message: 'Test response',
        reasoning: [],
        sources: [],
        confidence: 0.8,
        data: null,
        suggestedQuestions: [],
      });
      mockCacheService.get.mockResolvedValue(null);
      mockConversationMemory.getOrCreateContext.mockReturnValue({});

      await service.processMessage(sessionId, message, userId, { cvId: 'cv123' });

      // Verify that the reasoning engine was called with a NON-EMPTY graph
      expect(mockGraphReasoningEngine.answerCandidateQuestion).toHaveBeenCalled();
      const callArgs = mockGraphReasoningEngine.answerCandidateQuestion.mock.calls[0];
      const graphArg = callArgs[0];

      // Graph should NOT be empty
      expect(graphArg.nodes.size).toBeGreaterThan(0);
    });

    it('should FAIL if reasoning engine receives empty graph when data exists', async () => {
      const userId = 'user123';
      const sessionId = 'session123';
      const message = 'Test message';

      // Mock context with EMPTY graph (this should fail the test)
      const mockContext = {
        userId,
        cvId: 'cv123',
        graph: {
          id: 'graph123',
          nodes: new Map(), // EMPTY - THIS SHOULD FAIL
          edges: new Map(),
          metadata: { version: '1.0.0', createdAt: new Date(), updatedAt: new Date(), source: 'CV_PARSER' },
        },
      };

      (copilotContextService.loadCopilotContext as jest.Mock).mockResolvedValue(mockContext);
      mockPromptInterpreter.interpret.mockReturnValue({ type: 'default', entities: {} });
      mockGraphReasoningEngine.answerCandidateQuestion.mockReturnValue({
        detailedExplanation: 'Test response',
        evidence: [],
        reasoningTrace: { confidence: 0.8, steps: [] },
      });
      mockResponseBuilder.buildResponse.mockReturnValue({
        message: 'Test response',
        reasoning: [],
        sources: [],
        confidence: 0.8,
        data: null,
        suggestedQuestions: [],
      });
      mockCacheService.get.mockResolvedValue(null);
      mockConversationMemory.getOrCreateContext.mockReturnValue({});

      // The production code should throw an error when graph is empty with CV context
      await expect(service.processMessage(sessionId, message, userId, { cvId: 'cv123' }))
        .rejects.toThrow('Business context loaded but graph is empty');
    });

    it('should PASS if graph has nodes when CV data exists', async () => {
      const userId = 'user123';
      const sessionId = 'session123';
      const message = 'Test message';

      // Mock context with REAL graph
      const mockContext = {
        userId,
        cvId: 'cv123',
        graph: {
          id: 'graph123',
          nodes: new Map([
            ['node1', { id: 'node1', type: 'SKILL', label: 'TypeScript' }],
            ['node2', { id: 'node2', type: 'SKILL', label: 'NestJS' }],
            ['node3', { id: 'node3', type: 'CANDIDATE', label: 'Candidate' }],
          ]),
          edges: new Map([
            ['edge1', { id: 'edge1', type: 'HAS_SKILL', sourceNode: 'node3', targetNode: 'node1' }],
            ['edge2', { id: 'edge2', type: 'HAS_SKILL', sourceNode: 'node3', targetNode: 'node2' }],
          ]),
          metadata: { version: '1.0.0', createdAt: new Date(), updatedAt: new Date(), source: 'CV_PARSER' },
        },
      };

      (copilotContextService.loadCopilotContext as jest.Mock).mockResolvedValue(mockContext);
      mockPromptInterpreter.interpret.mockReturnValue({ type: 'default', entities: {} });
      mockGraphReasoningEngine.answerCandidateQuestion.mockReturnValue({
        detailedExplanation: 'Test response',
        evidence: [],
        reasoningTrace: { confidence: 0.8, steps: [] },
      });
      mockResponseBuilder.buildResponse.mockReturnValue({
        message: 'Test response',
        reasoning: [],
        sources: [],
        confidence: 0.8,
        data: null,
        suggestedQuestions: [],
      });
      mockCacheService.get.mockResolvedValue(null);
      mockConversationMemory.getOrCreateContext.mockReturnValue({});

      await service.processMessage(sessionId, message, userId, { cvId: 'cv123' });

      const callArgs = mockGraphReasoningEngine.answerCandidateQuestion.mock.calls[0];
      const graphArg = callArgs[0];

      // Graph should have nodes
      expect(graphArg.nodes.size).toBeGreaterThan(0);
      expect(graphArg.edges.size).toBeGreaterThan(0);
    });
  });

  describe('Graph Node Count Verification', () => {
    it('should verify graph contains at least 1 node when CV data exists', async () => {
      const userId = 'user123';
      const sessionId = 'session123';
      const message = 'Test message';

      const mockContext = {
        userId,
        cvId: 'cv123',
        graph: {
          id: 'graph123',
          nodes: new Map([['node1', { id: 'node1', type: 'SKILL', label: 'TypeScript' }]]),
          edges: new Map(),
          metadata: { version: '1.0.0', createdAt: new Date(), updatedAt: new Date(), source: 'CV_PARSER' },
        },
      };

      (copilotContextService.loadCopilotContext as jest.Mock).mockResolvedValue(mockContext);
      mockPromptInterpreter.interpret.mockReturnValue({ type: 'default', entities: {} });
      mockGraphReasoningEngine.answerCandidateQuestion.mockReturnValue({
        detailedExplanation: 'Test response',
        evidence: [],
        reasoningTrace: { confidence: 0.8, steps: [] },
      });
      mockResponseBuilder.buildResponse.mockReturnValue({
        message: 'Test response',
        reasoning: [],
        sources: [],
        confidence: 0.8,
        data: null,
        suggestedQuestions: [],
      });
      mockCacheService.get.mockResolvedValue(null);
      mockConversationMemory.getOrCreateContext.mockReturnValue({});

      await service.processMessage(sessionId, message, userId, { cvId: 'cv123' });

      const callArgs = mockGraphReasoningEngine.answerCandidateQuestion.mock.calls[0];
      const graphArg = callArgs[0];

      expect(graphArg.nodes.size).toBeGreaterThanOrEqual(1);
    });

    it('should FAIL if reasoning engine receives empty graph when Job context exists', async () => {
      const userId = 'user123';
      const sessionId = 'session123';
      const message = 'Test message';

      const mockContext = {
        userId,
        jobId: 'job123',
        graph: {
          id: 'graph123',
          nodes: new Map(),
          edges: new Map(),
          metadata: { version: '1.0.0', createdAt: new Date(), updatedAt: new Date(), source: 'JOB_PARSER' },
        },
      };

      (copilotContextService.loadCopilotContext as jest.Mock).mockResolvedValue(mockContext);
      mockPromptInterpreter.interpret.mockReturnValue({ type: 'default', entities: {} });
      mockGraphReasoningEngine.answerCandidateQuestion.mockReturnValue({
        detailedExplanation: 'Test response',
        evidence: [],
        reasoningTrace: { confidence: 0.8, steps: [] },
      });
      mockResponseBuilder.buildResponse.mockReturnValue({
        message: 'Test response',
        reasoning: [],
        sources: [],
        confidence: 0.8,
        data: null,
        suggestedQuestions: [],
      });
      mockCacheService.get.mockResolvedValue(null);
      mockConversationMemory.getOrCreateContext.mockReturnValue({});

      await expect(service.processMessage(sessionId, message, userId, { jobId: 'job123' }))
        .rejects.toThrow('Business context loaded but graph is empty');
    });

    it('should PASS if graph has nodes when Job data exists', async () => {
      const userId = 'user123';
      const sessionId = 'session123';
      const message = 'Test message';

      const mockContext = {
        userId,
        jobId: 'job123',
        graph: {
          id: 'graph123',
          nodes: new Map([
            ['node1', { id: 'node1', type: 'SKILL', label: 'TypeScript' }],
            ['node2', { id: 'node2', type: 'SKILL', label: 'NestJS' }],
            ['node3', { id: 'node3', type: 'JOB', label: 'Senior Developer' }],
          ]),
          edges: new Map([
            ['edge1', { id: 'edge1', type: 'REQUIRES_SKILL', sourceNode: 'node3', targetNode: 'node1' }],
            ['edge2', { id: 'edge2', type: 'REQUIRES_SKILL', sourceNode: 'node3', targetNode: 'node2' }],
          ]),
          metadata: { version: '1.0.0', createdAt: new Date(), updatedAt: new Date(), source: 'JOB_PARSER' },
        },
      };

      (copilotContextService.loadCopilotContext as jest.Mock).mockResolvedValue(mockContext);
      mockPromptInterpreter.interpret.mockReturnValue({ type: 'default', entities: {} });
      mockGraphReasoningEngine.answerCandidateQuestion.mockReturnValue({
        detailedExplanation: 'Test response',
        evidence: [],
        reasoningTrace: { confidence: 0.8, steps: [] },
      });
      mockResponseBuilder.buildResponse.mockReturnValue({
        message: 'Test response',
        reasoning: [],
        sources: [],
        confidence: 0.8,
        data: null,
        suggestedQuestions: [],
      });
      mockCacheService.get.mockResolvedValue(null);
      mockConversationMemory.getOrCreateContext.mockReturnValue({});

      const result = await service.processMessage(sessionId, message, userId, { jobId: 'job123' });

      expect(result).toBeDefined();
      expect(result.message).toBe('Test response');
    });

    it('should PASS if graph is empty when no CV/Job context is provided (general query)', async () => {
      const userId = 'user123';
      const sessionId = 'session123';
      const message = 'General question without specific context';

      const mockContext = {
        userId,
        graph: {
          id: 'graph123',
          nodes: new Map(),
          edges: new Map(),
          metadata: { version: '1.0.0', createdAt: new Date(), updatedAt: new Date(), source: 'GENERAL' },
        },
      };

      (copilotContextService.loadCopilotContext as jest.Mock).mockResolvedValue(mockContext);
      mockPromptInterpreter.interpret.mockReturnValue({ type: 'default', entities: {} });
      mockGraphReasoningEngine.answerCandidateQuestion.mockReturnValue({
        detailedExplanation: 'General response',
        evidence: [],
        reasoningTrace: { confidence: 0.5, steps: [] },
      });
      mockResponseBuilder.buildResponse.mockReturnValue({
        message: 'General response',
        reasoning: [],
        sources: [],
        confidence: 0.5,
        data: null,
        suggestedQuestions: [],
      });
      mockCacheService.get.mockResolvedValue(null);
      mockConversationMemory.getOrCreateContext.mockReturnValue({});

      const result = await service.processMessage(sessionId, message, userId);

      expect(result).toBeDefined();
      expect(result.message).toBe('General response');
    });
  });
});
