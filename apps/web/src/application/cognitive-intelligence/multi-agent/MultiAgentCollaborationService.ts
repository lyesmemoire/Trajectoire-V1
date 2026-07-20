/**
 * Multi-Agent Collaboration Service
 * Communication between AI agents
 */

import {
  AgentEvent,
  AgentCapability,
  AgentContext,
  AgentMemory,
  AgentConversation,
  AgentPriority,
  ConflictResolution,
  ConsensusResult,
  MultiAgentConfig,
  defaultMultiAgentConfig,
} from "./interfaces/IMultiAgentCollaboration";

// ============================================================================
// MULTI-AGENT COLLABORATION SERVICE CLASS
// ============================================================================

export class MultiAgentCollaborationService {
  private static instance: MultiAgentCollaborationService;
  private config: MultiAgentConfig;
  private agentRegistry: Map<string, AgentCapability> = new Map();
  private agentContexts: Map<string, AgentContext> = new Map();
  private agentMemories: Map<string, AgentMemory> = new Map();
  private eventQueue: AgentEvent[] = [];
  private conversations: Map<string, AgentConversation> = new Map();
  private agentPriorities: Map<string, AgentPriority> = new Map();
  private conflictResolutions: Map<string, ConflictResolution> = new Map();
  private consensusResults: Map<string, ConsensusResult> = new Map();
  private eventCache: Map<string, AgentEvent> = new Map();

  private constructor() {
    this.config = defaultMultiAgentConfig;
  }

  static getInstance(): MultiAgentCollaborationService {
    if (!MultiAgentCollaborationService.instance) {
      MultiAgentCollaborationService.instance = new MultiAgentCollaborationService();
    }
    return MultiAgentCollaborationService.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<MultiAgentConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Register agent
   */
  registerAgent(agentId: string, capability: AgentCapability): void {
    this.agentRegistry.set(agentId, capability);

    // Initialize agent context
    this.agentContexts.set(agentId, {
      agentId,
      state: {},
      memory: new Map(),
      activeTasks: [],
      pendingEvents: [],
      lastActivity: new Date(),
    });

    // Initialize agent memory
    this.agentMemories.set(agentId, {
      agentId,
      shortTerm: new Map(),
      longTerm: new Map(),
      episodic: new Map(),
      semantic: new Map(),
      lastUpdated: new Date(),
    });

    // Initialize agent priority
    this.agentPriorities.set(agentId, {
      agentId,
      priority: 50,
      factors: {
        confidence: 0.5,
        cost: 0.5,
        roi: 0.5,
        urgency: 0.5,
        impact: 0.5,
        history: 0.5,
      },
      lastUpdated: new Date(),
    });
  }

  /**
   * Emit event
   */
  emitEvent(sourceAgentId: string, targetAgentId: string | null, type: string, payload: Record<string, unknown>, priority: number = 50): string {
    const event: AgentEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sourceAgentId,
      targetAgentId,
      type: type as any,
      payload,
      timestamp: new Date(),
      priority,
      ttl: this.config.eventTTL,
    };

    this.eventQueue.push(event);

    // Cache event if enabled
    if (this.config.enableEventCaching) {
      this.eventCache.set(event.id, event);
    }

    return event.id;
  }

  /**
   * Process event queue
   */
  async processEventQueue(): Promise<void> {
    const eventsToProcess = this.eventQueue.sort((a, b) => b.priority - a.priority);
    this.eventQueue = [];

    for (const event of eventsToProcess) {
      await this.processEvent(event);
    }
  }

  /**
   * Process event
   */
  private async processEvent(event: AgentEvent): Promise<void> {
    // Check if event is expired
    const age = Date.now() - event.timestamp.getTime();
    if (age > event.ttl) {
      return;
    }

    // Update agent context
    const context = this.agentContexts.get(event.sourceAgentId);
    if (context) {
      context.lastActivity = new Date();
      context.pendingEvents.push(event.id);
    }

    // Route event to target agent
    if (event.targetAgentId) {
      const targetContext = this.agentContexts.get(event.targetAgentId);
      if (targetContext) {
        targetContext.pendingEvents.push(event.id);
      }
    }

    // Handle event based on type
    switch (event.type) {
      case "propose":
        await this.handleProposal(event);
        break;
      case "contest":
        await this.handleContest(event);
        break;
      case "request_info":
        await this.handleRequestInfo(event);
        break;
      case "publish_result":
        await this.handlePublishResult(event);
        break;
    }
  }

