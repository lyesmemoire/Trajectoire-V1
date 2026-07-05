/**
 * Money Value Object
 * Represents monetary amounts for Stripe operations
 * Pure validation, no external dependencies
 */
export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string = "eur"
  ) {}

  static create(amount: number, currency: string = "eur"): Money {
    if (amount < 0) {
      throw new Error("Money amount cannot be negative");
    }
    if (!Number.isFinite(amount)) {
      throw new Error("Money amount must be a finite number");
    }
    const normalizedCurrency = currency.toLowerCase();
    if (!["eur", "usd", "gbp"].includes(normalizedCurrency)) {
      throw new Error(`Unsupported currency: ${currency}`);
    }
    return new Money(amount, normalizedCurrency);
  }

  static fromCents(cents: number, currency: string = "eur"): Money {
    return Money.create(cents / 100, currency);
  }

  toCents(): number {
    return Math.round(this.amount * 100);
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("Cannot add money with different currencies");
    }
    return Money.create(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("Cannot subtract money with different currencies");
    }
    if (this.amount < other.amount) {
      throw new Error("Cannot subtract more money than available");
    }
    return Money.create(this.amount - other.amount, this.currency);
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  isPositive(): boolean {
    return this.amount > 0;
  }
}
