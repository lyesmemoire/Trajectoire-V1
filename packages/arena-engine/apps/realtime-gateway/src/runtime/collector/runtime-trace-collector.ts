import { RuntimeWireEvent } from "./runtime-wire-event.js";
import { RuntimeTrace } from "../../../../../core/p6/trace-contract.js";

export class RuntimeTraceCollector {
  private traces = new Map<string, RuntimeTrace>();

  startSession(sessionId: string) {
    this.traces.set(sessionId, {
      sessionId,
      turns: [],
    });
  }

  appendEvent(event: RuntimeWireEvent) {
    const trace = this.traces.get(event.sessionId);
    if (!trace) return;

    this.route(event, trace);
  }

  attachP5Context(sessionId: string, context: { snapshotHash: string; journalPointer: string }) {
    const trace = this.traces.get(sessionId);
    if (!trace) return;
    const current = trace.turns.at(-1);
    if (!current) return;
    
    current.p5 = context;
  }

  private route(event: RuntimeWireEvent, trace: RuntimeTrace) {
    switch (event.type) {
      case "USER_MESSAGE":
        this.startTurn(trace, event);
        break;

      case "VOICE_OUTPUT":
        this.completeTurn(trace, event);
        break;

      case "P6_EVENT":
        this.attachEvent(trace, event);
        break;
    }
  }

  private startTurn(trace: RuntimeTrace, event: { message: string; timestamp: number }) {
    trace.turns.push({
      index: trace.turns.length,
      input: {
        message: event.message,
        timestamp: event.timestamp,
      },
      output: null,
      p5: null,
      events: [],
      derived: {
        latencyMs: 0,
        turnDurationMs: 0,
      },
    });
  }

  private attachEvent(trace: RuntimeTrace, event: { event: string; timestamp: number; payload: unknown }) {
    const current = trace.turns.at(-1);
    if (!current) return;

    current.events.push({
      type: event.event,
      timestamp: event.timestamp,
      payload: event.payload,
    });
  }

  private completeTurn(trace: RuntimeTrace, event: { utterance: string; timestamp: number }) {
    const current = trace.turns.at(-1);
    if (!current) return;

    current.output = {
      utterance: event.utterance,
      timestamp: event.timestamp,
    };

    current.derived.turnDurationMs = event.timestamp - current.input.timestamp;
  }
  
  getTrace(sessionId: string): RuntimeTrace | undefined {
    return this.traces.get(sessionId);
  }
}
