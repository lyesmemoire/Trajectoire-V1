/**
 * Cost Optimization Engine
 * Manages OpenAI costs, tokens, ROI and optimizes model choices
 */

import {
  ModelType,
  ModelCost,
  CostEstimation,
  ROICalculation,
  OptimizationStrategy,
  CostOptimizationConfig,
  defaultCostOptimizationConfig,
  CostHistory,
  CacheEntry,
} from "./interfaces/ICostOptimizationEngine";

// ============================================================================
// MODEL COSTS DATABASE
// ============================================================================

const MODEL_COSTS: Record<ModelType, ModelCost> = {
  "gpt-3.5-turbo": {
    model: "gpt-3.5-turbo",
    inputCostPerToken: 0.0005, // $0.0005 per 1K tokens
    outputCostPerToken: 0.0015, // $0.0015 per 1K tokens
    maxTokens: 4096,
    latency: 500, // 500ms average
    quality: 0.7,
    streaming: true,
    caching: true,
  },
  "gpt-4": {
    model: "gpt-4",
    inputCostPerToken: 0.03, // $0.03 per 1K tokens
    outputCostPerToken: 0.06, // $0.06 per 1K tokens
    maxTokens: 8192,
    latency: 2000, // 2s average
    quality: 0.9,
    streaming: true,
    caching: true,
  },
  "gpt-4-turbo": {
    model: "gpt-4-turbo",
    inputCostPerToken: 0.01, // $0.01 per 1K tokens
    outputCostPerToken: 0.03, // $0.03 per 1K tokens
    maxTokens: 128000,
    latency: 1000, // 1s average
    quality: 0.85,
    streaming: true,
    caching: true,
  },
  "gpt-5": {
    model: "gpt-5",
    inputCostPerToken: 0.05, // $0.05 per 1K tokens
    outputCostPerToken: 0.10, // $0.10 per 1K tokens
    maxTokens: 200000,
    latency: 1500, // 1.5s average
    quality: 0.95,
    streaming: true,
    caching: true,
  },
  "custom": {
    model: "custom",
    inputCostPerToken: 0.001, // $0.001 per 1K tokens
    outputCostPerToken: 0.002, // $0.002 per 1K tokens
    maxTokens: 2048,
    latency: 300, // 300ms average
    quality: 0.6,
    streaming: false,
    caching: false,
  },
};

// ============================================================================
// COST OPTIMIZATION ENGINE CLASS
// ============================================================================

export class CostOptimizationEngine {
  private static instance: CostOptimizationEngine;
  private config: CostOptimizationConfig;
  private costHistory: CostHistory[] = [];
  private cache: Map<string, CacheEntry> = new Map();
  private sessionCost: number = 0;
  private periodCost: number = 0;

  private constructor() {
    this.config = defaultCostOptimizationConfig;
  }

