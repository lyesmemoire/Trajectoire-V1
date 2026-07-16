import { describe, it, expect } from 'vitest';
import { IsInterviewReadyToCompleteSpec } from '../../../domain/specifications/IsInterviewReadyToCompleteSpec.js';

describe('IsInterviewReadyToCompleteSpec', () => {
  const spec = new IsInterviewReadyToCompleteSpec();

  it('should return true if forced by anti-loop', () => {
    expect(spec.isSatisfiedBy({
      currentPhase: 'exploration',
      totalTurns: 5,
      targetPhasesCompleted: false,
      isForcedByAntiLoop: true
    })).toBe(true);
  });

  it('should return true if in wrap-up and target phases completed', () => {
    expect(spec.isSatisfiedBy({
      currentPhase: 'wrap-up',
      totalTurns: 5,
      targetPhasesCompleted: true,
      isForcedByAntiLoop: false
    })).toBe(true);
  });

  it('should return false if in wrap-up but target phases NOT completed', () => {
    expect(spec.isSatisfiedBy({
      currentPhase: 'wrap-up',
      totalTurns: 5,
      targetPhasesCompleted: false,
      isForcedByAntiLoop: false
    })).toBe(false);
  });

  it('should return true if >= 15 turns and target phases completed (minimal condition)', () => {
    expect(spec.isSatisfiedBy({
      currentPhase: 'pressure',
      totalTurns: 15,
      targetPhasesCompleted: true,
      isForcedByAntiLoop: false
    })).toBe(true);
  });

  it('should return false otherwise', () => {
    expect(spec.isSatisfiedBy({
      currentPhase: 'pressure',
      totalTurns: 10,
      targetPhasesCompleted: true,
      isForcedByAntiLoop: false
    })).toBe(false);
  });
});
