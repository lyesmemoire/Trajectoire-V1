import { ObservabilityBus, ObservabilityEvent } from "../../contracts/observability";

export class InMemoryObservabilityBus implements ObservabilityBus {
  readonly events: ObservabilityEvent[] = [];

  async emit(event: ObservabilityEvent): Promise<void> {
    this.events.push(event);
  }
}
