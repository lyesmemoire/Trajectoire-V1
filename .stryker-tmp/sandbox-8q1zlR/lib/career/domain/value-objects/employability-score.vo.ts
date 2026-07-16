// @ts-nocheck
import { ValidationError } from "@/lib/core/errors";

export class EmployabilityScore {
  public readonly value: number;

  private constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new ValidationError("Invalid EmployabilityScore: must be between 0 and 100");
    }
    this.value = Math.round(value * 10) / 10;
  }

  public static create(value: number): EmployabilityScore {
    return new EmployabilityScore(value);
  }

  public equals(other: EmployabilityScore): boolean {
    return this.value === other.value;
  }

  public toJSON(): number {
    return this.value;
  }
}
