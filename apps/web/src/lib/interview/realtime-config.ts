/**
 * Configuration partagée de l'entretien vocal Realtime (route serveur et hook client).
 * Aucun import serveur ici : ce fichier est aussi chargé dans le navigateur.
 */

/** Modèle OpenAI Realtime : une seule source pour la création de session et l'échange SDP. */
export const REALTIME_MODEL = 'gpt-4o-realtime-preview-2025-06-03'

/** Longueur maximale d'une réplique enregistrée (caractères). */
export const REALTIME_MAX_MESSAGE_CHARS = 4000

/** Durée maximale d'un entretien vocal : fin automatique au-delà. */
export const REALTIME_MAX_DURATION_MS = 45 * 60 * 1000

/** Avertissement (non bloquant) avant la fin automatique. */
export const REALTIME_WARNING_MS = 40 * 60 * 1000

/** Attente maximale de l'enregistrement des dernières répliques avant la fin de session. */
export const REALTIME_FLUSH_TIMEOUT_MS = 5000
