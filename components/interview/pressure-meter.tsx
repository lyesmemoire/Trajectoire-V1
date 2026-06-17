"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface Props {
  level: number; // 0-100
}

export function PressureMeter({ level }: Props) {
  // Détermination de la couleur selon le niveau
  const getColor = (val: number) => {
    if (val > 80) return "bg-rose-500";
    if (val > 50) return "bg-amber-500";
    return "bg-blue-500";
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-[200px]">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <Zap
            className={`w-3 h-3 ${level > 70 ? "text-amber-500 fill-amber-500" : "text-slate-300"}`}
          />
          Tension
        </span>
        <span
          className={`text-[10px] font-black ${level > 80 ? "text-rose-500" : "text-slate-400"}`}
        >
          {level}%
        </span>
      </div>

      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
        {/* Barre de fond pulsante si pression haute */}
        {level > 75 && (
          <motion.div
            className="absolute inset-0 bg-rose-500/20"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ type: "spring", stiffness: 50 }}
          className={`h-full rounded-full ${getColor(level)} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
        />
      </div>

      {level > 85 && (
        <p className="text-[8px] font-bold text-rose-400 uppercase text-center animate-pulse">
          Attention : Recruteur impatient
        </p>
      )}
    </div>
  );
}
