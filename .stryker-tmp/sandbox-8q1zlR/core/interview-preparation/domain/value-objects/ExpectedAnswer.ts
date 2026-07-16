/**
 * ExpectedAnswer Value Object
 *
 * Ideal response structure for interview questions.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY answer structure definition and helper methods.
 */
// @ts-nocheck


import { AnswerStructure, ExpectedAnswerData } from "../types";

export class ExpectedAnswer {
  private readonly structure: AnswerStructure;
  private readonly keyPoints: string[];
  private readonly examples: string[];
  private readonly antiPatterns: string[];
  private readonly minimumLength: number;
  private readonly maximumLength: number;

  constructor(data: ExpectedAnswerData) {
    this.structure = data.structure;
    this.keyPoints = data.keyPoints;
    this.examples = data.examples;
    this.antiPatterns = data.antiPatterns;
    this.minimumLength = data.minimumLength;
    this.maximumLength = data.maximumLength;
    Object.freeze(this);
  }

  getStructure(): AnswerStructure {
    return this.structure;
  }

  getKeyPoints(): string[] {
    return [...this.keyPoints];
  }

  getExamples(): string[] {
    return [...this.examples];
  }

  getAntiPatterns(): string[] {
    return [...this.antiPatterns];
  }

  getMinimumLength(): number {
    return this.minimumLength;
  }

  getMaximumLength(): number {
    return this.maximumLength;
  }

  matchesStructure(answer: string): boolean {
    switch (this.structure) {
      case AnswerStructure.STAR:
        return this.matchesSTARStructure(answer);
      case AnswerStructure.SITUATION_ACTION_RESULT:
        return this.matchesSARStructure(answer);
      case AnswerStructure.TECHNICAL_EXPLANATION:
        return this.matchesTechnicalStructure(answer);
      case AnswerStructure.FREE_FORM:
        return true;
      default:
        throw new Error(`Unknown AnswerStructure: ${this.structure}`);
    }
  }

  private matchesSTARStructure(answer: string): boolean {
    const hasSituation = /situation|context|background/i.test(answer);
    const hasTask = /task|responsibility|challenge/i.test(answer);
    const hasAction = /action|step|approach|method/i.test(answer);
    const hasResult = /result|outcome|impact|achievement/i.test(answer);
    return hasSituation && hasTask && hasAction && hasResult;
  }

  private matchesSARStructure(answer: string): boolean {
    const hasSituation = /situation|context|background/i.test(answer);
    const hasAction = /action|step|approach|method/i.test(answer);
    const hasResult = /result|outcome|impact|achievement/i.test(answer);
    return hasSituation && hasAction && hasResult;
  }

  private matchesTechnicalStructure(answer: string): boolean {
    const hasExplanation = /explain|describe|detail/i.test(answer);
    const hasTechnical = /technical|implementation|code|algorithm/i.test(answer);
    return hasExplanation && hasTechnical;
  }

  hasKeyPoints(answer: string): boolean {
    return this.keyPoints.every((point) =>
      answer.toLowerCase().includes(point.toLowerCase())
    );
  }

  hasAntiPatterns(answer: string): boolean {
    return this.antiPatterns.some((pattern) =>
      answer.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  withinLengthBounds(answer: string): boolean {
    const length = answer.length;
    return length >= this.minimumLength && length <= this.maximumLength;
  }

  equals(other: ExpectedAnswer): boolean {
    return (
      this.structure === other.getStructure() &&
      this.minimumLength === other.getMinimumLength() &&
      this.maximumLength === other.getMaximumLength()
    );
  }
}
