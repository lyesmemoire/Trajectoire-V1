// @ts-nocheck
import { TokenUsage } from "./token-usage.vo";

export class Completion {
  private constructor(
    public readonly content: string,
    public readonly tokenUsage?: TokenUsage
  ) {}

  public static create(content: string, tokenUsage?: TokenUsage): Completion {
    if (!content) {
      throw new Error("Completion content cannot be empty");
    }
    return new Completion(content, tokenUsage);
  }
}
