/**
 * TimingCalculationService
 *
 * Domain service for timing calculation.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY timing calculation orchestration.
 */
// @ts-nocheck


import { InterviewQuestion } from "../entities/InterviewQuestion";
import { InterviewSection } from "../entities/InterviewSection";
import { InterviewPlan } from "../entities/InterviewPlan";
import { InterviewTiming } from "../value-objects/InterviewTiming";
import { InterviewConstraints } from "../value-objects/InterviewConstraints";
import { QuestionType } from "../value-objects/QuestionType";
import { QuestionDifficulty } from "../value-objects/QuestionDifficulty";
import { ValidationResult } from "../types";

export class TimingCalculationService {
  calculateQuestionTiming(question: InterviewQuestion): InterviewTiming {
    const type = question.getType();
    const difficulty = question.getDifficulty();
    const baseTime = this.getBaseTime(type, difficulty);
    return InterviewTiming.fromSeconds(baseTime);
  }

  calculateSectionTiming(section: InterviewSection): InterviewTiming {
    const questions = section.getQuestions();
    let totalSeconds = 0;

    for (const question of questions) {
      totalSeconds += this.calculateQuestionTiming(question).getTotalTime();
    }

    return new InterviewTiming({
      preparationTime: 0,
      answerTime: totalSeconds,
      followUpTime: 0,
    });
  }

  calculateTotalTiming(plan: InterviewPlan): InterviewTiming {
    const sections = plan.getSections();
    let totalSeconds = 0;

    for (const section of sections) {
      totalSeconds += this.calculateSectionTiming(section).getTotalTime();
    }

    return new InterviewTiming({
      preparationTime: 0,
      answerTime: totalSeconds,
      followUpTime: 0,
    });
  }

  validateTiming(plan: InterviewPlan, constraints: InterviewConstraints): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const totalTiming = this.calculateTotalTiming(plan);
    const totalMinutes = totalTiming.getTotalTime() / 60;

    if (!constraints.isDurationValid(totalMinutes)) {
      errors.push(
        `Total duration ${totalMinutes} minutes exceeds maximum ${constraints.getMaxTotalDuration()} minutes`
      );
    }

    for (const section of plan.getSections()) {
      const sectionTiming = this.calculateSectionTiming(section);
      const sectionMinutes = sectionTiming.getTotalTime() / 60;

      if (sectionMinutes > 20) {
        warnings.push(`Section ${section.getName()} duration ${sectionMinutes} minutes is long`);
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

  private getBaseTime(type: QuestionType, difficulty: QuestionDifficulty): number {
    const typeMultiplier = this.getTypeMultiplier(type);
    const difficultyMultiplier = this.getDifficultyMultiplier(difficulty);
    const baseTime = 120;
    return Math.round(baseTime * typeMultiplier * difficultyMultiplier);
  }

  private getTypeMultiplier(type: QuestionType): number {
    switch (type.getValue()) {
      case "TECHNICAL":
        return 1.5;
      case "BEHAVIORAL":
        return 1.2;
      case "SITUATIONAL":
        return 1.3;
      case "CULTURE_FIT":
        return 1.0;
      case "PROBLEM_SOLVING":
        return 1.4;
      case "LEADERSHIP":
        return 1.3;
      default:
        return 1.0;
    }
  }

  private getDifficultyMultiplier(difficulty: QuestionDifficulty): number {
    const numeric = difficulty.toNumeric();
    return 0.5 + numeric * 0.25;
  }
}
