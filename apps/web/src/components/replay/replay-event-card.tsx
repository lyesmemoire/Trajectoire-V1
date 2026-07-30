
"use client"

import { motion } from "framer-motion"
import {
  Zap,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Target,
  MessageSquare,
} from "lucide-react"
import { ReplayEvent } from "@/lib/interview/types/replay.types"

const EVENT_CONFIG = {
  pressure_peak: {
    icon: Zap,
    color: "text-terracotta-500",
    bg: "bg-terracotta-50",
    border: "border-terracotta-100",
    label: "Pic de Tension",
  },
  interruption: {
    icon: AlertCircle,
    color: "text-brick-500",
    bg: "bg-brick-50",
    border: "border-brick-100",
    label: "Interruption",
  },
  recovery: {
    icon: TrendingUp,
    color: "text-ink-600",
    bg: "bg-ivoire-100",
    border: "border-ivoire-200",
    label: "Reprise de Contrôle",
  },
  strong_answer: {
    icon: CheckCircle2,
    color: "text-forest-500",
    bg: "bg-forest-50",
    border: "border-forest-100",
    label: "Moment Fort",
  },
  hesitation: {
    icon: Target,
    color: "text-ink-600",
    bg: "bg-ivoire-50",
    border: "border-ivoire-100",
    label: "Hésitation",
  },
  evasion: {
    icon: MessageSquare,
    color: "text-ink-500",
    bg: "bg-ivoire-50",
    border: "border-ivoire-200",
    label: "Esquive",
  },
  milestone: {
    icon: Target,
    color: "text-ink-500",
    bg: "bg-ivoire-50",
    border: "border-ivoire-200",
    label: "Étape",
  },
}

export function ReplayEventCard({ event }: { event: ReplayEvent }) {
  const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.milestone
  const Icon = config.icon

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60)
    const s = time % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative pl-8 pb-10 border-l-2 border-ivoire-200 last:pb-0`}
    >
      {/* Timeline Dot */}
      <div
        className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${config.bg}`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full ${config.color.replace("text", "bg")}`}
        />
      </div>

      <div
        className={`p-6 rounded-[2rem] border ${config.bg} ${config.border} shadow-premium group hover:shadow-premium-lg transition-all`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${config.color}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-ink-400">
              {config.label}
            </span>
          </div>
          <span className="text-xs font-black text-ink-400 tabular-nums">
            {formatTime(event.timestamp)}
          </span>
        </div>

        <h4 className="text-lg font-serif font-black text-ink-900 mb-2">
          {event.title}
        </h4>
        <p className="text-sm text-ink-600 font-medium leading-relaxed mb-4">
          {event.description}
        </p>

        {event.coachingAdvice && (
          <div className="mt-4 p-4 bg-white/60 rounded-2xl border border-white/40">
            <p className="text-xs font-black text-ink-400 uppercase tracking-widest mb-2">
              Conseil Stratégique
            </p>
            <p className="text-sm font-serif font-bold text-ink-800 leading-relaxed italic">
              "{event.coachingAdvice}"
            </p>
          </div>
        )}

        {event.betterVersion && (
          <div className="mt-4 p-4 bg-forest-50/50 rounded-2xl border border-forest-100">
            <p className="text-[10px] font-black text-forest-600 uppercase tracking-widest mb-2">
              Version Optimisée
            </p>
            <p className="text-sm font-bold text-forest-900 leading-relaxed">
              {event.betterVersion}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