  static getInstance(): CostOptimizationEngine {
    if (!CostOptimizationEngine.instance) {
      CostOptimizationEngine.instance = new CostOptimizationEngine();
    }
    return CostOptimizationEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<CostOptimizationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Estimate cost for action
   */
  estimateCost(
    model: ModelType,
    inputTokens: number,
    expectedOutputTokens: number
  ): CostEstimation {
    const modelCost = MODEL_COSTS[model];
    
    const inputCost = (inputTokens / 1000) * modelCost.inputCostPerToken;
    const outputCost = (expectedOutputTokens / 1000) * modelCost.outputCostPerToken;
    const totalCost = inputCost + outputCost;
    const totalTokens = inputTokens + expectedOutputTokens;
    const estimatedTime = modelCost.latency + (totalTokens / 1000) * 10; // 10ms per 1K tokens

    return {
      model,
      inputTokens,
      outputTokens: expectedOutputTokens,
      totalTokens,
      inputCost,
      outputCost,
      totalCost,
      estimatedTime,
      qualityScore: modelCost.quality,
    };
  }

  /**
   * Calculate ROI for action
   */
  calculateROI(
    actionId: string,
    cost: number,
    expectedValue: number
  ): ROICalculation {
    const roi = expectedValue - cost;
    const roiPercentage = cost > 0 ? (roi / cost) * 100 : 0;
    const breakEven = roi >= 0;
    const recommended = roiPercentage >= (this.config.minROI - 1) * 100;

    let reasoning = "";
    if (recommended) {
      reasoning = `Positive ROI: ${roiPercentage.toFixed(1)}% - action recommended`;
    } else {
      reasoning = `Negative ROI: ${roiPercentage.toFixed(1)}% - action not recommended`;
    }

    return {
      actionId,
      cost,
      expectedValue,
      roi,
      roiPercentage,
      breakEven,
      recommended,
      reasoning,
    };
  }

  /**
   * Generate optimization strategy
   */
  generateOptimizationStrategy(
    actionId: string,
    inputTokens: number,
    expectedOutputTokens: number,
    expectedValue: number,
    requiredQuality: number
  ): OptimizationStrategy {
    // Check cache first
    const cacheKey = this.generateCacheKey(actionId, inputTokens);
    const cachedResult = this.cache.get(cacheKey);
    
    let reuseResults = false;
    if (cachedResult && this.config.reuseEnabled) {
      const age = Date.now() - cachedResult.timestamp.getTime();
      if (age < cachedResult.ttl * 1000) {
        reuseResults = true;
      }
    }

    // Estimate costs for different models
    const modelOptions = Object.keys(MODEL_COSTS) as ModelType[];
    const validModels = modelOptions.filter(model => 
      MODEL_COSTS[model].quality >= requiredQuality
    );

    // Find cheapest model that meets quality requirements
    let bestModel = validModels[0];
    let lowestCost = Infinity;

    validModels.forEach(model => {
      const estimation = this.estimateCost(model, inputTokens, expectedOutputTokens);
      if (estimation.totalCost < lowestCost) {
        lowestCost = estimation.totalCost;
        bestModel = model;
      }
    });

    // Check if cost exceeds limits
    const costEstimation = this.estimateCost(bestModel, inputTokens, expectedOutputTokens);
    const roiCalculation = this.calculateROI(actionId, costEstimation.totalCost, expectedValue);

    let skipAction = false;
    let alternativeAction: string | null = null;

    if (!roiCalculation.recommended) {
      skipAction = true;
      alternativeAction = "skip_action";
    }

    if (costEstimation.totalCost > this.config.maxCostPerAction) {
      skipAction = true;
      alternativeAction = "use_cheaper_model";
    }

    // Determine streaming
    const useStreaming = costEstimation.totalTokens > this.config.streamingThreshold;

    // Determine caching
    const useCaching = this.config.cachingEnabled;

    // Generate reasoning
    const reasoning = this.generateOptimizationReasoning(
      reuseResults,
      bestModel,
      skipAction,
      roiCalculation,
      costEstimation
    );

    return {
      useStreaming,
      useCaching,
      reuseResults,
      skipAction,
      alternativeAction,
      modelChoice: bestModel,
      reasoning,
    };
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(actionId: string, inputTokens: number): string {
    return `${actionId}_${inputTokens}`;
  }

  /**
   * Generate optimization reasoning
   */
  private generateOptimizationReasoning(
    reuseResults: boolean,
    model: ModelType,
    skipAction: boolean,
    roi: ROICalculation,
    cost: CostEstimation
  ): string {
    const reasons: string[] = [];

    if (reuseResults) {
      reasons.push("Reusing cached results to save cost");
    }

    reasons.push(`Selected ${model} for optimal cost/quality balance`);

    if (skipAction) {
      reasons.push(`Skipping action due to negative ROI (${roi.roiPercentage.toFixed(1)}%)`);
    } else {
      reasons.push(`Action recommended with positive ROI (${roi.roiPercentage.toFixed(1)}%)`);
    }

    reasons.push(`Estimated cost: $${cost.totalCost.toFixed(4)}`);

    return reasons.join("; ");
  }

  /**
   * Record cost
   */
  recordCost(
    actionId: string,
    model: ModelType,
    cost: number,
    tokens: number,
    value: number
  ): void {
    const roi = value - cost;

    const historyEntry: CostHistory = {
      actionId,
      model,
      cost,
      tokens,
      timestamp: new Date(),
      roi,
      value,
    };

    this.costHistory.push(historyEntry);
    this.sessionCost += cost;
    this.periodCost += cost;
  }

  /**
   * Cache result
   */
  cacheResult(
    key: string,
    model: ModelType,
    input: any,
    output: any,
    cost: number,
    tokens: number,
    ttl: number = 3600
  ): void {
    const entry: CacheEntry = {
      key,
      model,
      input,
      output,
      cost,
      tokens,
      timestamp: new Date(),
      hits: 0,
      ttl,
    };

    this.cache.set(key, entry);
  }

  /**
   * Get cached result
   */
  getCachedResult(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp.getTime();
    if (age > entry.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    return entry;
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    
    this.cache.forEach((entry, key) => {
      const age = now - entry.timestamp.getTime();
      if (age > entry.ttl * 1000) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Get session cost
   */
  getSessionCost(): number {
    return this.sessionCost;
  }

  /**
   * Get period cost
   */
  getPeriodCost(): number {
    return this.periodCost;
  }

  /**
   * Reset session cost
   */
  resetSessionCost(): void {
    this.sessionCost = 0;
  }

  /**
   * Reset period cost
   */
  resetPeriodCost(): void {
    this.periodCost = 0;
  }

  /**
   * Get cost statistics
   */
  getStatistics(): {
    totalCost: number;
    totalTokens: number;
    averageCost: number;
    averageTokens: number;
    modelDistribution: Record<ModelType, number>;
    cacheHitRate: number;
    averageROI: number;
    budgetRemaining: number;
    budgetUsed: number;
  } {
    const totalCost = this.costHistory.reduce((sum, entry) => sum + entry.cost, 0);
    const totalTokens = this.costHistory.reduce((sum, entry) => sum + entry.tokens, 0);
    const averageCost = this.costHistory.length > 0 ? totalCost / this.costHistory.length : 0;
    const averageTokens = this.costHistory.length > 0 ? totalTokens / this.costHistory.length : 0;

    const modelDistribution: Record<ModelType, number> = {
      "gpt-3.5-turbo": 0,
      "gpt-4": 0,
      "gpt-4-turbo": 0,
      "gpt-5": 0,
      "custom": 0,
    };

    this.costHistory.forEach(entry => {
      modelDistribution[entry.model]++;
    });

    const totalCacheHits = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.hits, 0);
    const cacheHitRate = this.cache.size > 0 ? totalCacheHits / (this.cache.size + totalCacheHits) : 0;

    const averageROI = this.costHistory.length > 0
      ? this.costHistory.reduce((sum, entry) => sum + entry.roi, 0) / this.costHistory.length
      : 0;

    const budgetUsed = this.periodCost;
    const budgetRemaining = this.config.budget - budgetUsed;

    return {
      totalCost,
      totalTokens,
      averageCost,
      averageTokens,
      modelDistribution,
      cacheHitRate,
      averageROI,
      budgetRemaining,
      budgetUsed,
    };
  }

  /**
   * Get cost history
   */
  getCostHistory(): CostHistory[] {
    return this.costHistory;
  }

  /**
   * Clear cost history
   */
  clearCostHistory(): void {
    this.costHistory = [];
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Export data
   */
  exportData(): {
    costHistory: CostHistory[];
    cache: CacheEntry[];
    config: CostOptimizationConfig;
  } {
    return {
      costHistory: this.costHistory,
      cache: Array.from(this.cache.values()),
      config: this.config,
    };
  }

  /**
   * Import data
   */
  importData(data: {
    costHistory: CostHistory[];
    cache: CacheEntry[];
    config?: CostOptimizationConfig;
  }): void {
    this.costHistory = data.costHistory;
    data.cache.forEach(entry => {
      this.cache.set(entry.key, entry);
    });
    if (data.config) {
      this.setConfig(data.config);
    }
  }
}

export const costOptimizationEngine = CostOptimizationEngine.getInstance();
