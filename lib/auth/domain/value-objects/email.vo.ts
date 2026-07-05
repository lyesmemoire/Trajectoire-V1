export class Email {
  private constructor(public readonly value: string) {}

  static create(value: string): Email {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length === 0) {
      throw new Error("Email cannot be empty.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      throw new Error("Invalid email format.");
    }
    return new Email(trimmed.toLowerCase());
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
