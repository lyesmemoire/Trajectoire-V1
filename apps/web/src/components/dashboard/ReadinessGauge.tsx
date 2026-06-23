"use client";

import { motion } from "framer-motion";

interface ReadinessGaugeProps {
  score: number; // 0-100
}

const STATUSES = [
  { max: 0,   label: "Commence ton diagnostic",  color: "#6b7280" },
  { max: 40,  label: "Des lacunes à combler",     color: "#ef4444" },
  { max: 70,  label: "Tu progresses",             color: "#f59e0b" },
  { max: 89,  label: "Niveau solide",             color: "#3b82f6" },
  { max: 100, label: "Prêt pour le Grand Jury",   color: "#10b981" },
] as const;

function getStatus(score: number) {
  return (
    STATUSES.find((s) => score <= s.max) ??
    STATUSES[STATUSES.length - 1]
  );
}

export function ReadinessGauge({ score }: ReadinessGaugeProps) {
  const status   = getStatus(score);
  const radius   = 88;
  const stroke   = 10;
  const normalR  = radius - stroke / 2;
  const circum   = 2 * Math.PI * normalR;
  const dash     = (score / 100) * circum;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-52 h-52">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx="100" cy="100" r={normalR}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <motion.circle
            cx="100" cy="100" r={normalR}
            fill="none"
            stroke={status.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circum}
            initial={{ strokeDashoffset: circum }}
            animate={{ strokeDashoffset: circum - dash }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>

        {/* Score au centre */}
        <div className="absolute inset-0 flex flex-col items-center
                         justify-center">
          <motion.span
            className="text-5xl font-extrabold text-white tabular-nums"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-white/40 font-semibold
                            uppercase tracking-widest mt-1">
            / 100
          </span>
        </div>
      </div>

      {/* Label statut */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="px-5 py-2 rounded-full text-sm font-bold"
        style={{
          backgroundColor: `${status.color}22`,
          color: status.color,
          border: `1px solid ${status.color}44`,
        }}
      >
        {status.label}
      </motion.div>
    </div>
  );
}
