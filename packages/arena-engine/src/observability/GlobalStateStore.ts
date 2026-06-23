// src/observability/GlobalStateStore.ts
import { EventStreamBus } from "../distributed/stream/EventStreamBus";
import { IClock } from "../ports/IInfra";

export type GlobalStateSnapshot = {
  epoch: number;
  activeNodes: number;
  deadNodes: number;
  queuedTasks: number;
  lastEvents: any[];
  timestamp: number;
};

export class GlobalStateStore {
  private state: GlobalStateSnapshot;

  constructor(private readonly clock: IClock, private eventBus: EventStreamBus) {
    this.state = {
      epoch: 0,
      activeNodes: 0,
      deadNodes: 0,
      queuedTasks: 0,
      lastEvents: [],
      timestamp: this.clock.now(),
    };
    this.attachEventListeners();
  }

  update(partial: Partial<GlobalStateSnapshot>) {
    this.state = {
      ...this.state,
      ...partial,
      timestamp: this.clock.now(),
    };
  }

  snapshot(): GlobalStateSnapshot {
    return this.state;
  }

  serialize(): any {
    // Return a deep copy to prevent mutation
    return JSON.parse(JSON.stringify(this.state));
  }

  restore(data: any): void {
    this.state = JSON.parse(JSON.stringify(data));
  }

  rehydrate(): void {
    // Nothing to reschedule for GlobalStateStore
  }

  private attachEventListeners() {
    this.eventBus.subscribe((event) => {
      const trimmed = this.state.lastEvents.slice(-49);
      this.state.lastEvents = [...trimmed, event];
    });
  }
}
