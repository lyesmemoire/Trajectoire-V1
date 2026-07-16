// @ts-nocheck
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { DocumentParserGateway } from "../../ports/gateways/document-parser.gateway";
import pdfParse from "pdf-parse";

export class PdfParserAdapter implements DocumentParserGateway {
  async extractText(fileBuffer: Buffer, mimeType: string): Promise<Result<string>> {
    try {
      if (mimeType !== "application/pdf") {
        return fail(new InfrastructureError("Unsupported file type. Only PDF is supported."));
      }

      const data = await pdfParse(fileBuffer);
      if (!data.text || data.text.trim().length === 0) {
        return fail(new InfrastructureError("No text found in PDF. It might be an image."));
      }

      return ok(data.text);
    } catch (e: any) {
      return fail(new InfrastructureError(`Failed to parse PDF: ${e.message}`));
    }
  }
}
