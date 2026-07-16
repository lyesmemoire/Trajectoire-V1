/**
 * Cost Tracker
 *
 * Tracks AI usage costs, tokens, and latency for analytics and billing.
 */

export interface CostMetrics {
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latency: number; // milliseconds
  cost: number; // in USD
  timestamp: Date;
  promptVersion?: string;
}

export interface CostSummary {
  totalCost: number;
  totalTokens: number;
  totalRequests: number;
  averageLatency: number;
  byProvider: Record<string, ProviderSummary>;
  byModel: Record<string, ModelSummary>;
}

export interface ProviderSummary {
  totalCost: number;
  totalTokens: number;
  totalRequests: number;
  averageLatency: number;
}

export interface ModelSummary {
  totalCost: number;
  totalTokens: number;
  totalRequests: number;
  averageLatency: number;
}

/**
 * Cost per 1M tokens for different providers and models
 */
const PRICING: Record<string, Record<string, { input: number; output: number }>> = {
  openai: {
    "gpt-4": { input: 30, output: 60 },
    "gpt-4-turbo": { input: 10, output: 30 },
    "gpt-3.5-turbo": { input: 0.5, output: 1.5 },
  },
  anthropic: {
    "claude-3-opus": { input: 15, output: 75 },
    "claude-3-sonnet": { input: 3, output: 15 },
    "claude-3-haiku": { input: 0.25, output: 1.25 },
  },
};

/**
 * Cost Tracker
 *
 * Tracks and summarizes AI usage costs.
 */
export class CostTracker {
  private metrics: CostMetrics[] = [];

  /**
   * Record a cost metric
   */
  record(metric: Omit<CostMetrics, "cost">): CostMetrics {
    const cost = this.calculateCost(
      metric.provider,
      metric.model,
      metric.promptTokens,
      metric.completionTokens
    );

    const fullMetric: CostMetrics = {
      ...metric,
      cost,
    };

    this.metrics.push(fullMetric);
    return fullMetric;
  }

  /**
   * Calculate cost based on provider, model, and tokens
   */
  private calculateCost(
    provider: string,
    model: string,
    promptTokens: number,
    completionTokens: number
  ): number {
    const providerPricing = PRICING[provider];
    if (!providerPricing) {
      return 0; // Unknown provider, cannot calculate cost
    }

    const modelPricing = providerPricing[model];
    if (!modelPricing) {
      return 0; // Unknown model, cannot calculate cost
    }

    const inputCost = (promptTokens / 1_000_000) * modelPricing.input;
    const outputCost = (completionTokens / 1_000_000) * modelPricing.output;

    return inputCost + outputCost;
  }

  /**
   * Get cost summary for a time range
   */
  getSummary(startDate?: Date, endDate?: Date): CostSummary {
    const filtered = this.filterByDateRange(startDate, endDate);

    const summary: CostSummary = {
      totalCost: 0,
      totalTokens: 0,
      totalRequests: filtered.length,
      averageLatency: 0,
      byProvider: {},
      byModel: {},
    };

    if (filtered.length === 0) {
      return summary;
    }

    let totalLatency = 0;

    for (const metric of filtered) {
      summary.totalCost += metric.cost;
      summary.totalTokens += metric.totalTokens;
      totalLatency += metric.latency;

      // By provider
      if (!summary.byProvider[metric.provider]) {
        summary.byProvider[metric.provider] = {
          totalCost: 0,
          totalTokens: 0,
          totalRequests: 0,
          averageLatency: 0,
        };
      }
      summary.byProvider[metric.provider]!.totalCost += metric.cost;
      summary.byProvider[metric.provider]!.totalTokens += metric.totalTokens;
      summary.byProvider[metric.provider]!.totalRequests++;
      summary.byProvider[metric.provider]!.averageLatency += metric.latency;

      // By model
      if (!summary.byModel[metric.model]) {
        summary.byModel[metric.model] = {
          totalCost: 0,
          totalTokens: 0,
          totalRequests: 0,
          averageLatency: 0,
        };
      }
      summary.byModel[metric.model]!.totalCost += metric.cost;
      summary.byModel[metric.model]!.totalTokens += metric.totalTokens;
      summary.byModel[metric.model]!.totalRequests++;
      summary.byModel[metric.model]!.averageLatency += metric.latency;
    }

    summary.averageLatency = totalLatency / filtered.length;

    // Calculate average latencies
    for (const provider of Object.values(summary.byProvider)) {
      provider.averageLatency = provider.averageLatency / provider.totalRequests;
    }

    for (const model of Object.values(summary.byModel)) {
      model.averageLatency = model.averageLatency / model.totalRequests;
    }

    return summary;
  }

  /**
   * Get metrics for a specific provider
   */
  getByProvider(provider: string, startDate?: Date, endDate?: Date): CostMetrics[] {
    const filtered = this.filterByDateRange(startDate, endDate);
    return filtered.filter((m) => m.provider === provider);
  }

  /**
   * Get metrics for a specific model
   */
  getByModel(model: string, startDate?: Date, endDate?: Date): CostMetrics[] {
    const filtered = this.filterByDateRange(startDate, endDate);
    return filtered.filter((m) => m.model === model);
  }

  /**
   * Get metrics for a specific prompt version
   */
  getByPromptVersion(promptVersion: string, startDate?: Date, endDate?: Date): CostMetrics[] {
    const filtered = this.filterByDateRange(startDate, endDate);
    return filtered.filter((m) => m.promptVersion === promptVersion);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Get all metrics
   */
  getAll(): CostMetrics[] {
    return [...this.metrics];
  }

  /**
   * Filter metrics by date range
   */
  private filterByDateRange(startDate?: Date, endDate?: Date): CostMetrics[] {
    if (!startDate && !endDate) {
      return [...this.metrics];
    }

    return this.metrics.filter((metric) => {
      if (startDate && metric.timestamp < startDate) {
        return false;
      }
      if (endDate && metric.timestamp > endDate) {
        return false;
      }
      return true;
    });
  }

  /**
   * Update pricing for a provider/model
   */
  static updatePricing(provider: string, model: string, inputCost: number, outputCost: number): void {
    if (!PRICING[provider]) {
      PRICING[provider] = {};
    }
    PRICING[provider][model] = { input: inputCost, output: outputCost };
  }

  /**
   * Get current pricing
   */
  static getPricing(): typeof PRICING {
    return PRICING;
  }
}
