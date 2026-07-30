import { Engine } from "../contracts/Engine";
import { EngineInput } from "../contracts/Engine";
import { BaseEvent } from "../contracts/Event";
import { CognitiveState } from "../../../domain/cognitive/CognitiveState";

// ===================================================================
// RUNTIME HOOKS — Runtime Hooks for Telemetry, Monitoring, Debug
// ===================================================================

export interface RuntimeHooks {
  beforeEngine?(engine: Engine, input: EngineInput): void | Promise<void>;
  afterEngine?(engine: Engine, input: EngineInput, events: BaseEvent[]): void | Promise<void>;
  beforePublish?(event: BaseEvent): void | Promise<void>;
  afterPublish?(event: BaseEvent): void | Promise<void>;
  beforeReducer?(events: BaseEvent[], previousState: CognitiveState): void | Promise<void>;
  afterReducer?(events: BaseEvent[], newState: CognitiveState): void | Promise<void>;
}

export class DefaultRuntimeHooks implements RuntimeHooks {
  // All hooks are empty by default - can be extended later for telemetry, monitoring, etc.
  async beforeEngine(engine: Engine, input: EngineInput): Promise<void> {
    // Hook for telemetry before engine execution
  }

  async afterEngine(engine: Engine, input: EngineInput, events: BaseEvent[]): Promise<void> {
    // Hook for telemetry after engine execution
  }

  async beforePublish(event: BaseEvent): Promise<void> {
    // Hook for telemetry before event publishing
  }

  async afterPublish(event: BaseEvent): Promise<void> {
    // Hook for telemetry after event publishing
  }

  async beforeReducer(events: BaseEvent[], previousState: CognitiveState): Promise<void> {
    // Hook for telemetry before reducer execution
  }

  async afterReducer(events: BaseEvent[], newState: CognitiveState): Promise<void> {
    // Hook for telemetry after reducer execution
  }
}
