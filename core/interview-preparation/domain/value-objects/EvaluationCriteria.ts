/**
 * EvaluationCriteria Value Object
 *
 * Scoring rubric for question evaluation.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY scoring rubric definition and helper methods.
 */

import { RubricItem, EvaluationCriteriaData } from "../types";

export class EvaluationCriteria {
  private readonly criteriaId: string;
  private readonly rubric: RubricItem[];
  private readonly maxScore: number;
  private readonly weight: number;
  private readonly requiredKeyPoints: string[];
  private readonly acceptableAnswerPatterns: string[];

  constructor(data: EvaluationCriteriaData) {
    this.criteriaId = this.generateId();
    this.rubric = data.rubric;
    this.maxScore = data.maxScore;
    this.weight = data.weight;
    this.requiredKeyPoints = data.requiredKeyPoints;
    this.acceptableAnswerPatterns = data.acceptableAnswerPatterns;
    Object.freeze(this);
  }

  getCriteriaId(): string {
    return this.criteriaId;
  }

  getRubric(): RubricItem[] {
    return [...this.rubric];
  }

  getMaxScore(): number {
    return this.maxScore;
  }

  getWeight(): number {
    return this.weight;
  }

  getRequiredKeyPoints(): string[] {
    return [...this.requiredKeyPoints];
  }

  getAcceptableAnswerPatterns(): string[] {
    return [...this.acceptableAnswerPatterns];
  }

  calculateScore(answer: string): number {
    let score = 0;
    const keyPointsFound = this.requiredKeyPoints.filter((point) =>
      answer.toLowerCase().includes(point.toLowerCase())
    ).length;
    const keyPointsRatio = keyPointsFound / this.requiredKeyPoints.length;
    score = keyPointsRatio * this.maxScore;
    return Math.min(score, this.maxScore);
  }

  hasRequiredKeyPoints(answer: string): boolean {
    return this.requiredKeyPoints.every((point) =>
      answer.toLowerCase().includes(point.toLowerCase())
    );
  }

  matchesPattern(answer: string): boolean {
    return this.acceptableAnswerPatterns.some((pattern) =>
      new RegExp(pattern, "i").test(answer)
    );
  }

  equals(other: EvaluationCriteria): boolean {
    return (
      this.criteriaId === other.getCriteriaId() &&
      this.maxScore === other.getMaxScore() &&
      this.weight === other.getWeight()
    );
  }

  private generateId(): string {
    return `criteria_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
