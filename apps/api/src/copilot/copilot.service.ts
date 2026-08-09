import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PromptInterpreterService, Intent } from './prompt-interpreter.service';
import {
  ResponseBuilderService,
  CopilotResponse,
} from './response-builder.service';
import { ConversationMemoryService, Message } from './conversation-memory.service';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { GraphReasoningEngine } from '../runtime/kg/graph-reasoning-engine.service';
import { Graph } from '../runtime/kg/graph-types';
import { CacheService } from '../cache/cache.decorator';
import { CopilotContextService, CopilotContext, CopilotRequestContext } from './copilot-context.service';

@Injectable()
export class CopilotService {
  constructor(
    private readonly promptInterpreter: PromptInterpreterService,
    private readonly graphReasoningEngine: GraphReasoningEngine,
    private readonly responseBuilder: ResponseBuilderService,
    private readonly conversationMemory: ConversationMemoryService,
    private readonly graphSearchService: GraphSearchService,
    private readonly graphMatchingService: GraphMatchingService,
    private readonly cacheService: CacheService,
    private readonly contextService: CopilotContextService,
  ) {}

  async processMessage(
    sessionId: string,
    message: string,
    userId: string,
    context?: CopilotRequestContext,
  ): Promise<CopilotResponse> {
    const cacheKey = this.cacheService.generateKey(
      'copilot',
      sessionId,
      message,
    );

    // Try cache first (5 minute TTL for conversations)
    const cached = await this.cacheService.get<CopilotResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Load real business context - userId is now required
    let businessContext: CopilotContext | null = null;
    let graph: Graph;

    businessContext = await this.contextService.loadCopilotContext(userId, context);

    // CRITICAL: Do not fallback to empty graph - if context is loaded but graph is missing, this is an error
    // For tests, we allow empty graphs to avoid requiring database setup
    if (!businessContext.graph) {
      throw new Error('Business context loaded but graph is missing. Cannot process Copilot request without valid graph data.');
    }

    // CRITICAL: Reject empty graphs when data context is provided (CV or Job)
    // Empty graphs indicate a parsing or data extraction failure
    if (businessContext.graph && businessContext.graph.nodes.size === 0) {
      if (context?.cvId || context?.jobId) {
        throw new Error('Business context loaded but graph is empty. Cannot process Copilot request with empty graph when CV/Job data is provided.');
      }
      // If no CV/Job context provided, empty graph is acceptable (e.g., general queries)
    }

    graph = businessContext.graph;

    const intent = this.promptInterpreter.interpret(message);
    const memoryContext = this.conversationMemory.getOrCreateContext(sessionId, userId);

    // Use graph reasoning engine with real graph from business context
    const reasoningResult = this.graphReasoningEngine.answerCandidateQuestion(
      graph,
      message,
    );

    // Convert Explanation to ReasoningResult format
    const adaptedReasoningResult = {
      reasoning: [reasoningResult.detailedExplanation],
      sources: reasoningResult.evidence.map((e) => e.claim),
      confidence: reasoningResult.reasoningTrace.confidence,
      data: reasoningResult,
    };

    let data: any = null;

    switch (intent.type) {
      case 'search_candidates':
        data = await this.handleSearchCandidates(intent, memoryContext, businessContext);
        break;
      case 'search_jobs':
        data = await this.handleSearchJobs(intent, memoryContext, businessContext);
        break;
      case 'explain_score':
        data = await this.handleExplainScore(intent, memoryContext, businessContext, userId);
        break;
      case 'propose_training':
        data = await this.handleProposeTraining(intent, memoryContext, businessContext);
        break;
      case 'propose_evolution':
        data = await this.handleProposeEvolution(intent, memoryContext, businessContext);
        break;
    }

    const response = this.responseBuilder.buildResponse(
      intent,
      adaptedReasoningResult as any,
      data,
      businessContext,
    );

    await this.conversationMemory.addMessage(sessionId, {
      role: 'user',
      content: message,
      timestamp: new Date(),
    }, userId, businessContext?.cvId, businessContext?.jobId);

    await this.conversationMemory.addMessage(sessionId, {
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      sources: response.sources,
      reasoning: response.reasoning,
    }, userId, businessContext?.cvId, businessContext?.jobId);

    // Cache the response with 5 minute TTL
    await this.cacheService.set(cacheKey, response, 300);

    return response;
  }

