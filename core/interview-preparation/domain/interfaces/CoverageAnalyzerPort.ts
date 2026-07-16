/**
 * CoverageAnalyzerPort
 *
 * Port interface for competency coverage analysis.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY interface definition.
 */

import { InterviewPlan } from "../entities/InterviewPlan";
import { Requirement, Suggestion } from "../types";
import { CoverageMatrix } from "../value-objects/CoverageMatrix";

export interface CoverageAnalyzerPort {
  /**
   * Analyze competency coverage for a plan
   * @param plan - Interview plan to analyze
   * @param requirements - Job requirements
   * @returns Coverage matrix
   */
  analyze(plan: InterviewPlan, requirements: Requirement[]): CoverageMatrix;

  /**
   * Identify competency gaps in a plan
   * @param plan - Interview plan to analyze
   * @param requirements - Job requirements
   * @returns Array of missing competencies
   */
  identifyGaps(plan: InterviewPlan, requirements: Requirement[]): string[];

  /**
   * Suggest improvements for coverage
   * @param coverage - Current coverage matrix
   * @returns Array of suggestions
   */
  suggestImprovements(coverage: CoverageMatrix): Suggestion[];
}
