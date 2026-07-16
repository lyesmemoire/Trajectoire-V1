/**
 * DurationPolicy
 *
 * Policy for enforcing duration rules.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY duration rule enforcement.
 */

export class DurationPolicy {
  private readonly maxDuration: number;
  private readonly minDuration: number;
  private readonly maxPerQuestion: number;

  constructor(
    maxDuration: number = 90,
    minDuration: number = 30,
    maxPerQuestion: number = 10
  ) {
    this.maxDuration = maxDuration;
    this.minDuration = minDuration;
    this.maxPerQuestion = maxPerQuestion;
  }

  validate(duration: number): boolean {
    return duration >= this.minDuration && duration <= this.maxDuration;
  }

  validateQuestion(duration: number): boolean {
    return duration <= this.maxPerQuestion;
  }

  getViolationMessage(duration: number): string {
    if (duration < this.minDuration) {
      return `Duration ${duration} minutes is below minimum ${this.minDuration}`;
    }
    if (duration > this.maxDuration) {
      return `Duration ${duration} minutes exceeds maximum ${this.maxDuration}`;
    }
    return `Duration ${duration} minutes is invalid`;
  }

  getQuestionViolationMessage(duration: number): string {
    if (duration > this.maxPerQuestion) {
      return `Question duration ${duration} minutes exceeds maximum ${this.maxPerQuestion}`;
    }
    return `Question duration ${duration} minutes is invalid`;
  }

  getMaxDuration(): number {
    return this.maxDuration;
  }

  getMinDuration(): number {
    return this.minDuration;
  }

  getMaxPerQuestion(): number {
    return this.maxPerQuestion;
  }
}
