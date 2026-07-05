import { Result } from "@/lib/core/result";

export interface LLMRewriterGateway {
  /**
   * Re-writes the content according to the provided instructions.
   */
  rewrite(content: string, instructions: string): Promise<Result<string>>;
}
