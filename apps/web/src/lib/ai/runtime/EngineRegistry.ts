import { Engine } from "../contracts/Engine";

// ===================================================================
// ENGINE REGISTRY — Engine Registry Contract
// ===================================================================

export interface EngineRegistry {
  register(engine: Engine): void;
  get(name: string): Engine | undefined;
  getAll(): Engine[];
  has(name: string): boolean;
  clear(): void;
}

export class DefaultEngineRegistry implements EngineRegistry {
  private engines: Map<string, Engine> = new Map();

  register(engine: Engine): void {
    if (this.engines.has(engine.name)) {
      throw new Error(`Engine ${engine.name} is already registered`);
    }
    this.engines.set(engine.name, engine);
  }

  get(name: string): Engine | undefined {
    return this.engines.get(name);
  }

  getAll(): Engine[] {
    return Array.from(this.engines.values());
  }

  has(name: string): boolean {
    return this.engines.has(name);
  }

  clear(): void {
    this.engines.clear();
  }
}
