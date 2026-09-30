/** Règles communes aux formulaires d'authentification (inscription, réinitialisation). */

export const MIN_PASSWORD_LENGTH = 8
/** Limite haute (bcrypt ignore au-delà de 72 octets) : évite aussi les corps démesurés. */
export const MAX_PASSWORD_LENGTH = 72

/** Adresse e-mail normalisée : espaces retirés, minuscules. */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

/** Contrôle de forme volontairement simple : Supabase reste l'autorité. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254
}

/** Message d'erreur en français, ou `null` si le mot de passe convient. */
export function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Le mot de passe ne doit pas dépasser ${MAX_PASSWORD_LENGTH} caractères.`
  }
  return null
}
