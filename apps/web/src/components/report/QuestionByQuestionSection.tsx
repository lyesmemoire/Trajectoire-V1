"use client"

import { useState, useRef, useEffect } from "react"

interface QnaItem {
  messageId?: string
  sessionId?: string
  hasAudio?: boolean
  question: string
  answer: string
  competency: string | null
  score: number
  whatWentWell: string[]
  whatWasMissing: string[]
  howToImprove: string[]
  betterAnswer: string
}

interface QuestionByQuestionSectionProps {
  items: QnaItem[]
}

function scoreStatus(score: number): {
  label: string
  bgClass: string
  textClass: string
  borderClass: string
} {
  if (score >= 80) {
    return {
      label: "Solide",
      bgClass: "bg-forest-50",
      textClass: "text-forest-700",
      borderClass: "border-forest-200",
    }
  }
  if (score >= 60) {
    return {
      label: "À renforcer",
      bgClass: "bg-amber-50",
      textClass: "text-amber-700",
      borderClass: "border-amber-200",
    }
  }
  return {
    label: "Prioritaire",
    bgClass: "bg-terracotta-50",
    textClass: "text-terracotta-700",
    borderClass: "border-terracotta-200",
  }
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ReplayButton({ messageId, sessionId, isOpen }: { messageId: string; sessionId: string; isOpen: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Cleanup on unmount or when accordion closes
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setState("idle")
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [isOpen])

  const togglePlay = async () => {
    if (state === "playing") {
      audioRef.current?.pause()
      setState("idle")
      return
    }

    if (state === "idle" && !audioRef.current?.src) {
      setState("loading")
      try {
        const res = await fetch(`/api/simulation/audio-replay?sessionId=${sessionId}&messageId=${messageId}`)
        if (!res.ok) throw new Error("Replay unavailable")
        const data = await res.json()
        if (!data.signedUrl) throw new Error("No URL")

        const audio = new Audio(data.signedUrl)
        audioRef.current = audio
        audio.onended = () => setState("idle")
        audio.onerror = () => setState("error")
        await audio.play()
        setState("playing")
      } catch (err) {
        console.error(err)
        setState("error")
      }
    } else if (audioRef.current) {
      await audioRef.current.play().catch(() => setState("error"))
      setState("playing")
    }
  }

  if (state === "error") {
    return <span className="text-[10px] text-terracotta-600 font-medium bg-terracotta-50 px-2 py-1 rounded">Replay indisponible</span>
  }

  return (
    <button
      onClick={togglePlay}
      disabled={state === "loading"}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-700 bg-violet-100 hover:bg-violet-200 rounded-full transition-colors disabled:opacity-50"
      aria-label={state === "playing" ? "Mettre en pause" : "Écouter ma réponse"}
    >
      {state === "playing" ? "⏸ Pause" : state === "loading" ? "⏳ Chargement..." : "▶ Écouter ma réponse"}
    </button>
  )
}

function QuestionCard({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: QnaItem
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const status = scoreStatus(item.score)
  const panelId = `qna-panel-${index}`
  const headerId = `qna-header-${index}`

  return (
    <div
      className={`rounded-xl border bg-white/70 backdrop-blur-xl shadow-sm transition-shadow duration-200 ${
        isOpen ? "shadow-premium border-violet-200" : "border-ivoire-200 hover:border-violet-100"
      }`}
    >
      {/* Header — toujours visible */}
      <button
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 rounded-xl"
      >
        {/* Numéro */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
          {index + 1}
        </span>

        {/* Compétence + score */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink-900">
            {item.competency ?? "Compétence générale"}
          </p>
          <p className="mt-0.5 truncate text-xs text-ink-500 italic line-clamp-1">
            {item.question}
          </p>
        </div>

        {/* Score badge + statut */}
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.bgClass} ${status.textClass} border ${status.borderClass}`}
          >
            {status.label}
          </span>
          <span className="text-sm font-bold text-ink-900 tabular-nums">
            {Number.isFinite(item.score) ? Math.min(100, Math.max(0, Math.round(item.score))) : "–"}/100
          </span>
          <ChevronIcon open={isOpen} />
        </div>
      </button>

      {/* Body — accordéon */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
        className="border-t border-ivoire-100 px-5 pb-6 pt-4"
      >
        {/* Question et réponse */}
        <div className="mb-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
              Question du recruteur
            </p>
            <p className="text-sm leading-relaxed text-ink-700">{item.question}</p>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                Votre réponse
              </p>
              {item.hasAudio && item.messageId && item.sessionId && (
                <ReplayButton messageId={item.messageId} sessionId={item.sessionId} isOpen={isOpen} />
              )}
            </div>
            <p className="text-sm leading-relaxed text-ink-700">{item.answer}</p>
          </div>
        </div>

        {/* Ce qui a convaincu / Ce qui manquait */}
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {item.whatWentWell.length > 0 && (
            <div className="rounded-xl bg-forest-50 p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="text-forest-600 text-sm">✓</span>
                <p className="text-xs font-semibold text-forest-800">Ce qui a convaincu</p>
              </div>
              <ul className="space-y-1">
                {item.whatWentWell.map((point, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-500" />
                    <span className="text-sm text-ink-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.whatWasMissing.length > 0 && (
            <div className="rounded-xl bg-terracotta-50 p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="text-terracotta-600 text-sm">△</span>
                <p className="text-xs font-semibold text-terracotta-800">Ce qui manquait</p>
              </div>
              <ul className="space-y-1">
                {item.whatWasMissing.map((point, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-500" />
                    <span className="text-sm text-ink-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Comment progresser */}
        {item.howToImprove.length > 0 && (
          <div className="mb-4 rounded-xl border border-violet-100 bg-violet-50/60 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-700">
              Comment progresser
            </p>
            <ul className="space-y-1.5">
              {item.howToImprove.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 rounded-full bg-violet-200 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Meilleure réponse */}
        {item.betterAnswer && (
          <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100/40 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-800">
              Exemple de réponse plus forte
            </p>
            <p className="text-sm leading-relaxed text-ink-800 italic">{item.betterAnswer}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function QuestionByQuestionSection({ items }: QuestionByQuestionSectionProps) {
  const [openIndex, setOpenIndex] = useState<number>(0)

  if (!items || items.length === 0) return null

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-serif font-semibold text-ink-900">
          Analyse de vos réponses
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Découvrez précisément ce qui a convaincu le recruteur et ce qui peut être renforcé.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <QuestionCard
            key={i}
            item={item}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </div>
  )
}
