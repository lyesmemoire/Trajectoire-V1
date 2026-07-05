export class ModelConfiguration {
  private constructor(
    public readonly model: string,
    public readonly temperature: number,
    public readonly maxTokens?: number,
    public readonly topP?: number,
  ) {}

  public static create(model: string, temperature: number = 0.7, maxTokens?: number, topP?: number): ModelConfiguration {
    if (temperature < 0 || temperature > 2) {
      throw new Error("Temperature must be between 0 and 2");
    }
    if (topP !== undefined && (topP < 0 || topP > 1)) {
      throw new Error("TopP must be between 0 and 1");
    }
    return new ModelConfiguration(model, temperature, maxTokens, topP);
  }
}
