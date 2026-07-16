import { describe, it, expect } from 'vitest';
import { PhaseTransitionPolicy } from '../../../domain/policies/PhaseTransitionPolicy.js';

describe('PhaseTransitionPolicy', () => {
  const policy = new PhaseTransitionPolicy();

  describe('opening -> exploration', () => {
    it('should allow transition if there are no scores', () => {
      const result = policy.evaluate({
        currentPhase: 'opening',
        targetPhase: 'exploration',
        scoresInCurrentPhase: [],
        topicsCovered: 1
      });
      expect(result.allowed).toBe(true);
    });

    it('should allow transition if at least one score is > 50', () => {
      const result = policy.evaluate({
        currentPhase: 'opening',
        targetPhase: 'exploration',
        scoresInCurrentPhase: [40, 55],
        topicsCovered: 1
      });
      expect(result.allowed).toBe(true);
    });

    it('should deny transition if all scores are <= 50', () => {
      const result = policy.evaluate({
        currentPhase: 'opening',
        targetPhase: 'exploration',
        scoresInCurrentPhase: [40, 50],
        topicsCovered: 1
      });
      expect(result.denied).toBe(true);
      expect(result.reason).toContain('score > 50');
    });
  });

  describe('exploration -> pressure', () => {
    it('should allow transition if 3 scores are > 60 and topics >= 2', () => {
      const result = policy.evaluate({
        currentPhase: 'exploration',
        targetPhase: 'pressure',
        scoresInCurrentPhase: [65, 70, 40, 80],
        topicsCovered: 2
      });
      expect(result.allowed).toBe(true);
    });

    it('should deny transition if less than 3 scores are > 60', () => {
      const result = policy.evaluate({
        currentPhase: 'exploration',
        targetPhase: 'pressure',
        scoresInCurrentPhase: [65, 70, 40, 60], // only 2 > 60
        topicsCovered: 2
      });
      expect(result.denied).toBe(true);
      expect(result.reason).toContain('3 strong scores');
    });

    it('should deny transition if less than 2 topics are covered', () => {
      const result = policy.evaluate({
        currentPhase: 'exploration',
        targetPhase: 'pressure',
        scoresInCurrentPhase: [65, 70, 40, 80],
        topicsCovered: 1 // only 1 topic
      });
      expect(result.denied).toBe(true);
      expect(result.reason).toContain('2 topics covered');
    });
  });

  it('should allow other phase transitions by default', () => {
    const result = policy.evaluate({
      currentPhase: 'pressure',
      targetPhase: 'closing',
      scoresInCurrentPhase: [40],
      topicsCovered: 3
    });
    expect(result.allowed).toBe(true);
  });
});
