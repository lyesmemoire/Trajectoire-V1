import { InMemoryRuntimeEventStore } from "../interview/runtime/fsm/orchestrator/InMemoryRuntimeEventStore";
import type { InterviewRuntimeEvent } from "../interview/runtime/fsm/types/InterviewRuntimeEvent";

describe("RuntimeEventStore", () => {
  const createMockEvent = (sequence: number): InterviewRuntimeEvent => ({
    eventId: `test-event-${sequence}`,
    sessionId: "test-session",
    timestamp: 1600000000000 + sequence * 1000,
    sequence,
    source: "test",
    type: "VOICE_STARTED",
  });

  test("should append events immutably", () => {
    const store = new InMemoryRuntimeEventStore();
    const event1 = createMockEvent(1);
    
    const store2 = store.append(event1);
    
    expect(store.getAll()).toHaveLength(0);
    expect(store2.getAll()).toHaveLength(1);
    expect(store2.getAll()[0]).toEqual(event1);
  });

  test("should append batch of events immutably", () => {
    const store = new InMemoryRuntimeEventStore();
    const events = [createMockEvent(1), createMockEvent(2)];
    
    const store2 = store.appendBatch(events);
    
    expect(store.getAll()).toHaveLength(0);
    expect(store2.getAll()).toHaveLength(2);
    expect(store2.getLastSequence()).toBe(2);
  });

  test("should maintain order and deep freeze stored events", () => {
    const store = new InMemoryRuntimeEventStore();
    const event = createMockEvent(1);
    const store2 = store.append(event);
    
    const retrieved = store2.getAll()[0];
    
    expect(() => {
      // @ts-expect-error - testing immutability
      retrieved.timestamp = 999;
    }).toThrow(TypeError);
  });
});
