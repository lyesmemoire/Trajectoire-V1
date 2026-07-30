"use client"

import { useMemo } from "react"
import {
  Gauge,
  MessageSquareWarning,
  Clock,
  TrendingUp,
  Star,
  CheckCircle2,
  Info,
} from "lucide-react"
import type {
  SpeechAnalysisResult,
  SpeedRating,
  OverallRating,
} from "@/lib/audio/speech-analyzer"

const WPM_CONFIG: Record<
  SpeedRating,
  { label: string; color: string; bg: string; bar: string }
> = {
  too_slow: {
    label: "Trop lent",
    color: "text-ink-600",
    bg: "bg-ivoire-100",
    bar: "bg-ink-400",
  },
  slow: {
    label: "Lent",
    color: "text-ink-600",
    bg: "bg-ivoire-100",
    bar: "bg-ink-400",
  },
  ideal: {
    label: "Idéal ✓",
    color: "text-forest-600",
    bg: "bg-forest-50",
    bar: "bg-forest-500",
  },
  fast: {
    label: "Rapide",
    color: "text-terracotta-600",
    bg: "bg-terracotta-50",
    bar: "bg-terracotta-400",
  },
  too_fast: {
    label: "Trop rapide",
    color: "text-brick-600",
    bg: "bg-brick-50",
    bar: "bg-brick-500",
  },
}

const OVERALL_CONFIG: Record<
  OverallRating,
  { label: string; color: string; ring: string; emoji: string }
> = {
  excellent: {
    label: "Excellent",
    color: "text-forest-600",
    ring: "ring-forest-400",
    emoji: "🌟",
  },
  good: {
    label: "Bien",
    color: "text-ink-600",
    ring: "ring-ink-400",
    emoji: "👍",
  },
  average: {
    label: "Passable",
    color: "text-terracotta-600",
    ring: "ring-terracotta-400",
    emoji: "📈",
  },
  needs_work: {
    label: "À améliorer",
    color: "text-terracotta-600",
    ring: "ring-terracotta-400",
    emoji: "🔧",
  },
  poor: {
    label: "Insuffisant",
    color: "text-brick-600",
    ring: "ring-brick-400",
    emoji: "⚠️",
  },
}

function StatCard({
  icon: Icon, label, value, sub, color = "text-gray-700" }: {
  icon: any
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <div className="bg-ivoire-50 rounded-2xl p-4 flex flex-col gap-1 border border-ivoire-200 shadow-premium">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[10px] font-black uppercase text-ink-400 tracking-wider">
          {label}
        </span>
      </div>
      <p className={`text-lg font-serif font-black leading-none ${color} mt-1`}>{value}</p>
      {sub && (
        <p className="text-[10px] font-bold text-ink-300 mt-1">{sub}</p>
      )}
    </div>
  )
}

export function SpeechFeedback({
  result, compact = false, className = "" }: {
  result: SpeechAnalysisResult
  compact?: boolean
  className?: string
}) {
  const sortedRecs = useMemo(
    () =>
      [...result.recommendations].sort((a, b) => {
        const order = { critical: 0, warning: 1, info: 2 }
        return order[a.severity] - order[b.severity]
      }),
    [result.recommendations],
  )

  if (compact) {
    return (
      <div className={`grid grid-cols-3 gap-4 ${className}`}>
        <StatCard
          icon={Gauge}
          label="Débit"
          value={`${result.wordsPerMinute} wpm`}
          color={WPM_CONFIG[result.wordsPerMinuteRating].color}
        />
        <StatCard
          icon={MessageSquareWarning}
          label="Parasites"
          value={result.fillerWordCount}
          color="text-terracotta-600"
        />
        <StatCard
          icon={Clock}
          label="Pauses"
          value={result.longPauseCount}
          color="text-ink-600"
        />
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-6 p-8 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-ivoire-200 shadow-premium-lg">
        <div className="text-center">
          <div
            className={`w-24 h-24 rounded-full border-8 border-ivoire-100 flex items-center justify-center text-3xl font-serif font-black mb-2 ${OVERALL_CONFIG[result.overallRating].color}`}
          >
            {result.overallScore}
          </div>
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${OVERALL_CONFIG[result.overallRating].color}`}
          >
            {OVERALL_CONFIG[result.overallRating].label}
          </span>
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-serif font-black text-ink-900">
            Analyse de l'Élocution
          </h3>
          <p className="text-sm text-ink-600 font-medium leading-relaxed">
            Votre prestation est jugée{" "}
            <span className="font-bold text-ink-900">
              {OVERALL_CONFIG[result.overallRating].label}
            </span>
            . L'IA a détecté {result.fillerWordCount} tics de langage sur une
            durée de {Math.round(result.totalDurationSeconds)}s.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Gauge}
          label="Vitesse"
          value={result.wordsPerMinute}
          sub="Mots / minute"
          color={WPM_CONFIG[result.wordsPerMinuteRating].color}
        />
        <StatCard
          icon={MessageSquareWarning}
          label="Parasites"
          value={result.fillerWordCount}
          sub="Tics vocaux"
          color="text-terracotta-600"
        />
        <StatCard
          icon={Clock}
          label="Pauses"
          value={result.longPauseCount}
          sub="Silences > 2s"
          color="text-ink-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Régularité"
          value={`${Math.round(result.speedVariation * 100)}%`}
          sub="Variation débit"
          color="text-bronze-600"
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black text-ink-400 uppercase tracking-widest flex items-center gap-2">
          <Info className="w-4 h-4 text-bronze-600" /> Recommandations Coach
        </h4>
        {sortedRecs.map((rec, i) => (
          <div
            key={i}
            className="p-6 rounded-[2rem] border bg-ivoire-50 border-ivoire-200 flex gap-4"
          >
            <CheckCircle2 className="w-6 h-6 text-bronze-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-serif font-black text-ink-900">{rec.title}</p>
              <p className="text-xs text-ink-600 font-medium mt-1 leading-relaxed">
                {rec.description}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl text-[10px] font-black text-bronze-600 shadow-premium">
                <Star className="w-3 h-3 fill-current" /> CONSEIL: {rec.tip}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
