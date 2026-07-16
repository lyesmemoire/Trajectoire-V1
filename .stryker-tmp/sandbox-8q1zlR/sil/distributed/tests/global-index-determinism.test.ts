// @ts-nocheck
import { describe, it, expect } from "vitest";
import { GlobalEventIndex } from "../index/global-event-index";

describe("Phase 2-K: Global Index Determinism", () => {
  it("should generate a monotonic sequence per session", () => {
    const index = new GlobalEventIndex();
    
    const s1 = "session-1";
    const s2 = "session-2";

    expect(index.assign({ sessionId: s1 })).toBe(1);
    expect(index.assign({ sessionId: s2 })).toBe(1);
    expect(index.assign({ sessionId: s1 })).toBe(2);
    expect(index.assign({ sessionId: s1 })).toBe(3);
    expect(index.assign({ sessionId: s2 })).toBe(2);
  });

  it("should ensure final ordering is identical even if events are assigned sequentially", () => {
    const index = new GlobalEventIndex();
    
    const events = [
      { eventId: "e1", sessionId: "sess-A" },
      { eventId: "e2", sessionId: "sess-A" },
      { eventId: "e3", sessionId: "sess-A" },
    ];

    const indexed = events.map(e => ({ ...e, sequence: index.assign(e) }));
    
    // Reverse them, sort by sequence, they should be back in order
    const shuffled = [...indexed].reverse();
    const sorted = shuffled.sort((a, b) => a.sequence - b.sequence);

    expect(sorted[0].eventId).toBe("e1");
    expect(sorted[1].eventId).toBe("e2");
    expect(sorted[2].eventId).toBe("e3");
  });
});
