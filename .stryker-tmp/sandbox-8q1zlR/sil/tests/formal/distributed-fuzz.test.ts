// @ts-nocheck
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { FormalReplayEngine } from "./formal-replay-engine";
import { SILEvent } from "../../contracts/sil-events";

describe("Distributed Formal Fuzzing", () => {
  it("invariance under distributed permutation", () => {
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
          }),
          { minLength: 50, maxLength: 500 }
        ).map(events => 
          events.map((e, index) => ({ ...e, eventId: `evt-${index}` }))
        ),
        (events) => {
          // Generate 10 random permutations to simulate packets arriving in chaotic order
          // from different distributed shards
          const permutations = Array.from({ length: 10 }, () =>
            [...events].sort(() => Math.random() - 0.5)
          );

          const results = permutations.map((p) =>
            FormalReplayEngine.run(p as SILEvent[]).replayHash
          );

          // all permutations must converge to the exact same hash
          expect(new Set(results).size).toBe(1);
        }
      )
    );
  });
});
