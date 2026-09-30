/**
 * Validation de la description de poste (aperçu gratuit).
 * La lecture et la validation du fichier CV sont dans lib/cv/cv-file.ts (validateur unique).
 */
export function validateJobDescription(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length < 50) {
    return { valid: false, error: "Description trop courte (min 50 caractères)" }
  }
  if (text.length > 10000) {
    return { valid: false, error: "Description trop longue (max 10000 caractères)" }
  }
  return { valid: true }
}
