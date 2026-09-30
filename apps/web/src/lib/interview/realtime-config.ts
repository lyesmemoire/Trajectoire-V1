/**
 * Configuration partagée de l'entretien vocal (API Realtime d'OpenAI, version GA, WebRTC).
 * Aucun import serveur ici : ce fichier est aussi chargé dans le navigateur.
 *
 * Contrat (documentation OpenAI, « Realtime conversations » et « Realtime WebRTC ») :
 *   1. le serveur crée un jeton éphémère : POST /v1/realtime/client_secrets, avec la session complète
 *      (modèle, consignes, voix, transcription, détection de fin de parole) ;
 *   2. le navigateur envoie son offre SDP à POST /v1/realtime/calls avec ce jeton, et reçoit la réponse SDP ;
 *   3. les événements transitent par le canal de données « oai-events ».
 * L'ancienne interface « beta » (modèles gpt-4o-realtime-preview, /v1/realtime/sessions) est arrêtée.
 */

/**
 * Modèle par défaut (surchargeable côté serveur par OPENAI_REALTIME_MODEL). Les modèles `gpt-realtime` et
 * `gpt-4o-realtime` plus anciens sont annoncés pour un arrêt le 2027-01-20 : ne pas les utiliser.
 */
export const REALTIME_MODEL = "gpt-realtime-2.1"

/** Voix recommandée par OpenAI pour la meilleure qualité (avec « cedar »). */
export const REALTIME_VOICE = "marin"

/** Transcription de la parole du candidat (enregistrée pour le rapport). */
export const REALTIME_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe"
export const REALTIME_TRANSCRIPTION_LANGUAGE = "fr"

export const REALTIME_CLIENT_SECRETS_URL = "https://api.openai.com/v1/realtime/client_secrets"
export const REALTIME_CALLS_URL = "https://api.openai.com/v1/realtime/calls"

/** Validité du jeton éphémère pour ÉTABLIR la connexion (secondes). */
export const REALTIME_CLIENT_SECRET_TTL_SECONDS = 120

/** Longueur maximale d'une réplique enregistrée (caractères). */
export const REALTIME_MAX_MESSAGE_CHARS = 4000

/** Plafond absolu d'un entretien vocal, quelle que soit la durée choisie. */
export const REALTIME_MAX_DURATION_MS = 45 * 60 * 1000

/** La recruteuse est prévenue (et le candidat aussi, par un bandeau) quand il reste ce temps. */
export const REALTIME_WRAP_UP_SECONDS = 120

/** Délai laissé après la durée choisie pour que la recruteuse termine sa conclusion avant la fin automatique. */
export const REALTIME_END_GRACE_SECONDS = 90

/** Attente maximale de l'enregistrement des dernières répliques avant la fin de session. */
export const REALTIME_FLUSH_TIMEOUT_MS = 5000

/** Durée d'entretien (secondes) → délais de la séance, bornés par le plafond absolu. */
export function realtimeTimeline(durationSeconds: number | null | undefined): {
  wrapUpAtMs: number
  endAtMs: number
} {
  const seconds = Number.isFinite(durationSeconds) && (durationSeconds as number) > 0 ? (durationSeconds as number) : 15 * 60
  const endAtMs = Math.min(REALTIME_MAX_DURATION_MS, (seconds + REALTIME_END_GRACE_SECONDS) * 1000)
  const wrapUpAtMs = Math.max(0, Math.min(endAtMs - REALTIME_END_GRACE_SECONDS * 1000, (seconds - REALTIME_WRAP_UP_SECONDS) * 1000))
  return { wrapUpAtMs, endAtMs }
}
