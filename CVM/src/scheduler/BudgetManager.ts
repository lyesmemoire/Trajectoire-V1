/**
 * Budget Manager Implementation
 * Manages latency, token, CPU, and memory budgets for sessions
 */

import {
  CognitiveTask,
  BudgetCheckResult,
  BudgetMetrics,
  TaskMetrics
} from './types';

export class BudgetManager {
  latencyBudgets: Map<string, number> = new Map();
  tokenBudgets: Map<string, number> = new Map();
  cpuBudgets: Map<string, number> = new Map();
  memoryBudgets: Map<string, number> = new Map();
  
  private metrics: BudgetMetrics = {
    totalLatencyConsumed: 0,
    totalTokensConsumed: 0,
    totalCPUConsumed: 0,
    totalMemoryConsumed: 0,
    budgetViolations: 0
  };

  /**
   * Check if a task is within budget
   */
  checkBudget(task: CognitiveTask): BudgetCheckResult {
    const sessionId = task.sessionId;
    const exceededBudgets: string[] = [];
    const remainingBudgets = new Map<string, number>();
    
    // Check latency budget
    const latencyBudget = this.latencyBudgets.get(sessionId) || Infinity;
    if (task.latencyBudget > latencyBudget) {
      exceededBudgets.push('latency');
    }
    remainingBudgets.set('latency', latencyBudget);
    
    // Check token budget
    const tokenBudget = this.tokenBudgets.get(sessionId) || Infinity;
    if (task.tokenBudget > tokenBudget) {
      exceededBudgets.push('tokens');
    }
    remainingBudgets.set('tokens', tokenBudget);
    
    // Check CPU budget
    const cpuBudget = this.cpuBudgets.get(sessionId) || Infinity;
    const cpuRequirement = 100;
    if (cpuRequirement > cpuBudget) {
      exceededBudgets.push('cpu');
    }
    remainingBudgets.set('cpu', cpuBudget);
    
    // Check memory budget
    const memoryBudget = this.memoryBudgets.get(sessionId) || Infinity;
    const memoryRequirement = 1024 * 1024;
    if (memoryRequirement > memoryBudget) {
      exceededBudgets.push('memory');
    }
    remainingBudgets.set('memory', memoryBudget);
    
    return {
      withinBudget: exceededBudgets.length === 0,
      exceededBudgets,
      remainingBudgets
    };
  }

  /**
   * Consume budget for a completed task
   */
  consumeBudget(task: CognitiveTask, metrics: TaskMetrics): void {
    const sessionId = task.sessionId;
    
    const currentLatency = this.latencyBudgets.get(sessionId) || Infinity;
    if (currentLatency !== Infinity) {
      this.latencyBudgets.set(sessionId, currentLatency - metrics.executionTime);
      this.metrics.totalLatencyConsumed += metrics.executionTime;
    }
    
    const currentTokens = this.tokenBudgets.get(sessionId) || Infinity;
    if (currentTokens !== Infinity) {
      this.tokenBudgets.set(sessionId, currentTokens - metrics.tokensUsed);
      this.metrics.totalTokensConsumed += metrics.tokensUsed;
    }
    
    const currentCPU = this.cpuBudgets.get(sessionId) || Infinity;
    if (currentCPU !== Infinity) {
      this.cpuBudgets.set(sessionId, currentCPU - metrics.cpuTime);
      this.metrics.totalCPUConsumed += metrics.cpuTime;
    }
    
    const currentMemory = this.memoryBudgets.get(sessionId) || Infinity;
    if (currentMemory !== Infinity) {
      this.memoryBudgets.set(sessionId, currentMemory - metrics.memoryUsed);
      this.metrics.totalMemoryConsumed += metrics.memoryUsed;
    }
  }

  /**
   * Release budget for a cancelled/failed task
   */
  releaseBudget(task: CognitiveTask): void {
    const sessionId = task.sessionId;
    // Budget release policy depends on implementation
    // For now, we don't restore consumed budget
  }

  /**
   * Set budget for a session
   */
  setBudget(sessionId: string, type: 'latency' | 'tokens' | 'cpu' | 'memory', value: number): void {
    switch (type) {
      case 'latency':
        this.latencyBudgets.set(sessionId, value);
        break;
      case 'tokens':
        this.tokenBudgets.set(sessionId, value);
        break;
      case 'cpu':
        this.cpuBudgets.set(sessionId, value);
        break;
      case 'memory':
        this.memoryBudgets.set(sessionId, value);
        break;
    }
  }

  /**
   * Get budget metrics
   */
  getMetrics(): BudgetMetrics {
    return { ...this.metrics };
  }

  /**
   * Record a budget violation
   */
  recordBudgetViolation(): void {
    this.metrics.budgetViolations++;
  }

  /**
   * Get remaining budget for a session
   */
  getRemainingBudget(sessionId: string): Map<string, number> {
    const remaining = new Map<string, number>();
    remaining.set('latency', this.latencyBudgets.get(sessionId) || Infinity);
    remaining.set('tokens', this.tokenBudgets.get(sessionId) || Infinity);
    remaining.set('cpu', this.cpuBudgets.get(sessionId) || Infinity);
    remaining.set('memory', this.memoryBudgets.get(sessionId) || Infinity);
    return remaining;
  }

  /**
   * Clear all budgets for a session
   */
  clearSession(sessionId: string): void {
    this.latencyBudgets.delete(sessionId);
    this.tokenBudgets.delete(sessionId);
    this.cpuBudgets.delete(sessionId);
    this.memoryBudgets.delete(sessionId);
  }

  /**
   * Clear all budgets
   */
  clear(): void {
    this.latencyBudgets.clear();
    this.tokenBudgets.clear();
    this.cpuBudgets.clear();
    this.memoryBudgets.clear();
  }
}
