// @ts-nocheck
export class TokenUsage {
  private constructor(
    public readonly promptTokens: number,
    public readonly completionTokens: number,
    public readonly totalTokens: number
  ) {}

  public static create(promptTokens: number, completionTokens: number, totalTokens?: number): TokenUsage {
    if (promptTokens < 0 || completionTokens < 0) {
      throw new Error("Token counts cannot be negative");
    }
    const total = totalTokens !== undefined ? totalTokens : promptTokens + completionTokens;
    if (total !== promptTokens + completionTokens) {
      throw new Error("Total tokens must be the sum of prompt and completion tokens");
    }
    return new TokenUsage(promptTokens, completionTokens, total);
  }
}
