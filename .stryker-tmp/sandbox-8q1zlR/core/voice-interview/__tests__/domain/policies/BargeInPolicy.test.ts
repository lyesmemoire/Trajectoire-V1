// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { BargeInPolicy } from '../../../domain/policies/BargeInPolicy.js';

describe('BargeInPolicy', () => {
  const policy = new BargeInPolicy();

  it('should deny if AI is not speaking', () => {
    const result = policy.evaluate({
      isAiSpeaking: false,
      userAudioDurationMs: 600
    });
    expect(result.denied).toBe(true);
    expect(result.reason).toContain('AI is not speaking');
  });

  it('should deny if audio duration is below threshold (500ms)', () => {
    const result = policy.evaluate({
      isAiSpeaking: true,
      userAudioDurationMs: 499
    });
    expect(result.denied).toBe(true);
    expect(result.reason).toContain('below barge-in threshold');
  });

  it('should allow if AI is speaking and duration is >= threshold', () => {
    const result = policy.evaluate({
      isAiSpeaking: true,
      userAudioDurationMs: 500
    });
    expect(result.allowed).toBe(true);

    const result2 = policy.evaluate({
      isAiSpeaking: true,
      userAudioDurationMs: 1000
    });
    expect(result2.allowed).toBe(true);
  });
});
