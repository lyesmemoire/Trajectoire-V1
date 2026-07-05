export class UserId {
  private constructor(public readonly value: string) {}

  static create(value: string): UserId {
    if (!value || value.trim().length === 0) {
      throw new Error("UserId cannot be empty.");
    }
    return new UserId(value);
  }

  static generate(idGenerator: { generate(): string }): UserId {
    return new UserId(idGenerator.generate());
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
