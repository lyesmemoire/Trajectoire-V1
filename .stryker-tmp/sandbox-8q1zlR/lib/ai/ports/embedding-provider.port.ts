// @ts-nocheck
import { Result } from "@/lib/core/result";

export interface EmbeddingProviderPort {
  createEmbedding(text: string): Promise<Result<number[]>>;
  createEmbeddings(texts: string[]): Promise<Result<number[][]>>;
}
