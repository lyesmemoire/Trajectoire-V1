// ===================================================================
// EXECUTION REPORT — Execution Report Contract
// ===================================================================

export interface EngineExecutionMetrics {
  engineName: string;
  durationMs: number;
  eventsProduced: number;
  success: boolean;
  error?: string;
  factsConsumed?: string[];
  factsProduced?: string[];
  budgetUsed?: {
    durationMs: number;
    tokens: number;
  };
}

export interface ReducerExecutionMetrics {
  reducerName: string;
  durationMs: number;
  success: boolean;
  error?: string;
}

export interface ExecutionGraphNode {
  engineName: string;
  durationMs: number;
  eventsProduced: number;
  success: boolean;
  factsConsumed: string[];
  factsProduced: string[];
  errors: string[];
  budgetUsed: {
    durationMs: number;
    tokens: number;
  };
}

export interface ExecutionGraph {
  nodes: ExecutionGraphNode[];
  edges: Array<{
    from: string;
    to: string;
    type: "produces" | "consumes";
  }>;
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
  executionGraph?: ExecutionGraph;
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
  private graphNodes: ExecutionGraphNode[] = [];
  private graphEdges: Array<{ from: string; to: string; type: "produces" | "consumes" }> = [];

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

    // Add to execution graph
    this.graphNodes.push({
      engineName: metrics.engineName,
      durationMs: metrics.durationMs,
      eventsProduced: metrics.eventsProduced,
      success: metrics.success,
      factsConsumed: metrics.factsConsumed || [],
      factsProduced: metrics.factsProduced || [],
      errors: metrics.error ? [metrics.error] : [],
      budgetUsed: metrics.budgetUsed || { durationMs: metrics.durationMs, tokens: 0 },
    });
  }

  recordReducerExecution(metrics: ReducerExecutionMetrics): void {
    this.report.reducersExecuted!.push(metrics);
    this.report.budgetUsed!.durationMs += metrics.durationMs;
  }

  addGraphEdge(from: string, to: string, type: "produces" | "consumes"): void {
    this.graphEdges.push({ from, to, type });
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

    // Build execution graph
    this.report.executionGraph = {
      nodes: this.graphNodes,
      edges: this.graphEdges,
    };

    return this.report as ExecutionReport;
  }
}
