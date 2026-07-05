import { ValidationError } from "@/lib/core/errors";

export class ReturnProbability {
  public readonly value: number;

  private constructor(value: number) {
    if (value < 0 || value > 1) {
      throw new ValidationError("Invalid ReturnProbability: must be between 0 and 1");
    }
    // Round to 4 decimal places
    this.value = Math.round(value * 10000) / 10000;
  }

  public static create(value: number): ReturnProbability {
    return new ReturnProbability(value);
  }

  public equals(other: ReturnProbability): boolean {
    return this.value === other.value;
  }

  public toJSON(): number {
    return this.value;
  }
}
