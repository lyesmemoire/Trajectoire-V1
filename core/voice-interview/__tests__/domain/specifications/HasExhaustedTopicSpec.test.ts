import { describe, it, expect } from 'vitest';
import { QuestionExecution } from '../../../domain/entities/QuestionExecution.js';
import { HasExhaustedTopicSpec } from '../../../domain/specifications/HasExhaustedTopicSpec.js';

describe('HasExhaustedTopicSpec', () => {
  const spec = new HasExhaustedTopicSpec();

  const createExecution = (overrides: Partial<any> = {}) => {
    return QuestionExecution.reconstitute({
      questionId: 'q1' as any,
      topic: 't1' as any,
      attempts: 1,
      stressLevel: null,
      success: false,
      abandoned: false,
      isMunition: false,
      ...overrides
    });
  };

  it('should return true if execution was successful', () => {
    expect(spec.isSatisfiedBy(createExecution({ success: true }), false)).toBe(true);
  });

  it('should return true if execution was abandoned', () => {
    expect(spec.isSatisfiedBy(createExecution({ abandoned: true }), false)).toBe(true);
  });

  it('should return true if max retries are reached', () => {
    expect(spec.isSatisfiedBy(createExecution(), true)).toBe(true);
  });

  it('should return false otherwise', () => {
    expect(spec.isSatisfiedBy(createExecution(), false)).toBe(false);
  });
});
