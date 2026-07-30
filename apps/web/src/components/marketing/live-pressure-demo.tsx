"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, ChevronRight, Activity } from "lucide-react"
import { PressureMeterV2 } from "../pressure/pressure-meter-v2"

const PLAYGROUND_SCENARIOS = [
  {
    id: "vague",
    label: "Réponse Vague",
    user: "J'ai beaucoup travaillé sur la communication interne cette année.",
    ai: "Trop vague. Quel système exact avez-vous mis en place et comment avez-vous mesuré son adoption ?",
    pressure: 82,
    status: "Tension Critique",
    color: "#EF4444",
  },
  {
    id: "precise",
    label: "Réponse Précise",
    user: "J'ai réduit le churn de 15% en instaurant des Daily Scrums et un système de feedback automatisé.",
    ai: "Précis. Comment avez-vous priorisé les chantiers issus de ces retours ?",
    pressure: 42,
    status: "Exposition Maîtrisée",
    color: "#06B6D4",
  },
]

export function LivePressureDemo() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-60 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0B1023] rounded-[4rem] p-10 lg:p-24 border border-white/[0.08] relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#7C3AED]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="space-y-12 text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <Activity className="w-3 h-3 text-[#7C3AED]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ink-400">
                  Interaction Temps Réel
                </span>
              </div>

              <h2 className="text-5xl lg:text-7xl font-black leading-[0.9] text-white tracking-tighter">
                Vivez la <br />
                <span className="text-[#EF4444]">confrontation.</span>
              </h2>

              <p className="text-xl text-ink-400 font-medium leading-relaxed max-w-lg">
                StudioEntretien est le seul système qui interrompt votre réponse
                pour tester votre précision sous tension.
              </p>

              <div className="flex flex-col gap-4 max-w-sm">
                {PLAYGROUND_SCENARIOS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setActive(i)}
                    className={`group flex items-center justify-between p-6 rounded-[1.5rem] border-2 transition-all duration-500 ${
                      active === i
                        ? "border-[#7C3AED] bg-[#7C3AED]/10 text-white shadow-[0_0_30px_rgba(124,58,237,0.2)]"
                        : "border-white/[0.05] bg-white/[0.02] text-ink-500 hover:border-white/10"
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">
                      {s.label}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${active === i ? "translate-x-1 text-[#7C3AED]" : "text-ink-700"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              animate={
                active === 0
                  ? {
                      x: [-1, 1, -1, 1, 0],
                      transition: { duration: 0.2, repeat: 2 },
                    }
                  : {}
              }
              className="bg-[#050816]/90 backdrop-blur-3xl rounded-[4rem] border border-white/[0.08] p-1 shadow-2xl relative"
            >
              {active === 0 && (
                <div className="absolute inset-0 bg-brick-500/5 rounded-[4rem] animate-pulse pointer-events-none" />
              )}

              <div className="bg-[#0B1023] rounded-[3.8rem] p-10 md:p-14 space-y-12 min-h-[480px] flex flex-col justify-center border border-white/[0.03]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-12"
                  >
                    {/* User */}
                    <div className="flex gap-5 justify-end">
                      <div
                        className={`p-6 rounded-[2rem] rounded-tr-none max-w-[85%] border shadow-2xl ${
                          active === 0
                            ? "bg-ink-800 border-white/5 opacity-50"
                            : "bg-[#7C3AED] border-white/20"
                        }`}
                      >
                        <p className="text-sm font-bold text-white italic leading-relaxed">
                          "{PLAYGROUND_SCENARIOS[active]?.user}"
                        </p>
                      </div>
                    </div>

                    {/* IA */}
                    <div className="flex gap-5 items-start">
                      <div className="w-14 h-14 rounded-2xl bg-[#050816] border border-white/10 flex items-center justify-center text-[#EF4444] shadow-xl">
                        <AlertCircle className="w-7 h-7" />
                      </div>
                      <div className="bg-white/[0.03] border border-white/[0.05] p-7 rounded-[2rem] rounded-tl-none max-w-[85%] backdrop-blur-md">
                        <p className="text-sm font-black text-ink-300 leading-relaxed">
                          "{PLAYGROUND_SCENARIOS[active]?.ai}"
                        </p>
                      </div>
                    </div>

                    {/* Meter V2 */}
                    <div className="pt-10 border-t border-white/[0.05]">
                      <PressureMeterV2
                        level={PLAYGROUND_SCENARIOS[active]?.pressure ?? 0}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
