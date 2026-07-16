// @ts-nocheck
import { Result } from "@/lib/core/result";

export interface DocumentParserGateway {
  /**
   * Extracts text from the given document buffer.
   */
  extractText(fileBuffer: Buffer, mimeType: string): Promise<Result<string>>;
}
