// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { History, TrendingUp, Target, ChevronRight } from "lucide-react";

const EVOLUTION_STORY = [
  {
    type: "stress_reactive",
    date: "Jan 2026",
    label: "Stress Reactive",
    color: "#EF4444",
    desc: "Identité initiale sous pression élevée.",
  },
  {
    type: "analytical_operator",
    date: "Fév 2026",
    label: "Analytical Thinker",
    color: "#06B6D4",
    desc: "Mutation vers la précision technique.",
  },
  {
    type: "strategic_leader",
    date: "Mai 2026",
    label: "Strategic Leader",
    color: "#7C3AED",
    desc: "Émergence du leadership exécutif.",
  },
];

export function EvolutionSection() {
  return (
    <section className="py-40 px-6 bg-transparent relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                Une mutation <br />
                <span className="text-[#06B6D4] italic">continue.</span>
              </h2>
              <p className="text-xl text-slate-400 font-medium max-w-xl leading-relaxed">
                Le recrutement est un sport de combat. StudioEntretien est votre
                centre d'entraînement comportemental pour passer du doute à la
                domination.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-[#0B1023] border border-white/[0.08] space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <TrendingUp className="w-12 h-12" />
                </div>
                <p className="text-3xl font-black text-white">+14%</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Résilience Moyenne
                </p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-[#0B1023] border border-white/[0.08] space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Target className="w-12 h-12" />
                </div>
                <p className="text-3xl font-black text-white">Top 3%</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Score de Recovery
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0B1023] rounded-[4rem] p-12 lg:p-16 border border-white/[0.08] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <History className="w-48 h-48 text-[#7C3AED]" />
            </div>

            <div className="relative space-y-12">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse shadow-[0_0_10px_#06B6D4]" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Chronologie Comportementale
                </h3>
              </div>

              <div className="space-y-12">
                {EVOLUTION_STORY.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="flex gap-10 items-start relative group"
                  >
                    <div className="text-[10px] font-black text-slate-500 w-20 pt-1 uppercase tracking-widest">
                      {step.date}
                    </div>
                    <div className="relative flex flex-col items-center">
                      <div
                        className="w-5 h-5 rounded-full border-4 border-[#0B1023] shadow-xl z-10 transition-transform duration-500 group-hover:scale-125"
                        style={{ backgroundColor: step.color }}
                      />
                      {i !== EVOLUTION_STORY.length - 1 && (
                        <div className="absolute top-5 w-[2px] h-20 bg-gradient-to-b from-white/[0.08] to-transparent" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-base font-black text-white uppercase tracking-tight">
                        {step.label}
                      </p>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 mt-8 border-t border-white/[0.05]">
                <button className="flex items-center gap-2 text-[10px] font-black text-[#7C3AED] uppercase tracking-widest hover:text-white transition-colors group">
                  Voir mon plan de mutation{" "}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
