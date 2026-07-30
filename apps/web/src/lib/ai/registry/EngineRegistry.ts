import { Engine } from "../contracts/Engine";

export class EngineRegistry {
  private static instance: EngineRegistry;
  private engines: Map<string, Engine> = new Map();

  private constructor() {}

  public static getInstance(): EngineRegistry {
    if (!EngineRegistry.instance) {
      EngineRegistry.instance = new EngineRegistry();
    }
    return EngineRegistry.instance;
  }

  public register(engine: Engine): void {
    if (this.engines.has(engine.name)) {
      console.warn(`Engine ${engine.name} is already registered. Overwriting...`);
    }
    this.engines.set(engine.name, engine);
  }

  public get(name: string): Engine | undefined {
    return this.engines.get(name);
  }

  public getRequired(name: string): Engine {
    const engine = this.engines.get(name);
    if (!engine) {
      throw new Error(`Engine ${name} not found in registry.`);
    }
    return engine;
  }

  public getAll(): Engine[] {
    return Array.from(this.engines.values());
  }
}
