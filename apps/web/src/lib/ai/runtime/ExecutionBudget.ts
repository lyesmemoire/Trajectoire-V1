// ===================================================================
// EXECUTION BUDGET — Execution Budget Contract
// ===================================================================

export interface ExecutionBudget {
  maxDurationMs: number;
  maxTokens: number;
  remainingDurationMs: number;
  remainingTokens: number;
}

export interface BudgetConfig {
  maxDurationMs: number;
  maxTokens: number;
}

export class ExecutionBudgetManager {
  private budget: ExecutionBudget;

  constructor(config: BudgetConfig) {
    this.budget = {
      maxDurationMs: config.maxDurationMs,
      maxTokens: config.maxTokens,
      remainingDurationMs: config.maxDurationMs,
      remainingTokens: config.maxTokens,
    };
  }

  consumeDuration(durationMs: number): void {
    this.budget.remainingDurationMs -= durationMs;
    if (this.budget.remainingDurationMs < 0) {
      this.budget.remainingDurationMs = 0;
    }
  }

  consumeTokens(tokens: number): void {
    this.budget.remainingTokens -= tokens;
    if (this.budget.remainingTokens < 0) {
      this.budget.remainingTokens = 0;
    }
  }

  isDurationExceeded(): boolean {
    return this.budget.remainingDurationMs <= 0;
  }

  isTokensExceeded(): boolean {
    return this.budget.remainingTokens <= 0;
  }

  isExceeded(): boolean {
    return this.isDurationExceeded() || this.isTokensExceeded();
  }

  getBudget(): ExecutionBudget {
    return { ...this.budget };
  }

  reset(): void {
    this.budget.remainingDurationMs = this.budget.maxDurationMs;
    this.budget.remainingTokens = this.budget.maxTokens;
  }
}
