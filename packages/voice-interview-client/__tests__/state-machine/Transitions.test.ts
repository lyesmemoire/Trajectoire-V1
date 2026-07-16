import { describe, it, expect } from "vitest";
import { TRANSITION_TABLE, lookupTransition } from "../../src/state-machine/Transitions.js";
import { ClientState, ClientEvent } from "../../src/state-machine/States.js";

describe("Transition Table", () => {
  it("should have no duplicate (from, event) pairs", () => {
    const keys = new Set<string>();
    for (const t of TRANSITION_TABLE) {
      const key = `${t.from}:${t.event}`;
      expect(keys.has(key)).toBe(false);
      keys.add(key);
    }
  });

  it("should have 31 transitions", () => {
    expect(TRANSITION_TABLE.length).toBe(31);
  });

  it("should return undefined for invalid transitions", () => {
    expect(lookupTransition(ClientState.Disconnected, ClientEvent.PAUSE)).toBeUndefined();
    expect(lookupTransition(ClientState.Completed, ClientEvent.PAUSE)).toBeUndefined();
    expect(lookupTransition(ClientState.Error, ClientEvent.START_INTERVIEW)).toBeUndefined();
  });

  it("should resolve known transitions in O(1)", () => {
    const result = lookupTransition(ClientState.Disconnected, ClientEvent.CONNECT);
    expect(result).toBeDefined();
    expect(result!.to).toBe(ClientState.Authenticating);
  });

  it("should ensure all terminal states only accept RESET", () => {
    const terminalTransitions = TRANSITION_TABLE.filter(
      (t) => t.from === ClientState.Completed || t.from === ClientState.Error
    );
    for (const t of terminalTransitions) {
      expect(t.event).toBe(ClientEvent.RESET);
      expect(t.to).toBe(ClientState.Disconnected);
    }
  });

  it("should ensure all 'to' values are valid ClientStates", () => {
    const validStates = new Set(Object.values(ClientState));
    for (const t of TRANSITION_TABLE) {
      expect(validStates.has(t.to)).toBe(true);
      expect(validStates.has(t.from)).toBe(true);
    }
  });
});