  async getConversationHistory(
    sessionId: string,
    userId: string,
  ): Promise<Message[]> {
    return this.conversationMemory.getConversationHistory(sessionId, userId);
  }

  async clearConversation(sessionId: string, userId: string): Promise<void> {
    await this.conversationMemory.clearConversation(sessionId, userId);
  }

  async getAllSessions(userId: string): Promise<string[]> {
    return this.conversationMemory.getAllSessions(userId);
  }

  private async handleSearchCandidates(
    intent: Intent,
    memoryContext: any,
    businessContext: CopilotContext | null,
  ): Promise<any> {
    const jobGraph = this.createJobGraphFromIntent(intent);
    const candidateGraphs = businessContext?.graph ? [businessContext.graph] : [];

    this.conversationMemory.setLastSearchQuery(
      memoryContext.sessionId,
      JSON.stringify(intent),
      businessContext?.userId || '',
    );

    try {
      const results = this.graphSearchService.searchCandidatesByNeighborhood(
        jobGraph,
        candidateGraphs,
      );
      return { results, jobGraph };
    } catch (error) {
      return { results: [], jobGraph };
    }
  }

  private async handleSearchJobs(
    intent: Intent,
    memoryContext: any,
    businessContext: CopilotContext | null,
  ): Promise<any> {
    // Graph functionality disabled
    throw new Error('Graph functionality disabled - database tables not available');
    // if (!businessContext?.graph) {
    //   throw new Error('Cannot search jobs without candidate graph. Please ensure CV data is available.');
    // }

    // const candidateGraph = businessContext.graph;
    // const jobGraphs = [];

    // this.conversationMemory.setLastSearchQuery(
    //   memoryContext.sessionId,
    //   JSON.stringify(intent),
    // );

    // try {
    //   const results = this.graphSearchService.searchJobsByNeighborhood(
    //     candidateGraph,
    //     jobGraphs,
    //   );
    //   return { results, candidateGraph };
    // } catch (error) {
    //   return { results: [], candidateGraph };
    // }
  }

  private async handleExplainScore(
    intent: Intent,
    memoryContext: any,
    businessContext: CopilotContext | null,
    userId: string,
  ): Promise<any> {
    const report = this.conversationMemory.getLastReport(memoryContext.sessionId, userId);
    return report || null;
  }

  private async handleProposeTraining(
    intent: Intent,
    memoryContext: any,
    businessContext: CopilotContext | null,
  ): Promise<any> {
    // Graph functionality disabled
    throw new Error('Graph functionality disabled - database tables not available');
    // const candidateGraph = businessContext?.graph;

    // if (!candidateGraph) {
    //   return { error: 'No candidate graph available' };
    // }

    // try {
    //   const jobGraphs = [];
    //   const results = this.graphSearchService.searchCandidatesByCommunity(
    //     candidateGraph,
    //     jobGraphs,
    //   );
    //   return { careerPath: results, candidateGraph };
    // } catch (error) {
    //   return { error: 'Failed to build career path', candidateGraph };
    // }
  }

  private async handleProposeEvolution(
    intent: Intent,
    memoryContext: any,
    businessContext: CopilotContext | null,
  ): Promise<any> {
    const candidateGraph = businessContext?.graph;

    if (!candidateGraph) {
      return { error: 'No candidate graph available' };
    }

    try {
      const jobGraphs = [];
      const results = this.graphSearchService.searchCandidatesByCommunity(
        candidateGraph,
        jobGraphs,
      );
      return {
        careerPath: results,
        candidateGraph,
        targetJob: intent.entities.jobTitle,
      };
    } catch (error) {
      return { error: 'Failed to build career path', candidateGraph };
    }
  }

  private createJobGraphFromIntent(intent: Intent): Graph {
    // DEPRECATED: This creates an empty graph. In production, job graphs should be loaded from database.
    // Throwing error to prevent silent fallback to empty graph.
    throw new Error('createJobGraphFromIntent is deprecated. Job graphs must be loaded from database via CopilotContextService.');
  }

  private createCandidateGraphFromIntent(intent: Intent): Graph {
    // DEPRECATED: This creates an empty graph. In production, candidate graphs must be loaded from database.
    // Throwing error to prevent silent fallback to empty graph.
    throw new Error('createCandidateGraphFromIntent is deprecated. Candidate graphs must be loaded from database via CopilotContextService.');
  }
}
