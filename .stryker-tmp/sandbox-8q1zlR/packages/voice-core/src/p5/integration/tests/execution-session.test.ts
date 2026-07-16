// @ts-nocheck
import { describe, it, expect } from "vitest";
import { createSession, executeDecision } from "../execution-session.js";
import { replay } from "../../journal/replay.js";
import { replayTimeline } from "../../timeline/timeline-replay.js";
import { MindState } from "../../execution-contract.js";

describe("execution-session — R1, R3, R4, R5", () => {
  const getState = (): MindState => ({
    trust: 0.5,
    suspicion: 0.5,
    pressure: 50,
    emotion: "neutral",
  });

  it("should execute a decision and update state, journal, and timeline (R1)", () => {
    const session = createSession(getState(), 0);
    const { session: next, result } = executeDecision(
      session,
      { trustDelta: 0.2, pressureDelta: 10 },
      1,
    );

    expect(result).not.toBeNull();
    expect(result!.next.trust).toBeCloseTo(0.7, 5);
    expect(result!.next.pressure).toBe(60);

    // R1: journal and timeline grow by the same count
    expect(next.journal.entries.length).toBe(next.timeline.entries.length);
    expect(result!.journalSize).toBe(result!.timelineTick);
  });

  it("should return null result for an invalid decision (R4)", () => {
    const session = createSession(getState(), 0);
    const { session: next, result } = executeDecision(
      session,
      { trustDelta: NaN },
      1,
    );

    expect(result).toBeNull();
    // Session unchanged
    expect(next.state).toEqual(session.state);
    expect(next.journal.entries).toHaveLength(0);
    expect(next.timeline.entries).toHaveLength(0);
  });

  it("should be deterministic (R3)", () => {
    const state = getState();
    const decision = { trustDelta: 0.1, emotion: "happy" };

    const { result: a } = executeDecision(createSession(state, 0), decision, 1);
    const { result: b } = executeDecision(createSession(state, 0), decision, 1);

    expect(a).toEqual(b);
  });

  it("should execute multiple decisions sequentially", () => {
    let session = createSession(getState(), 0);

    const decisions = [
      { trustDelta: 0.1 },
      { pressureDelta: -10 },
      { suspicionDelta: 0.2 },
      { emotion: "focused" },
    ];

    for (const decision of decisions) {
      const { session: next } = executeDecision(session, decision, 0);
      session = next;
    }

    expect(session.state.trust).toBeCloseTo(0.6, 5);
    expect(session.state.pressure).toBe(40);
    expect(session.state.suspicion).toBeCloseTo(0.7, 5);
    expect(session.state.emotion).toBe("focused");
    expect(session.journal.entries.length).toBe(session.timeline.entries.length);
  });

  it("should support full replay from initial snapshot + journal (R5)", () => {
    let session = createSession(getState(), 0);

    const decisions = [
      { trustDelta: 0.15 },
      { pressureDelta: 20 },
      { emotion: "engaged" },
    ];

    for (const decision of decisions) {
      const { session: next } = executeDecision(session, decision, 0);
      session = next;
    }

    // Replay from initial snapshot + journal
    const replayed = replay(session.initialSnapshot, session.journal);
    expect(replayed).toEqual(session.state);

    // Replay from initial snapshot + timeline
    const timelineReplayed = replayTimeline(session.initialSnapshot, session.timeline);
    expect(timelineReplayed).toEqual(session.state);
  });
});
