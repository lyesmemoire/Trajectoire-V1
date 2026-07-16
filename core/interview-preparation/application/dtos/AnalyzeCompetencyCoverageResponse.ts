/**
 * AnalyzeCompetencyCoverageResponse DTO
 *
 * Response DTO for analyzing competency coverage.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */

export interface AnalyzeCompetencyCoverageResponse {
  overallCoverage: number;
  softSkillCoverage: number;
  hardSkillCoverage: number;
  gaps: string[];
  competencies: CompetencyCoverageDTO[];
  analyzedAt: Date;
}

export interface CompetencyCoverageDTO {
  competencyId: string;
  competencyName: string;
  coverageLevel: string;
  questionCount: number;
  isSufficient: boolean;
}
