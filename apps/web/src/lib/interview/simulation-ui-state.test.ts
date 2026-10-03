import { describe, it, expect } from "vitest"
import {
  SIMULATION_REASSURANCE,
  SIMULATION_UI_COPY,
  deriveSimulationUiState,
  friendlyVoiceError,
  isWrittenFallbackVisible,
  shouldAutoMute,
  VOICE_FALLBACK_ERROR,
  type SimulationUiInput,
} from "./simulation-ui-state"

const base: SimulationUiInput = { status: "connected", isMuted: false, isEnding: false, lastTranscript: null }
const assistant = { role: "assistant", final: true } as const
const user = { role: "user", final: true } as const

describe("deriveSimulationUiState", () => {
  it("connecting : avant la connexion", () => {
    expect(deriveSimulationUiState({ ...base, status: "idle" })).toBe("connecting")
    expect(deriveSimulationUiState({ ...base, status: "connecting" })).toBe("connecting")
  })

  it("recruiter_speaking : la recruteuse parle, ou va parler la première", () => {
    expect(deriveSimulationUiState({ ...base, status: "speaking_ai", lastTranscript: user })).toBe("recruiter_speaking")
    expect(deriveSimulationUiState({ ...base, status: "connected", lastTranscript: null })).toBe("recruiter_speaking")
  })

  it("ready : question posée, micro coupé", () => {
    expect(deriveSimulationUiState({ ...base, isMuted: true, lastTranscript: assistant })).toBe("ready")
  })

  it("listening : micro ouvert après la question, ou candidate en train de parler", () => {
    expect(deriveSimulationUiState({ ...base, isMuted: false, lastTranscript: assistant })).toBe("listening")
    expect(deriveSimulationUiState({ ...base, status: "speaking_user", lastTranscript: assistant })).toBe("listening")
  })

  it("processing : réponse donnée, la recruteuse n'a pas encore répondu, ou fin d'entretien", () => {
    expect(deriveSimulationUiState({ ...base, isMuted: true, lastTranscript: user })).toBe("processing")
    expect(deriveSimulationUiState({ ...base, isMuted: false, lastTranscript: user })).toBe("processing")
    expect(deriveSimulationUiState({ ...base, status: "speaking_ai", isEnding: true })).toBe("processing")
  })

  it("error : erreur ou connexion perdue", () => {
    expect(deriveSimulationUiState({ ...base, status: "error" })).toBe("error")
    expect(deriveSimulationUiState({ ...base, status: "disconnected", lastTranscript: assistant })).toBe("error")
  })
})

describe("libellés exacts du skill", () => {
  it("bouton micro : « Répondre » en ready, « J’ai terminé ma réponse » en listening, « Réessayer » en erreur", () => {
    expect(SIMULATION_UI_COPY.ready.mic).toEqual({ label: "Répondre", action: "unmute", disabled: false })
    expect(SIMULATION_UI_COPY.listening.mic).toEqual({ label: "J’ai terminé ma réponse", action: "mute", disabled: false })
    expect(SIMULATION_UI_COPY.error.mic.label).toBe("Réessayer")
    expect(SIMULATION_UI_COPY.error.mic.action).toBe("retry")
  })

  it("titres et sous-titres", () => {
    expect(SIMULATION_UI_COPY.connecting).toMatchObject({ title: "Alexandra", subtitle: "Connexion…" })
    expect(SIMULATION_UI_COPY.recruiter_speaking).toMatchObject({ title: "Alexandra", subtitle: "Écoutez la question" })
    expect(SIMULATION_UI_COPY.ready).toMatchObject({ title: "À vous", subtitle: "Prenez le temps de réfléchir, puis répondez" })
    expect(SIMULATION_UI_COPY.listening).toMatchObject({ title: "À vous", subtitle: "Alexandra vous écoute" })
    expect(SIMULATION_UI_COPY.processing).toMatchObject({ title: "Alexandra", subtitle: "Alexandra prépare la suite" })
  })

  it("jamais « RECRUTEUR IA »", () => {
    expect(JSON.stringify(SIMULATION_UI_COPY)).not.toMatch(/RECRUTEUR IA/i)
  })

  it("le micro n'est actionnable qu'en ready, listening et error", () => {
    const enabled = Object.entries(SIMULATION_UI_COPY).filter(([, c]) => !c.mic.disabled).map(([k]) => k)
    expect(enabled.sort()).toEqual(["error", "listening", "ready"])
  })
})

describe("repli écrit", () => {
  it("visible uniquement quand la voix est en échec (micro refusé, connexion, jeton…)", () => {
    expect(isWrittenFallbackVisible("error")).toBe(true)
    for (const s of ["connecting", "recruiter_speaking", "ready", "listening", "processing"] as const) {
      expect(isWrittenFallbackVisible(s)).toBe(false)
    }
  })
})

describe("micro coupé à la fin de la question", () => {
  it("coupe quand la recruteuse vient de finir et que le micro est ouvert", () => {
    expect(shouldAutoMute("recruiter_speaking", "listening", false)).toBe(true)
  })
  it("ne coupe pas dans les autres transitions", () => {
    expect(shouldAutoMute("recruiter_speaking", "listening", true)).toBe(false)
    expect(shouldAutoMute("ready", "listening", false)).toBe(false)
    expect(shouldAutoMute("listening", "processing", false)).toBe(false)
  })
})

describe("friendlyVoiceError", () => {
  it("garde les messages déjà lisibles", () => {
    const m = "Accès au microphone refusé. Autorisez le micro dans votre navigateur puis réessayez."
    expect(friendlyVoiceError(m)).toBe(m)
  })
  it("remplace tout message technique (code, fournisseur) par un message simple", () => {
    for (const raw of ["OpenAI Realtime error 502", "Request failed with status 429", "TypeError: undefined", "SDP exchange failed", ""]) {
      const out = friendlyVoiceError(raw)
      expect(out).toBe(VOICE_FALLBACK_ERROR)
      expect(out).not.toMatch(/openai|realtime|\b[45]\d{2}\b|sdp/i)
    }
    expect(friendlyVoiceError(null)).toBe(VOICE_FALLBACK_ERROR)
  })
})

describe("ligne de rassurance", () => {
  it("texte exact du skill", () => {
    expect(SIMULATION_REASSURANCE).toBe("Respirez. Prenez le temps de répondre.")
  })
  it("la page l’affiche en permanence, quel que soit l’état (rendu hors de toute condition d’état)", async () => {
    const { readFileSync } = await import("node:fs")
    const src = readFileSync(new URL("../../app/(app)/simulation/[id]/page.tsx", import.meta.url), "utf-8")
    expect(src).toMatch(/{SIMULATION_REASSURANCE}/)
    expect(src).not.toMatch(/Respirez./)
  })
})

describe("messages d'erreur de la page de simulation", () => {
  it("n'affiche jamais le message brut du hook : il passe par friendlyVoiceError", async () => {
    const { readFileSync } = await import("node:fs")
    const src = readFileSync(new URL("../../app/(app)/simulation/[id]/page.tsx", import.meta.url), "utf-8")
    // errorMessage n'est lu qu'une fois, pour être filtré
    const uses = src.match(/errorMessage/g) ?? []
    expect(uses.length).toBeLessThanOrEqual(2) // déstructuration du hook + friendlyVoiceError(errorMessage)
    expect(src).toMatch(/friendlyVoiceError\(errorMessage\)/)
  })
})
