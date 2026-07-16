import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { ScoreSignal } from '../../../domain/types.js';

describe('ScoreSignal Value Object (Property-Based)', () => {
  it('should always be valid for integers between 0 and 100', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 100 }), (score) => {
        const signal = ScoreSignal.create(score);
        expect(signal.value).toBe(score);
      })
    );
  });

  it('should throw error for integers less than 0', () => {
    fc.assert(
      fc.property(fc.integer({ max: -1 }), (score) => {
        expect(() => ScoreSignal.create(score)).toThrow('Invalid ScoreSignal');
      })
    );
  });

  it('should throw error for integers greater than 100', () => {
    fc.assert(
      fc.property(fc.integer({ min: 101 }), (score) => {
        expect(() => ScoreSignal.create(score)).toThrow('Invalid ScoreSignal');
      })
    );
  });

});