  /**
   * Handle proposal
   */
  private async handleProposal(event: AgentEvent): Promise<void> {
    if (this.config.enableConsensus) {
      await this.initiateConsensus(event);
    }
  }

  /**
   * Handle contest
   */
  private async handleContest(event: AgentEvent): Promise<void> {
    if (this.config.enableConflictResolution) {
      await this.resolveConflict(event);
    }
  }

  /**
   * Handle request info
   */
  private async handleRequestInfo(event: AgentEvent): Promise<void> {
    if (event.targetAgentId) {
      const response = {
        type: "respond",
        payload: event.payload,
      };
      this.emitEvent(event.targetAgentId, event.sourceAgentId, "respond", response, event.priority);
    }
  }

  /**
   * Handle publish result
   */
  private async handlePublishResult(event: AgentEvent): Promise<void> {
    // Store result in agent memory
    const memory = this.agentMemories.get(event.sourceAgentId);
    if (memory) {
      memory.semantic.set(`result_${event.id}`, event.payload);
      memory.lastUpdated = new Date();
    }
  }

  /**
   * Initiate consensus
   */
  private async initiateConsensus(event: AgentEvent): Promise<ConsensusResult> {
    const participants = Array.from(this.agentRegistry.keys());
    const votes = new Map<string, number>();

    // Collect votes from all agents
    participants.forEach(agentId => {
      const priority = this.agentPriorities.get(agentId);
      const vote = priority?.priority || 50;
      votes.set(agentId, vote);
    });

    // Calculate weighted vote
    const weightedVote = this.calculateWeightedVote(votes);

    // Calculate factors
    const factors = this.calculateConsensusFactors(participants);

    // Make decision
    const decision = weightedVote >= this.config.consensusThreshold ? "approve" : "reject";

    const result: ConsensusResult = {
      id: `consensus_${event.id}`,
      proposalId: event.id,
      participants,
      votes,
      weightedVote,
      factors,
      decision,
      confidence: weightedVote / 100,
      timestamp: new Date(),
    };

    this.consensusResults.set(result.id, result);

    return result;
  }

  /**
   * Calculate weighted vote
   */
  private calculateWeightedVote(votes: Map<string, number>): number {
    const voteValues = Array.from(votes.values());
    return voteValues.reduce((sum, vote) => sum + vote, 0) / voteValues.length;
  }

  /**
   * Calculate consensus factors
   */
  private calculateConsensusFactors(participants: string[]): {
    confidence: number;
    cost: number;
    roi: number;
    urgency: number;
    impact: number;
    history: number;
  } {
    const factors = {
      confidence: 0.7,
      cost: 0.6,
      roi: 0.7,
      urgency: 0.5,
      impact: 0.8,
      history: 0.6,
    };

    participants.forEach(agentId => {
      const priority = this.agentPriorities.get(agentId);
      if (priority) {
        factors.confidence = (factors.confidence + priority.factors.confidence) / 2;
        factors.cost = (factors.cost + priority.factors.cost) / 2;
        factors.roi = (factors.roi + priority.factors.roi) / 2;
        factors.urgency = (factors.urgency + priority.factors.urgency) / 2;
        factors.impact = (factors.impact + priority.factors.impact) / 2;
        factors.history = (factors.history + priority.factors.history) / 2;
      }
    });

    return factors;
  }

  /**
   * Resolve conflict
   */
  private async resolveConflict(event: AgentEvent): Promise<ConflictResolution> {
    const conflictingAgents = [event.sourceAgentId, event.targetAgentId].filter(Boolean) as string[];
    const conflictingActions = [event.payload.action as string];

    // Use priority-based resolution
    const resolutionStrategy = "priority";
    const resolution = this.resolveByPriority(conflictingAgents);

    const conflictResolution: ConflictResolution = {
      id: `conflict_${event.id}`,
      conflictId: event.id,
      conflictingAgents,
      conflictingActions,
      resolutionStrategy,
      resolution,
      confidence: 0.8,
      timestamp: new Date(),
    };

    this.conflictResolutions.set(conflictResolution.id, conflictResolution);

    return conflictResolution;
  }

