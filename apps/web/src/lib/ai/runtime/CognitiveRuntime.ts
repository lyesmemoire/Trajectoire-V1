import { EngineInput } from "../contracts/Engine";
import { EngineRegistry, DefaultEngineRegistry } from "./EngineRegistry";
import { EventBus, DefaultEventBus } from "./EventBus";
import { EngineScheduler, SequentialEngineScheduler } from "./EngineScheduler";
import { ReducerRegistry, DefaultReducerRegistry } from "./ReducerRegistry";
import { RuntimeHooks, DefaultRuntimeHooks } from "./RuntimeHooks";
import { SnapshotBuilder, DefaultSnapshotBuilder } from "./SnapshotBuilder";
import { InvestigationContext } from "../../../domain/cognitive/InvestigationContext";
import { CognitiveState } from "../../../domain/cognitive/CognitiveState";
import { EngineExecutionError, EngineBudgetExceededError } from "./errors/EngineExecutionError";
import { ExecutionBudgetManager, BudgetConfig } from "./ExecutionBudget";
import { ExecutionReportBuilder, ExecutionReport } from "./ExecutionReport";
import { EngineCapabilityRegistry } from "./EngineCapability";

// ===================================================================
// COGNITIVE RUNTIME — Cognitive Runtime Contract
// ===================================================================

export interface CognitiveRuntime {
  initialize(sessionId: string, context: InvestigationContext, budgetConfig?: BudgetConfig): Promise<void>;
  execute(engineNames: string[], input: EngineInput, abortSignal?: AbortSignal): Promise<ExecutionReport>;
  getEventBus(): EventBus;
  getRegistry(): EngineRegistry;
  getReducerRegistry(): ReducerRegistry;
  getSnapshotBuilder(): SnapshotBuilder;
  getExecutionReport(): ExecutionReport | null;
  getCapabilityRegistry(): EngineCapabilityRegistry;
}

export class DefaultCognitiveRuntime implements CognitiveRuntime {
  private readonly registry: EngineRegistry;
  private readonly eventBus: EventBus;
  private readonly scheduler: EngineScheduler;
  private readonly reducerRegistry: ReducerRegistry;
  private readonly hooks: RuntimeHooks;
  private readonly snapshotBuilder: SnapshotBuilder;
  private readonly capabilityRegistry: EngineCapabilityRegistry;
  private sessionId: string | null = null;
  private currentContext: InvestigationContext | null = null;
  private currentState: CognitiveState | null = null;
  private currentTraceId: string | null = null;
  private currentCorrelationId: string | null = null;
  private budgetManager: ExecutionBudgetManager | null = null;
  private reportBuilder: ExecutionReportBuilder | null = null;
  private executionPolicy: "stop-on-error" | "continue-on-error" = "continue-on-error";

  constructor() {
    this.registry = new DefaultEngineRegistry();
    this.eventBus = new DefaultEventBus();
    this.scheduler = new SequentialEngineScheduler(this.registry);
    this.reducerRegistry = new DefaultReducerRegistry();
    this.hooks = new DefaultRuntimeHooks();
    this.snapshotBuilder = new DefaultSnapshotBuilder();
    this.capabilityRegistry = new EngineCapabilityRegistry();
  }

  async initialize(sessionId: string, context: InvestigationContext, budgetConfig?: BudgetConfig): Promise<void> {
    this.sessionId = sessionId;
    this.currentContext = context;
    this.currentTraceId = crypto.randomUUID();
    this.currentCorrelationId = crypto.randomUUID();

    if (budgetConfig) {
      this.budgetManager = new ExecutionBudgetManager(budgetConfig);
    }

    this.reportBuilder = new ExecutionReportBuilder(
      sessionId,
      this.currentTraceId,
      this.currentCorrelationId
    );
  }

