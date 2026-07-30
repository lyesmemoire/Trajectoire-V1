import { Engine, EngineInput } from "../contracts/Engine";
import { EngineResult } from "../contracts/EngineResult";
import { BaseEvent } from "../contracts/Event";
import { createEventEnvelope } from "../contracts/EventEnvelope";
import { z } from "zod";

// ===================================================================
// BASE ENGINE — Abstract Base Class for All Engines
// ===================================================================

export interface BaseEngineConfig {
  name: string;
  version: string;
  schemaVersion: string;
}

export abstract class BaseEngine<TContext, TPayload, TEvent extends BaseEvent> implements Engine<EngineInput<TContext, TPayload>, TEvent> {
  readonly name: string;
  readonly version: string;
  readonly schemaVersion: string;

  constructor(config: BaseEngineConfig) {
    this.name = config.name;
    this.version = config.version;
    this.schemaVersion = config.schemaVersion;
  }

  // Main entry point - handles all boilerplate
  async execute(input: EngineInput<TContext, TPayload>): Promise<EngineResult<TEvent>> {
    const startTime = Date.now();

    try {
      // Validate input
      await this.validateInput(input);

      // Process (to be implemented by subclasses)
      const events = await this.process(input.context, input.payload, input.sessionId);

      // Validate events
      await this.validateEvents(events);

      const durationMs = Date.now() - startTime;

      return {
        engine: this.name,
        version: this.version,
        durationMs,
        tokens: { prompt: 0, completion: 0, total: 0 },
        confidence: 1.0,
        events,
        warnings: [],
        metrics: {},
        debug: {},
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      
      return {
        engine: this.name,
        version: this.version,
        durationMs,
        tokens: { prompt: 0, completion: 0, total: 0 },
        confidence: 0.0,
        events: [],
        warnings: [],
        metrics: {},
        debug: {},
      };
    }
  }

  // Abstract method to be implemented by subclasses
  protected abstract process(
    context: TContext,
    payload: TPayload,
    sessionId: string
  ): Promise<TEvent[]>;

  // Input validation (can be overridden)
  protected async validateInput(input: EngineInput<TContext, TPayload>): Promise<void> {
    // Default: no validation
  }

  // Event validation (can be overridden)
  protected async validateEvents(events: TEvent[]): Promise<void> {
    // Default: no validation
  }

  // Helper to create event envelope
  protected createEnvelope(traceId?: string, correlationId?: string, causationId?: string | null) {
    return createEventEnvelope(this.name, this.version, traceId, correlationId, causationId);
  }

  // Helper to create base event
  protected createBaseEvent<TPayload>(
    sessionId: string,
    eventType: string,
    payload: TPayload
  ): BaseEvent<TPayload> {
    return {
      id: crypto.randomUUID(),
      sessionId,
      sequence: 0,
      engine: this.name,
      eventType: eventType as any,
      engineVersion: this.version,
      payload,
      createdAt: new Date(),
    };
  }
}
