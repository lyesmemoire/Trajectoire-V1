/**
 * InterviewConstraints Value Object
 *
 * Business rules and limitations for interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY constraints definition and helper methods.
 */

import { InterviewConstraintsData, QuestionDifficulty } from "../types";

export class InterviewConstraints {
  private readonly maxTotalDuration: number;
  private readonly maxQuestionsPerSection: number;
  private readonly maxTotalQuestions: number;
  private readonly minSoftSkillQuestions: number;
  private readonly minHardSkillQuestions: number;
  private readonly maxDifficulty: QuestionDifficulty;
  private readonly minDifficulty: QuestionDifficulty;
  private readonly mandatoryCompetencies: string[];
  private readonly forbiddenTopics: string[];

  constructor(data: InterviewConstraintsData) {
    this.maxTotalDuration = data.maxTotalDuration ?? 90;
    this.maxQuestionsPerSection = data.maxQuestionsPerSection ?? 10;
    this.maxTotalQuestions = data.maxTotalQuestions ?? 30;
    this.minSoftSkillQuestions = data.minSoftSkillQuestions ?? 4;
    this.minHardSkillQuestions = data.minHardSkillQuestions ?? 6;
    this.maxDifficulty = data.maxDifficulty ?? QuestionDifficulty.EXPERT;
    this.minDifficulty = data.minDifficulty ?? QuestionDifficulty.BEGINNER;
    this.mandatoryCompetencies = data.mandatoryCompetencies ?? [];
    this.forbiddenTopics = data.forbiddenTopics ?? [];
    Object.freeze(this);
  }

  getMaxTotalDuration(): number {
    return this.maxTotalDuration;
  }

  getMaxQuestionsPerSection(): number {
    return this.maxQuestionsPerSection;
  }

  getMaxTotalQuestions(): number {
    return this.maxTotalQuestions;
  }

  getMinSoftSkillQuestions(): number {
    return this.minSoftSkillQuestions;
  }

  getMinHardSkillQuestions(): number {
    return this.minHardSkillQuestions;
  }

  getMaxDifficulty(): QuestionDifficulty {
    return this.maxDifficulty;
  }

  getMinDifficulty(): QuestionDifficulty {
    return this.minDifficulty;
  }

  getMandatoryCompetencies(): string[] {
    return [...this.mandatoryCompetencies];
  }

  getForbiddenTopics(): string[] {
    return [...this.forbiddenTopics];
  }

  isDurationValid(duration: number): boolean {
    return duration <= this.maxTotalDuration;
  }

  isQuestionCountValid(count: number): boolean {
    return count >= 10 && count <= this.maxTotalQuestions;
  }

  isSectionQuestionCountValid(count: number): boolean {
    return count >= 3 && count <= this.maxQuestionsPerSection;
  }

  isSkillBalanceValid(softCount: number, hardCount: number): boolean {
    const total = softCount + hardCount;
    if (total === 0) return false;
    const softRatio = softCount / total;
    return softRatio >= 0.4 && softRatio <= 0.6;
  }

  isDifficultyValid(difficulty: QuestionDifficulty): boolean {
    return difficulty >= this.minDifficulty && difficulty <= this.maxDifficulty;
  }

  equals(other: InterviewConstraints): boolean {
    return (
      this.maxTotalDuration === other.getMaxTotalDuration() &&
      this.maxTotalQuestions === other.getMaxTotalQuestions() &&
      this.minSoftSkillQuestions === other.getMinSoftSkillQuestions() &&
      this.minHardSkillQuestions === other.getMinHardSkillQuestions()
    );
  }

  static default(): InterviewConstraints {
    return new InterviewConstraints({});
  }
}