  async execute(engineNames: string[], input: EngineInput, abortSignal?: AbortSignal): Promise<ExecutionReport> {
    if (!this.sessionId || !this.reportBuilder) {
      throw new Error("Runtime not initialized. Call initialize() first.");
    }

    // Verify engine chain contracts
    const violations = this.capabilityRegistry.verifyChain(engineNames);
    if (violations.length > 0) {
      throw new Error(`Engine chain contract violations: ${violations.map(v => v.violation).join(", ")}`);
    }

    const reportBuilder = this.reportBuilder;

    // Execute engines sequentially via scheduler
    for (const engineName of engineNames) {
      if (abortSignal?.aborted) {
        throw new EngineExecutionError(engineName, "unknown", "Execution aborted by AbortSignal");
      }

      if (this.budgetManager?.isExceeded()) {
        throw new EngineBudgetExceededError(
          engineName,
          "unknown",
          this.budgetManager.isDurationExceeded() ? "time" : "tokens",
          this.budgetManager.getBudget().maxDurationMs,
          this.budgetManager.getBudget().maxDurationMs - this.budgetManager.getBudget().remainingDurationMs
        );
      }

      const engine = this.registry.get(engineName);
      if (!engine) {
        throw new Error(`Engine ${engineName} not found in registry`);
      }

      const engineStartTime = Date.now();

      // Hook: beforeEngine
      await this.hooks.beforeEngine?.(engine, input);
      reportBuilder.recordHookCall("beforeEngine");

      try {
        const result = await engine.execute(input);

        // Hook: afterEngine
        await this.hooks.afterEngine?.(engine, input, result.events);
        reportBuilder.recordHookCall("afterEngine");

        // Record engine execution metrics
        const durationMs = Date.now() - engineStartTime;
        reportBuilder.recordEngineExecution({
          engineName: engine.name,
          durationMs,
          eventsProduced: result.events.length,
          success: true,
        });

        // Consume budget
        if (this.budgetManager) {
          this.budgetManager.consumeDuration(durationMs);
          this.budgetManager.consumeTokens(result.tokens.total);
        }

        // Publish events to EventBus (Runtime dispatch only)
        for (const event of result.events) {
          // Hook: beforePublish
          await this.hooks.beforePublish?.(event);
          reportBuilder.recordHookCall("beforePublish");

          this.eventBus.publish(event);

          // Hook: afterPublish
          await this.hooks.afterPublish?.(event);
          reportBuilder.recordHookCall("afterPublish");
        }
      } catch (error) {
        const durationMs = Date.now() - engineStartTime;
        reportBuilder.recordEngineExecution({
          engineName: engine.name,
          durationMs,
          eventsProduced: 0,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });

        if (this.executionPolicy === "stop-on-error") {
          throw error;
        }
      }
    }

    // Collect all events from EventBus
    const events = this.eventBus.getHistory(this.sessionId);

    // Apply reducers
    if (this.currentState && this.currentContext) {
      // Hook: beforeReducer
      await this.hooks.beforeReducer?.(events, this.currentState);
      reportBuilder.recordHookCall("beforeReducer");

      const reducerStartTime = Date.now();
      let newState = this.currentState;
      for (const reducer of this.reducerRegistry.getAll()) {
        try {
          newState = reducer.reduce(events, newState);
          reportBuilder.recordReducerExecution({
            reducerName: reducer.name,
            durationMs: Date.now() - reducerStartTime,
            success: true,
          });
        } catch (error) {
          reportBuilder.recordReducerExecution({
            reducerName: reducer.name,
            durationMs: Date.now() - reducerStartTime,
            success: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      // Hook: afterReducer
      await this.hooks.afterReducer?.(events, newState);
      reportBuilder.recordHookCall("afterReducer");

      // Build new snapshot
      const newContext = this.snapshotBuilder.build(
        newState,
        this.currentContext,
        {
          traceId: this.currentTraceId || undefined,
          correlationId: this.currentCorrelationId || undefined,
        }
      );

      reportBuilder.incrementSnapshotCount();

      this.currentState = newState;
      this.currentContext = newContext;
    }

    // Finalize and return report
    const report = reportBuilder.finalize();
    return report;
  }

  getEventBus(): EventBus {
    return this.eventBus;
  }

  getRegistry(): EngineRegistry {
    return this.registry;
  }

  getReducerRegistry(): ReducerRegistry {
    return this.reducerRegistry;
  }

  getSnapshotBuilder(): SnapshotBuilder {
    return this.snapshotBuilder;
  }

  getExecutionReport(): ExecutionReport | null {
    return this.reportBuilder?.finalize() || null;
  }

  getCapabilityRegistry(): EngineCapabilityRegistry {
    return this.capabilityRegistry;
  }

  setExecutionPolicy(policy: "stop-on-error" | "continue-on-error"): void {
    this.executionPolicy = policy;
  }
}
