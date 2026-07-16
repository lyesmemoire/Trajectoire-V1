import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { TurnTiming } from '../../../domain/types.js';

describe('TurnTiming Value Object (Property-Based)', () => {
  it('should create valid TurnTiming for positive milliseconds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 300000 }), // reasonable max 5 mins
        fc.integer({ min: 0, max: 600000 }), // reasonable max 10 mins
        (latency, duration) => {
          const timing = TurnTiming.create(latency, duration);
          expect(timing.latencyMs).toBe(latency);
          expect(timing.durationMs).toBe(duration);
        }
      )
    );
  });

  it('should throw for negative latency', () => {
    fc.assert(
      fc.property(
        fc.integer({ max: -1 }),
        fc.integer({ min: 0 }),
        (latency, duration) => {
          expect(() => TurnTiming.create(latency, duration)).toThrow('Invalid TurnTiming: latencyMs must be positive');
        }
      )
    );
  });

  it('should throw for negative duration', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0 }),
        fc.integer({ max: -1 }),
        (latency, duration) => {
          expect(() => TurnTiming.create(latency, duration)).toThrow('Invalid TurnTiming: durationMs must be positive');
        }
      )
    );
  });
});
