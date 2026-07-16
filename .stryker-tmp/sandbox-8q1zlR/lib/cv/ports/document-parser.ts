// @ts-nocheck
import { Result } from "@/lib/core/result";

/**
 * Capacité métier : extraction de texte depuis un document.
 */
export interface DocumentParser {
  extractText(fileBuffer: Buffer, mimeType: string): Promise<Result<string>>;
  parseStructuredData(text: string): Promise<Result<any>>;
}
