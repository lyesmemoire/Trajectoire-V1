/**
 * Domain Errors
 *
 * Domain-specific error types.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY error definitions.
 */
// @ts-nocheck


export class InterviewPlanningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InterviewPlanningError";
  }
}

export class QuestionGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuestionGenerationError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class CoverageAnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CoverageAnalysisError";
  }
}

export class DifficultyAdjustmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DifficultyAdjustmentError";
  }
}

export class OrderingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderingError";
  }
}

export class TimingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimingError";
  }
}

export class InvariantViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvariantViolationError";
  }
}
