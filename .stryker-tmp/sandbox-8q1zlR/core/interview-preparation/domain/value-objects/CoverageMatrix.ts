/**
 * CoverageMatrix Value Object
 *
 * Complete competency coverage analysis.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY coverage matrix definition and helper methods.
 */
// @ts-nocheck


import { CompetencyCoverage } from "./CompetencyCoverage";

export class CoverageMatrix {
  private readonly competencies: Map<string, CompetencyCoverage>;
  private readonly overallCoverage: number;
  private readonly softSkillCoverage: number;
  private readonly hardSkillCoverage: number;
  private readonly gaps: string[];

  constructor(
    competencies: Map<string, CompetencyCoverage>,
    softSkillCompetencies: Set<string>
  ) {
    this.competencies = new Map(competencies);
    this.overallCoverage = this.calculateOverallCoverage();
    this.softSkillCoverage = this.calculateSkillCoverage(softSkillCompetencies);
    this.hardSkillCoverage = this.calculateSkillCoverage(
      new Set(
        Array.from(competencies.keys()).filter(
          (id) => !softSkillCompetencies.has(id)
        )
      )
    );
    this.gaps = this.identifyGaps();
    Object.freeze(this);
  }

  getCompetencies(): Map<string, CompetencyCoverage> {
    return new Map(this.competencies);
  }

  getOverallCoverage(): number {
    return this.overallCoverage;
  }

  getSoftSkillCoverage(): number {
    return this.softSkillCoverage;
  }

  getHardSkillCoverage(): number {
    return this.hardSkillCoverage;
  }

  getGaps(): string[] {
    return [...this.gaps];
  }

  isCoverageSufficient(): boolean {
    return this.overallCoverage >= 80 && this.gaps.length === 0;
  }

  getCoverageByCompetency(competencyId: string): CompetencyCoverage | null {
    return this.competencies.get(competencyId) ?? null;
  }

  addCompetencyCoverage(coverage: CompetencyCoverage): CoverageMatrix {
    const newCompetencies = new Map(this.competencies);
    newCompetencies.set(coverage.getCompetencyId(), coverage);
    return new CoverageMatrix(newCompetencies, new Set());
  }

  private calculateOverallCoverage(): number {
    if (this.competencies.size === 0) return 0;
    let totalCoverage = 0;
    for (const coverage of this.competencies.values()) {
      totalCoverage += coverage.getCoveragePercentage();
    }
    return Math.round(totalCoverage / this.competencies.size);
  }

  private calculateSkillCoverage(competencyIds: Set<string>): number {
    if (competencyIds.size === 0) return 0;
    let totalCoverage = 0;
    let count = 0;
    for (const competencyId of competencyIds) {
      const coverage = this.competencies.get(competencyId);
      if (coverage) {
        totalCoverage += coverage.getCoveragePercentage();
        count++;
      }
    }
    return count === 0 ? 0 : Math.round(totalCoverage / count);
  }

  private identifyGaps(): string[] {
    const gaps: string[] = [];
    for (const coverage of this.competencies.values()) {
      if (!coverage.isCoverageSufficient()) {
        gaps.push(coverage.getCompetencyId());
      }
    }
    return gaps;
  }

  equals(other: CoverageMatrix): boolean {
    if (this.competencies.size !== other.getCompetencies().size) {
      return false;
    }
    for (const [id, coverage] of this.competencies) {
      const otherCoverage = other.getCompetencies().get(id);
      if (!otherCoverage || !coverage.equals(otherCoverage)) {
        return false;
      }
    }
    return true;
  }

  static empty(): CoverageMatrix {
    return new CoverageMatrix(new Map(), new Set());
  }
}
