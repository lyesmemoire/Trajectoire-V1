// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export function PressureMeterV2({ level }: { level: number }) {
  const isHigh = level > 75;

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <Activity
            className={`w-4 h-4 ${isHigh ? "text-red-500 animate-pulse" : "text-cyan-400"}`}
          />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
            Tension Biométrique
          </span>
        </div>
        <div className="text-right">
          <motion.span
            key={level}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-2xl font-black tabular-nums ${isHigh ? "text-red-500" : "text-white"}`}
          >
            {level}%
          </motion.span>
        </div>
      </div>

      <div className="relative h-6 bg-white/[0.02] border border-white/[0.05] rounded-lg overflow-hidden flex items-center px-1">
        {/* The "ECG" Grid Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Dynamic Segments */}
        <div className="flex gap-0.5 w-full h-3 relative z-10">
          {[...Array(40)].map((_, i) => {
            const threshold = (i / 40) * 100;
            const active = level >= threshold;
            return (
              <motion.div
                key={i}
                initial={{ scaleY: 0.2 }}
                animate={{
                  scaleY: active ? (isHigh ? [0.8, 1.2, 0.8] : 1) : 0.2,
                  backgroundColor: active
                    ? threshold > 75
                      ? "#EF4444"
                      : threshold > 40
                        ? "#F59E0B"
                        : "#06B6D4"
                    : "rgba(255,255,255,0.05)",
                }}
                transition={{ duration: 0.3, repeat: isHigh ? Infinity : 0 }}
                className="flex-1 rounded-sm"
              />
            );
          })}
        </div>

        {/* High Pressure Alert Glow */}
        {isHigh && (
          <motion.div
            className="absolute inset-0 bg-red-500/10 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      <div className="flex justify-between">
        <p
          className={`text-[8px] font-black uppercase tracking-widest ${isHigh ? "text-red-400" : "text-slate-600"}`}
        >
          {isHigh
            ? "Critique : Signal de panique détecté"
            : "Stable : Exposition maîtrisée"}
        </p>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full ${isHigh ? "bg-red-500 animate-ping" : "bg-slate-800"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
