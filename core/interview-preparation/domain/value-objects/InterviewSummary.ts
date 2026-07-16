/**
 * InterviewSummary Value Object
 *
 * High-level interview summary.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY summary definition and helper methods.
 */

import { QuestionDifficulty } from "../types";

export class InterviewSummary {
  private readonly totalQuestions: number;
  private readonly totalDuration: number;
  private readonly softSkillQuestions: number;
  private readonly hardSkillQuestions: number;
  private readonly averageDifficulty: number;
  private readonly sections: string[];
  private readonly primaryCompetencies: string[];
  private readonly estimatedDifficulty: QuestionDifficulty;

  constructor(
    totalQuestions: number,
    totalDuration: number,
    softSkillQuestions: number,
    hardSkillQuestions: number,
    averageDifficulty: number,
    sections: string[],
    primaryCompetencies: string[],
    estimatedDifficulty: QuestionDifficulty
  ) {
    this.totalQuestions = totalQuestions;
    this.totalDuration = totalDuration;
    this.softSkillQuestions = softSkillQuestions;
    this.hardSkillQuestions = hardSkillQuestions;
    this.averageDifficulty = averageDifficulty;
    this.sections = [...sections];
    this.primaryCompetencies = [...primaryCompetencies];
    this.estimatedDifficulty = estimatedDifficulty;
    Object.freeze(this);
  }

  getTotalQuestions(): number {
    return this.totalQuestions;
  }

  getTotalDuration(): number {
    return this.totalDuration;
  }

  getSoftSkillQuestions(): number {
    return this.softSkillQuestions;
  }

  getHardSkillQuestions(): number {
    return this.hardSkillQuestions;
  }

  getAverageDifficulty(): number {
    return this.averageDifficulty;
  }

  getSections(): string[] {
    return [...this.sections];
  }

  getPrimaryCompetencies(): string[] {
    return [...this.primaryCompetencies];
  }

  getEstimatedDifficulty(): QuestionDifficulty {
    return this.estimatedDifficulty;
  }

  isBalanced(): boolean {
    const total = this.softSkillQuestions + this.hardSkillQuestions;
    if (total === 0) return false;
    const softRatio = this.softSkillQuestions / total;
    return softRatio >= 0.4 && softRatio <= 0.6;
  }

  isAppropriateForLevel(candidateLevel: "JUNIOR" | "MID_LEVEL" | "SENIOR" | "PRINCIPAL"): boolean {
    const levelNumeric = this.levelToNumeric(candidateLevel);
    const difficultyNumeric = this.difficultyToNumeric(this.estimatedDifficulty);
    return Math.abs(levelNumeric - difficultyNumeric) <= 1;
  }

  private levelToNumeric(level: string): number {
    switch (level) {
      case "JUNIOR":
        return 1;
      case "MID_LEVEL":
        return 2;
      case "SENIOR":
        return 3;
      case "PRINCIPAL":
        return 4;
      default:
        throw new Error(`Unknown level: ${level}`);
    }
  }

  private difficultyToNumeric(difficulty: QuestionDifficulty): number {
    switch (difficulty) {
      case QuestionDifficulty.BEGINNER:
        return 1;
      case QuestionDifficulty.INTERMEDIATE:
        return 2;
      case QuestionDifficulty.ADVANCED:
        return 3;
      case QuestionDifficulty.EXPERT:
        return 4;
      default:
        throw new Error(`Unknown difficulty: ${difficulty}`);
    }
  }

  equals(other: InterviewSummary): boolean {
    return (
      this.totalQuestions === other.getTotalQuestions() &&
      this.totalDuration === other.getTotalDuration() &&
      this.estimatedDifficulty === other.getEstimatedDifficulty()
    );
  }
}
