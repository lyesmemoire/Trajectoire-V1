import { Engine, EngineInput } from "../contracts/Engine";
import { EngineRegistry } from "./EngineRegistry";

// ===================================================================
// ENGINE SCHEDULER — Engine Scheduler Contract
// ===================================================================

export interface EngineScheduler {
  schedule(engineName: string, input: EngineInput): Promise<void>;
  scheduleAll(engineNames: string[], input: EngineInput): Promise<void>;
}

export class SequentialEngineScheduler implements EngineScheduler {
  constructor(private readonly registry: EngineRegistry) {}

  async schedule(engineName: string, input: EngineInput): Promise<void> {
    const engine = this.registry.get(engineName);
    if (!engine) {
      throw new Error(`Engine ${engineName} not found in registry`);
    }
    await engine.execute(input);
  }

  async scheduleAll(engineNames: string[], input: EngineInput): Promise<void> {
    for (const engineName of engineNames) {
      await this.schedule(engineName, input);
    }
  }
}
