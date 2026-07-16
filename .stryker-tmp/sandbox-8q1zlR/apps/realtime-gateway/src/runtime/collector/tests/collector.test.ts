// @ts-nocheck
import { describe, it, expect } from "vitest";
import { RuntimeTraceCollector } from "../runtime-trace-collector.js";

describe("P6.6 bis - RuntimeTraceCollector", () => {
  it("should securely construct a trace from raw events (C1-C4)", () => {
    const collector = new RuntimeTraceCollector();
    const sessionId = "session_123";
    
    collector.startSession(sessionId);

    // 1. User Message
    collector.appendEvent({
      type: "USER_MESSAGE",
      sessionId,
      message: "Hello",
      timestamp: 1000,
    });

    // 2. P5 Context Attached (from Facade)
    collector.attachP5Context(sessionId, {
      snapshotHash: "hash1",
      journalPointer: "1",
    });

    // 3. P6 Engine Event
    collector.appendEvent({
      type: "P6_EVENT",
      sessionId,
      event: "DECISION",
      payload: { trustDelta: 0.1 },
      timestamp: 1010,
    });

    // 4. Voice Output
    collector.appendEvent({
      type: "VOICE_OUTPUT",
      sessionId,
      utterance: "Hi there!",
      timestamp: 1050,
    });

    const trace = collector.getTrace(sessionId);
    
    expect(trace).toBeDefined();
    expect(trace?.turns.length).toBe(1);

    const turn = trace?.turns[0];
    
    // Check Inputs & Outputs
    expect(turn?.input.message).toBe("Hello");
    expect(turn?.output?.utterance).toBe("Hi there!");
    
    // Check Derived metrics
    expect(turn?.derived.turnDurationMs).toBe(50); // 1050 - 1000
    
    // Check Events
    expect(turn?.events.length).toBe(1);
    expect(turn?.events[0].type).toBe("DECISION");
    expect(turn?.events[0].payload).toEqual({ trustDelta: 0.1 });
    
    // Check Context
    expect(turn?.p5?.snapshotHash).toBe("hash1");
  });
});
