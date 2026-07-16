// @ts-nocheck
// src/observability/GlobalStateStore.ts
import { EventStreamBus } from "../distributed/stream/EventStreamBus";

export type GlobalStateSnapshot = {
  epoch: number;
  activeNodes: number;
  deadNodes: number;
  queuedTasks: number;
  lastEvents: any[];
  timestamp: number;
};

export class GlobalStateStore {
  private static state: GlobalStateSnapshot = {
    epoch: 0,
    activeNodes: 0,
    deadNodes: 0,
    queuedTasks: 0,
    lastEvents: [],
    timestamp: Date.now(),
  };

  static update(partial: Partial<GlobalStateSnapshot>) {
    this.state = {
      ...this.state,
      ...partial,
      timestamp: Date.now(),
    };
  }

  static snapshot(): GlobalStateSnapshot {
    return this.state;
  }

  static attachEventListeners() {
    EventStreamBus.subscribe((event) => {
      const trimmed = this.state.lastEvents.slice(-49);
      this.state.lastEvents = [...trimmed, event];
    });
  }
}
