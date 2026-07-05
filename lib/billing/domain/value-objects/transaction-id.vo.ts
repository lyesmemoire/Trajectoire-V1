export class TransactionId {
  private constructor(public readonly value: string) {}

  static create(value: string): TransactionId {
    if (!value || value.trim().length === 0) {
      throw new Error("TransactionId cannot be empty.");
    }
    return new TransactionId(value);
  }

  static generate(idGenerator: { generate(): string }): TransactionId {
    return new TransactionId(idGenerator.generate());
  }
}
