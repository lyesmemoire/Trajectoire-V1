import { fileTypeFromBuffer } from "file-type"

export async function validateCVUpload(file: File | null): Promise<{
  valid: boolean
  content?: string
  error?: string
}> {
  if (!file) {
    return { valid: false, error: "Fichier CV requis" }
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    return { valid: false, error: "Fichier trop volumineux (max 5MB)" }
  }

  const ALLOWED_MIME = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]

  // Validation MIME stricte avec file-type (évite spoofing)
  const arrayBuffer = await file.arrayBuffer()
  const fileType = await fileTypeFromBuffer(arrayBuffer)
  
  if (!fileType) {
    return { valid: false, error: "Format de fichier non reconnu" }
  }

  if (!ALLOWED_MIME.includes(fileType.mime)) {
    return { valid: false, error: "Format non supporté (PDF, DOCX, TXT uniquement)" }
  }

  // Double vérification : le MIME déclaré doit correspondre au type réel
  if (file.type && file.type !== fileType.mime) {
    return { valid: false, error: "Incohérence de type de fichier détectée" }
  }

  // Extraction avec timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const content = await extractCVContent(file, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (content.length < 100) {
      return { valid: false, error: "CV trop court" }
    }
    if (content.length > 50000) {
      return { valid: false, error: "CV trop long (max 50000 caractères)" }
    }

    return { valid: true, content }
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === "AbortError") {
      return { valid: false, error: "Timeout lecture fichier" }
    }
    return { valid: false, error: "Erreur lecture fichier" }
  }
}

async function extractCVContent(file: File, _options?: { signal?: AbortSignal }): Promise<string> {
  // Pour le MVP, on utilise une extraction simple basée sur le type
  if (file.type === "text/plain") {
    return await file.text()
  }

  // Pour PDF/DOCX, on utilise une implémentation simplifiée
  // MVP : on retourne le texte brut si possible, sinon une erreur
  if (file.type === "application/pdf") {
    // Pour MVP, on utilise pdfjs-dist déjà installé
    const pdfjs = await import("pdfjs-dist")
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
    let text = ""
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((item: any) => item.str).join(" ") + "\n"
    }
    
    return text
  }

  // DOCX : MVP - retourne placeholder
  throw new Error("Format DOCX non supporté dans MVP")
}

export function validateJobDescription(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length < 50) {
    return { valid: false, error: "Description trop courte (min 50 caractères)" }
  }
  if (text.length > 10000) {
    return { valid: false, error: "Description trop longue (max 10000 caractères)" }
  }
  return { valid: true }
}
