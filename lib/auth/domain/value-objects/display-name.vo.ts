export class DisplayName {
  private constructor(public readonly value: string) {}

  static create(value: string): DisplayName {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length === 0) {
      throw new Error("Display name cannot be empty.");
    }
    if (trimmed.length > 100) {
      throw new Error("Display name cannot exceed 100 characters.");
    }
    return new DisplayName(trimmed);
  }

  equals(other: DisplayName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
