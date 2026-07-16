/**
 * AI Execution Log
 *
 * Logs all AI provider executions for audit, debugging, and analytics.
 */

export interface AIExecutionLogEntry {
  id: string;
  timestamp: Date;
  provider: "openai" | "anthropic" | "mock";
  model: string;
  promptId: string;
  promptVersion: string;
  promptVariables: Record<string, unknown>;
  latency: number; // milliseconds
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost: number; // USD
  retryCount: number;
  status: "success" | "error";
  error?: string;
  response?: unknown; // The parsed JSON response
  executionMode: "real" | "mock";
}

/**
 * AI Execution Logger
 *
 * Logs AI executions with full context.
 */
export class AIExecutionLogger {
  private logs: AIExecutionLogEntry[] = [];

  /**
   * Log an AI execution
   */
  log(entry: Omit<AIExecutionLogEntry, "id" | "timestamp">): AIExecutionLogEntry {
    const fullEntry: AIExecutionLogEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date(),
    };

    this.logs.push(fullEntry);
    return fullEntry;
  }

  /**
   * Get all logs
   */
  getAll(): AIExecutionLogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by provider
   */
  getByProvider(provider: string): AIExecutionLogEntry[] {
    return this.logs.filter((log) => log.provider === provider);
  }

  /**
   * Get logs by prompt ID
   */
  getByPromptId(promptId: string): AIExecutionLogEntry[] {
    return this.logs.filter((log) => log.promptId === promptId);
  }

  /**
   * Get logs by status
   */
  getByStatus(status: "success" | "error"): AIExecutionLogEntry[] {
    return this.logs.filter((log) => log.status === status);
  }

  /**
   * Get logs by execution mode
   */
  getByExecutionMode(mode: "real" | "mock"): AIExecutionLogEntry[] {
    return this.logs.filter((log) => log.executionMode === mode);
  }

  /**
   * Get logs by date range
   */
  getByDateRange(startDate: Date, endDate: Date): AIExecutionLogEntry[] {
    return this.logs.filter(
      (log) => log.timestamp >= startDate && log.timestamp <= endDate
    );
  }

  /**
   * Get summary statistics
   */
  getSummary(): {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    totalCost: number;
    totalTokens: number;
    averageLatency: number;
    byProvider: Record<string, number>;
    byPromptId: Record<string, number>;
    byMode: Record<string, number>;
  } {
    const successful = this.logs.filter((log) => log.status === "success");
    const failed = this.logs.filter((log) => log.status === "error");

    const totalCost = this.logs.reduce((sum, log) => sum + log.cost, 0);
    const totalTokens = this.logs.reduce((sum, log) => sum + log.tokens.total, 0);
    const averageLatency =
      this.logs.length > 0
        ? this.logs.reduce((sum, log) => sum + log.latency, 0) / this.logs.length
        : 0;

    const byProvider: Record<string, number> = {};
    const byPromptId: Record<string, number> = {};
    const byMode: Record<string, number> = {};

    for (const log of this.logs) {
      byProvider[log.provider] = (byProvider[log.provider] || 0) + 1;
      byPromptId[log.promptId] = (byPromptId[log.promptId] || 0) + 1;
      byMode[log.executionMode] = (byMode[log.executionMode] || 0) + 1;
    }

    return {
      totalExecutions: this.logs.length,
      successfulExecutions: successful.length,
      failedExecutions: failed.length,
      totalCost,
      totalTokens,
      averageLatency,
      byProvider,
      byPromptId,
      byMode,
    };
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Import logs from JSON
   */
  import(json: string): void {
    const parsed = JSON.parse(json) as AIExecutionLogEntry[];
    this.logs = parsed.map((log) => ({
      ...log,
      timestamp: new Date(log.timestamp),
    }));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const aiExecutionLogger = new AIExecutionLogger();
