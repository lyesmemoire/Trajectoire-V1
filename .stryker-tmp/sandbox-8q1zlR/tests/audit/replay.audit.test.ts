// @ts-nocheck
import { describe, it, expect } from "vitest";
import { ExecutionFacade } from "../../core/p5/integration/execution-facade";
import { MindState } from "../../core/p5/execution-contract";
import { reduceMind } from "../../core/p5/reduceMind";

describe("P6.7 - A3 Replay Audit", () => {
  it("should perfectly recreate final state from initial snapshot + journal", () => {
    const facade = new ExecutionFacade();
    const initialState: MindState = { trust: 0.5, suspicion: 0.5, pressure: 50, emotion: "neutral" };
    facade.initSession("replay1", initialState, 1000);
    
    // Simulate some events
    facade.execute("replay1", { trustDelta: 0.2 }, 1010);
    facade.execute("replay1", { suspicionDelta: 0.3 }, 1020);
    
    const finalState = facade.getState("replay1");
    const session = facade.getSession("replay1");
    const journalEntries = session?.journal.entries || [];
    
    // Replay manually from journal and initial state
    let replayedState = { ...initialState };
    for (const entry of journalEntries) {
      replayedState = reduceMind(replayedState, entry.event);
    }
    
    expect(replayedState).toEqual(finalState);
  });
});
