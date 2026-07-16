/**
 * QuestionType Value Object
 *
 * Type classification for interview questions.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY type classification and helper methods.
 */

import { QuestionType as QuestionTypeEnum } from "../types";

export class QuestionType {
  private readonly value: QuestionTypeEnum;

  constructor(value: QuestionTypeEnum) {
    this.value = value;
    Object.freeze(this);
  }

  getValue(): QuestionTypeEnum {
    return this.value;
  }

  isSoftSkill(): boolean {
    return (
      this.value === QuestionTypeEnum.BEHAVIORAL ||
      this.value === QuestionTypeEnum.SITUATIONAL ||
      this.value === QuestionTypeEnum.CULTURE_FIT ||
      this.value === QuestionTypeEnum.LEADERSHIP
    );
  }

  isHardSkill(): boolean {
    return (
      this.value === QuestionTypeEnum.TECHNICAL ||
      this.value === QuestionTypeEnum.PROBLEM_SOLVING
    );
  }

  requiresCodeExample(): boolean {
    return this.value === QuestionTypeEnum.TECHNICAL;
  }

  equals(other: QuestionType): boolean {
    return this.value === other.getValue();
  }

  static fromString(value: string): QuestionType {
    const enumValue = Object.values(QuestionTypeEnum).find(
      (v) => v === value
    );
    if (!enumValue) {
      throw new Error(`Invalid QuestionType: ${value}`);
    }
    return new QuestionType(enumValue);
  }

  static TECHNICAL(): QuestionType {
    return new QuestionType(QuestionTypeEnum.TECHNICAL);
  }

  static BEHAVIORAL(): QuestionType {
    return new QuestionType(QuestionTypeEnum.BEHAVIORAL);
  }

  static SITUATIONAL(): QuestionType {
    return new QuestionType(QuestionTypeEnum.SITUATIONAL);
  }

  static CULTURE_FIT(): QuestionType {
    return new QuestionType(QuestionTypeEnum.CULTURE_FIT);
  }

  static PROBLEM_SOLVING(): QuestionType {
    return new QuestionType(QuestionTypeEnum.PROBLEM_SOLVING);
  }

  static LEADERSHIP(): QuestionType {
    return new QuestionType(QuestionTypeEnum.LEADERSHIP);
  }
}
