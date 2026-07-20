"use client";

import { motion } from "framer-motion";
import { Trophy, Shield, Zap } from "lucide-react";

interface Entry {
  id: string;
  bestScore: number;
  maxPressure: number;
  interruptions: number;
  user: { name: string | null; image: string | null };
}

export function LiveLeaderboard({ entries }: { entries: Entry[] }) {
  return (
    <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Top Performers
        </h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
          Live
        </span>
      </div>

      <div className="space-y-4">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              i === 0
                ? "bg-amber-50 border-amber-200"
                : "bg-slate-50 border-slate-100"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                i === 0 ? "bg-amber-500 text-white" : "bg-white text-slate-400"
              }`}
            >
              {i + 1}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-900 truncate">
                {entry.user.name || "Candidat Anonyme"}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-500" />
                  <span className="text-[10px] font-bold text-slate-400">
                    {entry.maxPressure}% Tension
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-bold text-slate-400">
                    {entry.interruptions} Int.
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xl font-black text-slate-900">
                {entry.bestScore}
              </p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Score
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
