/** Limites et formats d'un CV téléversé : source unique, importable côté client comme côté serveur. */
export const CV_MAX_FILE_SIZE = 8 * 1024 * 1024
export const CV_MAX_FILE_SIZE_LABEL = "8 Mo"
export const CV_MIN_TEXT_LENGTH = 100
export const CV_MAX_TEXT_LENGTH = 50_000
export const CV_ACCEPTED_TYPES = ["PDF", "DOCX", "TXT"] as const
/** Valeur de l'attribut `accept` d'un champ fichier. */
export const CV_ACCEPT_ATTRIBUTE = ".pdf,.docx,.txt"
export const CV_ACCEPT_EXTENSIONS = [".pdf", ".docx", ".txt"] as const
