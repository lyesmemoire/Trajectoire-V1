/**
 * Traduction des erreurs Supabase Auth en messages français, sans jamais exposer le
 * texte brut (anglais, parfois technique). On s'appuie d'abord sur `code` (stable),
 * puis sur des fragments du message pour les anciennes versions, puis sur le statut.
 * Toute erreur inconnue retombe sur un message générique.
 */

export interface AuthErrorLike {
  code?: string | null
  message?: string | null
  status?: number | null
}

export const GENERIC_AUTH_ERROR = "Une erreur est survenue. Veuillez réessayer."

const BY_CODE: Record<string, string> = {
  invalid_credentials: "E-mail ou mot de passe incorrect.",
  email_not_confirmed: "Votre adresse e-mail n'est pas encore confirmée. Ouvrez le lien reçu par e-mail, ou demandez-en un nouveau.",
  user_already_exists: "Un compte existe déjà avec cette adresse e-mail. Connectez-vous ou réinitialisez votre mot de passe.",
  email_exists: "Un compte existe déjà avec cette adresse e-mail. Connectez-vous ou réinitialisez votre mot de passe.",
  weak_password: "Ce mot de passe est trop faible. Choisissez-en un plus long et moins courant.",
  same_password: "Le nouveau mot de passe doit être différent de l'ancien.",
  email_address_invalid: "Cette adresse e-mail n'est pas valide.",
  validation_failed: "Les informations saisies ne sont pas valides.",
  signup_disabled: "Les inscriptions sont momentanément fermées.",
  over_email_send_rate_limit: "Trop d'e-mails envoyés. Patientez quelques minutes avant de réessayer.",
  over_request_rate_limit: "Trop de tentatives. Patientez quelques minutes avant de réessayer.",
  session_not_found: "Votre session a expiré. Reconnectez-vous.",
  session_expired: "Votre session a expiré. Reconnectez-vous.",
  user_banned: "Ce compte est suspendu. Contactez le support.",
  otp_expired: "Ce lien a expiré. Demandez-en un nouveau.",
  flow_state_expired: "Ce lien a expiré. Demandez-en un nouveau.",
  flow_state_not_found: "Ce lien n'est plus valide. Demandez-en un nouveau.",
}

const BY_MESSAGE: Array<[RegExp, string]> = [
  [/invalid login credentials/i, BY_CODE.invalid_credentials],
  [/email not confirmed/i, BY_CODE.email_not_confirmed],
  [/user already registered|already been registered/i, BY_CODE.user_already_exists],
  [/password should be at least|weak password|password is too/i, BY_CODE.weak_password],
  [/new password should be different/i, BY_CODE.same_password],
  [/unable to validate email|invalid format|is invalid/i, BY_CODE.email_address_invalid],
  [/rate limit|too many requests|for security purposes/i, BY_CODE.over_request_rate_limit],
  [/token has expired|otp.*expired|link.*expired/i, BY_CODE.otp_expired],
  [/signups? not allowed|signup.*disabled/i, BY_CODE.signup_disabled],
  [/network|failed to fetch/i, "Connexion impossible. Vérifiez votre réseau et réessayez."],
]

export function translateAuthError(error: AuthErrorLike | null | undefined): string {
  if (!error) return GENERIC_AUTH_ERROR

  if (error.code && BY_CODE[error.code]) return BY_CODE[error.code]

  const message = error.message ?? ""
  for (const [pattern, text] of BY_MESSAGE) {
    if (pattern.test(message)) return text
  }

  if (error.status === 429) return BY_CODE.over_request_rate_limit
  return GENERIC_AUTH_ERROR
}

/** Vrai si l'erreur signifie « adresse non confirmée » (pour proposer le renvoi de l'e-mail). */
export function isEmailNotConfirmed(error: AuthErrorLike | null | undefined): boolean {
  if (!error) return false
  return error.code === "email_not_confirmed" || /email not confirmed/i.test(error.message ?? "")
}
