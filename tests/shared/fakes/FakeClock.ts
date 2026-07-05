/**
 * Fake Clock for testing
 * Allows deterministic time control in tests
 */

import { Clock } from "../../../lib/core/clock/Clock";

export class FakeClock implements Clock {
  private currentTime: Date;

  constructor(initialTime: Date = new Date("2024-01-01T00:00:00Z")) {
    this.currentTime = initialTime;
  }

  now(): Date {
    return new Date(this.currentTime);
  }

  advanceBy(milliseconds: number): void {
    this.currentTime = new Date(this.currentTime.getTime() + milliseconds);
  }

  advanceTo(date: Date): void {
    this.currentTime = new Date(date);
  }

  reset(date?: Date): void {
    this.currentTime = date ? new Date(date) : new Date("2024-01-01T00:00:00Z");
  }
}
