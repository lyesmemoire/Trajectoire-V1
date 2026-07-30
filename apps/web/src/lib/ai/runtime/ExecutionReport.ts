// ===================================================================
// EXECUTION REPORT — Execution Report Contract
// ===================================================================

export interface EngineExecutionMetrics {
  engineName: string;
  durationMs: number;
  eventsProduced: number;
  success: boolean;
  error?: string;
}

export interface ReducerExecutionMetrics {
  reducerName: string;
  durationMs: number;
  success: boolean;
  error?: string;
}

export interface ExecutionReport {
  sessionId: string;
  traceId: string;
  correlationId: string;
  startTime: Date;
  endTime: Date;
  totalDurationMs: number;
  enginesExecuted: EngineExecutionMetrics[];
  reducersExecuted: ReducerExecutionMetrics[];
  eventsPublished: number;
  snapshotsCreated: number;
  budgetUsed: {
    durationMs: number;
    tokens: number;
  };
  hooksCalled: {
    beforeEngine: number;
    afterEngine: number;
    beforePublish: number;
    afterPublish: number;
    beforeReducer: number;
    afterReducer: number;
  };
}

export class ExecutionReportBuilder {
  private report: Partial<ExecutionReport> = {
    enginesExecuted: [],
    reducersExecuted: [],
    eventsPublished: 0,
    snapshotsCreated: 0,
    budgetUsed: {
      durationMs: 0,
      tokens: 0,
    },
    hooksCalled: {
      beforeEngine: 0,
      afterEngine: 0,
      beforePublish: 0,
      afterPublish: 0,
      beforeReducer: 0,
      afterReducer: 0,
    },
  };

  constructor(
    private readonly sessionId: string,
    private readonly traceId: string,
    private readonly correlationId: string
  ) {
    this.report.sessionId = sessionId;
    this.report.traceId = traceId;
    this.report.correlationId = correlationId;
    this.report.startTime = new Date();
  }

  recordEngineExecution(metrics: EngineExecutionMetrics): void {
    this.report.enginesExecuted!.push(metrics);
    this.report.eventsPublished! += metrics.eventsProduced;
    this.report.budgetUsed!.durationMs += metrics.durationMs;
  }

  recordReducerExecution(metrics: ReducerExecutionMetrics): void {
    this.report.reducersExecuted!.push(metrics);
    this.report.budgetUsed!.durationMs += metrics.durationMs;
  }

  incrementSnapshotCount(): void {
    this.report.snapshotsCreated!++;
  }

  recordHookCall(hookName: keyof ExecutionReport["hooksCalled"]): void {
    this.report.hooksCalled![hookName]++;
  }

  finalize(): ExecutionReport {
    const endTime = new Date();
    this.report.endTime = endTime;
    this.report.totalDurationMs = endTime.getTime() - this.report.startTime!.getTime();

    return this.report as ExecutionReport;
  }
}
