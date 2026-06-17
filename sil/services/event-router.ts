import { SILEvent } from "../contracts/sil-events";
import { KafkaBridge } from "./kafka-bridge";

export class EventRouter {
  constructor(private kafkaBridge?: KafkaBridge) {}

  setKafkaBridge(bridge: KafkaBridge) {
    this.kafkaBridge = bridge;
  }

  emit(event: SILEvent) {
    if (this.kafkaBridge) {
      // Simulate that the emitted internal event is published to Kafka
      // and then immediately consumed by our ingestion layer.
      this.kafkaBridge.simulateConsume(event).catch(console.error);
    }
  }
}
