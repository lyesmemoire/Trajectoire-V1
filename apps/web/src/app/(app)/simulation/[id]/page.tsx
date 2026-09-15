"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useVoiceInterview } from "@/hooks/useVoiceInterview"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

type Session = {
  id: string
  job_title: string
  interview_type: string
  level: string
  duration_seconds: number
  status: string
}

type MatchingContext = {
  matchedSkills: string[]
  missingSkills: string[]
  suggestions: string[]
}

type PrepContext = {
  job: { title: string }
  matching: MatchingContext
  priorities: string[]
} | null

// ── Preparation card (shown before first message) ─────────────────────────────

function PrepCard({
  session,
  context,
  onStart,
}: {
  session: Session
  context: PrepContext
  onStart: () => void
}) {
  const matchedSkills = (context?.matching?.matchedSkills ?? []).slice(0, 2)
  const pointsToVerify = (context?.priorities ?? []).slice(0, 3)
  const hasPersonalization =
    matchedSkills.length > 0 || pointsToVerify.length > 0

  return (
    <div className="mx-auto max-w-[680px] py-8 px-4 sm:px-0">
      <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Votre entretien est prêt
          </h1>
          <p className="mt-1 text-slate-600">{session.job_title}</p>
        </div>

        {hasPersonalization ? (
          <>
            <p className="mb-6 text-center text-sm text-slate-500">
              Voici ce que Trajectoire a compris de votre profil pour cet entretien.
            </p>

            <div className="space-y-5">
              {/* Points déjà présents */}
              {matchedSkills.length > 0 && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Points déjà présents dans votre profil
                  </p>
                  <ul className="space-y-2">
                    {matchedSkills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <span className="text-emerald-600">✓</span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Points à vérifier */}
              {pointsToVerify.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Points à explorer pendant l'entretien
                  </p>
                  <ul className="space-y-2">
                    {pointsToVerify.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="mb-6 text-center text-sm leading-relaxed text-slate-500">
            Je vais adapter les questions à votre poste et approfondir vos
            réponses au fur et à mesure.
          </p>
        )}

        {/* Phrase cerveau */}
        <p className="mt-6 text-center text-sm text-slate-500 italic">
          &ldquo;Je vais adapter mes questions à vos réponses et approfondir les
          points qui manquent de preuves concrètes.&rdquo;
        </p>

        {/* CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={onStart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] sm:w-auto sm:min-w-[280px]"
          >
            Commencer mon entretien
          </button>
          <p className="mt-3 text-xs text-slate-400">
            Vous pourrez arrêter l'entretien à tout moment.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SimulationSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [prepContext, setPrepContext] = useState<PrepContext>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [textContent, setTextContent] = useState("")
  // Live partial transcript from Web Speech API (display only, never sent to brain)
  const [partialTranscript, setPartialTranscript] = useState("")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  // PREPARATION state — shown before first interaction
  const [phase, setPhase] = useState<"PREPARATION" | "INTERVIEW">("PREPARATION")
  const router = useRouter()
  const sessionIdRef = useRef<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // ── Voice pipeline ────────────────────────────────────────────────────────

  const handleTranscript = useCallback(
    async (text: string, durationMs?: number, audioBlob?: Blob | null) => {
      setTextContent(text)
      if (sessionIdRef.current) {
        const messageId = await submitMessage(text, sessionIdRef.current, durationMs)

        if (messageId && audioBlob) {
          const formData = new FormData()
          formData.append("sessionId", sessionIdRef.current)
          formData.append("messageId", messageId)
          formData.append("audio", audioBlob, "recording.webm")

          fetch("/api/simulation/audio-upload", {
            method: "POST",
            body: formData,
          }).catch((err) => {
            console.error("[Audio Replay] Upload failed non-fatally", err)
          })
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const {
    startRecording,
    stopRecording,
    speakText,
    cancelSpeaking,
    markBrainResponse,
    isRecording,
    isTranscribing,
    isSpeaking,
  } = useVoiceInterview({
    onTranscript: handleTranscript,
    onPartialTranscript: (partial) => setPartialTranscript(partial),
    onError: (msg) => {
      setVoiceError(msg)
      setPartialTranscript("")
      setTimeout(() => setVoiceError(null), 6000)
    },
  })

  // ── Data fetching ─────────────────────────────────────────────────────────

  useEffect(() => {
    params.then(({ id }) => {
      sessionIdRef.current = id
      fetchSession(id)
    })
  }, [params])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function fetchSession(id: string) {
    try {
      const response = await fetch(`/api/simulation/${id}`)
      if (!response.ok) throw new Error("Session introuvable")
      const data = await response.json()
      setSession(data.session)
      setMessages(data.messages || [])
      // Capture context for prep card (best effort)
      if (data.context) {
        setPrepContext(data.context as PrepContext)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  // ── Message submission (shared by text + voice) ───────────────────────────

  async function submitMessage(content: string, sessionId: string, durationMs?: number) {
    if (!content.trim() || sending) return

    setSending(true)
    setError(null)

    const formData = new FormData()
    formData.append("content", content)
    formData.append("sessionId", sessionId)
    if (durationMs) {
      formData.append("durationMs", durationMs.toString())
    }

    try {
      const response = await fetch("/api/simulation/message", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        const errorMessage =
          typeof data?.error === "string"
            ? data.error
            : typeof data?.error?.message === "string"
              ? data.error.message
              : "Erreur lors de l'envoi"
        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      const messageId = responseData?.data?.resultRef || responseData?.data?.data?.resultRef || responseData?.data?.messageId

      await fetchSession(sessionId)
      setTextContent("")
      setPartialTranscript("")

      // TTS: read the latest assistant response aloud if voice is enabled
      if (voiceEnabled) {
        // Mark brain response timestamp for latency telemetry
        markBrainResponse()
        const updatedRes = await fetch(`/api/simulation/${sessionId}`)
        if (updatedRes.ok) {
          const updated = await updatedRes.json()
          const assistantMsgs: Message[] = (updated.messages || []).filter(
            (m: Message) => m.role === "assistant"
          )
          const last = assistantMsgs[assistantMsgs.length - 1]
          if (last?.content) {
            speakText(last.content)
          }
        }
      }

      return messageId

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setSending(false)
    }
    return undefined
  }

  // ── Form submit (text mode) ───────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sessionIdRef.current) {
      await submitMessage(textContent, sessionIdRef.current)
    }
  }

  // ── End session ───────────────────────────────────────────────────────────

  async function handleEndSession() {
    const { id } = await params
    const formData = new FormData()
    formData.append("sessionId", id)

    try {
      const response = await fetch("/api/simulation/end", {
        method: "POST",
        body: formData,
      })
      if (response.ok) {
        router.push("/dashboard")
      } else {
        setError("Erreur lors de la fin de session")
      }
    } catch {
      setError("Erreur lors de la fin de session")
    }
  }

  // ── Mic button handler ────────────────────────────────────────────────────

  async function handleMicClick() {
    if (isRecording) {
      stopRecording()
    } else {
      if (isSpeaking) {
        cancelSpeaking()
      }
      setVoiceEnabled(true)
      setVoiceError(null)
      await startRecording()
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-slate-500">Chargement de la simulation...</p>
      </div>
    )
  }

  if (error && !session) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/dashboard" className="text-slate-700 hover:underline">
          Retour au tableau de bord
        </Link>
      </div>
    )
  }

  if (!session) return null

  // ── PREPARATION phase ─────────────────────────────────────────────────────

  if (phase === "PREPARATION") {
    return (
      <PrepCard
        session={session}
        context={prepContext}
        onStart={() => setPhase("INTERVIEW")}
      />
    )
  }

  // ── INTERVIEW phase ───────────────────────────────────────────────────────

  const micLabel = isRecording
    ? "Arrêter"
    : isTranscribing
    ? "Transcription…"
    : isSpeaking
    ? "Lecture…"
    : "🎙"

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-2"
          >
            ← Retour au tableau de bord
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {session.job_title}
          </h1>
          <p className="text-slate-600">
            {session.interview_type} · {session.level} ·{" "}
            {Math.floor(session.duration_seconds / 60)} minutes
          </p>
        </div>
        <button
          onClick={handleEndSession}
          disabled={sending}
          className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
        >
          Terminer
        </button>
      </div>

      {/* Text error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Voice error (non-blocking) */}
      {voiceError && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm flex justify-between items-center">
          <span>🎙 {voiceError}</span>
          <button
            onClick={() => setVoiceError(null)}
            className="ml-4 text-amber-500 hover:text-amber-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Progression</span>
          <span>{messages.length} messages</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-slate-900 h-2 rounded-full transition-all"
            style={{ width: `${Math.min((messages.length / 20) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Conversation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="text-center text-slate-400 py-8">
            <p>Préparation de votre entretien...</p>
          </div>
        )}

        {/* Live partial transcript bubble (Web Speech API — display only) */}
        {isRecording && partialTranscript && (
          <div className="flex justify-end mt-3">
            <div className="max-w-[70%] rounded-2xl p-4 bg-slate-200 text-slate-500 italic text-sm leading-relaxed animate-pulse">
              {partialTranscript}
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-6"
      >
        <div className="flex gap-3">
          {/* Microphone button */}
          <button
            type="button"
            onClick={handleMicClick}
            disabled={sending || isTranscribing || isSpeaking}
            title={
              isRecording
                ? "Cliquez pour arrêter l'enregistrement"
                : "Cliquez pour parler"
            }
            className={`px-4 py-3 rounded-xl font-semibold transition-colors self-end text-sm shrink-0 disabled:opacity-50 ${
              isRecording
                ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {micLabel}
          </button>

          <textarea
            name="content"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder={
              isRecording ? "Enregistrement en cours…" : "Votre réponse…"
            }
            disabled={sending || isRecording}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-slate-300 focus:bg-white focus:border-transparent outline-none resize-none disabled:opacity-50 text-sm"
            rows={3}
          />

          <button
            type="submit"
            disabled={sending || !textContent.trim() || isRecording}
            className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors self-end disabled:opacity-50"
          >
            {sending ? "Envoi…" : "Envoyer"}
          </button>
        </div>

        {/* Voice state indicator */}
        {(isTranscribing || isSpeaking || isRecording) && (
          <p className="mt-2 text-xs text-slate-400">
            {isRecording && "🔴 Enregistrement en cours — cliquez sur 🎙 pour terminer"}
            {isTranscribing && "⏳ Transcription en cours…"}
            {isSpeaking && "🔊 Lecture de la réponse du recruteur…"}
          </p>
        )}
      </form>
    </div>
  )
}
