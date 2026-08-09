/**
 * File Validator - Validation des fichiers uploadés
 * 
 * Ce module fournit des validations pour:
 * - Types de fichiers autorisés (PDF, DOCX, TXT)
 * - Taille maximale des fichiers
 * - Validation MIME type
 * - Validation extension
 * - Refus des fichiers dangereux
 */

const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const FORBIDDEN_EXTENSIONS = ["exe", "zip", "js", "html", "svg", "php", "sh", "bat", "cmd"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

/**
 * Valide un fichier uploadé
 */
export function validateUploadedFile(file: File): { valid: boolean; error?: string } {
  // Vérifier la taille
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "Le fichier dépasse la taille maximale de 5 Mo",
    };
  }

  // Vérifier l'extension
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: "Type de fichier non autorisé. Seuls PDF, DOCX et TXT sont acceptés",
    };
  }

  // Vérifier que ce n'est pas une extension interdite
  if (FORBIDDEN_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: "Type de fichier interdit",
    };
  }

  // Vérifier le MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Type MIME non autorisé",
    };
  }

  // Vérifier le nom du fichier (pas de caractères suspects)
  if (/[<>:"/\\|?*\x00-\x1F]/.test(file.name)) {
    return {
      valid: false,
      error: "Nom de fichier invalide",
    };
  }

  return { valid: true };
}

/**
 * Valide un nom de fichier
 */
export function validateFileName(name: string): { valid: boolean; error?: string } {
  if (!name || name.length === 0) {
    return { valid: false, error: "Nom de fichier vide" };
  }

  if (name.length > 255) {
    return { valid: false, error: "Nom de fichier trop long" };
  }

  if (/[<>:"/\\|?*\x00-\x1F]/.test(name)) {
    return { valid: false, error: "Nom de fichier invalide" };
  }

  const extension = name.split(".").pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: "Extension de fichier non autorisée",
    };
  }

  return { valid: true };
}

/**
 * Sanitize un nom de fichier
 */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\.{2,}/g, ".")
    .trim();
}

/**
 * Vérifie si un fichier est potentiellement dangereux
 */
export function isDangerousFile(file: File): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return FORBIDDEN_EXTENSIONS.includes(extension || "");
}
