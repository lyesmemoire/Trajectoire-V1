/**
 * AI Lifecycle Manager
 * Manages the complete lifecycle of AI decisions
 */

import {
  LifecycleStage,
  LifecycleEvent,
  DecisionNeed,
  DecisionContext,
  DecisionOutcome,
  LifecycleHistory,
  AILifecycle,
  LifecycleMetrics,
  AILifecycleManagerConfig,
  defaultAILifecycleManagerConfig,
} from "./interfaces/IAILifecycleManager";
import { globalExecutionGraph } from "../global-execution-graph/GlobalExecutionGraph";

// ============================================================================
// AI LIFECYCLE MANAGER CLASS
// ============================================================================

export class AILifecycleManager {
  private static instance: AILifecycleManager;
  private config: AILifecycleManagerConfig;
  private lifecycles: Map<string, AILifecycle> = new Map();
  private activeLifecycles: Set<string> = new Set();

  private constructor() {
    this.config = defaultAILifecycleManagerConfig;
  }

  static getInstance(): AILifecycleManager {
    if (!AILifecycleManager.instance) {
      AILifecycleManager.instance = new AILifecycleManager();
    }
    return AILifecycleManager.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<AILifecycleManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Start lifecycle
   */
  async startLifecycle(need: DecisionNeed): Promise<string> {
    const lifecycleId = `lifecycle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const lifecycle: AILifecycle = {
      id: lifecycleId,
      userId: need.userId,
      need,
      context: null,
      decisionId: null,
      outcome: null,
      history: {
        id: `history_${lifecycleId}`,
        lifecycleId,
        events: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      status: "active",
      currentStage: "need",
      startTime: new Date(),
      endTime: null,
      totalDuration: 0,
      totalCost: 0,
      confidence: 0.5,
    };

    this.lifecycles.set(lifecycleId, lifecycle);
    this.activeLifecycles.add(lifecycleId);

    // Record need event
    await this.recordEvent(lifecycleId, "need", "started", { need });

    // Auto-progress if enabled
    if (this.config.enableAutoProgression) {
      await this.progressLifecycle(lifecycleId);
    }

    return lifecycleId;
  }

  /**
   * Progress lifecycle
   */
  async progressLifecycle(lifecycleId: string): Promise<void> {
    const lifecycle = this.lifecycles.get(lifecycleId);
    if (!lifecycle || lifecycle.status !== "active") return;

    const stages: LifecycleStage[] = [
      "need",
      "context",
      "reasoning",
      "decision",
      "simulation",
      "validation",
      "execution",
      "observation",
      "learning",
      "reflection",
      "memory",
      "optimization",
    ];

    const currentIndex = stages.indexOf(lifecycle.currentStage);
    if (currentIndex === -1 || currentIndex === stages.length - 1) return;

    const nextStage = stages[currentIndex + 1];

    try {
      await this.executeStage(lifecycleId, nextStage);
    } catch (error) {
      if (this.config.enableAutoRetry) {
        await this.retryStage(lifecycleId, nextStage);
      } else {
        lifecycle.status = "failed";
        lifecycle.endTime = new Date();
        lifecycle.totalDuration = Date.now() - lifecycle.startTime.getTime();
        this.activeLifecycles.delete(lifecycleId);
      }
    }
  }

  /**
   * Execute stage
   */
  private async executeStage(lifecycleId: string, stage: LifecycleStage): Promise<void> {
    const lifecycle = this.lifecycles.get(lifecycleId);
    if (!lifecycle) return;

    const startTime = Date.now();
    await this.recordEvent(lifecycleId, stage, "started", {});

    switch (stage) {
      case "context":
        await this.executeContext(lifecycleId);
        break;
      case "reasoning":
        await this.executeReasoning(lifecycleId);
        break;
      case "decision":
        await this.executeDecision(lifecycleId);
        break;
      case "simulation":
        await this.executeSimulation(lifecycleId);
        break;
      case "validation":
        await this.executeValidation(lifecycleId);
        break;
      case "execution":
        await this.executeExecution(lifecycleId);
        break;
      case "observation":
        await this.executeObservation(lifecycleId);
        break;
      case "learning":
        await this.executeLearning(lifecycleId);
        break;
      case "reflection":
        await this.executeReflection(lifecycleId);
        break;
      case "memory":
        await this.executeMemory(lifecycleId);
        break;
      case "optimization":
        await this.executeOptimization(lifecycleId);
        break;
    }

    const duration = Date.now() - startTime;
    await this.recordEvent(lifecycleId, stage, "completed", { duration });
    lifecycle.currentStage = stage;
    lifecycle.history.updatedAt = new Date();
  }

  /**
   * Execute context stage
   */
  private async executeContext(lifecycleId: string): Promise<void> {
    const lifecycle = this.lifecycles.get(lifecycleId);
    if (!lifecycle) return;

    const context: DecisionContext = {
      id: `context_${lifecycleId}`,
      lifecycleId,
      userId: lifecycle.userId,
      userProfile: {},
      sessionData: {},
      historicalData: {},
      environment: {},
      timestamp: new Date(),
    };

    lifecycle.context = context;
  }

  /**
   * Execute reasoning stage
   */
  private async executeReasoning(lifecycleId: string): Promise<void> {
    const lifecycle = this.lifecycles.get(lifecycleId);
    if (!lifecycle) return;

    // Execute reasoning through global execution graph
    const result = await globalExecutionGraph.executeGraph("default_graph", {
      lifecycleId,
      userId: lifecycle.userId,
      need: lifecycle.need,
    });

    lifecycle.confidence = result.confidence;
    lifecycle.totalCost += result.totalCost;
  }

  /**
   * Execute decision stage
   */
  private async executeDecision(lifecycleId: string): Promise<void> {
    const lifecycle = this.lifecycles.get(lifecycleId);
    if (!lifecycle) return;

    lifecycle.decisionId = `decision_${lifecycleId}_${Date.now()}`;
  }

  /**
   * Execute simulation stage
   */
  private async executeSimulation(lifecycleId: string): Promise<void> {
    // Placeholder for simulation logic
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Execute validation stage
   */
  private async executeValidation(lifecycleId: string): Promise<void> {
    // Placeholder for validation logic
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  /**
   * Execute execution stage
   */
  private async executeExecution(lifecycleId: string): Promise<void> {
    // Placeholder for execution logic
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  /**
   * Execute observation stage
   */
  private async executeObservation(lifecycleId: string): Promise<void> {
    // Placeholder for observation logic
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Execute learning stage
   */
  private async executeLearning(lifecycleId: string): Promise<void> {
    // Placeholder for learning logic
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  /**
   * Execute reflection stage
   */
  private async executeReflection(lifecycleId: string): Promise<void> {
    // Placeholder for reflection logic
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  /**
   * Execute memory stage
   */
  private async executeMemory(lifecycleId: string): Promise<void> {
    // Placeholder for memory logic
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Execute optimization stage
   */
  private async executeOptimization(lifecycleId: string): Promise<void> {
    // Placeholder for optimization logic
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  /**
   * Retry stage
   */
  private async retryStage(lifecycleId: string, stage: LifecycleStage): Promise<void> {
    const lifecycle = this.lifecycles.get(lifecycleId);
    if (!lifecycle) return;

    let retryCount = 0;
    const maxRetries = this.config.maxRetries;

    while (retryCount < maxRetries) {
      try {
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        await this.executeStage(lifecycleId, stage);
        return;
      } catch (error) {
        retryCount++;
        if (retryCount >= maxRetries) {
          lifecycle.status = "failed";
          lifecycle.endTime = new Date();
          lifecycle.totalDuration = Date.now() - lifecycle.startTime.getTime();
          this.activeLifecycles.delete(lifecycleId);
          throw error;
        }
      }
    }
  }

  /**
   * Record event
   */
  private async recordEvent(lifecycleId: string, stage: LifecycleStage, status: "started" | "completed" | "failed" | "skipped", data: Record<string, unknown>): Promise<void> {
    const lifecycle = this.lifecycles.get(lifecycleId);
    if (!lifecycle) return;

    const event: LifecycleEvent = {
      id: `event_${lifecycleId}_${stage}_${Date.now()}`,
      lifecycleId,
      stage,
      timestamp: new Date(),
      status,
      duration: 0,
      data,
      metadata: {},
    };

    lifecycle.history.events.push(event);
    lifecycle.history.updatedAt = new Date();
  }

  /**
   * Complete lifecycle
   */
  async completeLifecycle(lifecycleId: string, outcome: DecisionOutcome): Promise<void> {
    const lifecycle = this.lifecycles.get(lifecycleId);
    if (!lifecycle) return;

    lifecycle.outcome = outcome;
    lifecycle.status = "completed";
    lifecycle.endTime = new Date();
    lifecycle.totalDuration = Date.now() - lifecycle.startTime.getTime();
    lifecycle.currentStage = "optimization";

    this.activeLifecycles.delete(lifecycleId);

    await this.recordEvent(lifecycleId, "optimization", "completed", { outcome });
  }

  /**
   * Cancel lifecycle
   */
  async cancelLifecycle(lifecycleId: string): Promise<void> {
    const lifecycle = this.lifecycles.get(lifecycleId);
    if (!lifecycle) return;

    lifecycle.status = "cancelled";
    lifecycle.endTime = new Date();
    lifecycle.totalDuration = Date.now() - lifecycle.startTime.getTime();

    this.activeLifecycles.delete(lifecycleId);

    await this.recordEvent(lifecycleId, lifecycle.currentStage, "skipped", { cancelled: true });
  }

  /**
   * Get lifecycle
   */
  getLifecycle(lifecycleId: string): AILifecycle | null {
    return this.lifecycles.get(lifecycleId) || null;
  }

  /**
   * Get lifecycles by user
   */
  getLifecyclesByUser(userId: string): AILifecycle[] {
    return Array.from(this.lifecycles.values()).filter(lifecycle => lifecycle.userId === userId);
  }

  /**
   * Get active lifecycles
   */
  getActiveLifecycles(): AILifecycle[] {
    return Array.from(this.activeLifecycles).map(id => this.lifecycles.get(id)).filter(Boolean) as AILifecycle[];
  }

  /**
   * Get lifecycle history
   */
  getLifecycleHistory(lifecycleId: string): LifecycleHistory | null {
    const lifecycle = this.lifecycles.get(lifecycleId);
    return lifecycle?.history || null;
  }

  /**
   * Get metrics
   */
  getMetrics(): LifecycleMetrics {
    const totalLifecycles = this.lifecycles.size;
    const activeLifecycles = this.activeLifecycles.size;
    const completedLifecycles = Array.from(this.lifecycles.values()).filter(l => l.status === "completed").length;
    const failedLifecycles = Array.from(this.lifecycles.values()).filter(l => l.status === "failed").length;

    const completed = Array.from(this.lifecycles.values()).filter(l => l.status === "completed");
    const averageDuration = completed.length > 0
      ? completed.reduce((sum, l) => sum + l.totalDuration, 0) / completed.length
      : 0;

    const averageCost = completed.length > 0
      ? completed.reduce((sum, l) => sum + l.totalCost, 0) / completed.length
      : 0;

    const averageConfidence = completed.length > 0
      ? completed.reduce((sum, l) => sum + l.confidence, 0) / completed.length
      : 0;

    const stageDistribution: Record<string, number> = {};
    this.lifecycles.forEach(lifecycle => {
      stageDistribution[lifecycle.currentStage] = (stageDistribution[lifecycle.currentStage] || 0) + 1;
    });

    const successRate = totalLifecycles > 0 ? completedLifecycles / totalLifecycles : 0;

    return {
      totalLifecycles,
      activeLifecycles,
      completedLifecycles,
      failedLifecycles,
      averageDuration,
      averageCost,
      averageConfidence,
      stageDistribution,
      successRate,
    };
  }

  /**
   * Clear completed lifecycles
   */
  clearCompletedLifecycles(): void {
    const toDelete: string[] = [];

    this.lifecycles.forEach((lifecycle, id) => {
      if (lifecycle.status === "completed" || lifecycle.status === "failed" || lifecycle.status === "cancelled") {
        toDelete.push(id);
      }
    });

    toDelete.forEach(id => {
      this.lifecycles.delete(id);
    });
  }
}

export const aiLifecycleManager = AILifecycleManager.getInstance();
