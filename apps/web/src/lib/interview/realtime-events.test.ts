import { describe, it, expect } from "vitest"
import {
  EMPTY_ACCUMULATORS,
  interpretRealtimeEvent,
  mergeTranscript,
  type PartialAccumulators,
  type RealtimeTranscript,
} from "./realtime-events"

const run = (events: Array<Record<string, unknown>>) => {
  let acc: PartialAccumulators = EMPTY_ACCUMULATORS
  const transcripts: RealtimeTranscript[] = []
  const statuses: string[] = []
  let error: string | undefined
  for (const e of events) {
    const o = interpretRealtimeEvent(e, acc)
    acc = o.accumulators
    if (o.transcript) transcripts.push(o.transcript)
    if (o.status) statuses.push(o.status)
    if (o.error) error = o.error
  }
  return { acc, transcripts, statuses, error }
}

describe("noms d'événements de l'API GA", () => {
  it("transcription de la recruteuse : response.output_audio_transcript.delta / done", () => {
    const { transcripts } = run([
      { type: "response.output_audio_transcript.delta", delta: "Bonjour, " },
      { type: "response.output_audio_transcript.delta", delta: "parlez-moi de vous." },
      { type: "response.output_audio_transcript.done", transcript: "Bonjour, parlez-moi de vous." },
    ])
    expect(transcripts.map(t => [t.role, t.text, t.final])).toEqual([
      ["assistant", "Bonjour, ", false],
      ["assistant", "Bonjour, parlez-moi de vous.", false],
      ["assistant", "Bonjour, parlez-moi de vous.", true],
    ])
  })

  it("les anciens noms de l'API beta ne produisent plus rien (régression : répliques perdues)", () => {
    const { transcripts, statuses } = run([
      { type: "response.audio_transcript.delta", delta: "x" },
      { type: "response.audio_transcript.done", transcript: "x" },
      { type: "response.audio.started" },
    ])
    expect(transcripts).toEqual([])
    expect(statuses).toEqual([])
  })

  it("transcription du candidat : delta puis completed", () => {
    const { transcripts, acc } = run([
      { type: "input_audio_buffer.speech_started" },
      { type: "conversation.item.input_audio_transcription.delta", delta: "Je suis " },
      { type: "conversation.item.input_audio_transcription.delta", delta: "développeuse." },
      { type: "conversation.item.input_audio_transcription.completed", transcript: "Je suis développeuse." },
    ])
    expect(transcripts.at(-1)).toEqual({ role: "user", text: "Je suis développeuse.", final: true })
    expect(acc.user).toBe("")
  })

  it("transcription finale vide ou d'espaces : rien à enregistrer", () => {
    for (const transcript of ["", "   ", undefined]) {
      const { transcripts } = run([{ type: "conversation.item.input_audio_transcription.completed", transcript }])
      expect(transcripts).toEqual([])
    }
    const { transcripts } = run([{ type: "response.output_audio_transcript.done", transcript: " " }])
    expect(transcripts).toEqual([])
  })

  it("sans texte final, le cumul des fragments sert de repli", () => {
    const { transcripts } = run([
      { type: "conversation.item.input_audio_transcription.delta", delta: "Bonjour" },
      { type: "conversation.item.input_audio_transcription.completed" },
    ])
    expect(transcripts.at(-1)).toMatchObject({ text: "Bonjour", final: true })
  })
})

describe("états", () => {
  it("cycle de parole : candidat, recruteuse, retour à l'écoute", () => {
    const { statuses } = run([
      { type: "input_audio_buffer.speech_started" },
      { type: "input_audio_buffer.speech_stopped" },
      { type: "output_audio_buffer.started" },
      { type: "output_audio_buffer.stopped" },
      { type: "output_audio_buffer.cleared" },
    ])
    expect(statuses).toEqual(["speaking_user", "connected", "speaking_ai", "connected", "connected"])
  })

  it("début de parole du candidat : le cumul partiel est remis à zéro", () => {
    const { acc } = run([
      { type: "conversation.item.input_audio_transcription.delta", delta: "reste" },
      { type: "input_audio_buffer.speech_started" },
    ])
    expect(acc.user).toBe("")
  })

  it("erreur du service : message et état d'erreur", () => {
    expect(run([{ type: "error", error: { message: "rate limit" } }])).toMatchObject({ error: "rate limit", statuses: ["error"] })
    expect(run([{ type: "error" }]).error).toBe("Erreur Realtime")
  })

  it("événement inconnu ou mal formé : ignoré sans exception", () => {
    expect(() => run([{ type: "rate_limits.updated" }, {}, { type: 5 }, { type: "response.output_audio_transcript.delta", delta: 12 }])).not.toThrow()
  })
})

describe("mergeTranscript", () => {
  const t = (role: "user" | "assistant", text: string, final: boolean): RealtimeTranscript => ({ role, text, final })

  it("un partiel remplace le partiel précédent du même rôle", () => {
    const list = mergeTranscript([t("assistant", "Bon", false)], t("assistant", "Bonjour", false))
    expect(list).toEqual([t("assistant", "Bonjour", false)])
  })

  it("le final remplace le partiel, puis le tour suivant s'ajoute", () => {
    let list = mergeTranscript([], t("assistant", "Bon", false))
    list = mergeTranscript(list, t("assistant", "Bonjour.", true))
    list = mergeTranscript(list, t("user", "Salut", false))
    expect(list.map(x => [x.role, x.text, x.final])).toEqual([
      ["assistant", "Bonjour.", true],
      ["user", "Salut", false],
    ])
  })

  it("deux tours finaux consécutifs du même rôle restent distincts", () => {
    const list = mergeTranscript([t("user", "A", true)], t("user", "B", true))
    expect(list).toHaveLength(2)
  })
})
