/**
 * Execution Pipeline
 * Executes actions decided by the Decision Engine in the correct order
 */

import {
  OrchestratorDecision,
  OrchestratorAction,
  ExecutionResult,
  ActionExecution,
  ExecutionError,
  ExecutionInsight,
  EngineType,
  OrchestratorConfig,
  defaultOrchestratorConfig,
} from "./interfaces/IAdaptiveIntelligenceOrchestrator";

// ============================================================================
// ENGINE EXECUTOR INTERFACE
// ============================================================================

interface EngineExecutor {
  execute(action: OrchestratorAction): Promise<any>;
  canExecute(engine: EngineType): boolean;
}

// ============================================================================
// EXECUTION PIPELINE CLASS
// ============================================================================

export class ExecutionPipeline {
  private static instance: ExecutionPipeline;
  private config: OrchestratorConfig;
  private executors: Map<EngineType, EngineExecutor> = new Map();
  private executionHistory: ExecutionResult[] = [];

  private constructor() {
    this.config = defaultOrchestratorConfig;
    this.initializeExecutors();
  }

  static getInstance(): ExecutionPipeline {
    if (!ExecutionPipeline.instance) {
      ExecutionPipeline.instance = new ExecutionPipeline();
    }
    return ExecutionPipeline.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<OrchestratorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Initialize engine executors
   */
  private initializeExecutors(): void {
    // Mock executors for now - in production, these would be the actual engines
    this.executors.set("careerProfile", this.createMockExecutor("careerProfile"));
    this.executors.set("weaknessDetector", this.createMockExecutor("weaknessDetector"));
    this.executors.set("goalEngine", this.createMockExecutor("goalEngine"));
    this.executors.set("recommendationEngine", this.createMockExecutor("recommendationEngine"));
    this.executors.set("learningPath", this.createMockExecutor("learningPath"));
    this.executors.set("confidenceScore", this.createMockExecutor("confidenceScore"));
    this.executors.set("employability", this.createMockExecutor("employability"));
    this.executors.set("diagnostic", this.createMockExecutor("diagnostic"));
    this.executors.set("conversationEngine", this.createMockExecutor("conversationEngine"));
    this.executors.set("personalityEngine", this.createMockExecutor("personalityEngine"));
    this.executors.set("evaluationEngine", this.createMockExecutor("evaluationEngine"));
    this.executors.set("aiQualityPlatform", this.createMockExecutor("aiQualityPlatform"));
  }

  /**
   * Create mock executor
   */
  private createMockExecutor(engine: EngineType): EngineExecutor {
    return {
      execute: async (action: OrchestratorAction) => {
        // Simulate execution time
        await this.delay(Math.random() * 1000 + 500);

        // Mock output based on engine type
        return {
          engine,
          action: action.type,
          timestamp: new Date(),
          success: true,
          data: {
            message: `${engine} executed successfully`,
            parameters: action.parameters,
          },
        };
      },
      canExecute: (eng: EngineType) => true,
    };
  }

  /**
   * Execute decision
   */
  async executeDecision(decision: OrchestratorDecision): Promise<ExecutionResult> {
    const startTime = Date.now();
    const actions: ActionExecution[] = [];
    const errors: ExecutionError[] = [];
    const insights: ExecutionInsight[] = [];

    // Filter and prepare actions
    let preparedActions = this.prepareActions(decision.actions);

    // Execute actions in dependency order
    const executedActionIds = new Set<string>();

    while (preparedActions.length > 0) {
      // Find actions with no pending dependencies
      const readyActions = preparedActions.filter(action =>
        action.dependencies.every(dep => executedActionIds.has(dep))
      );

      if (readyActions.length === 0) {
        // Circular dependency or missing dependency
        const remainingAction = preparedActions[0];
        errors.push({
          actionId: remainingAction.id,
          engine: remainingAction.engine,
          error: "Cannot resolve dependencies",
          severity: "high",
          recoverable: false,
        });
        break;
      }

      // Execute ready actions (respecting concurrency limit)
      const batch = readyActions.slice(0, this.config.maxConcurrentActions);
      const batchResults = await Promise.allSettled(
        batch.map(action => this.executeAction(action))
      );

      // Process results
      batchResults.forEach((result, index) => {
        const action = batch[index];
        executedActionIds.add(action.id);

        if (result.status === "fulfilled") {
          actions.push(result.value);
          
          // Generate insights
          const insight = this.generateInsight(action, result.value);
          if (insight) {
            insights.push(insight);
          }
        } else {
          errors.push({
            actionId: action.id,
            engine: action.engine,
            error: result.reason instanceof Error ? result.reason.message : String(result.reason),
            severity: this.determineErrorSeverity(action, result.reason),
            recoverable: this.isRecoverable(action, result.reason),
          });
        }
      });

      // Remove executed actions
      preparedActions = preparedActions.filter(action => !executedActionIds.has(action.id));
    }

    // Calculate overall success
    const overallSuccess = errors.length === 0 || errors.every(e => e.recoverable);

    // Calculate totals
    const totalDuration = Date.now() - startTime;
    const totalValue = actions.reduce((sum, action) => sum + action.value, 0);

    const result: ExecutionResult = {
      decisionId: decision.id,
      timestamp: new Date(),
      userId: decision.userId,
      actions,
      overallSuccess,
      totalDuration,
      totalValue,
      errors,
      insights,
    };

    // Store in history
    this.executionHistory.push(result);

    return result;
  }

  /**
   * Prepare actions for execution
   */
  private prepareActions(actions: OrchestratorAction[]): OrchestratorAction[] {
    let preparedActions = [...actions];

    // Filter by value threshold
    preparedActions = preparedActions.filter(action => action.estimatedValue >= this.config.valueThreshold);

    // Filter by risk tolerance
    const riskLevels = { low: 1, medium: 2, high: 3 };
    const tolerance = riskLevels[this.config.riskTolerance];
    preparedActions = preparedActions.filter(action => riskLevels[action.risk] <= tolerance);

    // Sort by priority
    preparedActions.sort((a, b) => b.priority - a.priority);

    return preparedActions;
  }

  /**
   * Execute single action
   */
  private async executeAction(action: OrchestratorAction): Promise<ActionExecution> {
    const startTime = Date.now();
    const executor = this.executors.get(action.engine);

    if (!executor) {
      throw new Error(`No executor found for engine: ${action.engine}`);
    }

    if (!executor.canExecute(action.engine)) {
      throw new Error(`Executor cannot execute engine: ${action.engine}`);
    }

    try {
      // Execute with timeout
      const output = await this.withTimeout(
        executor.execute(action),
        this.config.actionTimeout
      );

      const duration = Date.now() - startTime;
      const value = this.calculateActionValue(action, output);

      return {
        actionId: action.id,
        engine: action.engine,
        success: true,
        duration,
        value,
        output,
        error: null,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        actionId: action.id,
        engine: action.engine,
        success: false,
        duration,
        value: 0,
        output: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Execute with timeout
   */
  private async withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Action timeout")), timeout);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  /**
   * Calculate action value
   */
  private calculateActionValue(action: OrchestratorAction, output: any): number {
    // In production, this would be calculated based on actual output
    // For now, use the estimated value
    return action.estimatedValue;
  }

  /**
   * Generate insight from action execution
   */
  private generateInsight(action: OrchestratorAction, execution: ActionExecution): ExecutionInsight | null {
    if (!execution.success) {
      return null;
    }

    // Generate insights based on engine type and action type
    const insight = this.generateEngineInsight(action.engine, action.type, execution.output);
    
    if (insight) {
      return {
        category: insight.category,
        insight: insight.insight,
        confidence: insight.confidence,
        actionable: insight.actionable,
      };
    }

    return null;
  }

  /**
   * Generate engine-specific insight
   */
  private generateEngineInsight(engine: EngineType, actionType: string, output: any): {
    category: string;
    insight: string;
    confidence: number;
    actionable: boolean;
  } | null {
    const insights: Record<EngineType, (actionType: string, output: any) => any> = {
      careerProfile: () => ({
        category: "career",
        insight: "Career profile analysis completed successfully",
        confidence: 0.8,
        actionable: true,
      }),
      weaknessDetector: () => ({
        category: "weakness",
        insight: "Weakness detection completed - improvement opportunities identified",
        confidence: 0.75,
        actionable: true,
      }),
      goalEngine: () => ({
        category: "goal",
        insight: "Goal analysis completed - progress tracking updated",
        confidence: 0.85,
        actionable: true,
      }),
      recommendationEngine: () => ({
        category: "recommendation",
        insight: "Personalized recommendations generated",
        confidence: 0.7,
        actionable: true,
      }),
      learningPath: () => ({
        category: "learning",
        insight: "Learning path updated based on current progress",
        confidence: 0.8,
        actionable: true,
      }),
      confidenceScore: () => ({
        category: "confidence",
        insight: "Confidence assessment completed",
        confidence: 0.75,
        actionable: true,
      }),
      employability: () => ({
        category: "employability",
        insight: "Employability assessment completed",
        confidence: 0.8,
        actionable: true,
      }),
      diagnostic: () => ({
        category: "diagnostic",
        insight: "Diagnostic analysis completed - issues identified",
        confidence: 0.85,
        actionable: true,
      }),
      conversationEngine: () => ({
        category: "conversation",
        insight: "Conversation intervention completed",
        confidence: 0.7,
        actionable: true,
      }),
      personalityEngine: () => ({
        category: "personality",
        insight: "Personality analysis completed",
        confidence: 0.75,
        actionable: true,
      }),
      evaluationEngine: () => ({
        category: "evaluation",
        insight: "Evaluation completed - feedback generated",
        confidence: 0.8,
        actionable: true,
      }),
      aiQualityPlatform: () => ({
        category: "quality",
        insight: "AI quality monitoring completed",
        confidence: 0.9,
        actionable: false,
      }),
    };

    const generator = insights[engine];
    if (generator) {
      return generator(actionType, output);
    }

    return null;
  }

  /**
   * Determine error severity
   */
  private determineErrorSeverity(action: OrchestratorAction, error: any): "low" | "medium" | "high" {
    if (action.risk === "high") {
      return "high";
    }
    if (action.priority >= 80) {
      return "high";
    }
    if (action.priority >= 60) {
      return "medium";
    }
    return "low";
  }

  /**
   * Check if error is recoverable
   */
  private isRecoverable(action: OrchestratorAction, error: any): boolean {
    // Timeout errors are recoverable
    if (error instanceof Error && error.message === "Action timeout") {
      return true;
    }

    // Low priority actions are recoverable
    if (action.priority < 50) {
      return true;
    }

    // Low risk actions are recoverable
    if (action.risk === "low") {
      return true;
    }

    return false;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Register custom executor
   */
  registerExecutor(engine: EngineType, executor: EngineExecutor): void {
    this.executors.set(engine, executor);
  }

  /**
   * Unregister executor
   */
  unregisterExecutor(engine: EngineType): void {
    this.executors.delete(engine);
  }

  /**
   * Get execution history
   */
  getExecutionHistory(): ExecutionResult[] {
    return this.executionHistory;
  }

  /**
   * Get execution statistics
   */
  getStatistics(): {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    averageDuration: number;
    averageValue: number;
    enginesUsed: EngineType[];
    errorRate: number;
  } {
    const totalExecutions = this.executionHistory.length;
    const successfulExecutions = this.executionHistory.filter(r => r.overallSuccess).length;
    const failedExecutions = totalExecutions - successfulExecutions;

    const averageDuration =
      totalExecutions > 0
        ? this.executionHistory.reduce((sum, r) => sum + r.totalDuration, 0) / totalExecutions
        : 0;

    const averageValue =
      totalExecutions > 0
        ? this.executionHistory.reduce((sum, r) => sum + r.totalValue, 0) / totalExecutions
        : 0;

    const enginesUsed = Array.from(
      new Set(this.executionHistory.flatMap(r => r.actions.map(a => a.engine)))
    );

    const errorRate = totalExecutions > 0 ? failedExecutions / totalExecutions : 0;

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      averageDuration,
      averageValue,
      enginesUsed,
      errorRate,
    };
  }

  /**
   * Clear execution history
   */
  clearHistory(): void {
    this.executionHistory = [];
  }

  /**
   * Export execution history
   */
  exportHistory(): ExecutionResult[] {
    return this.executionHistory;
  }

  /**
   * Import execution history
   */
  importHistory(history: ExecutionResult[]): void {
    this.executionHistory = history;
  }
}

export const executionPipeline = ExecutionPipeline.getInstance();
