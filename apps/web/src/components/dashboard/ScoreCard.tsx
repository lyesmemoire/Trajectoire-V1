"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ScoreCardProps {
  label:       string;
  score:       number | null;
  icon:        LucideIcon;
  color:       string;      // tailwind bg class ex: "bg-indigo-500"
  href:        string;
  ctaLabel:    string;
  delay?:      number;
}

export function ScoreCard({
  label, score, icon: Icon, color, href, ctaLabel, delay = 0,
}: ScoreCardProps) {
  const hasScore = score !== null;

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className="group flex flex-col gap-4 rounded-2xl border border-white/8
                  bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.06]
                  transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl ${color}/20 flex items-center
                          justify-center`}>
          <Icon size={17} className={`${color.replace("bg-","text-")}`} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest
                          text-white/30 group-hover:text-white/50 transition-colors">
          {label}
        </span>
      </div>

      {/* Score */}
      {hasScore ? (
        <div className="flex items-end gap-1">
          <span className="text-4xl font-extrabold text-white tabular-nums">
            {score}
          </span>
          <span className="text-white/30 text-sm mb-1">/ 100</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 rounded-lg bg-white/5 animate-pulse" />
          <span className="text-xs text-white/30">Non analysé</span>
        </div>
      )}

      {/* CTA */}
      <span className={`text-xs font-semibold
                         ${hasScore ? "text-white/40" : "text-white/60"}
                         group-hover:text-white/80 transition-colors`}>
        {ctaLabel} →
      </span>
    </motion.a>
  );
}
