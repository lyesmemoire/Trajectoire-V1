// @ts-nocheck
import { describe, it, expect } from "vitest";
import { RuntimeStateStore } from "../runtime-state-store.js";
import { createSession } from "../execution-session.js";
import { MindState } from "../../execution-contract.js";

describe("runtime-state-store — R2: Session isolation", () => {
  const getState = (trust = 0.5): MindState => ({
    trust,
    suspicion: 0.5,
    pressure: 50,
    emotion: "neutral",
  });

  it("should store and retrieve a session", () => {
    const store = new RuntimeStateStore();
    const session = createSession(getState(), 0);

    store.setSession("s1", session);
    expect(store.getSession("s1")).toBe(session);
  });

  it("should return undefined for unknown session", () => {
    const store = new RuntimeStateStore();
    expect(store.getSession("unknown")).toBeUndefined();
  });

  it("should isolate sessions from each other (R2)", () => {
    const store = new RuntimeStateStore();

    const s1 = createSession(getState(0.1), 0);
    const s2 = createSession(getState(0.9), 0);

    store.setSession("s1", s1);
    store.setSession("s2", s2);

    expect(store.getSession("s1")!.state.trust).toBe(0.1);
    expect(store.getSession("s2")!.state.trust).toBe(0.9);
    expect(store.size).toBe(2);
  });

  it("should delete a session", () => {
    const store = new RuntimeStateStore();
    store.setSession("s1", createSession(getState(), 0));

    expect(store.deleteSession("s1")).toBe(true);
    expect(store.getSession("s1")).toBeUndefined();
    expect(store.deleteSession("s1")).toBe(false);
  });

  it("should clear all sessions", () => {
    const store = new RuntimeStateStore();
    store.setSession("s1", createSession(getState(), 0));
    store.setSession("s2", createSession(getState(), 0));

    store.clear();
    expect(store.size).toBe(0);
  });
});
