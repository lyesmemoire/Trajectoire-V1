"use client"

import { motion } from "framer-motion"
import { Trophy, Shield, Zap } from "lucide-react"

interface Entry {
  id: string
  bestScore: number
  maxPressure: number
  interruptions: number
  user: { name: string | null; image: string | null }
}

const podium = {
  gold: {
    icon: "text-[#B8860B]",
    card: "bg-[#B8860B]/10 border-[#B8860B]/25",
    pill: "bg-[#B8860B] text-ivoire-50",
  },
  silver: {
    icon: "text-[#8A8A8A]",
    card: "bg-[#8A8A8A]/10 border-[#8A8A8A]/25",
    pill: "bg-[#8A8A8A] text-white",
  },
  bronzeMedal: {
    icon: "text-[#CD7F32]",
    card: "bg-[#CD7F32]/10 border-[#CD7F32]/25",
    pill: "bg-[#CD7F32] text-white",
  },
} as const

function getPodiumStyle(index: number) {
  if (index === 0) return podium.gold
  if (index === 1) return podium.silver
  if (index === 2) return podium.bronzeMedal
  return null
}

export function LiveLeaderboard({ entries }: { entries: Entry[] }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] border border-ivoire-200 p-8 shadow-premium space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif font-black text-ink-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#B8860B]" /> Top Performers
        </h3>
        <span className="text-[10px] font-black text-ink-400 uppercase tracking-widest bg-ivoire-50 px-3 py-1 rounded-lg border border-ivoire-100">
          Live
        </span>
      </div>

      <div className="space-y-4">
        {entries.map((entry, i) => {
          const style = getPodiumStyle(i)

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                style ? style.card : "bg-ivoire-50 border-ivoire-100"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-black text-lg ${
                  style ? style.pill : "bg-white text-ink-400"
                }`}
              >
                {i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-serif font-black text-ink-900 truncate">
                  {entry.user.name || "Candidat Anonyme"}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-ink-600" />
                    <span className="text-[10px] font-bold text-ink-400">
                      {entry.maxPressure}% Tension
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-terracotta-500" />
                    <span className="text-[10px] font-bold text-ink-400">
                      {entry.interruptions} Int.
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-serif font-black text-ink-900">
                  {entry.bestScore}
                </p>
                <p className="text-[8px] font-black text-ink-400 uppercase tracking-widest">
                  Score
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
