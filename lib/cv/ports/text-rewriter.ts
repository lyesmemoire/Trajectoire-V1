import { Result } from "@/lib/core/result";

/**
 * Capacité métier : réécriture de contenu textuel.
 */
export interface TextRewriter {
  rewriteCvContent(originalText: string, instructions?: string): Promise<Result<string>>;
}
