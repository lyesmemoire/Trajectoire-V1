import { ValidationError } from "@/lib/core/errors";

export class CareerScore {
  public readonly value: number;

  private constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new ValidationError("Invalid CareerScore: must be between 0 and 100");
    }
    // Round to 1 decimal place
    this.value = Math.round(value * 10) / 10;
  }

  public static create(value: number): CareerScore {
    return new CareerScore(value);
  }

  public isHigherThan(other: CareerScore): boolean {
    return this.value > other.value;
  }

  public equals(other: CareerScore): boolean {
    return this.value === other.value;
  }

  public toJSON(): number {
    return this.value;
  }
}
