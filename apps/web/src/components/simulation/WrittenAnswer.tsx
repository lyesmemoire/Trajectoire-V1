"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Loader2, PenLine } from "lucide-react"
import {
  WRITTEN_ANSWER_MAX_LENGTH,
  buildWrittenAnswerForm,
  parseSessionQuestion,
  parseWrittenAnswerResponse,
  validateWrittenAnswer,
  writtenAnswerErrorMessage,
} from "@/lib/interview/written-answer"

interface WrittenAnswerProps {
  sessionId: string
  /** Dernière question de la recruteuse déjà connue de la page (transcription vocale), sinon chargée à l'ouverture. */
  knownQuestion: string | null
  /** La séance est terminée côté serveur : la page redirige vers le rapport. */
  onEnded: () => void
}

/**
 * Repli écrit de la simulation : lien secondaire « Répondre par écrit » (la voix reste l'expérience principale).
 * Le texte envoyé passe par POST /api/simulation/message, dans la même séance : voir lib/interview/written-answer.ts.
 */
export function WrittenAnswer({ sessionId, knownQuestion, onEnded }: WrittenAnswerProps) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState<string | null>(knownQuestion)
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")
  const idempotencyKey = useRef<string | null>(null)
  const textarea = useRef<HTMLTextAreaElement | null>(null)
  const uid = useId()

  // À l'ouverture : question connue, sinon dernière question enregistrée de la séance.
  useEffect(() => {
    if (!open || question) return
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch(`/api/simulation/${sessionId}`)
        const parsed = parseSessionQuestion(res.status, await res.json().catch(() => null))
        if (cancelled) return
        if (parsed.kind === "question") setQuestion(parsed.text)
        else if (parsed.kind === "ended") onEnded()
        else setError(parsed.message)
      } catch {
        if (!cancelled) setError("La question en cours n’a pas pu être chargée. Vérifiez votre connexion puis réessayez.")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, question, sessionId, onEnded])

  useEffect(() => {
    if (open) textarea.current?.focus()
  }, [open])

  async function checkEnded() {
    try {
      const res = await fetch(`/api/simulation/${sessionId}`)
      const parsed = parseSessionQuestion(res.status, await res.json().catch(() => null))
      if (parsed.kind === "ended") onEnded()
    } catch {
      /* réseau indisponible : le message d'erreur reste affiché */
    }
  }

  async function send() {
    if (sending) return
    const checked = validateWrittenAnswer(text)
    if (!checked.ok) {
      setError(checked.message)
      return
    }
    setSending(true)
    setError(null)
    // Même clé tant qu'un envoi n'a pas abouti : un nouvel essai ne crée jamais un doublon.
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID()
    try {
      const res = await fetch("/api/simulation/message", {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey.current },
        body: buildWrittenAnswerForm(sessionId, checked.content),
      })
      const result = parseWrittenAnswerResponse(res.status, await res.json().catch(() => null))
      if (result.ok) {
        setQuestion(result.aiResponse)
        setText("")
        idempotencyKey.current = null
        setAnnouncement("Alexandra a répondu.")
        textarea.current?.focus()
      } else {
        setError(result.message)
        // 409 : conflit de tour OU séance terminée. On ne termine jamais l'entretien sur la foi du seul code 409.
        if (res.status === 409) void checkEnded()
      }
    } catch {
      setError(writtenAnswerErrorMessage(0))
    } finally {
      setSending(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="tap-target inline-flex items-center gap-2 rounded-[6px] px-3 text-sm font-medium text-calm-accent-deep underline underline-offset-4 transition-colors hover:bg-calm-accent-wash"
      >
        <PenLine className="size-4" aria-hidden="true" />
        Répondre par écrit
      </button>
    )
  }

  return (
    <section aria-labelledby={`${uid}-titre`} className="w-full max-w-md rounded-[6px] border border-calm-line bg-calm-surface p-4 text-left">
      <h2 id={`${uid}-titre`} className="text-sm font-semibold text-calm-ink">
        Question d’Alexandra
      </h2>
      <p className="mt-1 whitespace-pre-wrap text-base leading-relaxed text-calm-ink">
        {question ?? "Chargement de la question…"}
      </p>

      <label htmlFor={`${uid}-reponse`} className="mt-4 block text-sm font-semibold text-calm-ink">
        Votre réponse
      </label>
      <textarea
        id={`${uid}-reponse`}
        ref={textarea}
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={WRITTEN_ANSWER_MAX_LENGTH}
        rows={5}
        disabled={sending}
        aria-describedby={error ? `${uid}-erreur` : undefined}
        aria-invalid={error ? true : undefined}
        className="mt-1 w-full resize-y rounded-[6px] border border-calm-input bg-calm-surface px-4 py-3 text-base text-calm-ink placeholder:text-calm-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-calm-accent disabled:bg-calm-bg"
        placeholder="Écrivez votre réponse ici."
      />

      {error && (
        <p id={`${uid}-erreur`} role="alert" className="mt-2 text-sm text-calm-warn">
          {error}
        </p>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={sending}
          className="tap-target rounded-[6px] px-3 text-sm text-calm-secondary underline underline-offset-4 hover:text-calm-ink disabled:opacity-50"
        >
          Revenir à la voix
        </button>
        <button
          type="button"
          onClick={() => void send()}
          disabled={sending || text.trim().length === 0 || !question}
          aria-busy={sending}
          className="tap-target inline-flex items-center gap-2 rounded-[6px] bg-calm-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-calm-accent-deep disabled:opacity-50"
        >
          {sending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {sending ? "Envoi…" : "Envoyer ma réponse"}
        </button>
      </div>
    </section>
  )
}
