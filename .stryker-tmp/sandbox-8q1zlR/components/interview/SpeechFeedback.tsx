// @ts-nocheck
"use client";

import { useMemo } from "react";
import {
  Gauge,
  MessageSquareWarning,
  Clock,
  TrendingUp,
  Star,
  CheckCircle2,
  Info,
} from "lucide-react";
import type {
  SpeechAnalysisResult,
  SpeedRating,
  OverallRating,
} from "@/lib/audio/speech-analyzer";

const WPM_CONFIG: Record<
  SpeedRating,
  { label: string; color: string; bg: string; bar: string }
> = {
  too_slow: {
    label: "Trop lent",
    color: "text-blue-600",
    bg: "bg-blue-50",
    bar: "bg-blue-400",
  },
  slow: {
    label: "Lent",
    color: "text-sky-600",
    bg: "bg-sky-50",
    bar: "bg-sky-400",
  },
  ideal: {
    label: "Idéal ✓",
    color: "text-green-600",
    bg: "bg-green-50",
    bar: "bg-green-500",
  },
  fast: {
    label: "Rapide",
    color: "text-amber-600",
    bg: "bg-amber-50",
    bar: "bg-amber-400",
  },
  too_fast: {
    label: "Trop rapide",
    color: "text-red-600",
    bg: "bg-red-50",
    bar: "bg-red-500",
  },
};

const OVERALL_CONFIG: Record<
  OverallRating,
  { label: string; color: string; ring: string; emoji: string }
> = {
  excellent: {
    label: "Excellent",
    color: "text-green-600",
    ring: "ring-green-400",
    emoji: "🌟",
  },
  good: {
    label: "Bien",
    color: "text-blue-600",
    ring: "ring-blue-400",
    emoji: "👍",
  },
  average: {
    label: "Passable",
    color: "text-amber-600",
    ring: "ring-amber-400",
    emoji: "📈",
  },
  needs_work: {
    label: "À améliorer",
    color: "text-orange-600",
    ring: "ring-orange-400",
    emoji: "🔧",
  },
  poor: {
    label: "Insuffisant",
    color: "text-red-600",
    ring: "ring-red-400",
    emoji: "⚠️",
  },
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "text-gray-700",
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-1 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
          {label}
        </span>
      </div>
      <p className={`text-lg font-black leading-none ${color} mt-1`}>{value}</p>
      {sub && (
        <p className="text-[10px] font-bold text-slate-300 mt-1">{sub}</p>
      )}
    </div>
  );
}

export function SpeechFeedback({
  result,
  compact = false,
  className = "",
}: {
  result: SpeechAnalysisResult;
  compact?: boolean;
  className?: string;
}) {
  const sortedRecs = useMemo(
    () =>
      [...result.recommendations].sort((a, b) => {
        const order = { critical: 0, warning: 1, info: 2 };
        return order[a.severity] - order[b.severity];
      }),
    [result.recommendations],
  );

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
          color="text-amber-600"
        />
        <StatCard
          icon={Clock}
          label="Pauses"
          value={result.longPauseCount}
          color="text-blue-600"
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
        <div className="text-center">
          <div
            className={`w-24 h-24 rounded-full border-8 border-slate-50 flex items-center justify-center text-3xl font-black mb-2 ${OVERALL_CONFIG[result.overallRating].color}`}
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
          <h3 className="text-xl font-black text-slate-900">
            Analyse de l'Élocution
          </h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Votre prestation est jugée{" "}
            <span className="font-bold text-slate-900">
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
          color="text-amber-600"
        />
        <StatCard
          icon={Clock}
          label="Pauses"
          value={result.longPauseCount}
          sub="Silences > 2s"
          color="text-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Régularité"
          value={`${Math.round(result.speedVariation * 100)}%`}
          sub="Variation débit"
          color="text-violet-600"
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" /> Recommandations Coach
        </h4>
        {sortedRecs.map((rec, i) => (
          <div
            key={i}
            className="p-6 rounded-[2rem] border bg-slate-50 border-slate-100 flex gap-4"
          >
            <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-black text-slate-900">{rec.title}</p>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                {rec.description}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl text-[10px] font-black text-blue-600 shadow-sm">
                <Star className="w-3 h-3 fill-current" /> CONSEIL: {rec.tip}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
