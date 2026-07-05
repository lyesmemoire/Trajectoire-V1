import { ValidationError } from "@/lib/core/errors";

export class AuthenticityScore {
  public readonly value: number;

  private constructor(value: number) {
    if (value < 0 || value > 1) {
      throw new ValidationError("Invalid AuthenticityScore: must be between 0 and 1");
    }
    this.value = Math.round(value * 10000) / 10000;
  }

  public static create(value: number): AuthenticityScore {
    return new AuthenticityScore(value);
  }

  public isSuspicious(): boolean {
    return this.value < 0.5;
  }

  public equals(other: AuthenticityScore): boolean {
    return this.value === other.value;
  }

  public toJSON(): number {
    return this.value;
  }
}
