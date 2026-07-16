/**
 * CoverageAnalysisService
 *
 * Domain service for competency coverage analysis.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY coverage analysis orchestration.
 */

import { InterviewPlan } from "../entities/InterviewPlan";
import { Requirement } from "../types";
import { CoverageMatrix } from "../value-objects/CoverageMatrix";
import { CompetencyCoverage } from "../value-objects/CompetencyCoverage";

export class CoverageAnalysisService {
  analyzeCoverage(plan: InterviewPlan, requirements: Requirement[]): CoverageMatrix {
    const competencies = new Map<string, CompetencyCoverage>();

    for (const section of plan.getSections()) {
      for (const question of section.getQuestions()) {
        const coverage = question.getCompetencyCoverage();
        const competencyId = coverage.getCompetencyId();
        const existingCoverage = competencies.get(competencyId);

        if (existingCoverage) {
          competencies.set(
            competencyId,
            existingCoverage.addQuestion(question.getQuestionId())
          );
        } else {
          competencies.set(competencyId, coverage);
        }
      }
    }

    const softSkillCompetencies = new Set<string>();
    for (const requirement of requirements) {
      if (this.isSoftSkill(requirement.competencyId)) {
        softSkillCompetencies.add(requirement.competencyId);
      }
    }

    return new CoverageMatrix(competencies, softSkillCompetencies);
  }

  identifyGaps(plan: InterviewPlan, requirements: Requirement[]): string[] {
    const coverageMatrix = this.analyzeCoverage(plan, requirements);
    const gaps: string[] = [];

    for (const requirement of requirements) {
      if (requirement.isMandatory) {
        const coverage = coverageMatrix.getCoverageByCompetency(requirement.competencyId);
        if (!coverage || !coverage.isCoverageSufficient()) {
          gaps.push(requirement.competencyId);
        }
      }
    }

    return gaps;
  }

  private isSoftSkill(competencyId: string): boolean {
    return competencyId.startsWith("soft_");
  }
}
