/**
 * ClockProvider
 *
 * Infrastructure clock provider.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY time abstraction.
 */
// @ts-nocheck


export interface IClock {
  now(): Date;
}

export class ClockProvider implements IClock {
  now(): Date {
    return new Date();
  }
}

export class FixedClockProvider implements IClock {
  constructor(private readonly fixedDate: Date) {}

  now(): Date {
    return new Date(this.fixedDate);
  }
}
