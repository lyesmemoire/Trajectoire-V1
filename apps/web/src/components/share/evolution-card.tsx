"use client"

import { motion } from "framer-motion"
import {
  ARCHETYPES_META,
  CareerArchetype,
} from "@/lib/archetypes/career-archetypes"
import { TrendingUp, ArrowRight } from "lucide-react"

interface Props {
  from: CareerArchetype
  to: CareerArchetype
}

export function EvolutionCard({ from, to }: Props) {
  const fromMeta = ARCHETYPES_META[from]
  const toMeta = ARCHETYPES_META[to]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-[400px] bg-ink-900 rounded-[3rem] p-10 border border-white/5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-forest-500 via-bronze-500 to-ink-600" />

      <div className="relative z-10 space-y-10">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-forest-500" />
          <span className="text-[10px] font-black text-ink-400 uppercase tracking-widest">
            Évolution Détectée
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl opacity-50">
              {fromMeta.icon}
            </div>
            <p className="text-[10px] font-bold text-ink-500 uppercase">
              {fromMeta.label.split(" ")[0]}
            </p>
          </div>

          <ArrowRight className="w-8 h-8 text-white/20" />

          <div className="text-center space-y-2">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 bg-bronze-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-bronze-600/40"
            >
              {toMeta.icon}
            </motion.div>
            <p className="text-[10px] font-black text-white uppercase">
              {toMeta.label.split(" ")[0]}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-2xl font-black text-white">Mutation en cours.</h4>
          <p className="text-sm text-ink-400 leading-relaxed font-medium">
            Vous avez réduit vos tics de langage de{" "}
            <span className="text-forest-400 font-bold">14%</span> et votre
            clarté sous pression a franchi un cap critique.
          </p>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
          <p className="text-[10px] font-black text-ink-500 uppercase">
            studioentretien.fr
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-forest-500" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
