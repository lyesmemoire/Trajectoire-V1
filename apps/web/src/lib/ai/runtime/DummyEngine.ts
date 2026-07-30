import { Engine, EngineInput } from "../contracts/Engine";
import { EngineResult } from "../contracts/EngineResult";
import { BaseEvent } from "../contracts/Event";
import { createEventEnvelope } from "../contracts/EventEnvelope";

// ===================================================================
// DUMMY ENGINE — Test Engine for Phase A.1
// ===================================================================

export interface DummyContext {
  testValue: string;
  traceId?: string;
  correlationId?: string;
}

export interface DummyPayload {
  message: string;
}

export type DummyInput = EngineInput<DummyContext, DummyPayload>;

export interface DummyEvent extends BaseEvent<{ message: string }> {
  eventType: "DUMMY_EVENT";
  envelope: {
    eventId: string;
    traceId: string;
    correlationId: string;
    causationId: string | null;
    occurredAt: Date;
    engineId: string;
    engineVersion: string;
    schemaVersion: string;
  };
}

export class DummyEngine implements Engine<DummyInput, DummyEvent> {
  readonly name = "DummyEngine";
  readonly version = "1.0.0";

  async execute(input: DummyInput): Promise<EngineResult<DummyEvent>> {
    const startTime = Date.now();

    const envelope = createEventEnvelope(
      this.name,
      this.version,
      input.context.traceId,
      input.context.correlationId
    );

    const event: DummyEvent = {
      id: crypto.randomUUID(),
      sessionId: input.sessionId,
      sequence: 0,
      engine: this.name,
      eventType: "DUMMY_EVENT",
      engineVersion: this.version,
      payload: {
        message: input.payload.message,
      },
      createdAt: new Date(),
      envelope,
    };

    const durationMs = Date.now() - startTime;

    return {
      engine: this.name,
      version: this.version,
      durationMs,
      tokens: {
        prompt: 0,
        completion: 0,
        total: 0,
      },
      confidence: 1.0,
      events: [event],
      warnings: [],
      metrics: {},
      debug: {},
    };
  }
}
