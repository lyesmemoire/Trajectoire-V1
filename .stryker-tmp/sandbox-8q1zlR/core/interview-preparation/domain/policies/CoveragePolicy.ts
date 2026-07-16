/**
 * CoveragePolicy
 *
 * Policy for enforcing competency coverage rules.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY coverage rule enforcement.
 */
// @ts-nocheck


import { CoverageMatrix } from "../value-objects/CoverageMatrix";
import { CoverageLevel } from "../types";

export class CoveragePolicy {
  private readonly requiredCompetencies: string[];
  private readonly minCoverageLevel: CoverageLevel;

  constructor(
    requiredCompetencies: string[] = [],
    minCoverageLevel: CoverageLevel = CoverageLevel.MEDIUM
  ) {
    this.requiredCompetencies = requiredCompetencies;
    this.minCoverageLevel = minCoverageLevel;
  }

  validate(coverage: CoverageMatrix): boolean {
    const gaps = coverage.getGaps();
    const missingRequired = this.requiredCompetencies.filter((id) =>
      gaps.includes(id)
    );

    if (missingRequired.length > 0) {
      return false;
    }

    const overallCoverage = coverage.getOverallCoverage();
    const minCoveragePercentage = this.coverageLevelToPercentage(this.minCoverageLevel);

    return overallCoverage >= minCoveragePercentage;
  }

  getMissingCompetencies(coverage: CoverageMatrix): string[] {
    const gaps = coverage.getGaps();
    return this.requiredCompetencies.filter((id) => gaps.includes(id));
  }

  getViolationMessage(coverage: CoverageMatrix): string {
    const missingRequired = this.getMissingCompetencies(coverage);
    if (missingRequired.length > 0) {
      return `Missing required competencies: ${missingRequired.join(", ")}`;
    }

    const overallCoverage = coverage.getOverallCoverage();
    const minCoveragePercentage = this.coverageLevelToPercentage(this.minCoverageLevel);

    if (overallCoverage < minCoveragePercentage) {
      return `Overall coverage ${overallCoverage}% is below minimum ${minCoveragePercentage}%`;
    }

    return "Coverage is invalid";
  }

  getRequiredCompetencies(): string[] {
    return [...this.requiredCompetencies];
  }

  getMinCoverageLevel(): CoverageLevel {
    return this.minCoverageLevel;
  }

  private coverageLevelToPercentage(level: CoverageLevel): number {
    switch (level) {
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
        throw new Error(`Unknown CoverageLevel: ${level}`);
    }
  }
}
