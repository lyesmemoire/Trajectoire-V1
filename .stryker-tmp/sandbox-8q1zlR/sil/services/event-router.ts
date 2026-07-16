// @ts-nocheck
import { SILEvent } from "../contracts/sil-events";
import { KafkaBridge } from "./kafka-bridge";
import { StructuredLogger } from "../contracts/structured-logger";
import * as crypto from "crypto";

export class EventRouter {
  constructor(private kafkaBridge?: KafkaBridge, private logger?: StructuredLogger) {}

  setKafkaBridge(bridge: KafkaBridge) {
    this.kafkaBridge = bridge;
  }

  emit(event: SILEvent) {
    if (this.kafkaBridge) {
      // Simulate that the emitted internal event is published to Kafka
      // and then immediately consumed by our ingestion layer.
      this.kafkaBridge.simulateConsume(event).catch((err) => {
        this.logger?.error({
          traceId: crypto.randomUUID(),
          tenantId: event.tenantId,
          sessionId: event.sessionId,
          stage: "kafka_bridge_consume",
          error: err,
          message: "[SILClient] Failed to publish event"
        });
      });
    }
  }
}
