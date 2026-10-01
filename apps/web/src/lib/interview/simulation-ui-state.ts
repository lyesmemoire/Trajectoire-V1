import type { RealtimeStatus, RealtimeTranscript } from "@/lib/interview/realtime-events"

/**
 * Machine d'états de l'interface de simulation (skill trajectoire-web-design, section 12).
 * Une seule source de vérité pour les libellés : l'état est DÉRIVÉ de ce que `useRealtimeInterview` expose déjà
 * (statut, micro coupé, dernier tour de parole), sans toucher au hook.
 */

export type SimulationUiState =
  | "connecting"
  | "recruiter_speaking"
  | "ready"
  | "listening"
  | "processing"
  | "error"

export interface SimulationUiInput {
  status: RealtimeStatus
  isMuted: boolean
  /** Fin d'entretien en cours (génération du rapport). */
  isEnding: boolean
  /** Dernier tour de parole connu, ou null avant le premier. */
  lastTranscript: Pick<RealtimeTranscript, "role" | "final"> | null
}

export function deriveSimulationUiState(input: SimulationUiInput): SimulationUiState {
  const { status, isMuted, isEnding, lastTranscript } = input

  if (isEnding) return "processing"

  switch (status) {
    case "error":
    case "disconnected":
      return "error"
    case "idle":
    case "connecting":
      return "connecting"
    case "speaking_ai":
      return "recruiter_speaking"
    case "speaking_user":
      return "listening"
    default:
      break
  }

  // Connecté, personne ne parle. La recruteuse parle la première : tant qu'aucun tour n'existe, on l'attend.
  if (lastTranscript === null) return "recruiter_speaking"
  // La candidate a répondu, la recruteuse n'a pas encore pris la parole.
  if (lastTranscript.role === "user" && lastTranscript.final) return "processing"
  return isMuted ? "ready" : "listening"
}

/** Action portée par le bouton du micro. */
export type MicAction = "none" | "unmute" | "mute" | "retry"

export interface SimulationUiCopy {
  /** Titre d'état ; null quand le message d'erreur le remplace. */
  title: string | null
  subtitle: string
  mic: { label: string; action: MicAction; disabled: boolean }
}

export const SIMULATION_UI_COPY: Record<SimulationUiState, SimulationUiCopy> = {
  connecting: {
    title: "Alexandra",
    subtitle: "Connexion…",
    mic: { label: "Connexion…", action: "none", disabled: true },
  },
  recruiter_speaking: {
    title: "Alexandra",
    subtitle: "Écoutez la question",
    mic: { label: "Alexandra parle", action: "none", disabled: true },
  },
  ready: {
    title: "À vous",
    subtitle: "Prenez le temps de réfléchir, puis répondez",
    mic: { label: "Répondre", action: "unmute", disabled: false },
  },
  listening: {
    title: "À vous",
    subtitle: "Alexandra vous écoute",
    mic: { label: "J’ai terminé ma réponse", action: "mute", disabled: false },
  },
  processing: {
    title: "Alexandra",
    subtitle: "Alexandra prépare la suite",
    mic: { label: "Préparation de la suite", action: "none", disabled: true },
  },
  error: {
    title: null,
    subtitle: "Connexion vocale interrompue",
    mic: { label: "Réessayer", action: "retry", disabled: false },
  },
}

/** Ligne de rassurance, toujours affichée. */
export const SIMULATION_REASSURANCE = "Respirez. Vous pouvez reformuler à tout moment."

/** Message d'erreur vocale affiché quand le hook n'en fournit pas (ou en fournit un illisible). */
export const VOICE_FALLBACK_ERROR =
  "La connexion vocale est momentanément indisponible. Réessayez, ou répondez par écrit."

/**
 * Message d'erreur vocale lisible : jamais de code, de nom de fournisseur ni de détail technique. Les messages du
 * hook sont déjà en français simple ; ce filtre est un garde-fou.
 */
export function friendlyVoiceError(message: string | null | undefined): string {
  const text = (message ?? "").trim()
  if (!text) return VOICE_FALLBACK_ERROR
  if (/openai|realtime|webrtc|sdp|status|\b[45]\d{2}\b|exception|undefined|null/i.test(text)) return VOICE_FALLBACK_ERROR
  return text
}

/** Le repli écrit est proposé quand la voix est indisponible ou en échec (micro refusé, connexion, jeton…). */
export function isWrittenFallbackVisible(state: SimulationUiState): boolean {
  return state === "error"
}

/** Le micro doit-il être coupé automatiquement ? À la fin de la question, pour laisser le temps de réfléchir. */
export function shouldAutoMute(previous: SimulationUiState, current: SimulationUiState, isMuted: boolean): boolean {
  return previous === "recruiter_speaking" && current === "listening" && !isMuted
}
