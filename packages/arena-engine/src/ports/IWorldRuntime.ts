// src/ports/IWorldRuntime.ts
import { EventStreamBus } from "../distributed/stream/EventStreamBus";
import { GlobalStateStore } from "../observability/GlobalStateStore";

export interface IWorldRuntime {
  eventBus: EventStreamBus;
  stateStore: GlobalStateStore;
}
