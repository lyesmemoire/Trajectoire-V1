// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { AntiInfiniteLoopPolicy } from '../../../domain/policies/AntiInfiniteLoopPolicy.js';

describe('AntiInfiniteLoopPolicy', () => {
  const policy = new AntiInfiniteLoopPolicy();

  it('should allow if turn count is below max (20)', () => {
    expect(policy.evaluate(19).allowed).toBe(true);
    expect(policy.evaluate(0).allowed).toBe(true);
  });

  it('should deny if turn count is equal to max (20)', () => {
    const result = policy.evaluate(20);
    expect(result.denied).toBe(true);
    expect(result.reason).toContain('Maximum turns limit reached');
  });

  it('should deny if turn count is greater than max', () => {
    const result = policy.evaluate(25);
    expect(result.denied).toBe(true);
  });
});
