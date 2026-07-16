// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { QuestionExecution } from '../../../domain/entities/QuestionExecution.js';
import { IsUnderPressureSpec } from '../../../domain/specifications/IsUnderPressureSpec.js';

describe('IsUnderPressureSpec', () => {
  const spec = new IsUnderPressureSpec();

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

  it('should return false if not in pressure phase', () => {
    expect(spec.isSatisfiedBy('exploration', createExecution({ isMunition: true }))).toBe(false);
  });

  it('should return false if no current execution', () => {
    expect(spec.isSatisfiedBy('pressure', null)).toBe(false);
  });

  it('should return false if execution is not a munition', () => {
    expect(spec.isSatisfiedBy('pressure', createExecution({ isMunition: false }))).toBe(false);
  });

  it('should return false if execution is abandoned or successful', () => {
    expect(spec.isSatisfiedBy('pressure', createExecution({ isMunition: true, success: true }))).toBe(false);
    expect(spec.isSatisfiedBy('pressure', createExecution({ isMunition: true, abandoned: true }))).toBe(false);
  });

  it('should return true if in pressure phase with active munition execution', () => {
    expect(spec.isSatisfiedBy('pressure', createExecution({ isMunition: true, success: false, abandoned: false }))).toBe(true);
  });
});