  /**
   * Resolve by priority
   */
  private resolveByPriority(agents: string[]): string {
    let highestPriority = 0;
    let selectedAgent = agents[0];

    agents.forEach(agentId => {
      const priority = this.agentPriorities.get(agentId);
      if (priority && priority.priority > highestPriority) {
        highestPriority = priority.priority;
        selectedAgent = agentId;
      }
    });

    return `Action by ${selectedAgent} takes precedence`;
  }

  /**
   * Create conversation
   */
  createConversation(participants: string[]): string {
    const conversation: AgentConversation = {
      id: `conv_${Date.now()}`,
      participants,
      events: [],
      startTime: new Date(),
      endTime: null,
      status: "active",
      outcome: null,
    };

    this.conversations.set(conversation.id, conversation);

    return conversation.id;
  }

  /**
   * Add event to conversation
   */
  addEventToConversation(conversationId: string, event: AgentEvent): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.events.push(event);
    }
  }

  /**
   * End conversation
   */
  endConversation(conversationId: string, outcome: string): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.endTime = new Date();
      conversation.status = "completed";
      conversation.outcome = outcome;
    }
  }

  /**
   * Update agent priority
   */
  updateAgentPriority(agentId: string, factors: Partial<{
    confidence: number;
    cost: number;
    roi: number;
    urgency: number;
    impact: number;
    history: number;
  }>): void {
    const priority = this.agentPriorities.get(agentId);
    if (priority) {
      priority.factors = { ...priority.factors, ...factors };
      priority.priority = this.calculatePriority(priority.factors);
      priority.lastUpdated = new Date();
    }
  }

  /**
   * Calculate priority
   */
  private calculatePriority(factors: {
    confidence: number;
    cost: number;
    roi: number;
    urgency: number;
    impact: number;
    history: number;
  }): number {
    return (
      factors.confidence * 0.2 +
      factors.roi * 0.2 +
      factors.urgency * 0.2 +
      factors.impact * 0.2 +
      factors.history * 0.1 +
      (1 - factors.cost) * 0.1
    ) * 100;
  }

  /**
   * Get agent context
   */
  getAgentContext(agentId: string): AgentContext | null {
    return this.agentContexts.get(agentId) || null;
  }

  /**
   * Get agent memory
   */
  getAgentMemory(agentId: string): AgentMemory | null {
    return this.agentMemories.get(agentId) || null;
  }

  /**
   * Get conversation
   */
  getConversation(conversationId: string): AgentConversation | null {
    return this.conversations.get(conversationId) || null;
  }

  /**
   * Get consensus result
   */
  getConsensusResult(consensusId: string): ConsensusResult | null {
    return this.consensusResults.get(consensusId) || null;
  }

  /**
   * Get conflict resolution
   */
  getConflictResolution(conflictId: string): ConflictResolution | null {
    return this.conflictResolutions.get(conflictId) || null;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.eventCache.clear();
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalAgents: number;
    totalConversations: number;
    totalEvents: number;
    totalConsensusResults: number;
    totalConflictResolutions: number;
    averagePriority: number;
    activeConversations: number;
  } {
    const totalAgents = this.agentRegistry.size;
    const totalConversations = this.conversations.size;
    const totalEvents = this.eventQueue.length + this.eventCache.size;
    const totalConsensusResults = this.consensusResults.size;
    const totalConflictResolutions = this.conflictResolutions.size;

    const averagePriority = this.agentPriorities.size > 0
      ? Array.from(this.agentPriorities.values()).reduce((sum, p) => sum + p.priority, 0) / this.agentPriorities.size
      : 0;

    const activeConversations = Array.from(this.conversations.values()).filter(c => c.status === "active").length;

    return {
      totalAgents,
      totalConversations,
      totalEvents,
      totalConsensusResults,
      totalConflictResolutions,
      averagePriority,
      activeConversations,
    };
  }
}

export const multiAgentCollaborationService = MultiAgentCollaborationService.getInstance();
