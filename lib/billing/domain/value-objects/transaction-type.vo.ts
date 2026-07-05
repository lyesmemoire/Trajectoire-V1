/**
 * Transaction Type Value Object
 * Represents the type of credit transaction
 */
export type TransactionTypeValue = "PURCHASE" | "CONSUMPTION" | "REFUND" | "BONUS";

export class TransactionType {
  private constructor(public readonly value: TransactionTypeValue) {}

  static create(value: string): TransactionType {
    const validTypes: TransactionTypeValue[] = ["PURCHASE", "CONSUMPTION", "REFUND", "BONUS"];
    if (!validTypes.includes(value as TransactionTypeValue)) {
      throw new Error(`Invalid TransactionType: ${value}`);
    }
    return new TransactionType(value as TransactionTypeValue);
  }

  static purchase(): TransactionType {
    return new TransactionType("PURCHASE");
  }

  static consumption(): TransactionType {
    return new TransactionType("CONSUMPTION");
  }

  static refund(): TransactionType {
    return new TransactionType("REFUND");
  }

  static bonus(): TransactionType {
    return new TransactionType("BONUS");
  }

  isPurchase(): boolean {
    return this.value === "PURCHASE";
  }

  isConsumption(): boolean {
    return this.value === "CONSUMPTION";
  }

  isRefund(): boolean {
    return this.value === "REFUND";
  }

  isBonus(): boolean {
    return this.value === "BONUS";
  }

  affectsBalance(): boolean {
    // PURCHASE and BONUS add credits, CONSUMPTION removes, REFUND adds back
    return true;
  }
}
