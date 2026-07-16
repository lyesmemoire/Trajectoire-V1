// @ts-nocheck
export class CreditAmount {
  private constructor(public readonly value: number) {}

  static create(value: number): CreditAmount {
    if (value < 0 || !Number.isInteger(value)) {
      throw new Error("CreditAmount must be a non-negative integer.");
    }
    return new CreditAmount(value);
  }

  add(amount: CreditAmount): CreditAmount {
    return new CreditAmount(this.value + amount.value);
  }

  subtract(amount: CreditAmount): CreditAmount {
    if (this.value < amount.value) {
      throw new Error("Cannot subtract more credits than available.");
    }
    return new CreditAmount(this.value - amount.value);
  }
}
