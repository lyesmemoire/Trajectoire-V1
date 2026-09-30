/**
 * Interprétation des événements du canal de données Realtime (API GA). Logique pure, extraite du hook
 * `useRealtimeInterview` pour être testée : un nom d'événement erroné se traduit par des répliques jamais
 * enregistrées, donc par un rapport vide.
 *
 * Noms d'événements (documentation OpenAI, API GA) :
 *   - parole du candidat : conversation.item.input_audio_transcription.delta / .completed
 *   - parole de la recruteuse : response.output_audio_transcript.delta / .done
 *   - détection de parole : input_audio_buffer.speech_started / .speech_stopped
 *   - lecture audio (WebRTC) : output_audio_buffer.started / .stopped / .cleared
 *   - erreurs : error
 */

export type RealtimeStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "speaking_user"
  | "speaking_ai"
  | "disconnected"
  | "error"

export interface RealtimeTranscript {
  role: "user" | "assistant"
  text: string
  final: boolean
}

/** Texte partiel en cours de transcription, pour chaque interlocuteur. */
export interface PartialAccumulators {
  user: string
  ai: string
}

export interface RealtimeEventOutcome {
  accumulators: PartialAccumulators
  status?: RealtimeStatus
  transcript?: RealtimeTranscript
  error?: string
}

export const EMPTY_ACCUMULATORS: PartialAccumulators = { user: "", ai: "" }

const asString = (v: unknown): string => (typeof v === "string" ? v : "")

export function interpretRealtimeEvent(
  event: Record<string, unknown>,
  acc: PartialAccumulators = EMPTY_ACCUMULATORS,
): RealtimeEventOutcome {
  switch (event.type) {
    // ── Lecture audio de la recruteuse ─────────────────────────────────────────
    case "output_audio_buffer.started":
      return { accumulators: acc, status: "speaking_ai" }
    case "output_audio_buffer.stopped":
    case "output_audio_buffer.cleared":
      return { accumulators: acc, status: "connected" }

    // ── Détection de la parole du candidat ─────────────────────────────────────
    case "input_audio_buffer.speech_started":
      return { accumulators: { ...acc, user: "" }, status: "speaking_user" }
    case "input_audio_buffer.speech_stopped":
      return { accumulators: acc, status: "connected" }

    // ── Transcription du candidat ──────────────────────────────────────────────
    case "conversation.item.input_audio_transcription.delta": {
      const user = acc.user + asString(event.delta)
      return { accumulators: { ...acc, user }, transcript: { role: "user", text: user, final: false } }
    }
    case "conversation.item.input_audio_transcription.completed": {
      const text = (asString(event.transcript) || acc.user).trim()
      const accumulators = { ...acc, user: "" }
      // Transcription vide (bruit, silence) : rien à enregistrer.
      return text ? { accumulators, transcript: { role: "user", text, final: true } } : { accumulators }
    }

    // ── Transcription de la recruteuse ─────────────────────────────────────────
    case "response.output_audio_transcript.delta": {
      const ai = acc.ai + asString(event.delta)
      return { accumulators: { ...acc, ai }, transcript: { role: "assistant", text: ai, final: false } }
    }
    case "response.output_audio_transcript.done": {
      const text = (asString(event.transcript) || acc.ai).trim()
      const accumulators = { ...acc, ai: "" }
      return text ? { accumulators, transcript: { role: "assistant", text, final: true } } : { accumulators }
    }

    // ── Erreur du service ──────────────────────────────────────────────────────
    case "error": {
      const detail = event.error as { message?: unknown } | undefined
      return { accumulators: acc, error: asString(detail?.message) || "Erreur Realtime", status: "error" }
    }

    default:
      return { accumulators: acc }
  }
}

/**
 * Ajoute un fragment à la liste affichée : un fragment non final remplace le précédent du même rôle
 * s'il n'est pas final, un fragment final remplace le partiel en cours ou s'ajoute.
 */
export function mergeTranscript(list: RealtimeTranscript[], next: RealtimeTranscript): RealtimeTranscript[] {
  const last = list[list.length - 1]
  if (last && last.role === next.role && !last.final) return [...list.slice(0, -1), next]
  return [...list, next]
}
