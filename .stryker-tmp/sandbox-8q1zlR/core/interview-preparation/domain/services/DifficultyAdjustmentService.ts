/**
 * DifficultyAdjustmentService
 *
 * Domain service for difficulty adjustment.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY difficulty adjustment orchestration.
 */
// @ts-nocheck


import { InterviewQuestion } from "../entities/InterviewQuestion";
import { QuestionDifficulty } from "../value-objects/QuestionDifficulty";
import { SkillLevel } from "../types";
import { ValidationResult } from "../types";

export class DifficultyAdjustmentService {
  adjustDifficulty(questions: InterviewQuestion[], candidateLevel: SkillLevel): InterviewQuestion[] {
    const adjustedQuestions: InterviewQuestion[] = [];

    for (const question of questions) {
      const currentDifficulty = question.getDifficulty();
      const optimalDifficulty = this.calculateOptimalDifficulty(candidateLevel, currentDifficulty);

      if (!currentDifficulty.equals(optimalDifficulty)) {
        question.adjustDifficulty(optimalDifficulty);
      }

      adjustedQuestions.push(question);
    }

    return adjustedQuestions;
  }

  calculateOptimalDifficulty(candidateLevel: SkillLevel, jobLevel: QuestionDifficulty): QuestionDifficulty {
    const candidateNumeric = this.skillLevelToNumeric(candidateLevel);
    const jobNumeric = jobLevel.toNumeric();

    if (candidateNumeric >= jobNumeric) {
      return jobLevel;
    }

    const average = Math.round((candidateNumeric + jobNumeric) / 2);
    return QuestionDifficulty.fromNumeric(average);
  }

  validateProgression(questions: InterviewQuestion[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (let i = 1; i < questions.length; i++) {
      const current = questions[i].getDifficulty();
      const previous = questions[i - 1].getDifficulty();
      const currentNumeric = current.toNumeric();
      const previousNumeric = previous.toNumeric();

      if (currentNumeric - previousNumeric > 1) {
        errors.push(
          `Difficulty jump too large at position ${i}: ${previous.getValue()} -> ${current.getValue()}`
        );
      }

      if (currentNumeric < previousNumeric) {
        warnings.push(
          `Difficulty regression at position ${i}: ${previous.getValue()} -> ${current.getValue()}`
        );
      }
    }

    const isValid = errors.length === 0;
    const score = isValid ? 100 : Math.max(0, 100 - errors.length * 10);

    return {
      isValid,
      errors,
      warnings,
      score,
    };
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
}
