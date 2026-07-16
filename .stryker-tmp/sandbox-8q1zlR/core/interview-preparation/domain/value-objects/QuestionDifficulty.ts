/**
 * QuestionDifficulty Value Object
 *
 * Difficulty level classification for interview questions.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY difficulty classification and helper methods.
 */
// @ts-nocheck


import { QuestionDifficulty as QuestionDifficultyEnum, SkillLevel } from "../types";

export class QuestionDifficulty {
  private readonly value: QuestionDifficultyEnum;

  constructor(value: QuestionDifficultyEnum) {
    this.value = value;
    Object.freeze(this);
  }

  getValue(): QuestionDifficultyEnum {
    return this.value;
  }

  toNumeric(): number {
    switch (this.value) {
      case QuestionDifficultyEnum.BEGINNER:
        return 1;
      case QuestionDifficultyEnum.INTERMEDIATE:
        return 2;
      case QuestionDifficultyEnum.ADVANCED:
        return 3;
      case QuestionDifficultyEnum.EXPERT:
        return 4;
      default:
        throw new Error(`Unknown QuestionDifficulty: ${this.value}`);
    }
  }

  static fromNumeric(value: number): QuestionDifficulty {
    switch (value) {
      case 1:
        return new QuestionDifficulty(QuestionDifficultyEnum.BEGINNER);
      case 2:
        return new QuestionDifficulty(QuestionDifficultyEnum.INTERMEDIATE);
      case 3:
        return new QuestionDifficulty(QuestionDifficultyEnum.ADVANCED);
      case 4:
        return new QuestionDifficulty(QuestionDifficultyEnum.EXPERT);
      default:
        throw new Error(`Invalid numeric value for QuestionDifficulty: ${value}`);
    }
  }

  canBeAttemptedBy(candidateLevel: SkillLevel): boolean {
    const candidateNumeric = this.skillLevelToNumeric(candidateLevel);
    const difficultyNumeric = this.toNumeric();
    return candidateNumeric >= difficultyNumeric - 1;
  }

  private skillLevelToNumeric(level: SkillLevel): number {
    switch (level) {
      case SkillLevel.JUNIOR:
        return 1;
      case SkillLevel.MID_LEVEL:
        return 2;
      case SkillLevel.SENIOR:
        return 3;
      case SkillLevel.PRINCIPAL:
        return 4;
      default:
        throw new Error(`Unknown SkillLevel: ${level}`);
    }
  }

  equals(other: QuestionDifficulty): boolean {
    return this.value === other.getValue();
  }

  static fromString(value: string): QuestionDifficulty {
    const enumValue = Object.values(QuestionDifficultyEnum).find(
      (v) => v === value
    );
    if (!enumValue) {
      throw new Error(`Invalid QuestionDifficulty: ${value}`);
    }
    return new QuestionDifficulty(enumValue);
  }

  static BEGINNER(): QuestionDifficulty {
    return new QuestionDifficulty(QuestionDifficultyEnum.BEGINNER);
  }

  static INTERMEDIATE(): QuestionDifficulty {
    return new QuestionDifficulty(QuestionDifficultyEnum.INTERMEDIATE);
  }

  static ADVANCED(): QuestionDifficulty {
    return new QuestionDifficulty(QuestionDifficultyEnum.ADVANCED);
  }

  static EXPERT(): QuestionDifficulty {
    return new QuestionDifficulty(QuestionDifficultyEnum.EXPERT);
  }
}
