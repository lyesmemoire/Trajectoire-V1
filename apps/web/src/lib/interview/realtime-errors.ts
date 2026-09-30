/** Messages français affichés quand l'entretien vocal ne peut pas démarrer. */

const BY_STATUS: Record<number, string> = {
  400: "Cette simulation n'est pas prête : relancez-la depuis « Nouvelle simulation ».",
  401: 'Votre session a expiré. Reconnectez-vous puis relancez la simulation.',
  404: 'Cette simulation est introuvable.',
  409: 'Cette simulation est déjà terminée.',
  429: 'Trop de tentatives en peu de temps. Patientez quelques minutes puis réessayez.',
  502: 'Le service vocal est momentanément indisponible. Réessayez dans un instant.',
  503: 'Le service vocal est momentanément indisponible. Réessayez dans un instant.',
}

export const REALTIME_DEFAULT_ERROR = 'Impossible de démarrer la simulation vocale. Réessayez.'
export const REALTIME_SDP_ERROR = 'La connexion au service vocal a échoué. Réessayez.'
export const REALTIME_MIC_DENIED =
  "Accès au microphone refusé. Autorisez le micro dans votre navigateur puis réessayez."
export const REALTIME_MIC_MISSING = 'Aucun microphone détecté.'

export function realtimeSessionErrorMessage(status: number): string {
  return BY_STATUS[status] ?? REALTIME_DEFAULT_ERROR
}

/** Message pour une erreur levée par getUserMedia ; `null` si ce n'en est pas une. */
export function realtimeMicErrorMessage(err: unknown): string | null {
  const name = (err as { name?: string } | null)?.name
  if (name === 'NotAllowedError' || name === 'SecurityError') return REALTIME_MIC_DENIED
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return REALTIME_MIC_MISSING
  return null
}
