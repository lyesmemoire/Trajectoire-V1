/**
 * InterviewTiming Value Object
 *
 * Time allocation for questions and sections.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY timing definition and helper methods.
 */
// @ts-nocheck


import { InterviewTimingData } from "../types";

export class InterviewTiming {
  private readonly preparationTime: number;
  private readonly answerTime: number;
  private readonly followUpTime: number;
  private readonly totalTime: number;

  constructor(data: InterviewTimingData) {
    this.preparationTime = data.preparationTime;
    this.answerTime = data.answerTime;
    this.followUpTime = data.followUpTime;
    this.totalTime = this.calculateTotal();
    Object.freeze(this);
  }

  getPreparationTime(): number {
    return this.preparationTime;
  }

  getAnswerTime(): number {
    return this.answerTime;
  }

  getFollowUpTime(): number {
    return this.followUpTime;
  }

  getTotalTime(): number {
    return this.totalTime;
  }

  calculateTotal(): number {
    return this.preparationTime + this.answerTime + this.followUpTime;
  }

  isWithinBounds(maxTime: number): boolean {
    return this.totalTime <= maxTime;
  }

  equals(other: InterviewTiming): boolean {
    return (
      this.preparationTime === other.getPreparationTime() &&
      this.answerTime === other.getAnswerTime() &&
      this.followUpTime === other.getFollowUpTime()
    );
  }

  static fromSeconds(totalSeconds: number): InterviewTiming {
    const preparationTime = Math.round(totalSeconds * 0.2);
    const answerTime = Math.round(totalSeconds * 0.7);
    const followUpTime = totalSeconds - preparationTime - answerTime;
    return new InterviewTiming({
      preparationTime,
      answerTime,
      followUpTime,
    });
  }
}
