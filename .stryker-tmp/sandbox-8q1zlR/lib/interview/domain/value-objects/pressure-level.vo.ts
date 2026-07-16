// @ts-nocheck
export class PressureLevel {
  public readonly value: number; // 0 to 100

  private constructor(value: number) {
    this.value = value;
  }

  public static create(value: number): PressureLevel {
    if (value < 0 || value > 100) {
      throw new Error("Pressure level must be between 0 and 100.");
    }
    return new PressureLevel(value);
  }

  public increase(amount: number): PressureLevel {
    return PressureLevel.create(Math.min(100, this.value + amount));
  }

  public decrease(amount: number): PressureLevel {
    return PressureLevel.create(Math.max(0, this.value - amount));
  }
}
