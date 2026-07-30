import { EngineInput } from "../contracts/Engine";
import { EngineRegistry, DefaultEngineRegistry } from "./EngineRegistry";
import { EventBus, DefaultEventBus } from "./EventBus";
import { EngineScheduler, SequentialEngineScheduler } from "./EngineScheduler";
import { InvestigationContext } from "../../../domain/cognitive/InvestigationContext";

// ===================================================================
// COGNITIVE RUNTIME — Cognitive Runtime Contract
// ===================================================================

export interface CognitiveRuntime {
  initialize(sessionId: string, context: InvestigationContext): Promise<void>;
  execute(engineNames: string[], input: EngineInput): Promise<void>;
  getEventBus(): EventBus;
  getRegistry(): EngineRegistry;
}

export class DefaultCognitiveRuntime implements CognitiveRuntime {
  private readonly registry: EngineRegistry;
  private readonly eventBus: EventBus;
  private readonly scheduler: EngineScheduler;
  private sessionId: string | null = null;

  constructor() {
    this.registry = new DefaultEngineRegistry();
    this.eventBus = new DefaultEventBus();
    this.scheduler = new SequentialEngineScheduler(this.registry);
  }

  async initialize(sessionId: string, context: InvestigationContext): Promise<void> {
    this.sessionId = sessionId;
    // Runtime orchestration only - no business logic
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

      const result = await engine.execute(input);

      // Publish events to EventBus (Runtime orchestration only)
      for (const event of result.events) {
        this.eventBus.publish(event);
      }
    }
  }

  getEventBus(): EventBus {
    return this.eventBus;
  }

  getRegistry(): EngineRegistry {
    return this.registry;
  }
}
