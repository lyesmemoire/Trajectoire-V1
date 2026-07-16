/**
 * MetricsAdapter
 *
 * Generic adapter for recording metrics and history.
 * This abstraction eliminates repetitive metrics recording logic across engines.
 *
 * Responsibility:
 * - Adapt IntelligenceMetadata to Brain-compatible metrics format
 * - Record metrics in Brain history
 * - Provide consistent metrics recording for all engines
 *
 * Location: intelligence-runtime
 * Justification: This is a runtime responsibility related to execution tracking
 * and metrics recording, which belongs in the runtime library.
 */

export interface IntelligenceMetadata {
  latency?: number;
  tokenUsage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  cost?: number;
  [key: string]: unknown;
}

export interface BrainMetrics {
  latency: number;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost: number;
  retryCount: number;
}

export interface HistoryEntry {
  promptId: string;
  promptVersion: string;
  input: Record<string, unknown>;
  output: unknown;
  timestamp: Date;
  metrics: BrainMetrics;
  status: "success" | "error" | "partial";
}

export interface MetricsAdapterOptions {
  defaultLatency?: number;
  defaultCost?: number;
  defaultRetryCount?: number;
}

export class MetricsAdapter {
  /**
   * Adapt IntelligenceMetadata to Brain-compatible metrics format
   *
   * @param metadata - Raw IntelligenceMetadata from intelligence-core
   * @param options - Configuration for metrics adaptation
   * @returns Brain-compatible metrics
   */
  static adaptMetrics(
    metadata: IntelligenceMetadata | undefined,
    options: MetricsAdapterOptions = {}
  ): BrainMetrics {
    const {
      defaultLatency = 0,
      defaultCost = 0,
      defaultRetryCount = 0,
    } = options;

    return {
      latency: metadata?.latency ?? defaultLatency,
      tokens: {
        prompt: metadata?.tokenUsage?.promptTokens ?? 0,
        completion: metadata?.tokenUsage?.completionTokens ?? 0,
        total: metadata?.tokenUsage?.totalTokens ?? 0,
      },
      cost: metadata?.cost ?? defaultCost,
      retryCount: defaultRetryCount,
    };
  }

  /**
   * Create a complete history entry for Brain recording
   *
   * @param promptId - Prompt identifier
   * @param promptVersion - Prompt version
   * @param input - Input data
   * @param output - Output data
   * @param metadata - IntelligenceMetadata from execution
   * @param status - Execution status
   * @param options - Configuration for metrics adaptation
   * @returns Complete history entry
   */
  static createHistoryEntry(
    promptId: string,
    promptVersion: string,
    input: Record<string, unknown>,
    output: unknown,
    metadata: IntelligenceMetadata | undefined,
    status: "success" | "error" | "partial" = "success",
    options: MetricsAdapterOptions = {}
  ): HistoryEntry {
    const metrics = this.adaptMetrics(metadata, options);

    return {
      promptId,
      promptVersion,
      input,
      output,
      timestamp: new Date(),
      metrics,
      status,
    };
  }

  /**
   * Create a simplified history entry (for engines without metadata)
   *
   * @param promptId - Prompt identifier
   * @param promptVersion - Prompt version
   * @param input - Input data
   * @param output - Output data
   * @param status - Execution status
   * @returns Simplified history entry with zero metrics
   */
  static createSimplifiedHistoryEntry(
    promptId: string,
    promptVersion: string,
    input: Record<string, unknown>,
    output: unknown,
    status: "success" | "error" | "partial" = "success"
  ): HistoryEntry {
    return this.createHistoryEntry(
      promptId,
      promptVersion,
      input,
      output,
      undefined,
      status,
      {
        defaultLatency: 0,
        defaultCost: 0,
        defaultRetryCount: 0,
      }
    );
  }

  /**
   * Validate that metrics are in the correct format
   *
   * @param metrics - Metrics to validate
   * @returns true if valid, false otherwise
   */
  static validateMetrics(metrics: BrainMetrics): boolean {
    return (
      typeof metrics.latency === "number" &&
      typeof metrics.tokens.prompt === "number" &&
      typeof metrics.tokens.completion === "number" &&
      typeof metrics.tokens.total === "number" &&
      typeof metrics.cost === "number" &&
      typeof metrics.retryCount === "number"
    );
  }

  /**
   * Calculate total cost from metrics
   *
   * @param metrics - Metrics to calculate cost from
   * @returns Total cost
   */
  static calculateTotalCost(metrics: BrainMetrics): number {
    return metrics.cost;
  }

  /**
   * Calculate total tokens from metrics
   *
   * @param metrics - Metrics to calculate tokens from
   * @returns Total tokens
   */
  static calculateTotalTokens(metrics: BrainMetrics): number {
    return metrics.tokens.total;
  }

  /**
   * Calculate average latency from multiple metrics
   *
   * @param metricsArray - Array of metrics to average
   * @returns Average latency
   */
  static calculateAverageLatency(metricsArray: BrainMetrics[]): number {
    if (metricsArray.length === 0) return 0;
    
    const totalLatency = metricsArray.reduce((sum, m) => sum + m.latency, 0);
    return totalLatency / metricsArray.length;
  }
}
