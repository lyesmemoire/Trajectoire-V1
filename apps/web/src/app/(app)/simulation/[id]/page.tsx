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

export default function SimulationSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [textContent, setTextContent] = useState("")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const router = useRouter()
  const sessionIdRef = useRef<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // ── Voice pipeline ────────────────────────────────────────────────────────

  const handleTranscript = useCallback(
    async (text: string) => {
      // Fill the text area with the transcript and auto-submit
      setTextContent(text)
      if (sessionIdRef.current) {
        await submitMessage(text, sessionIdRef.current)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const { voiceState, startRecording, stopRecording, speakText, isRecording, isTranscribing, isSpeaking } =
    useVoiceInterview({
      onTranscript: handleTranscript,
      onError: (msg) => {
        setVoiceError(msg)
        // Auto-clear voice error after 6s
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  // ── Message submission (shared by text + voice) ───────────────────────────

  async function submitMessage(content: string, sessionId: string) {
    if (!content.trim() || sending) return

    setSending(true)
    setError(null)

    const formData = new FormData()
    formData.append("content", content)
    formData.append("sessionId", sessionId)

    try {
      const response = await fetch("/api/simulation/message", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de l'envoi")
      }

      await fetchSession(sessionId)
      setTextContent("")

      // TTS: read the latest assistant response aloud if voice is enabled
      if (voiceEnabled) {
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setSending(false)
    }
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

  function handleMicClick() {
    if (isRecording) {
      stopRecording()
    } else {
      setVoiceEnabled(true)
      setVoiceError(null)
      startRecording()
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-ink-600">Chargement de la simulation...</p>
      </div>
    )
  }

  if (error && !session) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-brick-600 mb-4">{error}</p>
        <Link href="/dashboard" className="text-ink-700 hover:underline">
          Retour au tableau de bord
        </Link>
      </div>
    )
  }

  if (!session) return null

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
            className="inline-flex items-center text-sm text-ink-600 hover:text-ink-900 mb-2"
          >
            ← Retour au tableau de bord
          </Link>
          <h1 className="text-2xl font-bold text-ink-900">{session.job_title}</h1>
          <p className="text-ink-600">
            {session.interview_type} · {session.level} · {Math.floor(session.duration_seconds / 60)} minutes
          </p>
        </div>
        <button
          onClick={handleEndSession}
          disabled={sending}
          className="px-4 py-2 bg-brick-100 text-brick-700 rounded-lg hover:bg-brick-200 transition-colors text-sm font-medium disabled:opacity-50"
        >
          Terminer
        </button>
      </div>

      {/* Text error */}
      {error && (
        <div className="mb-4 p-4 bg-brick-50 border border-brick-200 rounded-lg text-brick-600">
          {error}
        </div>
      )}

      {/* Voice error (non-blocking) */}
      {voiceError && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm flex justify-between items-center">
          <span>🎙 {voiceError}</span>
          <button onClick={() => setVoiceError(null)} className="ml-4 text-amber-500 hover:text-amber-700">✕</button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-ink-600 mb-2">
          <span>Progression</span>
          <span>{messages.length} messages</span>
        </div>
        <div className="w-full bg-ivoire-200 rounded-full h-2">
          <div
            className="bg-ink-800 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(messages.length / 20 * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Conversation */}
      <div className="bg-white rounded-lg border border-ivoire-200 p-6 mb-6 min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-ink-600 text-white"
                      : "bg-ivoire-100 text-ink-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="text-center text-ink-500 py-8">
            <p>Préparation de votre entretien...</p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-ivoire-200 p-6">
        <div className="flex gap-3">
          {/* Microphone button */}
          <button
            type="button"
            onClick={handleMicClick}
            disabled={sending || isTranscribing || isSpeaking}
            title={isRecording ? "Cliquez pour arrêter l'enregistrement" : "Cliquez pour parler"}
            className={`px-4 py-3 rounded-lg font-semibold transition-colors self-end text-sm shrink-0 disabled:opacity-50 ${
              isRecording
                ? "bg-brick-500 text-white hover:bg-brick-600 animate-pulse"
                : "bg-ivoire-200 text-ink-600 hover:bg-ivoire-300"
            }`}
          >
            {micLabel}
          </button>

          <textarea
            name="content"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder={isRecording ? "Enregistrement en cours…" : "Votre réponse…"}
            disabled={sending || isRecording}
            className="flex-1 px-4 py-3 border border-ivoire-300 rounded-lg focus:ring-2 focus:ring-ink-400 focus:border-transparent outline-none resize-none disabled:opacity-50"
            rows={3}
          />

          <button
            type="submit"
            disabled={sending || !textContent.trim() || isRecording}
            className="px-6 py-3 bg-ink-600 text-white font-semibold rounded-lg hover:bg-ink-700 transition-colors self-end disabled:opacity-50"
          >
            {sending ? "Envoi…" : "Envoyer"}
          </button>
        </div>

        {/* Voice state indicator */}
        {(isTranscribing || isSpeaking || isRecording) && (
          <p className="mt-2 text-xs text-ink-400">
            {isRecording && "🔴 Enregistrement en cours — cliquez sur 🎙 pour terminer"}
            {isTranscribing && "⏳ Transcription en cours…"}
            {isSpeaking && "🔊 Lecture de la réponse du recruteur…"}
          </p>
        )}
      </form>
    </div>
  )
}
