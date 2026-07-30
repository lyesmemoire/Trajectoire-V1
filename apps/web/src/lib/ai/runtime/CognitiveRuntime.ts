import { EngineInput } from "../contracts/Engine";
import { EngineRegistry, DefaultEngineRegistry } from "./EngineRegistry";
import { EventBus, DefaultEventBus } from "./EventBus";
import { EngineScheduler, SequentialEngineScheduler } from "./EngineScheduler";
import { ReducerRegistry, DefaultReducerRegistry, Reducer } from "./ReducerRegistry";
import { RuntimeHooks, DefaultRuntimeHooks } from "./RuntimeHooks";
import { SnapshotBuilder, DefaultSnapshotBuilder } from "./SnapshotBuilder";
import { InvestigationContext } from "../../../domain/cognitive/InvestigationContext";
import { BaseEvent } from "../contracts/Event";
import { CognitiveState } from "../../../domain/cognitive/CognitiveState";
import { SnapshotMetadata } from "../../../domain/cognitive/SnapshotMetadata";

// ===================================================================
// COGNITIVE RUNTIME — Cognitive Runtime Contract
// ===================================================================

export interface CognitiveRuntime {
  initialize(sessionId: string, context: InvestigationContext): Promise<void>;
  execute(engineNames: string[], input: EngineInput): Promise<void>;
  getEventBus(): EventBus;
  getRegistry(): EngineRegistry;
  getReducerRegistry(): ReducerRegistry;
  getSnapshotBuilder(): SnapshotBuilder;
}

export class DefaultCognitiveRuntime implements CognitiveRuntime {
  private readonly registry: EngineRegistry;
  private readonly eventBus: EventBus;
  private readonly scheduler: EngineScheduler;
  private readonly reducerRegistry: ReducerRegistry;
  private readonly hooks: RuntimeHooks;
  private readonly snapshotBuilder: SnapshotBuilder;
  private sessionId: string | null = null;
  private currentContext: InvestigationContext | null = null;
  private currentState: CognitiveState | null = null;
  private currentTraceId: string | null = null;
  private currentCorrelationId: string | null = null;

  constructor() {
    this.registry = new DefaultEngineRegistry();
    this.eventBus = new DefaultEventBus();
    this.scheduler = new SequentialEngineScheduler(this.registry);
    this.reducerRegistry = new DefaultReducerRegistry();
    this.hooks = new DefaultRuntimeHooks();
    this.snapshotBuilder = new DefaultSnapshotBuilder();
  }

  async initialize(sessionId: string, context: InvestigationContext): Promise<void> {
    this.sessionId = sessionId;
    this.currentContext = context;
    this.currentTraceId = crypto.randomUUID();
    this.currentCorrelationId = crypto.randomUUID();
    // Runtime dispatch only - no business logic
  }

  async execute(engineNames: string[], input: EngineInput): Promise<void> {
    if (!this.sessionId) {
      throw new Error("Runtime not initialized. Call initialize() first.");
    }

    // Execute engines sequentially via scheduler
    for (const engineName of engineNames) {
      const engine = this.registry.get(engineName);
      if (!engine) {
        throw new Error(`Engine ${engineName} not found in registry`);
      }

      // Hook: beforeEngine
      await this.hooks.beforeEngine?.(engine, input);

      const result = await engine.execute(input);

      // Hook: afterEngine
      await this.hooks.afterEngine?.(engine, input, result.events);

      // Publish events to EventBus (Runtime dispatch only)
      for (const event of result.events) {
        // Hook: beforePublish
        await this.hooks.beforePublish?.(event);

        this.eventBus.publish(event);

        // Hook: afterPublish
        await this.hooks.afterPublish?.(event);
      }
    }

    // Collect all events from EventBus
    const events = this.eventBus.getHistory(this.sessionId);

    // Apply reducers
    if (this.currentState && this.currentContext) {
      // Hook: beforeReducer
      await this.hooks.beforeReducer?.(events, this.currentState);

      let newState = this.currentState;
      for (const reducer of this.reducerRegistry.getAll()) {
        newState = reducer.reduce(events, newState);
      }

      // Hook: afterReducer
      await this.hooks.afterReducer?.(events, newState);

      // Build new snapshot
      const newContext = this.snapshotBuilder.build(
        newState,
        this.currentContext,
        {
          traceId: this.currentTraceId || undefined,
          correlationId: this.currentCorrelationId || undefined,
        }
      );

      this.currentState = newState;
      this.currentContext = newContext;
    }
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
}
