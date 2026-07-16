// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import {
  ARCHETYPES_META,
  CareerArchetype,
} from "@/lib/archetypes/career-archetypes";
import { Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

interface Props {
  current: CareerArchetype;
  previous?: CareerArchetype;
}

export function CareerIdentityCard({ current, previous }: Props) {
  const meta = ARCHETYPES_META[current];
  const isEvolving = previous && previous !== current;

  return (
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

      <div className="p-10 md:p-12 space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center text-4xl shadow-xl">
              {meta.icon}
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {meta.label}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  Identité Actuelle
                </span>
                {isEvolving && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1"
                  >
                    <TrendingUp className="w-3 h-3" /> Évolution détectée
                  </motion.span>
                )}
              </div>
            </div>
          </div>
          {isEvolving && (
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Ancien Profil
              </p>
              <p className="text-sm font-bold text-slate-400 line-through decoration-slate-300">
                {ARCHETYPES_META[previous!].label}
              </p>
            </div>
          )}
        </div>

        <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-3xl">
          {meta.description}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Forces de ce
              profil
            </h3>
            <div className="flex flex-wrap gap-2">
              {meta.strengths.map((s) => (
                <span
                  key={s}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-black rounded-xl border border-emerald-100"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Recommandation
              Coach
            </h3>
            <p className="text-sm font-bold text-slate-700 italic leading-relaxed">
              "{meta.coachingAdvice}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
