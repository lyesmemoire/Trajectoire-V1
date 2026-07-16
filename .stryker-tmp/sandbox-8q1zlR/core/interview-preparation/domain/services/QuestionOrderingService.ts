/**
 * QuestionOrderingService
 *
 * Domain service for question ordering.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY question ordering orchestration.
 */
// @ts-nocheck


import { InterviewQuestion } from "../entities/InterviewQuestion";
import { QuestionDependencies } from "../value-objects/QuestionDependencies";
import { OrderingStrategy } from "../types";
import { ValidationResult } from "../types";

export class QuestionOrderingService {
  orderQuestions(questions: InterviewQuestion[], strategy: OrderingStrategy): InterviewQuestion[] {
    switch (strategy) {
      case OrderingStrategy.DIFFICULTY_ASCENDING:
        return this.orderByDifficultyAscending(questions);
      case OrderingStrategy.DIFFICULTY_DESCENDING:
        return this.orderByDifficultyDescending(questions);
      case OrderingStrategy.COMPETENCY_GROUPED:
        return this.orderByCompetency(questions);
      case OrderingStrategy.CUSTOM:
        return questions;
      default:
        throw new Error(`Unknown OrderingStrategy: ${strategy}`);
    }
  }

  validateDependencies(questions: InterviewQuestion[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const questionMap = new Map<string, QuestionDependencies>();
    for (const question of questions) {
      questionMap.set(question.getQuestionId(), question.getDependencies());
    }

    for (const question of questions) {
      const dependencies = question.getDependencies();
      if (dependencies.hasCircularDependency(question.getQuestionId(), questionMap)) {
        errors.push(`Circular dependency detected for question ${question.getQuestionId()}`);
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

  resolveConflicts(questions: InterviewQuestion[]): InterviewQuestion[] {
    const resolvedQuestions: InterviewQuestion[] = [];
    const processedIds = new Set<string>();

    for (const question of questions) {
      const dependencies = question.getDependencies();
      const requires = dependencies.getRequires();

      if (requires.length === 0) {
        resolvedQuestions.push(question);
        processedIds.add(question.getQuestionId());
      } else {
        const canBeAsked = requires.every((id) => processedIds.has(id));
        if (canBeAsked) {
          resolvedQuestions.push(question);
          processedIds.add(question.getQuestionId());
        }
      }
    }

    return resolvedQuestions;
  }

  private orderByDifficultyAscending(questions: InterviewQuestion[]): InterviewQuestion[] {
    return [...questions].sort((a, b) => {
      return a.getDifficulty().toNumeric() - b.getDifficulty().toNumeric();
    });
  }

  private orderByDifficultyDescending(questions: InterviewQuestion[]): InterviewQuestion[] {
    return [...questions].sort((a, b) => {
      return b.getDifficulty().toNumeric() - a.getDifficulty().toNumeric();
    });
  }

  private orderByCompetency(questions: InterviewQuestion[]): InterviewQuestion[] {
    return [...questions].sort((a, b) => {
      const aCompetency = a.getCompetencyCoverage().getCompetencyId();
      const bCompetency = b.getCompetencyCoverage().getCompetencyId();
      return aCompetency.localeCompare(bCompetency);
    });
  }
}
