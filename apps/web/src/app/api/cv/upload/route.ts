import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MIN_TEXT_LENGTH = 50;
const MAX_TEXT_LENGTH = 50_000;

const PDF_MIME = "application/pdf";
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const TXT_MIME = "text/plain";

type SupportedFileType =
  | "PDF"
  | "DOCX"
  | "TXT";

interface UploadSuccessResponse {
  success: true;
  fileName: string;
  fileSize: number;
  fileType: SupportedFileType;
  textLength: number;
  extractedText: string;
}

function sanitizeFileName(
  fileName: string,
): string {
  return fileName
    .replace(/\.\./g, "")
    .replace(
      /[<>:"/\\|?*\u0000-\u001f]/g,
      "_",
    )
    .slice(0, 160);
}

function detectFileType(
  file: File,
): SupportedFileType | null {
  const name =
    file.name.toLowerCase();

  if (
    file.type === PDF_MIME ||
    name.endsWith(".pdf")
  ) {
    return "PDF";
  }

  if (
    file.type === DOCX_MIME ||
    name.endsWith(".docx")
  ) {
    return "DOCX";
  }

  if (
    file.type === TXT_MIME ||
    name.endsWith(".txt")
  ) {
    return "TXT";
  }

  return null;
}

function isPdfBuffer(
  buffer: Buffer,
): boolean {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  );
}

function isZipBuffer(
  buffer: Buffer,
): boolean {
  if (buffer.length < 4) {
    return false;
  }

  return (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    (
      (
        buffer[2] === 0x03 &&
        buffer[3] === 0x04
      ) ||
      (
        buffer[2] === 0x05 &&
        buffer[3] === 0x06
      ) ||
      (
        buffer[2] === 0x07 &&
        buffer[3] === 0x08
      )
    )
  );
}

async function extractPdf(
  buffer: Buffer,
): Promise<string> {
  try {
    const module =
      await import("pdf-parse");

    const pdfParse =
      module.default;

    const result =
      await pdfParse(buffer);

    const text =
      result.text?.trim() ?? "";

    if (
      text.length >=
      MIN_TEXT_LENGTH
    ) {
      return text;
    }
  } catch (error) {
    logger.warn({
      event:
        "CV upload - pdf-parse failed",
      message:
        error instanceof Error
          ? error.message
          : "Unknown pdf-parse error",
    });
  }

  try {
    const pdfjs =
      await import(
        "pdfjs-dist/legacy/build/pdf.mjs"
      );

    const loadingTask =
      pdfjs.getDocument({
        data:
          new Uint8Array(
            buffer,
          ),
      });

    const pdf =
      await loadingTask.promise;

    const pages: string[] = [];

    for (
      let index = 1;
      index <= pdf.numPages;
      index += 1
    ) {
      const page =
        await pdf.getPage(index);

      const content =
        await page.getTextContent();

      const pageText =
        content.items
          .map((item) =>
            "str" in item
              ? String(item.str)
              : "",
          )
          .join(" ");

      pages.push(pageText);
    }

    return pages.join("\n");
  } catch (error) {
    logger.error({
      event:
        "CV upload - pdfjs extraction failed",
      message:
        error instanceof Error
          ? error.message
          : "Unknown PDF extraction error",
    });

    throw new Error(
      "Impossible d'extraire le texte du PDF.",
    );
  }
}

async function extractDocx(
  buffer: Buffer,
): Promise<string> {
  try {
    const mammoth =
      await import("mammoth");

    const result =
      await mammoth.extractRawText({
        buffer,
      });

    return result.value ?? "";
  } catch (error) {
    logger.error({
      event:
        "CV upload - DOCX extraction failed",
      message:
        error instanceof Error
          ? error.message
          : "Unknown DOCX extraction error",
    });

    throw new Error(
      "Impossible d'extraire le texte du fichier Word.",
    );
  }
}

async function extractText(
  file: File,
  fileType: SupportedFileType,
): Promise<string> {
  const buffer =
    Buffer.from(
      await file.arrayBuffer(),
    );

  if (fileType === "PDF") {
    if (!isPdfBuffer(buffer)) {
      throw new Error(
        "Le fichier ne semble pas être un PDF valide.",
      );
    }

    return extractPdf(buffer);
  }

  if (fileType === "DOCX") {
    if (!isZipBuffer(buffer)) {
      throw new Error(
        "Le fichier ne semble pas être un DOCX valide.",
      );
    }

    return extractDocx(buffer);
  }

  return buffer.toString("utf8");
}

function cleanExtractedText(
  value: string,
): string {
  return value
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(
      0,
      MAX_TEXT_LENGTH,
    );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Non authentifié",
        },
        {
          status: 401,
        },
      );
    }

    let formData: FormData;

    try {
      formData =
        await request.formData();
    } catch {
      return NextResponse.json(
        {
          error:
            "Requête multipart invalide.",
        },
        {
          status: 400,
        },
      );
    }

    const uploaded =
      formData.get("file");

    if (!(uploaded instanceof File)) {
      return NextResponse.json(
        {
          error:
            'Champ "file" absent de la requête.',
        },
        {
          status: 400,
        },
      );
    }

    const file = uploaded;

    if (file.size === 0) {
      return NextResponse.json(
        {
          error:
            "Le fichier est vide.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            "Fichier trop volumineux. Maximum 8 Mo.",
        },
        {
          status: 413,
        },
      );
    }

    const fileType =
      detectFileType(file);

    if (!fileType) {
      return NextResponse.json(
        {
          error:
            "Format non supporté. Utilisez un PDF ou DOCX.",
          accepted: [
            "PDF",
            "DOCX",
          ],
        },
        {
          status: 415,
        },
      );
    }

    let extractedText: string;

    try {
      extractedText =
        await extractText(
          file,
          fileType,
        );
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Impossible de lire le CV.",
        },
        {
          status: 422,
        },
      );
    }

    const cleanText =
      cleanExtractedText(
        extractedText,
      );

    if (
      cleanText.length <
      MIN_TEXT_LENGTH
    ) {
      return NextResponse.json(
        {
          error:
            "Le CV semble vide ou son contenu n'est pas lisible.",
          hint:
            fileType === "PDF"
              ? "Si le PDF est scanné comme une image, utilisez un PDF contenant du texte sélectionnable."
              : "Vérifiez que le fichier Word contient bien du texte.",
        },
        {
          status: 422,
        },
      );
    }

    const response:
      UploadSuccessResponse = {
        success: true,
        fileName:
          sanitizeFileName(
            file.name,
          ),
        fileSize: file.size,
        fileType,
        textLength:
          cleanText.length,
        extractedText:
          cleanText,
      };

    return NextResponse.json(
      response,
      {
        status: 200,
      },
    );
  } catch (error) {
    logger.error({
      event:
        "CV upload - unexpected error",
      message:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      {
        error:
          "Erreur inattendue lors de la lecture du CV.",
      },
      {
        status: 500,
      },
    );
  }
}