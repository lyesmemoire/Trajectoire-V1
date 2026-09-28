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
      bgClass: "bg-emerald-500/10",
      textClass: "text-emerald-300",
      borderClass: "border-emerald-400/20",
    }
  }
  if (score >= 60) {
    return {
      label: "À renforcer",
      bgClass: "bg-amber-500/10",
      textClass: "text-amber-300",
      borderClass: "border-amber-400/20",
    }
  }
  return {
    label: "Prioritaire",
    bgClass: "bg-rose-500/10",
    textClass: "text-rose-300",
    borderClass: "border-rose-400/20",
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
    return <span className="text-[10px] text-rose-300 font-medium bg-rose-500/10 px-2 py-1 rounded">Replay indisponible</span>
  }

  return (
    <button
      onClick={togglePlay}
      disabled={state === "loading"}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-full transition-colors disabled:opacity-50"
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
      className={`rounded-xl border bg-zinc-900 shadow-sm transition-shadow duration-200 ${
        isOpen ? "shadow-[0_2px_20px_-6px_rgba(99,102,241,0.35)] border-indigo-400/30" : "border-white/[0.08] hover:border-indigo-400/20"
      }`}
    >
      {/* Header — toujours visible */}
      <button
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 rounded-xl"
      >
        {/* Numéro */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-400 ring-1 ring-inset ring-indigo-400/20">
          {index + 1}
        </span>

        {/* Compétence + score */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white/80">
            {item.competency ?? "Compétence générale"}
          </p>
          <p className="mt-0.5 truncate text-xs text-white/40 italic line-clamp-1">
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
          <span className="text-sm font-bold text-white/80 tabular-nums">
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
        className="border-t border-white/[0.06] px-5 pb-6 pt-4"
      >
        {/* Question et réponse */}
        <div className="mb-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              Question du recruteur
            </p>
            <p className="text-sm leading-relaxed text-white/80">{item.question}</p>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Votre réponse
              </p>
              {item.hasAudio && item.messageId && item.sessionId && (
                <ReplayButton messageId={item.messageId} sessionId={item.sessionId} isOpen={isOpen} />
              )}
            </div>
            <p className="text-sm leading-relaxed text-white/80">{item.answer}</p>
          </div>
        </div>

        {/* Ce qui a convaincu / Ce qui manquait */}
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {item.whatWentWell.length > 0 && (
            <div className="rounded-xl bg-emerald-500/[0.06] p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="text-emerald-400 text-sm">✓</span>
                <p className="text-xs font-semibold text-emerald-300">Ce qui a convaincu</p>
              </div>
              <ul className="space-y-1">
                {item.whatWentWell.map((point, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span className="text-sm text-white/70">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.whatWasMissing.length > 0 && (
            <div className="rounded-xl bg-rose-500/[0.06] p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="text-rose-400 text-sm">△</span>
                <p className="text-xs font-semibold text-rose-300">Ce qui manquait</p>
              </div>
              <ul className="space-y-1">
                {item.whatWasMissing.map((point, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                    <span className="text-sm text-white/70">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Comment progresser */}
        {item.howToImprove.length > 0 && (
          <div className="mb-4 rounded-xl border border-indigo-400/20 bg-indigo-500/[0.06] p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Comment progresser
            </p>
            <ul className="space-y-1.5">
              {item.howToImprove.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-300">
                    {i + 1}
                  </span>
                  <span className="text-sm text-white/70">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Meilleure réponse */}
        {item.betterAnswer && (
          <div className="rounded-xl border border-indigo-400/25 bg-gradient-to-br from-indigo-500/10 to-transparent p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Exemple de réponse plus forte
            </p>
            <p className="text-sm leading-relaxed text-white/70 italic">{item.betterAnswer}</p>
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
        <h2 className="text-xl font-sans font-semibold text-white/80">
          Analyse de vos réponses
        </h2>
        <p className="mt-1 text-sm text-white/50">
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
