// @ts-nocheck
import { AIProvider } from "./AIProvider";
import { OpenAIProvider } from "./OpenAIProvider";
import { AnthropicProvider } from "./AnthropicProvider";
import { MockProvider } from "./MockProvider";
import { PromptRenderer, PromptTemplate, PromptVariables } from "./PromptTemplates/PromptRenderer";
import { PromptVersionManager, PromptVersion } from "./PromptTemplates/PromptVersion";
import { JsonValidator, JSONSchema } from "./JsonValidator";
import { RetryPolicy } from "./RetryPolicy";
import { CostTracker, CostMetrics } from "./CostTracker";
import { aiExecutionLogger } from "./AIExecutionLog";
import { getAIMode } from "./AIMode";

/**
 * AI Orchestrator
 *
 * Main orchestration layer for AI operations.
 * Combines provider selection, prompt rendering, JSON validation, retry logic, and cost tracking.
 */

export interface AIOrchestrationConfig {
  provider: "openai" | "anthropic" | "mock";
  model: string;
  promptId: string;
  promptVersion?: PromptVersion;
  temperature?: number;
  maxTokens?: number;
  schema?: JSONSchema;
}

export interface AIOrchestrationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metrics?: CostMetrics;
  attempts: number;
}

/**
 * AI Orchestrator
 *
 * Orchestrates AI operations with validation, retry, and tracking.
 */
export class AIOrchestrator {
  private providers: Map<string, AIProvider>;
  private promptVersionManager: PromptVersionManager;
  private retryPolicy: RetryPolicy;
  private costTracker: CostTracker;

  constructor() {
    this.providers = new Map();
    this.providers.set("openai", new OpenAIProvider());
    this.providers.set("anthropic", new AnthropicProvider());
    this.providers.set("mock", new MockProvider());
    
    this.promptVersionManager = new PromptVersionManager();
    this.retryPolicy = new RetryPolicy({ maxRetries: 2 });
    this.costTracker = new CostTracker();
  }

