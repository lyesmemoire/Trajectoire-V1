/**
 * QuestionCountPolicy
 *
 * Policy for enforcing question count rules.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY question count rule enforcement.
 */
// @ts-nocheck


export class QuestionCountPolicy {
  private readonly minQuestions: number;
  private readonly maxQuestions: number;
  private readonly minPerSection: number;
  private readonly maxPerSection: number;

  constructor(
    minQuestions: number = 10,
    maxQuestions: number = 30,
    minPerSection: number = 3,
    maxPerSection: number = 10
  ) {
    this.minQuestions = minQuestions;
    this.maxQuestions = maxQuestions;
    this.minPerSection = minPerSection;
    this.maxPerSection = maxPerSection;
  }

  validate(count: number): boolean {
    return count >= this.minQuestions && count <= this.maxQuestions;
  }

  validateSection(count: number): boolean {
    return count >= this.minPerSection && count <= this.maxPerSection;
  }

  getViolationMessage(count: number): string {
    if (count < this.minQuestions) {
      return `Question count ${count} is below minimum ${this.minQuestions}`;
    }
    if (count > this.maxQuestions) {
      return `Question count ${count} exceeds maximum ${this.maxQuestions}`;
    }
    return `Question count ${count} is invalid`;
  }

  getSectionViolationMessage(count: number): string {
    if (count < this.minPerSection) {
      return `Section question count ${count} is below minimum ${this.minPerSection}`;
    }
    if (count > this.maxPerSection) {
      return `Section question count ${count} exceeds maximum ${this.maxPerSection}`;
    }
    return `Section question count ${count} is invalid`;
  }

  getMinQuestions(): number {
    return this.minQuestions;
  }

  getMaxQuestions(): number {
    return this.maxQuestions;
  }

  getMinPerSection(): number {
    return this.minPerSection;
  }

  getMaxPerSection(): number {
    return this.maxPerSection;
  }
}
