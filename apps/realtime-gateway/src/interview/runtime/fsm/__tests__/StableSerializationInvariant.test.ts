// src/interview/runtime/fsm/__tests__/StableSerializationInvariant.test.ts

import { stableSerialize } from "../orchestrator/InMemoryRuntimeEventStore";
import { ReplaySnapshot } from "../orchestrator/ReplaySnapshot";
import type { InterviewRuntimeEvent } from "../types/InterviewRuntimeEvent";
import type { OrchestrationTraceEntry } from "../orchestrator/InMemoryRuntimeEventStore";
import { SERIALIZATION_SCHEMA_VERSION } from "../constants/serializationSchemaVersion";

/** Simple shuffle utility */
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Build an object with the same entries but shuffled key insertion order */
function shuffledObject<T extends Record<string, any>>(obj: T): T {
  const entries = Object.entries(obj) as [keyof T, any][];
  const shuffled = shuffleArray(entries);
  const result: any = {};
  for (const [k, v] of shuffled) {
    // Preserve deep structure – if value is an object, clone it recursively
    result[k] = typeof v === "object" && v !== null ? JSON.parse(JSON.stringify(v)) : v;
  }
  return result as T;
}

/** Deep clone using JSON round‑trip (deterministic for plain data) */
function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Generate a minimal but valid ReplaySnapshot */
function makeSnapshot(seq: number): ReplaySnapshot {
  return {
    replayHash: `hash${seq}` as any,
    previousHash: `prev${seq}` as any,
    eventHash: `event${seq}` as any,
    transitionId: `tid${seq}` as any,
    sequence: seq,
    currentState: "stateA",
    snapshotTimestamp: 1670000000 + seq,
    schemaVersion: SERIALIZATION_SCHEMA_VERSION,
  };
}

/** Minimal OrchestrationTraceEntry */
function makeTrace(seq: number): OrchestrationTraceEntry {
  return {
    action: "append",
    sequence: seq,
    deterministicTimestamp: 1670000000 + seq,
    sessionReplayHash: `hash${seq}`,
    target: "FSMEngine.transition",
    schemaVersion: SERIALIZATION_SCHEMA_VERSION,
  };
}

/** Minimal InterviewRuntimeEvent (VoiceStarted) */
function makeEvent(seq: number): InterviewRuntimeEvent {
  return {
    eventId: `eid${seq}`,
    sessionId: `sid${seq}`,
    timestamp: 1670000000 + seq,
    sequence: seq,
    source: "voice",
    type: "VOICE_STARTED",
  };
}

/** Run a batch of invariants for a given value */
function expectStableInvariant<T>(original: T) {
  const shuffled = shuffledObject(original);
  const cloned = cloneDeep(original);

  expect(stableSerialize(original).json).toBe(stableSerialize(shuffled).json);
  expect(stableSerialize(original).json).toBe(stableSerialize(cloned).json);
}

describe("StableSerializationInvariant", () => {
  const ITERATIONS = 10000;

  test("ReplaySnapshot serialization is order‑independent", () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const snapshot = makeSnapshot(i);
      expectStableInvariant(snapshot);
    }
  });

  test("InterviewRuntimeEvent serialization is order‑independent", () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const event = makeEvent(i);
      expectStableInvariant(event);
    }
  });

  test("OrchestrationTraceEntry serialization is order‑independent", () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const trace = makeTrace(i);
      expectStableInvariant(trace);
    }
  });

  test("Deep nested undefined stripping", () => {
    const objWithUndefined = { a: { b: undefined as any } } as const;
    const objClean = { a: {} } as const;
    expect(stableSerialize(objWithUndefined).json).toBe(stableSerialize(objClean).json);
  });

  test("Nested structures retain deterministic serialization", () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const complex = {
        a: [
          { z: i, a: i + 1 },
          { b: i + 2, c: [i, i + 3] },
        ],
        b: {
          y: i,
          x: { inner: i + 4 },
        },
        c: "static",
      } as const;
      expectStableInvariant(complex);
    }
  });
});
