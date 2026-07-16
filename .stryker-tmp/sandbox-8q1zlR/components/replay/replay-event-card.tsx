// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import {
  Zap,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Target,
  MessageSquare,
} from "lucide-react";
import { ReplayEvent } from "@/lib/interview/types/replay.types";

const EVENT_CONFIG = {
  pressure_peak: {
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    label: "Pic de Tension",
  },
  interruption: {
    icon: AlertCircle,
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
    label: "Interruption",
  },
  recovery: {
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    label: "Reprise de Contrôle",
  },
  strong_answer: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    label: "Moment Fort",
  },
  hesitation: {
    icon: Target,
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
    label: "Hésitation",
  },
  evasion: {
    icon: MessageSquare,
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-100",
    label: "Esquive",
  },
  milestone: {
    icon: Target,
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-100",
    label: "Étape",
  },
};

export function ReplayEventCard({ event }: { event: ReplayEvent }) {
  const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.milestone;
  const Icon = config.icon;

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative pl-8 pb-10 border-l-2 border-slate-100 last:pb-0`}
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
        className={`p-6 rounded-[2rem] border ${config.bg} ${config.border} shadow-sm group hover:shadow-md transition-all`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${config.color}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {config.label}
            </span>
          </div>
          <span className="text-xs font-black text-slate-400 tabular-nums">
            {formatTime(event.timestamp)}
          </span>
        </div>

        <h4 className="text-lg font-black text-slate-900 mb-2">
          {event.title}
        </h4>
        <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">
          {event.description}
        </p>

        {event.coachingAdvice && (
          <div className="mt-4 p-4 bg-white/60 rounded-2xl border border-white/40">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              Conseil Stratégique
            </p>
            <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
              "{event.coachingAdvice}"
            </p>
          </div>
        )}

        {event.betterVersion && (
          <div className="mt-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">
              Version Optimisée
            </p>
            <p className="text-sm font-bold text-emerald-900 leading-relaxed">
              {event.betterVersion}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
