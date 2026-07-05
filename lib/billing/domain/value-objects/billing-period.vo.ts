export class BillingPeriod {
  private constructor(
    public readonly start: Date,
    public readonly end: Date
  ) {}

  static create(start: Date, end: Date): BillingPeriod {
    if (start >= end) {
      throw new Error("BillingPeriod start date must be before end date.");
    }
    return new BillingPeriod(start, end);
  }

  isActive(at: Date): boolean {
    return this.start <= at && at < this.end;
  }
}
