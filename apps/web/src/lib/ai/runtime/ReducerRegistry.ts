import { BaseEvent } from "../contracts/Event";
import { CognitiveState } from "../../../domain/cognitive/CognitiveState";

// ===================================================================
// REDUCER REGISTRY — Reducer Registry Contract
// ===================================================================

export interface Reducer {
  name: string;
  version: string;
  reduce(events: BaseEvent[], previousState: CognitiveState): CognitiveState;
}

export interface ReducerRegistry {
  register(reducer: Reducer): void;
  get(name: string): Reducer | undefined;
  getAll(): Reducer[];
  has(name: string): boolean;
  clear(): void;
}

export class DefaultReducerRegistry implements ReducerRegistry {
  private reducers: Map<string, Reducer> = new Map();

  register(reducer: Reducer): void {
    if (this.reducers.has(reducer.name)) {
      throw new Error(`Reducer ${reducer.name} is already registered`);
    }
    this.reducers.set(reducer.name, reducer);
  }

  get(name: string): Reducer | undefined {
    return this.reducers.get(name);
  }

  getAll(): Reducer[] {
    return Array.from(this.reducers.values());
  }

  has(name: string): boolean {
    return this.reducers.has(name);
  }

  clear(): void {
    this.reducers.clear();
  }
}
