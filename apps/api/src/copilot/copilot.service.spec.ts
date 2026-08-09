import { Test, TestingModule } from '@nestjs/testing';
import { CopilotService } from './copilot.service';
import { PromptInterpreterService } from './prompt-interpreter.service';
import { ResponseBuilderService } from './response-builder.service';
import { ConversationMemoryService } from './conversation-memory.service';
import { CopilotContextService } from './copilot-context.service';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { GraphReasoningEngine } from '../runtime/kg/graph-reasoning-engine.service';
import { CacheService } from '../cache/cache.decorator';
import { Graph } from '../runtime/kg/graph-types';

describe('CopilotService', () => {
  let service: CopilotService;
  let promptInterpreter: PromptInterpreterService;
  let responseBuilder: ResponseBuilderService;
  let conversationMemory: ConversationMemoryService;
  let graphSearchService: GraphSearchService;
  let graphMatchingService: GraphMatchingService;
  let graphReasoningEngine: GraphReasoningEngine;
  let cacheService: CacheService;

  const TEST_USER_ID = 'test-user-id';

  const mockGraph: Graph = {
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
    edges: new Map([['edge-1', {
      id: 'edge-1',
      type: 'HAS_SKILL' as any,
      sourceNodeId: 'node-1',
      targetNodeId: 'node-1',
      weight: 0.5,
      confidence: 0.5,
      reason: 'test',
      metadata: {},
      timestamps: { createdAt: new Date(), updatedAt: new Date() },
      provenance: { createdBy: 'test', algorithmVersion: '1.0.0' },
      sourceNode: null as any,
      targetNode: null as any,
    }]]),
    metadata: {
      version: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'test',
    } as any,
  } as any;

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
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CopilotService>(CopilotService);
    promptInterpreter = module.get<PromptInterpreterService>(
      PromptInterpreterService,
    );
    responseBuilder = module.get<ResponseBuilderService>(
      ResponseBuilderService,
    );
    conversationMemory = module.get<ConversationMemoryService>(
      ConversationMemoryService,
    );
    graphSearchService = module.get<GraphSearchService>(GraphSearchService);
    graphMatchingService =
      module.get<GraphMatchingService>(GraphMatchingService);
    graphReasoningEngine =
      module.get<GraphReasoningEngine>(GraphReasoningEngine);
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processMessage', () => {
    it('should return cached response if available', async () => {
      const cachedResponse = {
        message: 'Cached response',
        sources: [],
        reasoning: [],
      };

      (cacheService.get as jest.Mock).mockResolvedValue(cachedResponse);

      const result = await service.processMessage('session-1', 'Test message', TEST_USER_ID);

      expect(result).toBe(cachedResponse);
      expect(cacheService.get).toHaveBeenCalled();
    });

    it('should process message and cache response', async () => {
      (cacheService.get as jest.Mock).mockResolvedValue(null);

      const result = await service.processMessage('session-1', 'Test message', TEST_USER_ID);

      expect(result).toBeDefined();
      expect(promptInterpreter.interpret).toHaveBeenCalledWith('Test message');
      expect(conversationMemory.getOrCreateContext).toHaveBeenCalledWith(
        'session-1',
        TEST_USER_ID,
      );
      expect(conversationMemory.addMessage).toHaveBeenCalledTimes(2);
      expect(cacheService.set).toHaveBeenCalled();
    });

    it('should add user and assistant messages to conversation memory', async () => {
      (cacheService.get as jest.Mock).mockResolvedValue(null);

      await service.processMessage('session-1', 'Test message', TEST_USER_ID);

      expect(conversationMemory.addMessage).toHaveBeenCalledWith('session-1', {
        role: 'user',
        content: 'Test message',
        timestamp: expect.any(Date),
      }, TEST_USER_ID, 'test-cv-id', 'test-job-id');

      expect(conversationMemory.addMessage).toHaveBeenCalledWith('session-1', {
        role: 'assistant',
        content: expect.any(String),
        timestamp: expect.any(Date),
        sources: expect.any(Array),
        reasoning: expect.any(Array),
      }, TEST_USER_ID, 'test-cv-id', 'test-job-id');
    });

    it('should use graph reasoning engine for candidate questions', async () => {
      (cacheService.get as jest.Mock).mockResolvedValue(null);

      await service.processMessage('session-1', 'Test question', TEST_USER_ID);

      expect(graphReasoningEngine.answerCandidateQuestion).toHaveBeenCalled();
    });
  });
});
