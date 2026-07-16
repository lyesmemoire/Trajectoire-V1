import { describe, it, expect } from 'vitest';
import { ScoreSignal } from '../../../domain/types.js';
import { IsCandidateDeflectingSpec } from '../../../domain/specifications/IsCandidateDeflectingSpec.js';

describe('IsCandidateDeflectingSpec', () => {
  const spec = new IsCandidateDeflectingSpec();

  it('should return true if semantic deflection is detected', () => {
    expect(spec.isSatisfiedBy({
      lastScores: [],
      semanticDeflectionDetected: true
    })).toBe(true);
  });

  it('should return true if the last 2 scores are both strictly below 40', () => {
    expect(spec.isSatisfiedBy({
      lastScores: [ScoreSignal.create(39), ScoreSignal.create(10)],
      semanticDeflectionDetected: false
    })).toBe(true);
  });

  it('should return false if only one recent score is below 40', () => {
    expect(spec.isSatisfiedBy({
      lastScores: [ScoreSignal.create(50), ScoreSignal.create(30)],
      semanticDeflectionDetected: false
    })).toBe(false);

    expect(spec.isSatisfiedBy({
      lastScores: [ScoreSignal.create(20), ScoreSignal.create(60)],
      semanticDeflectionDetected: false
    })).toBe(false);
  });

  it('should return false if scores are >= 40', () => {
    expect(spec.isSatisfiedBy({
      lastScores: [ScoreSignal.create(40), ScoreSignal.create(40)],
      semanticDeflectionDetected: false
    })).toBe(false);
  });
});
