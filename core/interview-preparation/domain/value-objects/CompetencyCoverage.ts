/**
 * CompetencyCoverage Value Object
 *
 * Mapping of questions to competencies.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY competency mapping and helper methods.
 */

import { CoverageLevel } from "../types";

export class CompetencyCoverage {
  private readonly competencyId: string;
  private readonly competencyName: string;
  private readonly coverageLevel: CoverageLevel;
  private readonly questionIds: string[];
  private readonly requiredCoverage: CoverageLevel;

  constructor(
    competencyId: string,
    competencyName: string,
    coverageLevel: CoverageLevel,
    questionIds: string[],
    requiredCoverage: CoverageLevel
  ) {
    this.competencyId = competencyId;
    this.competencyName = competencyName;
    this.coverageLevel = coverageLevel;
    this.questionIds = [...questionIds];
    this.requiredCoverage = requiredCoverage;
    Object.freeze(this);
  }

  getCompetencyId(): string {
    return this.competencyId;
  }

  getCompetencyName(): string {
    return this.competencyName;
  }

  getCoverageLevel(): CoverageLevel {
    return this.coverageLevel;
  }

  getQuestionIds(): string[] {
    return [...this.questionIds];
  }

  getRequiredCoverage(): CoverageLevel {
    return this.requiredCoverage;
  }

  isCoverageSufficient(): boolean {
    return this.coverageLevel >= this.requiredCoverage;
  }

  getCoveragePercentage(): number {
    switch (this.coverageLevel) {
      case CoverageLevel.NONE:
        return 0;
      case CoverageLevel.LOW:
        return 25;
      case CoverageLevel.MEDIUM:
        return 50;
      case CoverageLevel.HIGH:
        return 75;
      case CoverageLevel.COMPLETE:
        return 100;
      default:
        throw new Error(`Unknown CoverageLevel: ${this.coverageLevel}`);
    }
  }

  addQuestion(questionId: string): CompetencyCoverage {
    if (this.questionIds.includes(questionId)) {
      return this;
    }
    const newQuestionIds = [...this.questionIds, questionId];
    const newCoverageLevel = this.calculateCoverageLevel(newQuestionIds.length);
    return new CompetencyCoverage(
      this.competencyId,
      this.competencyName,
      newCoverageLevel,
      newQuestionIds,
      this.requiredCoverage
    );
  }

  private calculateCoverageLevel(questionCount: number): CoverageLevel {
    if (questionCount === 0) return CoverageLevel.NONE;
    if (questionCount === 1) return CoverageLevel.LOW;
    if (questionCount === 2) return CoverageLevel.MEDIUM;
    if (questionCount === 3) return CoverageLevel.HIGH;
    return CoverageLevel.COMPLETE;
  }

  equals(other: CompetencyCoverage): boolean {
    return (
      this.competencyId === other.getCompetencyId() &&
      this.coverageLevel === other.getCoverageLevel()
    );
  }
}
