import { logger } from "@/lib/logger"

/**
 * Lecture d'un CV téléversé : UN SEUL validateur pour `api/cv/upload` (utilisateur connecté) et
 * `api/public/analyze-preview` (aperçu gratuit anonyme). Avant, chaque route avait le sien
 * (8 Mo et pdfjs d'un côté ; 5 Mo, pdf-parse et DOCX « non supporté » de l'autre).
 *
 * Règles : PDF, DOCX ou TXT ; 8 Mo maximum ; le contenu doit correspondre au type annoncé (signature
 * du fichier, pas seulement l'extension ou le type MIME déclaré par le client) ; texte extrait entre
 * 100 et 50 000 caractères ; lecture limitée dans le temps.
 */

import {
  CV_ACCEPTED_TYPES,
  CV_MAX_FILE_SIZE,
  CV_MAX_FILE_SIZE_LABEL,
  CV_MAX_TEXT_LENGTH,
  CV_MIN_TEXT_LENGTH,
} from "./cv-limits"

export { CV_ACCEPTED_TYPES, CV_MAX_FILE_SIZE, CV_MAX_TEXT_LENGTH, CV_MIN_TEXT_LENGTH }
export const CV_EXTRACTION_TIMEOUT_MS = 15_000

export type CvFileType = (typeof CV_ACCEPTED_TYPES)[number]

export type CvFileResult =
  | { ok: true; fileType: CvFileType; text: string; fileName: string; fileSize: number }
  | { ok: false; status: 400 | 413 | 415 | 422; error: string; hint?: string }

const PDF_MIME = "application/pdf"
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
const TXT_MIME = "text/plain"

export function sanitizeCvFileName(fileName: string): string {
  return fileName
    .replace(/\.\./g, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
    .slice(0, 160)
}

export function detectCvFileType(file: { name: string; type: string }): CvFileType | null {
  const name = file.name.toLowerCase()
  if (file.type === PDF_MIME || name.endsWith(".pdf")) return "PDF"
  if (file.type === DOCX_MIME || name.endsWith(".docx")) return "DOCX"
  if (file.type === TXT_MIME || name.endsWith(".txt")) return "TXT"
  return null
}

function isPdf(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("latin1") === "%PDF"
}

function isZip(buffer: Buffer): boolean {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    ((buffer[2] === 0x03 && buffer[3] === 0x04) ||
      (buffer[2] === 0x05 && buffer[3] === 0x06) ||
      (buffer[2] === 0x07 && buffer[3] === 0x08))
  )
}

/** Un texte brut ne contient pas d'octet nul : sinon c'est un binaire renommé en .txt. */
function looksBinary(buffer: Buffer): boolean {
  return buffer.subarray(0, 4096).includes(0)
}

class CvReadError extends Error {}

async function extractPdf(buffer: Buffer): Promise<string> {
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) })
    try {
      const pdf = await loadingTask.promise
      const pages: string[] = []
      for (let index = 1; index <= pdf.numPages; index += 1) {
        const page = await pdf.getPage(index)
        const content = await page.getTextContent()
        pages.push(content.items.map(item => ("str" in item ? String(item.str) : "")).join(" "))
      }
      return pages.join("\n")
    } finally {
      await loadingTask.destroy()
    }
  } catch (error) {
    logger.error({
      event: "CV - extraction PDF impossible",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    })
    throw new CvReadError("Impossible d'extraire le texte du PDF.")
  }
}

async function extractDocx(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import("mammoth")
    const result = await mammoth.extractRawText({ buffer })
    return result.value ?? ""
  } catch (error) {
    logger.error({
      event: "CV - extraction DOCX impossible",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    })
    throw new CvReadError("Impossible d'extraire le texte du fichier Word.")
  }
}

async function extractText(buffer: Buffer, fileType: CvFileType): Promise<string> {
  if (fileType === "PDF") {
    if (!isPdf(buffer)) throw new CvReadError("Le fichier ne semble pas être un PDF valide.")
    return extractPdf(buffer)
  }
  if (fileType === "DOCX") {
    if (!isZip(buffer)) throw new CvReadError("Le fichier ne semble pas être un DOCX valide.")
    return extractDocx(buffer)
  }
  if (looksBinary(buffer)) throw new CvReadError("Le fichier texte n'est pas lisible.")
  return buffer.toString("utf8")
}

export function cleanCvText(value: string): string {
  return value
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, CV_MAX_TEXT_LENGTH)
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new CvReadError("La lecture du fichier a pris trop de temps.")), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

/** Valide et lit un CV. Ne lève jamais : toute erreur prévisible est renvoyée avec son statut HTTP. */
export async function readCvFile(file: File | null): Promise<CvFileResult> {
  if (!file) return { ok: false, status: 400, error: "Fichier CV requis." }
  if (file.size === 0) return { ok: false, status: 400, error: "Le fichier est vide." }
  if (file.size > CV_MAX_FILE_SIZE) {
    return { ok: false, status: 413, error: `Fichier trop volumineux. Maximum ${CV_MAX_FILE_SIZE_LABEL}.` }
  }

  const fileType = detectCvFileType(file)
  if (!fileType) {
    return { ok: false, status: 415, error: "Format non supporté. Utilisez un PDF, un DOCX ou un TXT." }
  }

  let raw: string
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    raw = await withTimeout(extractText(buffer, fileType), CV_EXTRACTION_TIMEOUT_MS)
  } catch (error) {
    return {
      ok: false,
      status: 422,
      error: error instanceof CvReadError ? error.message : "Impossible de lire le CV.",
    }
  }

  const text = cleanCvText(raw)
  if (text.length < CV_MIN_TEXT_LENGTH) {
    return {
      ok: false,
      status: 422,
      error: "Le CV semble vide ou son contenu n'est pas lisible.",
      hint:
        fileType === "PDF"
          ? "Si le PDF est scanné comme une image, utilisez un PDF contenant du texte sélectionnable."
          : "Vérifiez que le fichier contient bien du texte.",
    }
  }

  return { ok: true, fileType, text, fileName: sanitizeCvFileName(file.name), fileSize: file.size }
}
