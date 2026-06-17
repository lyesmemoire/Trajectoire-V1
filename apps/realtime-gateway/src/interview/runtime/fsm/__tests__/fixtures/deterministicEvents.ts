// src/interview/runtime/fsm/__tests__/fixtures/deterministicEvents.ts

import type { InterviewRuntimeEvent } from "../../types/InterviewRuntimeEvent";

/** Generates a deterministic list of events for replay tests. */
export function generateDeterministicEvents(count: number): InterviewRuntimeEvent[] {
  const events: InterviewRuntimeEvent[] = [];
  for (let i = 0; i < count; i++) {
    events.push({
      type: "QUESTION_EMITTED",
      sessionId: "session-123",
      eventId: `event-${i}`,
      timestamp: i, // deterministic timestamp, no Date.now
      sequence: i,
      source: "test",
      payload: { questionId: `q${i}` },
    } as any);
  }
  return events;
}
