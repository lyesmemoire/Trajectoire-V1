/**
 * Brain History
 *
 * Maintains a chronological history of all AI analyses and their evolution.
 */
// @ts-nocheck


export interface BrainHistoryEntry {
  id: string;
  timestamp: Date;
  promptId: string;
  promptVersion: string;
  input: Record<string, unknown>;
  output: unknown;
  metrics: {
    latency: number;
    tokens: { prompt: number; completion: number; total: number };
    cost: number;
    retryCount: number;
  };
  status: "success" | "error";
  error?: string;
}

export class BrainHistory {
  private history: BrainHistoryEntry[] = [];

  /**
   * Add a history entry
   */
  addEntry(entry: Omit<BrainHistoryEntry, "id">): BrainHistoryEntry {
    const fullEntry: BrainHistoryEntry = {
      ...entry,
      id: this.generateId(),
    };

    this.history.push(fullEntry);
    return fullEntry;
  }

  /**
   * Get all history
   */
  getHistory(): BrainHistoryEntry[] {
    return [...this.history];
  }

  /**
   * Get history by prompt ID
   */
  getHistoryByPromptId(promptId: string): BrainHistoryEntry[] {
    return this.history.filter((h) => h.promptId === promptId);
  }

  /**
   * Get history in date range
   */
  getHistoryByDateRange(start: Date, end: Date): BrainHistoryEntry[] {
    return this.history.filter((h) => h.timestamp >= start && h.timestamp <= end);
  }

  /**
   * Get evolution of a specific analysis over time
   */
  getEvolution(promptId: string): {
    entries: BrainHistoryEntry[];
    trend: "improving" | "declining" | "stable";
    averageLatency: number;
    averageCost: number;
    successRate: number;
  } {
    const entries = this.getHistoryByPromptId(promptId).sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    if (entries.length === 0) {
      return {
        entries: [],
        trend: "stable",
        averageLatency: 0,
        averageCost: 0,
        successRate: 0,
      };
    }

    const successful = entries.filter((e) => e.status === "success");
    const successRate = successful.length / entries.length;

    const averageLatency =
      successful.reduce((sum, e) => sum + e.metrics.latency, 0) / successful.length;
    const averageCost =
      successful.reduce((sum, e) => sum + e.metrics.cost, 0) / successful.length;

    // Determine trend based on recent vs older performance
    let trend: "improving" | "declining" | "stable" = "stable";
    if (entries.length >= 3) {
      const recent = entries.slice(-3);
      const older = entries.slice(0, -3);

      const recentAvgCost = recent.reduce((sum, e) => sum + e.metrics.cost, 0) / recent.length;
      const olderAvgCost = older.reduce((sum, e) => sum + e.metrics.cost, 0) / older.length;

      if (recentAvgCost < olderAvgCost * 0.9) {
        trend = "improving";
      } else if (recentAvgCost > olderAvgCost * 1.1) {
        trend = "declining";
      }
    }

    return {
      entries,
      trend,
      averageLatency,
      averageCost,
      successRate,
    };
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = [];
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
