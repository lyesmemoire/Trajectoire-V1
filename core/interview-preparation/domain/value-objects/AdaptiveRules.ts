/**
 * AdaptiveRules Value Object
 *
 * Rules for dynamic adjustment of interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY adaptive rules definition and helper methods.
 */

import { AdaptiveRulesData, AdaptationStrategy, QuestionDifficulty } from "../types";

export class AdaptiveRules {
  private readonly enableDifficultyAdaptation: boolean;
  private readonly enableTopicAdaptation: boolean;
  private readonly enableTimingAdaptation: boolean;
  private readonly adaptationThreshold: number;
  private readonly adaptationStrategy: AdaptationStrategy;

  constructor(data: AdaptiveRulesData) {
    this.enableDifficultyAdaptation = data.enableDifficultyAdaptation;
    this.enableTopicAdaptation = data.enableTopicAdaptation;
    this.enableTimingAdaptation = data.enableTimingAdaptation;
    this.adaptationThreshold = data.adaptationThreshold;
    this.adaptationStrategy = data.adaptationStrategy;
    Object.freeze(this);
  }

  isDifficultyAdaptationEnabled(): boolean {
    return this.enableDifficultyAdaptation;
  }

  isTopicAdaptationEnabled(): boolean {
    return this.enableTopicAdaptation;
  }

  isTimingAdaptationEnabled(): boolean {
    return this.enableTimingAdaptation;
  }

  getAdaptationThreshold(): number {
    return this.adaptationThreshold;
  }

  getAdaptationStrategy(): AdaptationStrategy {
    return this.adaptationStrategy;
  }

  shouldAdapt(currentScore: number): boolean {
    return this.enableDifficultyAdaptation && currentScore < this.adaptationThreshold;
  }

  getNewDifficulty(
    currentDifficulty: QuestionDifficulty,
    score: number
  ): QuestionDifficulty {
    if (!this.shouldAdapt(score)) {
      return currentDifficulty;
    }

    const currentNumeric = this.difficultyToNumeric(currentDifficulty);
    let adjustment = 0;

    switch (this.adaptationStrategy) {
      case AdaptationStrategy.CONSERVATIVE:
        adjustment = -1;
        break;
      case AdaptationStrategy.BALANCED:
        adjustment = score < this.adaptationThreshold * 0.5 ? -1 : 0;
        break;
      case AdaptationStrategy.AGGRESSIVE:
        adjustment = score < this.adaptationThreshold * 0.5 ? -2 : -1;
        break;
    }

    const newNumeric = Math.max(1, currentNumeric + adjustment);
    return this.numericToDifficulty(newNumeric);
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
        throw new Error(`Unknown QuestionDifficulty: ${difficulty}`);
    }
  }

  private numericToDifficulty(numeric: number): QuestionDifficulty {
    switch (numeric) {
      case 1:
        return QuestionDifficulty.BEGINNER;
      case 2:
        return QuestionDifficulty.INTERMEDIATE;
      case 3:
        return QuestionDifficulty.ADVANCED;
      case 4:
        return QuestionDifficulty.EXPERT;
      default:
        throw new Error(`Invalid numeric value: ${numeric}`);
    }
  }

  equals(other: AdaptiveRules): boolean {
    return (
      this.enableDifficultyAdaptation === other.isDifficultyAdaptationEnabled() &&
      this.adaptationThreshold === other.getAdaptationThreshold() &&
      this.adaptationStrategy === other.getAdaptationStrategy()
    );
  }

  static default(): AdaptiveRules {
    return new AdaptiveRules({
      enableDifficultyAdaptation: true,
      enableTopicAdaptation: false,
      enableTimingAdaptation: false,
      adaptationThreshold: 0.7,
      adaptationStrategy: AdaptationStrategy.BALANCED,
    });
  }
}