  /**
   * Execute AI orchestration with full pipeline
   */
  async execute<T = unknown>(
    template: PromptTemplate,
    variables: PromptVariables,
    config: AIOrchestrationConfig
  ): Promise<AIOrchestrationResult<T>> {
    const startTime = Date.now();
    const aiMode = getAIMode();
    
    // Auto-switch to mock provider if in mock mode
    const effectiveConfig = aiMode === "mock" 
      ? { ...config, provider: "mock" as const }
      : config;

    try {
      // 1. Render prompt
      const { system, user } = PromptRenderer.render(template, variables);

      // 2. Get prompt version
      const promptVersion = effectiveConfig.promptVersion || 
        this.promptVersionManager.getActiveVersion(effectiveConfig.promptId) || "v1";

      // 3. Get provider
      const provider = this.providers.get(effectiveConfig.provider);
      if (!provider) {
        throw new Error(`Provider ${effectiveConfig.provider} not available`);
      }

      if (!provider.isAvailable()) {
        throw new Error(`Provider ${effectiveConfig.provider} is not available (missing API key)`);
      }

      // 4. Execute with retry and JSON validation
      const retryResult = await this.retryPolicy.execute(async () => {
        const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];
        
        if (system) {
          messages.push({ role: "system", content: system });
        }
        messages.push({ role: "user", content: user });

        const response = await provider.generateChatCompletion({
          messages,
          model: effectiveConfig.model,
          temperature: effectiveConfig.temperature ?? 0.7,
          maxTokens: effectiveConfig.maxTokens ?? 2000,
        });

        // Validate JSON
        const validationResult = JsonValidator.validateAndParse(response.content, effectiveConfig.schema);
        
        if (!validationResult.valid) {
          throw new Error(`JSON validation failed: ${validationResult.error}`);
        }

        return {
          data: validationResult.data,
          response,
        };
      });

      if (!retryResult.success) {
        // Log failed execution
        aiExecutionLogger.log({
          provider: effectiveConfig.provider,
          model: effectiveConfig.model,
          promptId: effectiveConfig.promptId,
          promptVersion,
          promptVariables: variables,
          latency: Date.now() - startTime,
          tokens: { prompt: 0, completion: 0, total: 0 },
          cost: 0,
          retryCount: retryResult.attempts - 1,
          status: "error",
          error: retryResult.lastError?.message,
          executionMode: aiMode,
        });

        return {
          success: false,
          error: retryResult.lastError?.message || "AI orchestration failed",
          attempts: retryResult.attempts,
        };
      }

      // 5. Track cost
      const metrics = this.costTracker.record({
        provider: effectiveConfig.provider,
        model: effectiveConfig.model,
        promptTokens: retryResult.data!.response.usage.promptTokens,
        completionTokens: retryResult.data!.response.usage.completionTokens,
        totalTokens: retryResult.data!.response.usage.totalTokens,
        latency: retryResult.data!.response.latency,
        timestamp: new Date(),
        promptVersion,
      });

      // Log successful execution
      aiExecutionLogger.log({
        provider: effectiveConfig.provider,
        model: effectiveConfig.model,
        promptId: effectiveConfig.promptId,
        promptVersion,
        promptVariables: variables,
        latency: metrics.latency,
        tokens: {
          prompt: metrics.promptTokens,
          completion: metrics.completionTokens,
          total: metrics.totalTokens,
        },
        cost: metrics.cost,
        retryCount: retryResult.attempts - 1,
        status: "success",
        response: retryResult.data!.data,
        executionMode: aiMode,
      });

      return {
        success: true,
        data: retryResult.data!.data as T,
        metrics,
        attempts: retryResult.attempts,
      };
    } catch (error) {
      // Log error execution
      aiExecutionLogger.log({
        provider: effectiveConfig.provider,
        model: effectiveConfig.model,
        promptId: effectiveConfig.promptId,
        promptVersion: effectiveConfig.promptVersion || "v1",
        promptVariables: variables,
        latency: Date.now() - startTime,
        tokens: { prompt: 0, completion: 0, total: 0 },
        cost: 0,
        retryCount: 0,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        executionMode: aiMode,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        attempts: 1,
      };
    }
  }

  /**
   * Register a prompt version
   */
  registerPromptVersion(
    promptId: string,
    name: string,
    description: string,
    version: PromptVersion,
    isActive: boolean = true
  ): void {
    this.promptVersionManager.registerPromptVersion(promptId, name, description, version, isActive);
  }

  /**
   * Set active prompt version
   */
  setActivePromptVersion(promptId: string, version: PromptVersion, rolloutPercentage?: number): void {
    this.promptVersionManager.setActiveVersion(promptId, version, rolloutPercentage);
  }

  /**
   * Get cost summary
   */
  getCostSummary(startDate?: Date, endDate?: Date) {
    return this.costTracker.getSummary(startDate, endDate);
  }

  /**
   * Get metrics by provider
   */
  getMetricsByProvider(provider: string, startDate?: Date, endDate?: Date) {
    return this.costTracker.getByProvider(provider, startDate, endDate);
  }

  /**
   * Get metrics by prompt version
   */
  getMetricsByPromptVersion(promptVersion: string, startDate?: Date, endDate?: Date) {
    return this.costTracker.getByPromptVersion(promptVersion, startDate, endDate);
  }

  /**
   * Clear cost tracking
   */
  clearCostTracking(): void {
    this.costTracker.clear();
  }

  /**
   * Update retry policy
   */
  updateRetryPolicy(config: Partial<import("./RetryPolicy").RetryConfig>): void {
    this.retryPolicy.updateConfig(config);
  }

  /**
   * Check if provider is available
   */
  isProviderAvailable(provider: string): boolean {
    const p = this.providers.get(provider);
    return p ? p.isAvailable() : false;
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): string[] {
    const available: string[] = [];
    const providerEntries = Array.from(this.providers.entries());
    for (const [name, provider] of providerEntries) {
      if (provider.isAvailable()) {
        available.push(name);
      }
    }
    return available;
  }
}

// Singleton instance
export const aiOrchestrator = new AIOrchestrator();
