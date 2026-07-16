// @ts-nocheck
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { FormalReplayEngine } from "./formal-replay-engine";
import { INVARIANTS } from "../../contracts/invariants";
import { SILEvent } from "../../contracts/sil-events";

/**
 * SIL v1.0 — Formal verification layer
 */

describe("SIL Formal Verification", () => {
  it(INVARIANTS.DETERMINISM, () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            eventId: fc.string(),
            type: fc.string(),
            timestamp: fc.integer({ min: 1, max: 100000 }),
            tenantId: fc.string(),
            sessionId: fc.string(),
            payload: fc.jsonValue(),
            hash: fc.string(),
            previousEventHash: fc.string(),
            signature: fc.string()
          })
        ).map(events => 
          events.map((e, index) => ({ ...e, eventId: `evt-${index}` }))
        ),
        (events) => {
          const replay1 = FormalReplayEngine.run(events as SILEvent[]);
          const replay2 = FormalReplayEngine.run(events as SILEvent[]);

          expect(replay1.replayHash).toEqual(replay2.replayHash);
        }
      )
    );
  });

  it(INVARIANTS.REPLAY_EQUIVALENCE, () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            eventId: fc.string(),
            type: fc.string(),
            timestamp: fc.integer({ min: 1, max: 100000 }),
            tenantId: fc.string(),
            sessionId: fc.string(),
            payload: fc.jsonValue(),
            hash: fc.string(),
            previousEventHash: fc.string(),
            signature: fc.string()
          })
        ).map(events => 
          events.map((e, index) => ({ ...e, eventId: `evt-${index}` }))
        ),
        (events) => {
          // Shuffle the events randomly
          const shuffled = [...events].sort(() => Math.random() - 0.5);

          const a = FormalReplayEngine.run(events as SILEvent[]);
          const b = FormalReplayEngine.run(shuffled as SILEvent[]);

          // invariant must hold after normalization (sorting by timestamp inside ReplayEngine)
          expect(a.replayHash).toEqual(b.replayHash);
        }
      )
    );
  });

  it(INVARIANTS.TENANT_ISOLATION, () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            eventId: fc.string(),
            type: fc.string(),
            timestamp: fc.integer({ min: 1, max: 100000 }),
            tenantId: fc.string({ minLength: 1 }), // ensure non-empty tenants
            sessionId: fc.string(),
            payload: fc.jsonValue(),
            hash: fc.string(),
            previousEventHash: fc.string(),
            signature: fc.string()
          })
        ),
        (events) => {
          const result = FormalReplayEngine.run(events as SILEvent[]);

          const tenants = new Set(events.map(e => e.tenantId));

          expect(result.tenantCrossInfluence).toBe(false);
          // Only assert size > 0 if there were events generated
          if (events.length > 0) {
            expect(tenants.size).toBeGreaterThan(0);
          }
        }
      )
    );
  });
});
