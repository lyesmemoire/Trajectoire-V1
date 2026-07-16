// @ts-nocheck
import pdfParse from "pdf-parse";

const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46]; // %PDF

export function validatePDFMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  return (
    buffer[0] === PDF_MAGIC_BYTES[0] &&
    buffer[1] === PDF_MAGIC_BYTES[1] &&
    buffer[2] === PDF_MAGIC_BYTES[2] &&
    buffer[3] === PDF_MAGIC_BYTES[3]
  );
}

export function cleanExtractedText(rawText: string): string {
  return rawText
    .replace(/\s+/g, " ")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .replace(/[\uFFFD]/g, "")
    .replace(/[^\x20-\x7E\u00C0-\u024F\u2000-\u206F\n\r\t]/g, " ")
    .trim();
}

export async function parsePDF(buffer: Buffer): Promise<{
  text: string;
  pageCount: number;
  wordCount: number;
}> {
  if (!validatePDFMagicBytes(buffer)) {
    throw new Error("INVALID_PDF_FORMAT: File is not a valid PDF document");
  }

  const parsePromise = pdfParse(buffer, { max: 5 });
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error("PDF_PARSE_TIMEOUT: Parsing exceeded 3s")),
      3_000,
    ),
  );

  const result = await Promise.race([parsePromise, timeoutPromise]);
  let text = cleanExtractedText(result.text);

  // Hard cap text length to prevent memory overload from malicious PDFs
  if (text.length > 50000) {
    text = text.slice(0, 50000);
  }

  if (text.length < 100) {
    throw new Error("PDF_CONTENT_TOO_SHORT: Insufficient text extracted");
  }

  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;

  return { text, pageCount: result.numpages, wordCount };
}
