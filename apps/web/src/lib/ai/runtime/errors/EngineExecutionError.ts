// ===================================================================
// ENGINE EXECUTION ERROR — Engine Execution Error Contract
// ===================================================================

export class EngineExecutionError extends Error {
  constructor(
    public readonly engineName: string,
    public readonly engineVersion: string,
    message: string,
    public readonly cause?: Error,
    public readonly timestamp: Date = new Date()
  ) {
    super(`[${engineName}@${engineVersion}] ${message}`);
    this.name = "EngineExecutionError";
  }
}

export class EngineTimeoutError extends EngineExecutionError {
  constructor(
    engineName: string,
    engineVersion: string,
    public readonly timeoutMs: number,
    cause?: Error
  ) {
    super(
      engineName,
      engineVersion,
      `Engine execution timed out after ${timeoutMs}ms`,
      cause
    );
    this.name = "EngineTimeoutError";
  }
}

export class EngineBudgetExceededError extends EngineExecutionError {
  constructor(
    engineName: string,
    engineVersion: string,
    public readonly budgetType: "time" | "tokens",
    public readonly budgetLimit: number,
    public readonly actualUsage: number,
    cause?: Error
  ) {
    super(
      engineName,
      engineVersion,
      `Engine exceeded ${budgetType} budget: ${actualUsage}/${budgetLimit}`,
      cause
    );
    this.name = "EngineBudgetExceededError";
  }
}
